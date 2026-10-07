import { HealthMetric } from '@prisma/client';

export interface MetricStats {
  mean: number;
  std: number;
  ewma: number;
  zScore: number | null;
  currentValue: number | null;
  lowerBand: number;
  upperBand: number;
  trend: 'improving' | 'stable' | 'declining';
}

export class BaselineEngine {
  private static readonly CALIBRATION_DAYS = 14;
  private static readonly EWMA_ALPHA = 0.2;

  /**
   * Calculates mean and sample standard deviation of an array of numbers.
   */
  public static calculateStats(values: number[]): { mean: number; std: number } {
    if (!values || values.length === 0) {
      return { mean: 0, std: 1 };
    }
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    if (values.length === 1) {
      return { mean, std: 1 };
    }
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (values.length - 1);
    return { mean, std: Math.sqrt(variance) || 1 };
  }

  /**
   * Calculates EWMA: EWMA_t = alpha * x_t + (1 - alpha) * EWMA_(t-1)
   */
  public static calculateEWMA(values: number[], alpha = BaselineEngine.EWMA_ALPHA): number {
    if (!values || values.length === 0) return 0;
    let ewma = values[0];
    for (let i = 1; i < values.length; i++) {
      ewma = alpha * values[i] + (1 - alpha) * ewma;
    }
    return ewma;
  }

  /**
   * Evaluates baseline and current Z-score for a specific metric key.
   */
  public static evaluateMetricBaseline(
    history: HealthMetric[],
    key: keyof HealthMetric,
    higherIsBetter = true
  ): MetricStats {
    // Separate calibration window (first 14 days) and total history
    const validMetrics = history
      .map((h) => ({ val: h[key] as number | null, day: h.missionDay }))
      .filter((m): m is { val: number; day: number } => m.val !== null && typeof m.val === 'number');

    if (validMetrics.length === 0) {
      return {
        mean: 0,
        std: 1,
        ewma: 0,
        zScore: null,
        currentValue: null,
        lowerBand: 0,
        upperBand: 0,
        trend: 'stable',
      };
    }

    // Baseline calculation from calibration days (1-14) or first 14 available
    const calibrationValues = validMetrics
      .filter((m) => m.day <= BaselineEngine.CALIBRATION_DAYS)
      .map((m) => m.val);

    const baselinePool =
      calibrationValues.length >= 7 ? calibrationValues : validMetrics.map((m) => m.val);

    const { mean, std } = this.calculateStats(baselinePool);
    const allValues = validMetrics.map((m) => m.val);
    const ewma = this.calculateEWMA(allValues);
    const currentVal = allValues[allValues.length - 1];

    const zScore = (currentVal - mean) / (std || 1);

    // Band calculations: mean +/- 1.5 standard deviations
    const lowerBand = Number((mean - 1.5 * std).toFixed(2));
    const upperBand = Number((mean + 1.5 * std).toFixed(2));

    // Trend based on EWMA vs Baseline Mean
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    const delta = (ewma - mean) / (std || 1);
    if (Math.abs(delta) > 0.3) {
      if (higherIsBetter) {
        trend = delta > 0 ? 'improving' : 'declining';
      } else {
        trend = delta > 0 ? 'declining' : 'improving';
      }
    }

    return {
      mean: Number(mean.toFixed(2)),
      std: Number(std.toFixed(2)),
      ewma: Number(ewma.toFixed(2)),
      zScore: Number(zScore.toFixed(2)),
      currentValue: Number(currentVal.toFixed(2)),
      lowerBand,
      upperBand,
      trend,
    };
  }
}
