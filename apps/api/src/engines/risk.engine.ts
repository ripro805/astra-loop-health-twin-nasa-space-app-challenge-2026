import { SystemStatus, DomainMetricSummary, HealthDomain } from '@astra-loop/shared';

export interface DomainWeights {
  cardio: number;
  sleep: number;
  mind: number;
  muscleBone: number;
  immune: number;
  metabolic: number;
  environment: number;
  radiationSleepInteraction: number;
  co2SleepInteraction: number;
}

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
    metabolic: number;
    environment: number;
    radiationSleepInteraction: number;
    co2SleepInteraction: number;
  };
  contributions: {
    name: string;
    score: number;
    description: string;
  }[];
}

export class RiskEngine {
  /**
   * Environment-specific domain weight profiles.
   * Every profile is rigorously tested to ensure exact sum = 1.0.
   */
  public static readonly ENVIRONMENT_WEIGHTS: Record<string, DomainWeights> = {
    SPACECRAFT: {
      cardio: 0.18,
      sleep: 0.20,
      mind: 0.16,
      muscleBone: 0.15,
      immune: 0.08,
      metabolic: 0.08,
      environment: 0.07,
      radiationSleepInteraction: 0.05,
      co2SleepInteraction: 0.03,
    },
    STATION: {
      cardio: 0.18,
      sleep: 0.20,
      mind: 0.16,
      muscleBone: 0.15,
      immune: 0.08,
      metabolic: 0.08,
      environment: 0.07,
      radiationSleepInteraction: 0.05,
      co2SleepInteraction: 0.03,
    },
    MARS_BASE: {
      cardio: 0.16,
      sleep: 0.18,
      mind: 0.16,
      muscleBone: 0.12, // Lower weight due to 0.38g partial gravity offset
      immune: 0.10,
      metabolic: 0.10,
      environment: 0.10, // Higher surface dust/atmospheric interaction
      radiationSleepInteraction: 0.04,
      co2SleepInteraction: 0.04,
    },
    MOON_BASE: {
      cardio: 0.16,
      sleep: 0.18,
      mind: 0.16,
      muscleBone: 0.14,
      immune: 0.10,
      metabolic: 0.08,
      environment: 0.10,
      radiationSleepInteraction: 0.05,
      co2SleepInteraction: 0.03,
    },
    ROVER: {
      cardio: 0.15,
      sleep: 0.18,
      mind: 0.18,
      muscleBone: 0.10,
      immune: 0.08,
      metabolic: 0.11,
      environment: 0.12, // Tight cabin volume
      radiationSleepInteraction: 0.05,
      co2SleepInteraction: 0.03,
    },
  };

  /**
   * Evaluates overall risk score, explainable domain contributions, and hybrid safety resolution.
   */
  public static evaluateRisk(
    domains: DomainMetricSummary[],
    radiationDoseRate: number = 0.042, // mSv/h
    radiationBaseline: number = 0.05,
    environmentType: string = 'SPACECRAFT'
  ): RiskEvaluationResult {
    const weights: DomainWeights =
      this.ENVIRONMENT_WEIGHTS[environmentType] || this.ENVIRONMENT_WEIGHTS.SPACECRAFT;

    // Find domains
    const cardioDomain = domains.find((d) => d.domain === 'Cardio');
    const sleepDomain = domains.find((d) => d.domain === 'Sleep');
    const mindDomain = domains.find((d) => d.domain === 'Mind');
    const muscleBoneDomain = domains.find((d) => d.domain === 'Muscle-Bone');
    const immuneDomain = domains.find((d) => d.domain === 'Immune');
    const metabolicDomain = domains.find((d) => d.domain === 'Metabolic');
    const environmentDomain = domains.find((d) => d.domain === 'Environment');

    // Calculate domain risks (0 to 100 scale, where higher = higher simulated risk)
    const calcDomainRisk = (domain?: DomainMetricSummary, invert = false): number => {
      if (!domain || !domain.dataAvailable || domain.deviationZScore === null) {
        return 35; // Neutral baseline risk when sensor is missing; never assume 0!
      }
      const z = domain.deviationZScore;
      const effectiveZ = invert ? -z : z;
      const clampedZ = Math.max(-3, Math.min(3, effectiveZ));
      return Math.round(((clampedZ + 3) / 6) * 100);
    };

    const cardioRisk = calcDomainRisk(cardioDomain, true); // Lower HRV = higher risk
    const sleepRisk = calcDomainRisk(sleepDomain, true); // Less sleep = higher risk
    const mindRisk = calcDomainRisk(mindDomain, false); // Higher reaction time latency / stress = higher risk
    const muscleBoneRisk = calcDomainRisk(muscleBoneDomain, true); // Lower exercise / activity = higher risk
    const immuneRisk = calcDomainRisk(immuneDomain, false); // Elevated temp / stress = higher risk
    const metabolicRisk = calcDomainRisk(metabolicDomain, false); // Hyperglycemia or dehydration = higher risk
    const environmentRisk = calcDomainRisk(environmentDomain, false); // Elevated CO2 / noise = higher risk

    // 1. Radiation & Sleep Interaction
    const normalizedRadiation = Math.min(
      1.0,
      Math.max(0, (radiationDoseRate - radiationBaseline) / 1.5)
    );
    const sleepHours = sleepDomain?.currentValue ?? 7.0;
    const baselineSleep = sleepDomain?.personalBaseline ?? 7.35;
    const sleepDebtHours = Math.max(0, baselineSleep - sleepHours);
    const normalizedSleepDebt = Math.min(1.0, sleepDebtHours / 3.0);
    const radiationSleepInteraction = Math.round(
      normalizedRadiation * normalizedSleepDebt * 100
    );

    // 2. Cabin CO2 & Sleep Interaction
    const co2Val = environmentDomain?.currentValue ?? 1800;
    const normalizedCO2 = Math.min(1.0, Math.max(0, (co2Val - 1800) / 2200)); // 1800 to 4000 ppm
    const co2SleepInteraction = Math.round(normalizedCO2 * normalizedSleepDebt * 100);

    // Calculate data completeness
    const totalSensors = domains.length;
    const availableSensors = domains.filter((d) => d.dataAvailable).length;
    const dataCompleteness =
      totalSensors > 0 ? Math.round((availableSensors / totalSensors) * 100) : 50;

    // Compute Confidence: heavily impacted by missing sensors
    const avgDomainConfidence =
      domains.length > 0
        ? domains.reduce((sum, d) => sum + (d.dataAvailable ? d.confidence : 30), 0) /
          domains.length
        : 50;
    const completenessFactor = Math.pow(dataCompleteness / 100, 0.7);
    const confidence = Math.round(avgDomainConfidence * completenessFactor);

    // Weighted Risk Summation
    const rawRisk =
      weights.cardio * cardioRisk +
      weights.sleep * sleepRisk +
      weights.mind * mindRisk +
      weights.muscleBone * muscleBoneRisk +
      weights.immune * immuneRisk +
      weights.metabolic * metabolicRisk +
      weights.environment * environmentRisk +
      weights.radiationSleepInteraction * radiationSleepInteraction +
      weights.co2SleepInteraction * co2SleepInteraction;

    const overallRiskScore = Math.min(100, Math.max(0, Math.round(rawRisk)));

    // Risk Status mapping with Dual-Layer Absolute Safety override
    let status: SystemStatus = 'STABLE';
    let statusColor: 'GREEN' | 'YELLOW' | 'RED' | 'GRAY' = 'GREEN';

    // Check if any domain has an ABSOLUTE CRITICAL flag
    const hasCriticalAbsolute = domains.some((d) => d.absoluteStatus === 'CRITICAL');
    const hasWarningAbsolute = domains.some((d) => d.absoluteStatus === 'WARNING');

    if (confidence < 40 && !hasCriticalAbsolute) {
      status = 'INSUFFICIENT_DATA';
      statusColor = 'GRAY';
    } else if (hasCriticalAbsolute || overallRiskScore >= 60) {
      status = 'ATTENTION';
      statusColor = 'RED';
    } else if (hasWarningAbsolute || overallRiskScore >= 30) {
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
        score: Math.round(weights.sleep * sleepRisk),
        description: 'Cumulative sleep deficit relative to 14-day calibrated baseline',
      },
      {
        name: 'Cardio & BP deviation',
        score: Math.round(weights.cardio * cardioRisk),
        description: 'Autonomic tone attenuation (HRV) and vascular resistance shift',
      },
      {
        name: 'Radiation event',
        score: Math.round(
          weights.radiationSleepInteraction * radiationSleepInteraction +
            normalizedRadiation * 15
        ),
        description: 'Active 72-hour observation window compound exposure loading',
      },
      {
        name: 'Cognitive & Isolation',
        score: Math.round(weights.mind * mindRisk),
        description: 'Psychomotor vigilance latency and subjective allostatic load',
      },
      {
        name: 'Musculoskeletal deficit',
        score: Math.round(weights.muscleBone * muscleBoneRisk),
        description: 'Exercise mechanical loading deficit and gravity unloading offset',
      },
      {
        name: 'Habitat & CO2 interaction',
        score: Math.round(
          weights.environment * environmentRisk +
            weights.co2SleepInteraction * co2SleepInteraction
        ),
        description: 'Closed environment atmospheric CO2 pooling and acoustic noise',
      },
      {
        name: 'Metabolic & Hydration',
        score: Math.round(weights.metabolic * metabolicRisk),
        description: 'Glycemic variability and systemic hydration index',
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
        metabolic: metabolicRisk,
        environment: environmentRisk,
        radiationSleepInteraction,
        co2SleepInteraction,
      },
      contributions,
    };
  }
}
