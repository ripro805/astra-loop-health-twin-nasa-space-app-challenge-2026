import { HealthMetric, Countermeasure, CountermeasureOutcome } from '@prisma/client';
import { CountermeasureResult, CountermeasureRankItem } from '@astra-loop/shared';
import { BaselineEngine } from './baseline.engine.js';

export interface EvaluationOutcomeResult {
  beforeScore: number;
  afterScore: number;
  effect: number;
  confidence: number;
  result: CountermeasureResult;
  targetMetric: string;
}

export class LearnLoopEngine {
  /**
   * Evaluates a countermeasure by comparing 48-72h pre-action vs post-action Z-scores.
   * effect = improvement (positive indicates health recovery towards or above personal baseline)
   */
  public static evaluateCountermeasure(
    countermeasure: Countermeasure,
    metrics: HealthMetric[],
    targetMetric: keyof HealthMetric = 'sleepHours'
  ): EvaluationOutcomeResult {
    const startedDay = countermeasure.startedAt
      ? new Date(countermeasure.startedAt).getUTCDate()
      : 62;

    // Baseline calculation for target metric
    const stats = BaselineEngine.evaluateMetricBaseline(metrics, targetMetric, true);
    const mean = stats.mean;
    const std = stats.std || 1;

    // Window: 2-3 days before (48-72h) vs 2-3 days after (48-72h)
    // In our mission dataset, countermeasure typically starts day 63
    const beforeMetrics = metrics.filter(
      (m) => m.missionDay >= startedDay - 3 && m.missionDay < startedDay
    );
    const afterMetrics = metrics.filter(
      (m) => m.missionDay >= startedDay && m.missionDay <= startedDay + 3
    );

    const beforeValues = beforeMetrics
      .map((m) => m[targetMetric] as number | null)
      .filter((v): v is number => v !== null && typeof v === 'number');

    const afterValues = afterMetrics
      .map((m) => m[targetMetric] as number | null)
      .filter((v): v is number => v !== null && typeof v === 'number');

    if (beforeValues.length === 0 || afterValues.length === 0) {
      return {
        beforeScore: 0,
        afterScore: 0,
        effect: 0,
        confidence: 25,
        result: 'INSUFFICIENT_DATA',
        targetMetric: String(targetMetric),
      };
    }

    const beforeMean = beforeValues.reduce((a, b) => a + b, 0) / beforeValues.length;
    const afterMean = afterValues.reduce((a, b) => a + b, 0) / afterValues.length;

    // Z-scores relative to personal baseline
    const beforeZ = Number(((beforeMean - mean) / std).toFixed(2));
    const afterZ = Number(((afterMean - mean) / std).toFixed(2));

    // Improvement: moving closer to or above 0 Z-score from negative deficit
    const effect = Number((afterZ - beforeZ).toFixed(2));

    // Confidence depends on sample count
    const sampleCompleteness = (beforeValues.length + afterValues.length) / 6; // up to 6 days
    const confidence = Math.min(95, Math.max(30, Math.round(sampleCompleteness * 75 + 15)));

    let result: CountermeasureResult = 'UNCERTAIN';
    if (effect >= 0.4) {
      result = 'PROMISING';
    } else if (effect <= -0.3) {
      result = 'WORSENING';
    } else {
      result = 'UNCERTAIN';
    }

    return {
      beforeScore: beforeZ,
      afterScore: afterZ,
      effect,
      confidence,
      result,
      targetMetric: String(targetMetric),
    };
  }

  /**
   * Generates personalized ranking of countermeasures for an astronaut based on historical efficacy.
   */
  public static generatePersonalizedRanking(
    countermeasures: (Countermeasure & { outcomes: CountermeasureOutcome[] })[]
  ): CountermeasureRankItem[] {
    const catalog: Record<string, { title: string; defaultRecommendation: string }> = {
      SLEEP_PHASE_ADJUSTMENT: {
        title: 'Sleep Phase Adjustment',
        defaultRecommendation: 'Gradual 30-minute circadian advance with ambient blue-light attenuation.',
      },
      LIGHTING_SCHEDULE: {
        title: 'Circadian Lighting Protocol',
        defaultRecommendation: 'Dynamic spectrum adjustment: 480nm morning peak, red-shifted pre-sleep spectrum.',
      },
      RECOVERY_PERIOD: {
        title: 'Structured Recovery Window',
        defaultRecommendation: 'Scheduled 45-minute low-stimulation cognitive reset and sensory quiet period.',
      },
      EXERCISE_LOAD_ADJUSTMENT: {
        title: 'Exercise Load Modulation',
        defaultRecommendation: 'Transition from high-intensity interval to steady-state aerobic recovery.',
      },
      HYDRATION_MONITORING: {
        title: 'Electrolyte & Hydration Schedule',
        defaultRecommendation: 'Targeted isotonic electrolyte replenishment to support blood volume stability.',
      },
    };

    const grouped: Record<
      string,
      {
        count: number;
        effects: number[];
        confidences: number[];
        lastDay: number;
        outcomes: string[];
      }
    > = {};

    // Initialize all catalog keys
    for (const key of Object.keys(catalog)) {
      grouped[key] = { count: 0, effects: [], confidences: [], lastDay: 0, outcomes: [] };
    }

    for (const cm of countermeasures) {
      const typeKey = cm.type.toUpperCase().replace(/\s+/g, '_');
      if (!grouped[typeKey]) {
        grouped[typeKey] = { count: 0, effects: [], confidences: [], lastDay: 0, outcomes: [] };
      }
      grouped[typeKey].count += 1;
      const day = cm.startedAt ? new Date(cm.startedAt).getUTCDate() : 60;
      if (day > grouped[typeKey].lastDay) grouped[typeKey].lastDay = day;

      for (const o of cm.outcomes) {
        if (o.effect !== null) grouped[typeKey].effects.push(o.effect);
        if (o.confidence !== null) grouped[typeKey].confidences.push(o.confidence);
        if (o.result) grouped[typeKey].outcomes.push(o.result);
      }
    }

    // Default historical priors for demo storyline if empty
    if (grouped['SLEEP_PHASE_ADJUSTMENT'].effects.length === 0) {
      grouped['SLEEP_PHASE_ADJUSTMENT'].effects = [1.2];
      grouped['SLEEP_PHASE_ADJUSTMENT'].confidences = [72];
      grouped['SLEEP_PHASE_ADJUSTMENT'].outcomes = ['PROMISING'];
      grouped['SLEEP_PHASE_ADJUSTMENT'].count = 1;
      grouped['SLEEP_PHASE_ADJUSTMENT'].lastDay = 63;
    }
    if (grouped['LIGHTING_SCHEDULE'].effects.length === 0) {
      grouped['LIGHTING_SCHEDULE'].effects = [0.8];
      grouped['LIGHTING_SCHEDULE'].confidences = [64];
      grouped['LIGHTING_SCHEDULE'].outcomes = ['PROMISING'];
      grouped['LIGHTING_SCHEDULE'].count = 1;
      grouped['LIGHTING_SCHEDULE'].lastDay = 35;
    }
    if (grouped['RECOVERY_PERIOD'].effects.length === 0) {
      grouped['RECOVERY_PERIOD'].effects = [0.1];
      grouped['RECOVERY_PERIOD'].confidences = [41];
      grouped['RECOVERY_PERIOD'].outcomes = ['UNCERTAIN'];
      grouped['RECOVERY_PERIOD'].count = 1;
      grouped['RECOVERY_PERIOD'].lastDay = 21;
    }

    const ranking: CountermeasureRankItem[] = Object.entries(grouped).map(([typeKey, data]) => {
      const cat = catalog[typeKey] || {
        title: typeKey.replace(/_/g, ' '),
        defaultRecommendation: 'Non-clinical adaptive operational guidance.',
      };

      const avgEffect =
        data.effects.length > 0
          ? data.effects.reduce((a, b) => a + b, 0) / data.effects.length
          : 0;
      const avgConfidence =
        data.confidences.length > 0
          ? Math.round(data.confidences.reduce((a, b) => a + b, 0) / data.confidences.length)
          : 30;

      let overallResult: CountermeasureResult = 'INSUFFICIENT_DATA';
      if (data.outcomes.length === 0) {
        overallResult = 'INSUFFICIENT_DATA';
      } else if (avgEffect >= 0.4) {
        overallResult = 'PROMISING';
      } else if (avgEffect <= -0.2) {
        overallResult = 'WORSENING';
      } else {
        overallResult = 'UNCERTAIN';
      }

      return {
        id: typeKey,
        type: typeKey,
        title: cat.title,
        recommendation: cat.defaultRecommendation,
        evaluationCount: data.count,
        overallResult,
        confidence: avgConfidence,
        averageEffectZScore: Number(avgEffect.toFixed(2)),
        lastAppliedMissionDay: data.lastDay,
      };
    });

    // Sort by: PROMISING first, then averageEffectZScore descending, then confidence descending
    return ranking.sort((a, b) => {
      const scoreA = (a.overallResult === 'PROMISING' ? 100 : a.overallResult === 'UNCERTAIN' ? 50 : 0) + a.averageEffectZScore * 10;
      const scoreB = (b.overallResult === 'PROMISING' ? 100 : b.overallResult === 'UNCERTAIN' ? 50 : 0) + b.averageEffectZScore * 10;
      return scoreB - scoreA;
    });
  }
}
