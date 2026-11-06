import { prisma } from '../utils/prisma.js';
import { BaselineEngine } from '../engines/baseline.engine.js';
import { ForecastEngine } from '../engines/forecast.engine.js';
import { ThresholdEngine } from '../engines/threshold.engine.js';
import { TwinForecastData, PersonalBaselineMetric, CheckIn, INDICATOR_CATALOG } from '@astra-loop/shared';

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

  public static async recordMetric(astronautId: string, data: any) {
    const astronaut = await prisma.astronaut.findUnique({ where: { id: astronautId } });
    if (!astronaut) throw new Error('Astronaut not found');

    const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
    const missionDay = data.missionDay ?? astronaut.missionDay;

    const metric = await prisma.healthMetric.create({
      data: {
        astronautId,
        timestamp,
        missionDay,
        heartRate: data.heartRate,
        hrv: data.hrv,
        systolicBP: data.systolicBP,
        diastolicBP: data.diastolicBP,
        bloodGlucose: data.bloodGlucose,
        bodyTemp: data.bodyTemp,
        spo2: data.spo2,
        weightKg: data.weightKg,
        hydrationScore: data.hydrationScore,
        stress: data.stress,
        sleepHours: data.sleepHours,
        mood: data.mood,
        fatigue: data.fatigue,
        reactionTimeMs: data.reactionTimeMs,
        voiceCadence: data.voiceCadence,
        cabinCO2ppm: data.cabinCO2ppm,
        cabinTempC: data.cabinTempC,
        cabinHumidityPct: data.cabinHumidityPct,
        noiseDb: data.noiseDb,
        exerciseMinutes: data.exerciseMinutes,
        exerciseType: data.exerciseType,
        caloriesKcal: data.caloriesKcal,
        socialContactMinutes: data.socialContactMinutes,
        dataSource: data.dataSource || 'CREW_DIRECT_ENTRY',
        isSynthetic: false,
      },
    });

    return metric;
  }

  /**
   * Records astronaut daily check-in (mood, fatigue, stress, reaction test, voice, BP, glucose, temp, spo2).
   */
  public static async submitCheckIn(
    astronautId: string,
    data: {
      mood: number | null;
      fatigue: number | null;
      stress: number | null;
      reactionTimeMs: number | null;
      systolicBP?: number | null;
      diastolicBP?: number | null;
      bloodGlucose?: number | null;
      bodyTemp?: number | null;
      spo2?: number | null;
      weightKg?: number | null;
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
        systolicBP: data.systolicBP,
        diastolicBP: data.diastolicBP,
        bloodGlucose: data.bloodGlucose,
        bodyTemp: data.bodyTemp,
        spo2: data.spo2,
        weightKg: data.weightKg,
        voiceAvailable: data.voiceAvailable,
        voiceCadence: data.voiceCadence,
        notes: data.notes,
      },
    });

    // Also update or insert matching daily HealthMetric for closed-loop sync
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
          systolicBP: data.systolicBP ?? existingMetric.systolicBP,
          diastolicBP: data.diastolicBP ?? existingMetric.diastolicBP,
          bloodGlucose: data.bloodGlucose ?? existingMetric.bloodGlucose,
          bodyTemp: data.bodyTemp ?? existingMetric.bodyTemp,
          spo2: data.spo2 ?? existingMetric.spo2,
          weightKg: data.weightKg ?? existingMetric.weightKg,
          voiceCadence: data.voiceCadence ?? existingMetric.voiceCadence,
        },
      });
    }

    return checkIn;
  }

  /**
   * Retrieves personal health twin baseline bands, absolute thresholds, and explainable forecasts.
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

    // Expanded metric set for digital twin
    const metricDefs: {
      key: keyof (typeof history)[0];
      label: string;
      unit: string;
      higherIsBetter: boolean;
    }[] = [
      { key: 'systolicBP', label: 'Systolic Blood Pressure', unit: 'mmHg', higherIsBetter: false },
      { key: 'hrv', label: 'Heart Rate Variability', unit: 'ms', higherIsBetter: true },
      { key: 'heartRate', label: 'Resting Heart Rate', unit: 'bpm', higherIsBetter: false },
      { key: 'sleepHours', label: 'Sleep Duration', unit: 'hours', higherIsBetter: true },
      { key: 'bloodGlucose', label: 'Blood Glucose', unit: 'mg/dL', higherIsBetter: false },
      { key: 'bodyTemp', label: 'Core Body Temperature', unit: '°C', higherIsBetter: false },
      { key: 'spo2', label: 'Capillary Oxygen (SpO2)', unit: '%', higherIsBetter: true },
      { key: 'reactionTimeMs', label: 'PVT Reaction Latency', unit: 'ms', higherIsBetter: false },
      { key: 'cabinCO2ppm', label: 'Cabin Carbon Dioxide', unit: 'ppm', higherIsBetter: false },
      { key: 'exerciseMinutes', label: 'Daily Exercise Completed', unit: 'min', higherIsBetter: true },
      { key: 'voiceCadence', label: 'Voice Cadence Biomarker', unit: 'syllables/s', higherIsBetter: true },
    ];

    const catalogMap = new Map(INDICATOR_CATALOG.map((c) => [c.id, c]));

    const metrics: PersonalBaselineMetric[] = metricDefs.map((def) => {
      const stats = BaselineEngine.evaluateMetricBaseline(history, def.key as any, def.higherIsBetter);
      const cat = catalogMap.get(def.key as string);

      // Build historical band (Days 1 to currentDay) with normal and warning thresholds
      const historicalBand = history
        .filter((h) => h.missionDay <= currentDay)
        .map((h) => ({
          day: h.missionDay,
          value:
            h[def.key] !== null && h[def.key] !== undefined
              ? Number((h[def.key] as number).toFixed(2))
              : null,
          baselineMean: stats.mean,
          upperBand: stats.upperBand,
          lowerBand: stats.lowerBand,
          upperWarning: cat?.warningRange?.high,
          lowerWarning: cat?.warningRange?.low,
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
        confidence: stats.currentValue !== null ? 90 : 30,
        warningRange: cat?.warningRange ? { low: cat.warningRange.low, high: cat.warningRange.high } : undefined,
        criticalRange: cat?.criticalRange ? { low: cat.criticalRange.low, high: cat.criticalRange.high } : undefined,
        historicalBand,
      };
    });

    // Generate explainable forecasts using ForecastEngine
    const forecast = ForecastEngine.generateForecast(currentDay, history, 88);

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
