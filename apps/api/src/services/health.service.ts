import { prisma } from '../utils/prisma.js';
import { BaselineEngine } from '../engines/baseline.engine.js';
import { ForecastEngine } from '../engines/forecast.engine.js';
import { TwinForecastData, PersonalBaselineMetric, CheckIn } from '@astra-loop/shared';

export class HealthService {
  /**
   * Retrieves all health metrics for an astronaut.
   */
  public static async getMetrics(astronautId: string) {
    return prisma.healthMetric.findMany({
      where: { astronautId },
      orderBy: { missionDay: 'asc' },
    });
  }

  /**
   * Adds or updates a health metric record.
   */
  public static async recordMetric(
    astronautId: string,
    data: {
      missionDay: number;
      heartRate?: number;
      hrv?: number;
      sleepHours?: number;
      activity?: number;
      mood?: number;
      fatigue?: number;
      stress?: number;
      reactionTimeMs?: number;
      voiceCadence?: number;
      dataSource?: string;
    }
  ) {
    return prisma.healthMetric.create({
      data: {
        astronautId,
        timestamp: new Date(),
        missionDay: data.missionDay,
        heartRate: data.heartRate,
        hrv: data.hrv,
        sleepHours: data.sleepHours,
        activity: data.activity,
        mood: data.mood,
        fatigue: data.fatigue,
        stress: data.stress,
        reactionTimeMs: data.reactionTimeMs,
        voiceCadence: data.voiceCadence,
        dataSource: data.dataSource || 'MANUAL_ENTRY',
        isSynthetic: true,
      },
    });
  }

  /**
   * Records astronaut daily check-in (mood, fatigue, stress, reaction test, voice).
   */
  public static async submitCheckIn(
    astronautId: string,
    data: {
      mood: number | null;
      fatigue: number | null;
      stress: number | null;
      reactionTimeMs: number | null;
      voiceAvailable: boolean;
      voiceCadence?: number | null;
      notes?: string;
    }
  ) {
    const astronaut = await prisma.astronaut.findUnique({
      where: { id: astronautId },
    });
    const missionDay = astronaut ? astronaut.missionDay : 61;

    // Save CheckIn
    const checkIn = await prisma.checkIn.create({
      data: {
        astronautId,
        timestamp: new Date(),
        missionDay,
        mood: data.mood,
        fatigue: data.fatigue,
        stress: data.stress,
        reactionTimeMs: data.reactionTimeMs,
        voiceAvailable: data.voiceAvailable,
        voiceCadence: data.voiceCadence,
        notes: data.notes,
      },
    });

    // Also update or insert matching daily HealthMetric for holistic closed-loop sync
    const existingMetric = await prisma.healthMetric.findFirst({
      where: { astronautId, missionDay },
    });

    if (existingMetric) {
      await prisma.healthMetric.update({
        where: { id: existingMetric.id },
        data: {
          mood: data.mood ?? existingMetric.mood,
          fatigue: data.fatigue ?? existingMetric.fatigue,
          stress: data.stress ?? existingMetric.stress,
          reactionTimeMs: data.reactionTimeMs ?? existingMetric.reactionTimeMs,
          voiceCadence: data.voiceCadence ?? existingMetric.voiceCadence,
        },
      });
    }

    return checkIn;
  }

  /**
   * Retrieves personal health twin bands and explainable forecasts.
   */
  public static async getTwinAndForecast(astronautId: string): Promise<TwinForecastData> {
    const astronaut = await prisma.astronaut.findUnique({
      where: { id: astronautId },
      include: {
        healthMetrics: { orderBy: { missionDay: 'asc' } },
      },
    });

    if (!astronaut) {
      throw new Error(`Astronaut ${astronautId} not found.`);
    }

    const currentDay = astronaut.missionDay;
    const history = astronaut.healthMetrics;

    // Metrics to build personal twin bands for
    const metricDefs: { key: keyof typeof history[0]; label: string; unit: string; higherIsBetter: boolean }[] = [
      { key: 'hrv', label: 'Heart Rate Variability', unit: 'ms', higherIsBetter: true },
      { key: 'heartRate', label: 'Resting Heart Rate', unit: 'bpm', higherIsBetter: false },
      { key: 'sleepHours', label: 'Sleep Duration', unit: 'hours', higherIsBetter: true },
      { key: 'reactionTimeMs', label: 'Reaction Time Latency', unit: 'ms', higherIsBetter: false },
      { key: 'fatigue', label: 'Subjective Fatigue', unit: 'score (1-10)', higherIsBetter: false },
      { key: 'voiceCadence', label: 'Voice Cadence Biomarker', unit: 'syllables/s', higherIsBetter: true },
      { key: 'activity', label: 'Daily Exercise Load', unit: 'score', higherIsBetter: true },
    ];

    const metrics: PersonalBaselineMetric[] = metricDefs.map((def) => {
      const stats = BaselineEngine.evaluateMetricBaseline(history, def.key as any, def.higherIsBetter);

      // Build historical band (Days 1 to currentDay)
      const historicalBand = history
        .filter((h) => h.missionDay <= currentDay)
        .map((h) => ({
          day: h.missionDay,
          value: h[def.key] !== null && h[def.key] !== undefined ? Number((h[def.key] as number).toFixed(2)) : null,
          baselineMean: stats.mean,
          upperBand: stats.upperBand,
          lowerBand: stats.lowerBand,
        }));

      return {
        metricKey: def.key as any,
        label: def.label,
        unit: def.unit,
        mean: stats.mean,
        std: stats.std,
        ewma: stats.ewma,
        currentValue: stats.currentValue,
        zScore: stats.zScore,
        confidence: stats.currentValue !== null ? 88 : 30,
        historicalBand,
      };
    });

    // Generate explainable forecasts using ForecastEngine
    const forecast = ForecastEngine.generateForecast(currentDay, history, 84);

    return {
      calibrationPeriodDays: 14,
      isCalibrated: currentDay >= 14,
      ewmaAlpha: 0.2,
      metrics,
      forecast7Day: forecast.forecast7Day,
      forecast30DaySummary: forecast.forecast30DaySummary,
    };
  }
}
