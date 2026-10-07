import { SystemStatus, DomainMetricSummary } from '@astra-loop/shared';

export interface RiskEvaluationResult {
  overallRiskScore: number; // 0 - 100
  status: SystemStatus;
  statusColor: 'GREEN' | 'YELLOW' | 'RED' | 'GRAY';
  confidence: number; // 0 - 100
  dataCompleteness: number; // 0 - 100
  domainScores: {
    cardio: number;
    sleep: number;
    mind: number;
    muscleBone: number;
    immune: number;
    radiationSleepInteraction: number;
  };
  contributions: {
    name: string;
    score: number;
    description: string;
  }[];
}

export class RiskEngine {
  /**
   * Evaluates overall risk score and explainable domain contributions.
   * Formula:
   * risk = 0.20*cardio + 0.25*sleep + 0.20*mind + 0.15*muscleBone + 0.10*immune + 0.10*interaction
   */
  public static evaluateRisk(
    domains: DomainMetricSummary[],
    radiationDoseRate: number, // mSv/h
    radiationBaseline: number = 0.05
  ): RiskEvaluationResult {
    // Domain risk weights
    const WEIGHTS = {
      cardio: 0.2,
      sleep: 0.25,
      mind: 0.2,
      muscleBone: 0.15,
      immune: 0.1,
      radiationSleepInteraction: 0.1,
    };

    // Find domains
    const cardioDomain = domains.find((d) => d.domain === 'Cardio');
    const sleepDomain = domains.find((d) => d.domain === 'Sleep');
    const mindDomain = domains.find((d) => d.domain === 'Mind');
    const muscleBoneDomain = domains.find((d) => d.domain === 'Muscle-Bone');
    const immuneDomain = domains.find((d) => d.domain === 'Immune');

    // Calculate domain risks (0 to 100 scale, where higher = higher simulated risk)
    // Z-score conversion to risk: a negative Z-score for beneficial metrics (HRV, Sleep) or positive for fatigue increases risk
    const calcDomainRisk = (domain?: DomainMetricSummary, invert = false): number => {
      if (!domain || !domain.dataAvailable || domain.deviationZScore === null) {
        return 35; // Moderate neutral baseline risk when sensor is missing, never assume zero!
      }
      const z = domain.deviationZScore;
      // If higher metric is worse (e.g. fatigue, reaction time), risk rises with z
      // If higher metric is better (e.g. sleep, HRV), risk rises with negative z
      const effectiveZ = invert ? -z : z;
      // Map Z from [-3, 3] to risk [0, 100]
      const clampedZ = Math.max(-3, Math.min(3, effectiveZ));
      return Math.round(((clampedZ + 3) / 6) * 100);
    };

    const cardioRisk = calcDomainRisk(cardioDomain, true); // Lower HRV = higher risk
    const sleepRisk = calcDomainRisk(sleepDomain, true); // Less sleep = higher risk
    const mindRisk = calcDomainRisk(mindDomain, false); // Higher stress/reaction time = higher risk
    const muscleBoneRisk = calcDomainRisk(muscleBoneDomain, true); // Lower activity = higher risk
    const immuneRisk = calcDomainRisk(immuneDomain, false); // Elevated marker = higher risk

    // Radiation & Sleep Interaction
    // interaction = normalizedRadiation * normalizedSleepDebt
    const normalizedRadiation = Math.min(1.0, Math.max(0, (radiationDoseRate - radiationBaseline) / 1.5));
    const sleepHours = sleepDomain?.currentValue ?? 7.0;
    const baselineSleep = sleepDomain?.personalBaseline ?? 7.5;
    const sleepDebtHours = Math.max(0, baselineSleep - sleepHours);
    const normalizedSleepDebt = Math.min(1.0, sleepDebtHours / 3.0);

    const interactionRisk = Math.round(normalizedRadiation * normalizedSleepDebt * 100);

    // Calculate data completeness
    const totalSensors = domains.length;
    const availableSensors = domains.filter((d) => d.dataAvailable).length;
    const dataCompleteness = Math.round((availableSensors / totalSensors) * 100);

    // Compute Confidence: heavily impacted by missing sensors
    // Base confidence from average domain confidence, multiplied by completeness factor
    const avgDomainConfidence =
      domains.length > 0
        ? domains.reduce((sum, d) => sum + (d.dataAvailable ? d.confidence : 30), 0) / domains.length
        : 50;
    const completenessFactor = Math.pow(dataCompleteness / 100, 0.7);
    const confidence = Math.round(avgDomainConfidence * completenessFactor);

    // Total Risk Score
    const rawRisk =
      WEIGHTS.cardio * cardioRisk +
      WEIGHTS.sleep * sleepRisk +
      WEIGHTS.mind * mindRisk +
      WEIGHTS.muscleBone * muscleBoneRisk +
      WEIGHTS.immune * immuneRisk +
      WEIGHTS.radiationSleepInteraction * interactionRisk;

    const overallRiskScore = Math.min(100, Math.max(0, Math.round(rawRisk)));

    // Risk Status mapping
    let status: SystemStatus = 'STABLE';
    let statusColor: 'GREEN' | 'YELLOW' | 'RED' | 'GRAY' = 'GREEN';

    if (confidence < 40) {
      status = 'INSUFFICIENT_DATA';
      statusColor = 'GRAY';
    } else if (overallRiskScore >= 60) {
      status = 'ATTENTION';
      statusColor = 'RED';
    } else if (overallRiskScore >= 30) {
      status = 'MONITOR';
      statusColor = 'YELLOW';
    } else {
      status = 'STABLE';
      statusColor = 'GREEN';
    }

    // Explainable contributions for chart
    const contributions = [
      {
        name: 'Sleep debt',
        score: Math.round(WEIGHTS.sleep * sleepRisk),
        description: 'Contribution of cumulative sleep deficit below personal baseline',
      },
      {
        name: 'Radiation event',
        score: Math.round(WEIGHTS.radiationSleepInteraction * interactionRisk + normalizedRadiation * 15),
        description: 'Simulated compound exposure impact from active watch window',
      },
      {
        name: 'HRV deviation',
        score: Math.round(WEIGHTS.cardio * cardioRisk),
        description: 'Autonomic nervous system recovery divergence from 14-day baseline',
      },
      {
        name: 'Mood & Reaction time',
        score: Math.round(WEIGHTS.mind * mindRisk),
        description: 'Cognitive latency and subjective stress elevation',
      },
    ].sort((a, b) => b.score - a.score);

    return {
      overallRiskScore,
      status,
      statusColor,
      confidence,
      dataCompleteness,
      domainScores: {
        cardio: cardioRisk,
        sleep: sleepRisk,
        mind: mindRisk,
        muscleBone: muscleBoneRisk,
        immune: immuneRisk,
        radiationSleepInteraction: interactionRisk,
      },
      contributions,
    };
  }
}
