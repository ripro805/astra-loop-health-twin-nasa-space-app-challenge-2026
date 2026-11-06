import { describe, it, expect } from 'vitest';
import { ThresholdEngine } from '../src/engines/threshold.engine.js';
import { RiskEngine } from '../src/engines/risk.engine.js';
import { GravityEngine } from '../src/engines/gravity.engine.js';
import { EnvironmentEngine } from '../src/engines/environment.engine.js';
import { IsolationEngine } from '../src/engines/isolation.engine.js';
import { EscalationEngine } from '../src/engines/escalation.engine.js';
import { NutritionEngine } from '../src/engines/nutrition.engine.js';
import { GamificationEngine } from '../src/engines/gamification.engine.js';
import { LearnLoopEngine } from '../src/engines/learnLoop.engine.js';
import { ForecastEngine } from '../src/engines/forecast.engine.js';
import { DomainMetricSummary } from '@astra-loop/shared';

describe('ThresholdEngine (Absolute Safety Layer)', () => {
  it('identifies normal metrics within standard reference ranges', () => {
    const res = ThresholdEngine.evaluateMetric('systolicBP', 115);
    expect(res.status).toBe('NORMAL');
    expect(res.escalationTierSuggested).toBe('SELF_MANAGE');
  });

  it('detects clinical warnings correctly', () => {
    const res = ThresholdEngine.evaluateMetric('systolicBP', 138);
    expect(res.status).toBe('WARNING');
    expect(res.escalationTierSuggested).toBe('MONITOR');
  });

  it('triggers CRITICAL emergency on severe hypertension', () => {
    const res = ThresholdEngine.evaluateMetric('systolicBP', 185);
    expect(res.status).toBe('CRITICAL');
    expect(res.escalationTierSuggested).toBe('EMERGENCY');
  });

  it('triggers CRITICAL emergency on severe hypoglycemia', () => {
    const res = ThresholdEngine.evaluateMetric('bloodGlucose', 48);
    expect(res.status).toBe('CRITICAL');
    expect(res.escalationTierSuggested).toBe('EMERGENCY');
  });

  it('handles null and missing values safely without crashing', () => {
    const res = ThresholdEngine.evaluateMetric('systolicBP', null);
    expect(res.status).toBe('NORMAL');
    expect(res.currentValue).toBeNull();
  });

  it('demonstrates that Absolute CRITICAL overrides any personal baseline Z-score', () => {
    // Astronaut personal baseline drifted high, so Z-score claims "STABLE"
    const zScoreStatus = 'STABLE';
    const absoluteStatus = 'CRITICAL';

    const resolved = ThresholdEngine.resolveHybridStatus(absoluteStatus, zScoreStatus);
    expect(resolved).toBe('ATTENTION'); // Absolute safety overrides!
  });
});

describe('RiskEngine (Multi-Domain & Weights Integrity)', () => {
  it('verifies that domain weights sum to exactly 1.000 for all environments', () => {
    for (const [env, weights] of Object.entries(RiskEngine.ENVIRONMENT_WEIGHTS)) {
      const sum =
        weights.cardio +
        weights.sleep +
        weights.mind +
        weights.muscleBone +
        weights.immune +
        weights.metabolic +
        weights.environment +
        weights.radiationSleepInteraction +
        weights.co2SleepInteraction;

      expect(Number(sum.toFixed(4))).toBe(1.0);
    }
  });

  it('bounds risk score strictly in [0, 100]', () => {
    const mockDomains: DomainMetricSummary[] = [
      {
        domain: 'Cardio',
        currentValueDisplay: '120',
        currentValue: 120,
        unit: 'bpm',
        personalBaselineDisplay: '60',
        personalBaseline: 60,
        deviationDisplay: '+60',
        deviationZScore: 4.5,
        trend: 'declining',
        status: 'ATTENTION',
        confidence: 90,
        dataAvailable: true,
      },
    ];

    const result = RiskEngine.evaluateRisk(mockDomains, 2.5, 0.05, 'SPACECRAFT');
    expect(result.overallRiskScore).toBeGreaterThanOrEqual(0);
    expect(result.overallRiskScore).toBeLessThanOrEqual(100);
  });

  it('forces ATTENTION status if any domain has an ABSOLUTE CRITICAL flag', () => {
    const mockDomains: DomainMetricSummary[] = [
      {
        domain: 'Cardio',
        currentValueDisplay: '185 mmHg',
        currentValue: 185,
        unit: 'mmHg',
        personalBaselineDisplay: '120',
        personalBaseline: 120,
        deviationDisplay: '+65',
        deviationZScore: 0.1, // Artificially low Z-score
        trend: 'stable',
        status: 'STABLE',
        confidence: 90,
        dataAvailable: true,
        absoluteStatus: 'CRITICAL',
      },
    ];

    const result = RiskEngine.evaluateRisk(mockDomains, 0.04, 0.05, 'SPACECRAFT');
    expect(result.status).toBe('ATTENTION');
    expect(result.statusColor).toBe('RED');
  });
});

describe('GravityEngine (Loading Deficit & Prescription)', () => {
  it('correctly models 0g microgravity requirements', () => {
    const prescription = GravityEngine.evaluateGravityPrescription(0.0, 'Transit 0g');
    expect(prescription.loadingDeficitPct).toBe(100);
    expect(prescription.totalPrescribedMinutes).toBeGreaterThanOrEqual(130);
    expect(prescription.orthostaticIntoleranceRisk).toBe('HIGH');
  });

  it('offsets loading requirements in Mars partial gravity (0.38g)', () => {
    const prescription = GravityEngine.evaluateGravityPrescription(0.38, 'Mars Base');
    expect(prescription.loadingDeficitPct).toBe(62);
    expect(prescription.totalPrescribedMinutes).toBeLessThan(100);
    expect(prescription.prescribedResistiveMinutes).toBe(35);
  });
});

describe('EnvironmentEngine (NASA-STD-3001 Habitability)', () => {
  it('flags normal habitat conditions as optimal', () => {
    const res = EnvironmentEngine.evaluateEnvironment(1600, 21.5, 45, 50);
    expect(res.status).toBe('NORMAL');
    expect(res.overallScore).toBeGreaterThanOrEqual(90);
  });

  it('flags emergency alert when CO2 exceeds 5000 ppm', () => {
    const res = EnvironmentEngine.evaluateEnvironment(5200, 22.0, 45, 50);
    expect(res.status).toBe('CRITICAL');
    expect(res.co2Status).toBe('CRITICAL');
    expect(res.advisories[0]).toContain('CRITICAL CO2 SPIKE');
  });
});

describe('IsolationEngine (Behavioral Health Confinement)', () => {
  it('detects third-quarter mission morale risk window', () => {
    // Day 60 in a 90-day mission is 66.7% through mission (third quarter)
    const res = IsolationEngine.evaluateIsolation(6.0, 4.0, 4.0, 60, 4.0, 60, 90);
    expect(res.thirdQuarterRiskActive).toBe(true);
  });

  it('flags acoustic prosody fatigue when voice cadence slows', () => {
    const res = IsolationEngine.evaluateIsolation(7.0, 3.0, 5.0, 100, 3.4, 30, 90);
    expect(res.acousticProsodyFatigueDetected).toBe(true);
  });
});

describe('EscalationEngine (4-Tier Decision Triage)', () => {
  it('escalates to EMERGENCY on critical blood pressure', () => {
    const mockThresholds = {
      systolicBP: {
        status: 'CRITICAL' as const,
        ruleTriggered: 'Systolic BP exceeds 180 mmHg',
        citedSource: 'ACC/AHA',
        escalationTierSuggested: 'EMERGENCY' as const,
        unit: 'mmHg',
        currentValue: 185,
      },
    };

    const res = EscalationEngine.assessEscalation(mockThresholds, 85, 'ATTENTION', 1, 14.3);
    expect(res.tier).toBe('EMERGENCY');
    expect(res.uiBanner?.visible).toBe(true);
    expect(res.autonomousEmergencyPacketsReady).toBe(true);
  });

  it('correctly handles deep-space communications delay', () => {
    const mockThresholds = {};
    const res = EscalationEngine.assessEscalation(mockThresholds, 20, 'STABLE', 0, 18.2);
    expect(res.commsDelayHandlingNote).toContain('18.2 minutes');
  });
});

describe('NutritionEngine (Metabolic Targets)', () => {
  it('calculates energy and fluid targets based on body weight and exercise', () => {
    const targets = NutritionEngine.calculateTargets(75, 120, 88, 0.0);
    expect(targets.dailyCalorieTargetKcal).toBeGreaterThan(2800);
    expect(targets.dailyFluidTargetMl).toBeGreaterThan(3000);
    expect(targets.dailySodiumMaxMg).toBe(2300);
  });
});

describe('GamificationEngine (XP & Safe Levels)', () => {
  it('calculates sub-quadratic level progression', () => {
    const lvl1 = GamificationEngine.calculateLevel(100);
    const lvl3 = GamificationEngine.calculateLevel(1000);
    expect(lvl3.level).toBeGreaterThan(lvl1.level);
  });

  it('caps XP to avoid rewarding unsafe over-exercising (> 180 min)', () => {
    const awardNormal = GamificationEngine.processActivity(500, 'EXERCISE_COMPLETED', {
      exerciseMinutes: 120,
    });
    const awardOverExercised = GamificationEngine.processActivity(500, 'EXERCISE_COMPLETED', {
      exerciseMinutes: 240, // Unsafe 4 hours of exercise
    });

    expect(awardNormal.xpEarned).toBe(100);
    expect(awardOverExercised.xpEarned).toBe(25); // Capped safely!
  });
});

describe('LearnLoopEngine (Efficacy Verification)', () => {
  it('grades an improvement delta ≥ +0.4Z as PROMISING', () => {
    const mockCountermeasure: any = { startedAt: new Date('2026-10-02T00:00:00Z') };
    const mockMetrics: any[] = [
      // Pre-countermeasure (Days 60-62) with low sleep (~5.5h)
      { missionDay: 60, sleepHours: 5.6 },
      { missionDay: 61, sleepHours: 5.5 },
      { missionDay: 62, sleepHours: 5.7 },
      // Post-countermeasure (Days 63-65) with recovered sleep (~7.2h)
      { missionDay: 63, sleepHours: 7.1 },
      { missionDay: 64, sleepHours: 7.3 },
      { missionDay: 65, sleepHours: 7.2 },
    ];

    const outcome = LearnLoopEngine.evaluateCountermeasure(mockCountermeasure, mockMetrics, 'sleepHours');
    expect(outcome.result).toBe('PROMISING');
    expect(outcome.effect).toBeGreaterThanOrEqual(0.4);
  });
});

