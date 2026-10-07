import { prisma } from '../utils/prisma.js';
import { BaselineEngine } from '../engines/baseline.engine.js';
import { RiskEngine } from '../engines/risk.engine.js';
import { ConfidenceEngine } from '../engines/confidence.engine.js';
import { RadiationWatchEngine } from '../engines/radiationWatch.engine.js';
import {
  DashboardData,
  DomainMetricSummary,
  ChangeItem,
  SystemStatus,
} from '@astra-loop/shared';

export class AstronautService {
  /**
   * Retrieves or creates the default demo astronaut.
   */
  public static async getPrimaryAstronaut() {
    let astronaut = await prisma.astronaut.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    if (!astronaut) {
      astronaut = await prisma.astronaut.create({
        data: {
          name: 'CDR Alex Vance',
          missionDay: 61,
          calibrationDone: true,
        },
      });
    }

    return astronaut;
  }

  /**
   * Builds the comprehensive Today Dashboard data payload.
   */
  public static async getDashboardData(astronautId: string): Promise<DashboardData> {
    const astronaut = await prisma.astronaut.findUnique({
      where: { id: astronautId },
      include: {
        healthMetrics: {
          orderBy: { missionDay: 'asc' },
        },
        radiationEvents: {
          orderBy: { missionDay: 'asc' },
        },
        countermeasures: {
          where: { status: 'ACTIVE' },
        },
        alerts: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
      },
    });

    if (!astronaut) {
      throw new Error(`Astronaut ${astronautId} not found.`);
    }

    const currentDay = astronaut.missionDay;
    const history = astronaut.healthMetrics;
    const todayMetric = history.find((m) => m.missionDay === currentDay) || history[history.length - 1];
    const prevMetric = history.find((m) => m.missionDay === currentDay - 1);

    // Compute Baselines across all 5 key physiological domains
    const cardioStats = BaselineEngine.evaluateMetricBaseline(history, 'hrv', true);
    const sleepStats = BaselineEngine.evaluateMetricBaseline(history, 'sleepHours', true);
    const mindStats = BaselineEngine.evaluateMetricBaseline(history, 'reactionTimeMs', false); // lower reaction time is better
    const muscleStats = BaselineEngine.evaluateMetricBaseline(history, 'activity', true);
    const immuneStats = BaselineEngine.evaluateMetricBaseline(history, 'stress', false); // lower stress is better

    // Format Domain Summaries for the Today cards
    const domains: DomainMetricSummary[] = [
      {
        domain: 'Cardio',
        currentValueDisplay: todayMetric?.hrv ? `${todayMetric.hrv.toFixed(0)} ms` : 'DATA GAP',
        currentValue: todayMetric?.hrv ?? null,
        unit: 'rMSSD (ms)',
        personalBaselineDisplay: `${cardioStats.mean.toFixed(0)} ms`,
        personalBaseline: cardioStats.mean,
        deviationDisplay:
          todayMetric?.hrv && cardioStats.mean
            ? `${(todayMetric.hrv - cardioStats.mean).toFixed(0)} ms (${cardioStats.zScore?.toFixed(1)}z)`
            : 'INSUFFICIENT DATA',
        deviationZScore: cardioStats.zScore ?? 0,
        trend: cardioStats.trend,
        status:
          cardioStats.zScore === null
            ? 'INSUFFICIENT_DATA'
            : cardioStats.zScore < -1.2
            ? 'ATTENTION'
            : cardioStats.zScore < -0.5
            ? 'MONITOR'
            : 'STABLE',
        confidence: todayMetric?.hrv !== null ? 89 : 35,
        dataAvailable: todayMetric?.hrv !== null && todayMetric?.hrv !== undefined,
        notes: 'Autonomous HRV tracking via wrist photoplethysmography.',
      },
      {
        domain: 'Sleep',
        currentValueDisplay: todayMetric?.sleepHours
          ? `${Math.floor(todayMetric.sleepHours)}h ${Math.round((todayMetric.sleepHours % 1) * 60)}m`
          : 'DATA GAP',
        currentValue: todayMetric?.sleepHours ?? null,
        unit: 'hours',
        personalBaselineDisplay: `${Math.floor(sleepStats.mean)}h ${Math.round((sleepStats.mean % 1) * 60)}m`,
        personalBaseline: sleepStats.mean,
        deviationDisplay:
          todayMetric?.sleepHours && sleepStats.mean
            ? `${(todayMetric.sleepHours - sleepStats.mean < 0 ? '-' : '+')}${Math.abs(
                Math.floor(todayMetric.sleepHours - sleepStats.mean)
              )}h ${Math.abs(Math.round(((todayMetric.sleepHours - sleepStats.mean) % 1) * 60))}m`
            : 'INSUFFICIENT DATA',
        deviationZScore: sleepStats.zScore ?? 0,
        trend: sleepStats.trend,
        status:
          sleepStats.zScore === null
            ? 'INSUFFICIENT_DATA'
            : sleepStats.zScore < -1.2
            ? 'ATTENTION'
            : sleepStats.zScore < -0.5
            ? 'MONITOR'
            : 'STABLE',
        confidence: todayMetric?.sleepHours !== null ? 87 : 30,
        dataAvailable: todayMetric?.sleepHours !== null && todayMetric?.sleepHours !== undefined,
        notes: 'Actigraphy sleep staging and duration analysis.',
      },
      {
        domain: 'Mind',
        currentValueDisplay: todayMetric?.reactionTimeMs
          ? `${todayMetric.reactionTimeMs.toFixed(0)} ms`
          : 'DATA GAP',
        currentValue: todayMetric?.reactionTimeMs ?? null,
        unit: 'ms latency',
        personalBaselineDisplay: `${mindStats.mean.toFixed(0)} ms`,
        personalBaseline: mindStats.mean,
        deviationDisplay:
          todayMetric?.reactionTimeMs && mindStats.mean
            ? `+${(todayMetric.reactionTimeMs - mindStats.mean).toFixed(0)} ms (${mindStats.zScore?.toFixed(1)}z)`
            : 'INSUFFICIENT DATA',
        deviationZScore: mindStats.zScore ?? 0,
        trend: mindStats.trend,
        status:
          mindStats.zScore === null
            ? 'INSUFFICIENT_DATA'
            : mindStats.zScore > 1.2
            ? 'ATTENTION'
            : mindStats.zScore > 0.5
            ? 'MONITOR'
            : 'STABLE',
        confidence: todayMetric?.reactionTimeMs !== null ? 82 : 30,
        dataAvailable: todayMetric?.reactionTimeMs !== null && todayMetric?.reactionTimeMs !== undefined,
        notes: 'Psychomotor vigilance visual reaction test.',
      },
      {
        domain: 'Muscle-Bone',
        currentValueDisplay: todayMetric?.activity ? `${todayMetric.activity.toFixed(0)} score` : 'DATA GAP',
        currentValue: todayMetric?.activity ?? null,
        unit: 'activity load',
        personalBaselineDisplay: `${muscleStats.mean.toFixed(0)} score`,
        personalBaseline: muscleStats.mean,
        deviationDisplay:
          todayMetric?.activity && muscleStats.mean
            ? `${(todayMetric.activity - muscleStats.mean).toFixed(0)} pts`
            : 'INSUFFICIENT DATA',
        deviationZScore: muscleStats.zScore ?? 0,
        trend: muscleStats.trend,
        status:
          muscleStats.zScore === null
            ? 'INSUFFICIENT_DATA'
            : muscleStats.zScore < -1.0
            ? 'MONITOR'
            : 'STABLE',
        confidence: todayMetric?.activity !== null ? 92 : 35,
        dataAvailable: todayMetric?.activity !== null && todayMetric?.activity !== undefined,
        notes: 'Resistive and aerobic exercise telemetry.',
      },
      {
        domain: 'Immune',
        currentValueDisplay: todayMetric?.stress ? `${todayMetric.stress.toFixed(1)} / 10` : 'DATA GAP',
        currentValue: todayMetric?.stress ?? null,
        unit: 'allostatic load',
        personalBaselineDisplay: `${immuneStats.mean.toFixed(1)} / 10`,
        personalBaseline: immuneStats.mean,
        deviationDisplay:
          todayMetric?.stress && immuneStats.mean
            ? `+${(todayMetric.stress - immuneStats.mean).toFixed(1)} pts`
            : 'INSUFFICIENT DATA',
        deviationZScore: immuneStats.zScore ?? 0,
        trend: immuneStats.trend,
        status:
          immuneStats.zScore === null
            ? 'INSUFFICIENT_DATA'
            : immuneStats.zScore > 1.2
            ? 'MONITOR'
            : 'STABLE',
        confidence: todayMetric?.stress !== null ? 85 : 30,
        dataAvailable: todayMetric?.stress !== null && todayMetric?.stress !== undefined,
        notes: 'Simulated neuro-endocrine stress biomarkers.',
      },
    ];

    // Latest Radiation Event
    const latestRadiation = astronaut.radiationEvents[astronaut.radiationEvents.length - 1];
    const doseRate = latestRadiation ? latestRadiation.doseRate : 0.04;

    // Evaluate Risk using deterministic RiskEngine
    const riskResult = RiskEngine.evaluateRisk(domains, doseRate);

    // Sensor Completeness check
    const blindSpotInfo = ConfidenceEngine.evaluateSensorCompleteness(todayMetric, domains);

    // Radiation Watch Engine check
    const radWatch = RadiationWatchEngine.evaluateRadiationWatch(
      currentDay,
      astronaut.radiationEvents,
      history
    );

    // Formulate 3-5 What Changed Today items
    const recentChanges: ChangeItem[] = [];

    // Sleep change
    if (todayMetric && prevMetric && todayMetric.sleepHours && prevMetric.sleepHours) {
      const sleepPct = Math.round(
        ((todayMetric.sleepHours - prevMetric.sleepHours) / prevMetric.sleepHours) * 100
      );
      recentChanges.push({
        id: 'change-sleep',
        title: 'Sleep Duration Decreased',
        domain: 'Sleep',
        detectedChange: `${sleepPct}%`,
        percentChange: sleepPct,
        direction: sleepPct < 0 ? 'down' : 'up',
        baselineContext: 'Compared with your 14-day personal baseline (7h 21m).',
        whyThisMatters: 'Persistent sleep debt may contribute to fatigue and slower cognitive reaction times.',
        confidence: 87,
        dataSources: ['Actigraphy Wearable', 'Daily Self-Report'],
        riskContributionWeight: 25,
      });
    }

    // HRV change
    if (todayMetric && cardioStats.zScore !== null && cardioStats.zScore < -0.8) {
      recentChanges.push({
        id: 'change-hrv',
        title: 'HRV Below Personal Baseline',
        domain: 'Cardio',
        detectedChange: `${cardioStats.zScore.toFixed(1)}z`,
        percentChange: -28,
        direction: 'down',
        baselineContext: 'Autonomic tone divergence from calibrated 68ms baseline.',
        whyThisMatters: 'Reduced rMSSD reflects sympathetic dominance and reduced physiological recovery window.',
        confidence: 89,
        dataSources: ['Continuous PPG Bio-Sensor'],
        riskContributionWeight: 20,
      });
    }

    // Radiation change
    if (latestRadiation && latestRadiation.doseRate > 0.2) {
      recentChanges.push({
        id: 'change-radiation',
        title: 'Radiation Exposure Spike (SPE)',
        domain: 'Radiation',
        detectedChange: `+${latestRadiation.doseRate.toFixed(2)} mSv/h`,
        percentChange: 350,
        direction: 'up',
        baselineContext: 'Elevated relative to nominal deep-space galactic cosmic background (0.04 mSv/h).',
        whyThisMatters: 'Triggers 72-hour multi-sensor watch window for non-causal physiological association tracking.',
        confidence: 96,
        dataSources: ['Active Radiation Dosimeter Array'],
        riskContributionWeight: 22,
      });
    }

    // Reaction time change
    if (todayMetric && mindStats.zScore !== null && mindStats.zScore > 0.8) {
      recentChanges.push({
        id: 'change-reaction',
        title: 'Reaction Time Latency Shift',
        domain: 'Mind',
        detectedChange: `+${(todayMetric.reactionTimeMs! - mindStats.mean).toFixed(0)} ms`,
        percentChange: 22,
        direction: 'up',
        baselineContext: 'Psychomotor vigilance slower than 230ms 14-day personal baseline.',
        whyThisMatters: 'Slight latency increase associated with acute sleep deficit and task load.',
        confidence: 82,
        dataSources: ['Psychomotor Vigilance Check-In'],
        riskContributionWeight: 14,
      });
    }

    // Voice cadence change
    if (todayMetric && todayMetric.voiceCadence && todayMetric.voiceCadence < 4.0) {
      recentChanges.push({
        id: 'change-voice',
        title: 'Voice Cadence Modulation',
        domain: 'Mind / Speech',
        detectedChange: `${todayMetric.voiceCadence.toFixed(2)} syll/s`,
        percentChange: -15,
        direction: 'down',
        baselineContext: 'Voice cadence slowed relative to 4.35 syllables/s baseline.',
        whyThisMatters: 'Acoustic prosody deceleration often correlates with subjective fatigue.',
        confidence: 76,
        dataSources: ['Audio Check-In Stream'],
        riskContributionWeight: 9,
      });
    }

    return {
      missionDay: currentDay,
      overallStatus: riskResult.status,
      simulatedRiskScore: riskResult.overallRiskScore,
      confidence: riskResult.confidence,
      dataCompleteness: riskResult.dataCompleteness,
      isOffline: false,
      lastSyncTime: new Date().toISOString(),
      isSynthetic: true,
      domains,
      recentChanges,
      riskContributions: riskResult.contributions,
      activeWatchWindow: radWatch.watchWindowActive,
      activeCountermeasureCount: astronaut.countermeasures.length,
      activeAlerts: astronaut.alerts.map((a) => ({
        id: a.id,
        astronautId: a.astronautId,
        timestamp: a.timestamp.toISOString(),
        domain: a.domain as any,
        severity: a.severity as any,
        title: a.title,
        explanation: a.explanation,
        confidence: a.confidence,
      })),
    };
  }
}
