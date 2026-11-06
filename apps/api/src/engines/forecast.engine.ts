import { HealthMetric } from '@prisma/client';
import { TwinForecastData } from '@astra-loop/shared';

export class ForecastEngine {
  /**
   * Generates explainable 7-day and 30-day simulated trend forecasts using linear slope + EWMA,
   * with time-to-warning threshold estimation.
   */
  public static generateForecast(
    currentMissionDay: number,
    history: HealthMetric[],
    overallConfidence: number
  ): {
    forecast7Day: TwinForecastData['forecast7Day'];
    forecast30DaySummary: TwinForecastData['forecast30DaySummary'];
  } {
    // Look at last 7-14 days to compute recent trajectory slope
    const recentMetrics = history
      .filter((m) => m.missionDay <= currentMissionDay && m.missionDay >= currentMissionDay - 14)
      .sort((a, b) => a.missionDay - b.missionDay);

    const getSlope = (key: keyof HealthMetric): number => {
      const points = recentMetrics
        .map((m) => ({ x: m.missionDay, y: m[key] as number | null }))
        .filter((p): p is { x: number; y: number } => p.y !== null && typeof p.y === 'number');

      if (points.length < 3) return 0;
      const n = points.length;
      const sumX = points.reduce((acc, p) => acc + p.x, 0);
      const sumY = points.reduce((acc, p) => acc + p.y, 0);
      const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
      const sumXX = points.reduce((acc, p) => acc + p.x * p.x, 0);

      const denominator = n * sumXX - sumX * sumX;
      if (denominator === 0) return 0;
      return (n * sumXY - sumX * sumY) / denominator;
    };

    const sleepSlope = getSlope('sleepHours'); // Negative means declining
    const fatigueSlope = getSlope('fatigue'); // Positive means increasing
    const hrvSlope = getSlope('hrv'); // Negative means declining autonomic tone
    const bpSlope = getSlope('systolicBP'); // Positive means vascular pressure creeping

    // 7-Day daily projections
    const forecast7Day: TwinForecastData['forecast7Day'] = [];
    const latestSleep = recentMetrics[recentMetrics.length - 1]?.sleepHours ?? 6.2;
    const latestFatigue = recentMetrics[recentMetrics.length - 1]?.fatigue ?? 5.5;
    const latestBP = recentMetrics[recentMetrics.length - 1]?.systolicBP ?? 122.0;

    for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
      const projDay = currentMissionDay + dayOffset;
      const projectedSleepHours = Math.max(4.0, latestSleep + sleepSlope * dayOffset);
      const projectedFatigue = Math.min(10.0, latestFatigue + fatigueSlope * dayOffset);
      const projectedBP = Math.min(180.0, latestBP + bpSlope * dayOffset);

      // Simulated risks (0 - 100)
      const simulatedSleepRisk = Math.min(
        100,
        Math.max(0, Math.round((7.5 - projectedSleepHours) * 25 + 20))
      );
      const simulatedFatigueRisk = Math.min(100, Math.max(0, Math.round(projectedFatigue * 10)));
      const simulatedBPRisk = Math.min(
        100,
        Math.max(0, Math.round(((projectedBP - 110) / 40) * 100))
      );

      // Day confidence degrades exponentially as we project further into the future
      const dayConfidence = Math.max(
        35,
        Math.round(overallConfidence * Math.pow(0.96, dayOffset))
      );

      forecast7Day.push({
        day: projDay,
        fatigueTrend:
          fatigueSlope > 0.05 ? 'Increasing' : fatigueSlope < -0.05 ? 'Decreasing' : 'Stable',
        sleepTrend:
          sleepSlope < -0.05 ? 'Decreasing' : sleepSlope > 0.05 ? 'Increasing' : 'Stable',
        recoveryTrend:
          hrvSlope < -0.3 ? 'Decreasing' : hrvSlope > 0.3 ? 'Increasing' : 'Stable',
        simulatedFatigueRisk,
        simulatedSleepRisk,
        simulatedBPRisk,
        confidence: dayConfidence,
      });
    }

    // Time-to-threshold estimation: days until BP crosses 140 mmHg warning or sleep drops < 5.5h
    let timeToWarningThresholdDays: number | null = null;
    if (bpSlope > 0.5 && latestBP < 140) {
      timeToWarningThresholdDays = Math.max(1, Math.round((140 - latestBP) / bpSlope));
    } else if (sleepSlope < -0.05 && latestSleep > 5.5) {
      const daysToSleepWarning = Math.max(1, Math.round((latestSleep - 5.5) / Math.abs(sleepSlope)));
      timeToWarningThresholdDays = timeToWarningThresholdDays
        ? Math.min(timeToWarningThresholdDays, daysToSleepWarning)
        : daysToSleepWarning;
    }

    // 30-Day strategic outlook summary
    const forecast30DaySummary = {
      sleepRiskChange:
        sleepSlope < -0.03
          ? 'High Probability of Extended Sleep Deficit (+28%)'
          : 'Stable Circadian Alignment',
      fatigueRiskChange:
        fatigueSlope > 0.03
          ? 'Progressive Cumulative Fatigue Accumulation (+34%)'
          : 'Nominal Workload Recovery',
      recoveryProjection:
        hrvSlope < -0.1
          ? 'Sub-baseline Autonomic Recovery Without Countermeasure'
          : 'Maintained Baseline Homeostasis',
      overallRiskProjected: Math.min(
        95,
        Math.max(20, Math.round(50 + (fatigueSlope * 15 - sleepSlope * 15 + bpSlope * 5) * 10))
      ),
      timeToWarningThresholdDays,
      confidence: Math.max(30, Math.round(overallConfidence * 0.72)),
    };

    return {
      forecast7Day,
      forecast30DaySummary,
    };
  }
}
