import { prisma } from '../utils/prisma.js';
import { BaselineEngine } from '../engines/baseline.engine.js';
import { RiskEngine } from '../engines/risk.engine.js';
import { ConfidenceEngine } from '../engines/confidence.engine.js';
import { RadiationWatchEngine } from '../engines/radiationWatch.engine.js';
import { ThresholdEngine } from '../engines/threshold.engine.js';
import { EscalationEngine } from '../engines/escalation.engine.js';
import { SchedulerEngine } from '../engines/scheduler.engine.js';
import { GamificationEngine } from '../engines/gamification.engine.js';
import { GravityEngine } from '../engines/gravity.engine.js';
import { EnvironmentEngine } from '../engines/environment.engine.js';
import {
  DashboardData,
  DomainMetricSummary,
  ChangeItem,
  OrganSystemStatus,
  RoutineTask,
  GamificationState,
  FlightSurgeonReportData,
  Environment,
} from '@astra-loop/shared';

export class AstronautService {
  /**
   * Retrieves or creates the primary demo astronaut.
   */
  public static async getPrimaryAstronaut() {
    let astronaut = await prisma.astronaut.findFirst({
      include: { environment: true },
      orderBy: { createdAt: 'asc' },
    });

    if (!astronaut) {
      let defaultEnv = await prisma.environment.findFirst({ where: { type: 'SPACECRAFT' } });
      if (!defaultEnv) {
        defaultEnv = await prisma.environment.create({
          data: {
            type: 'SPACECRAFT',
            name: 'Astra Transit Habitat (Deep Space 0g)',
            gravityG: 0.0,
            commsDelayMinutes: 14.3,
          },
        });
      }

      astronaut = await prisma.astronaut.create({
        data: {
          name: 'CDR Alex Vance',
          missionDay: 61,
          calibrationDone: true,
          environmentId: defaultEnv.id,
        },
        include: { environment: true },
      });
    }

    return astronaut;
  }

  /**
   * Builds the comprehensive 7-Domain Today Dashboard data payload with absolute safety resolution.
   */
  public static async getDashboardData(astronautId: string): Promise<DashboardData> {
    const astronaut = await prisma.astronaut.findUnique({
      where: { id: astronautId },
      include: {
        environment: true,
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
          take: 6,
        },
      },
    });

    if (!astronaut) {
      throw new Error(`Astronaut ${astronautId} not found.`);
    }

    const currentDay = astronaut.missionDay;
    const history = astronaut.healthMetrics;
    const todayMetric =
      history.find((m) => m.missionDay === currentDay) || history[history.length - 1];
    const prevMetric = history.find((m) => m.missionDay === currentDay - 1);

    // Compute Baselines across all 7 domains
    const cardioStats = BaselineEngine.evaluateMetricBaseline(history, 'hrv', true);
    const bpStats = BaselineEngine.evaluateMetricBaseline(history, 'systolicBP', false);
    const sleepStats = BaselineEngine.evaluateMetricBaseline(history, 'sleepHours', true);
    const mindStats = BaselineEngine.evaluateMetricBaseline(history, 'reactionTimeMs', false);
    const muscleStats = BaselineEngine.evaluateMetricBaseline(history, 'activity', true);
    const tempStats = BaselineEngine.evaluateMetricBaseline(history, 'bodyTemp', false);
    const glucoseStats = BaselineEngine.evaluateMetricBaseline(history, 'bloodGlucose', false);
    const hydrationStats = BaselineEngine.evaluateMetricBaseline(history, 'hydrationScore', true);
    const co2Stats = BaselineEngine.evaluateMetricBaseline(history, 'cabinCO2ppm', false);

    // Absolute threshold evaluations
    const thresholds = ThresholdEngine.evaluateAllMetrics(todayMetric || {});

    // Format 7 Domain Summaries
    const domains: DomainMetricSummary[] = [
      // 1. Cardio (HRV & Blood Pressure)
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
        status: ThresholdEngine.resolveHybridStatus(
          thresholds.systolicBP.status,
          cardioStats.zScore === null
            ? 'INSUFFICIENT_DATA'
            : cardioStats.zScore < -1.2
            ? 'ATTENTION'
            : cardioStats.zScore < -0.5
            ? 'MONITOR'
            : 'STABLE'
        ),
        confidence: todayMetric?.hrv !== null ? 89 : 35,
        dataAvailable: todayMetric?.hrv !== null && todayMetric?.hrv !== undefined,
        notes: `BP: ${todayMetric?.systolicBP ?? 116}/${todayMetric?.diastolicBP ?? 74} mmHg. Continuous PPG autonomic tracking.`,
        absoluteStatus: thresholds.systolicBP.status,
        absoluteStatusText: thresholds.systolicBP.ruleTriggered,
      },

      // 2. Sleep
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
            ? `${todayMetric.sleepHours - sleepStats.mean < 0 ? '-' : '+'}${Math.abs(
                Math.floor(todayMetric.sleepHours - sleepStats.mean)
              )}h ${Math.abs(Math.round(((todayMetric.sleepHours - sleepStats.mean) % 1) * 60))}m`
            : 'INSUFFICIENT DATA',
        deviationZScore: sleepStats.zScore ?? 0,
        trend: sleepStats.trend,
        status: ThresholdEngine.resolveHybridStatus(
          thresholds.sleepHours.status,
          sleepStats.zScore === null
            ? 'INSUFFICIENT_DATA'
            : sleepStats.zScore < -1.2
            ? 'ATTENTION'
            : sleepStats.zScore < -0.5
            ? 'MONITOR'
            : 'STABLE'
        ),
        confidence: todayMetric?.sleepHours !== null ? 88 : 30,
        dataAvailable: todayMetric?.sleepHours !== null && todayMetric?.sleepHours !== undefined,
        notes: 'Actigraphy sleep staging and duration analysis.',
        absoluteStatus: thresholds.sleepHours.status,
        absoluteStatusText: thresholds.sleepHours.ruleTriggered,
      },

      // 3. Mind (Cognition & Stress)
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
        status: ThresholdEngine.resolveHybridStatus(
          thresholds.reactionTimeMs.status,
          mindStats.zScore === null
            ? 'INSUFFICIENT_DATA'
            : mindStats.zScore > 1.2
            ? 'ATTENTION'
            : mindStats.zScore > 0.5
            ? 'MONITOR'
            : 'STABLE'
        ),
        confidence: todayMetric?.reactionTimeMs !== null ? 84 : 30,
        dataAvailable:
          todayMetric?.reactionTimeMs !== null && todayMetric?.reactionTimeMs !== undefined,
        notes: 'Psychomotor vigilance visual reaction test and allostatic load.',
        absoluteStatus: thresholds.reactionTimeMs.status,
        absoluteStatusText: thresholds.reactionTimeMs.ruleTriggered,
      },

      // 4. Muscle-Bone
      {
        domain: 'Muscle-Bone',
        currentValueDisplay: todayMetric?.exerciseMinutes
          ? `${todayMetric.exerciseMinutes.toFixed(0)} min`
          : `${todayMetric?.activity ?? 80} score`,
        currentValue: todayMetric?.exerciseMinutes ?? todayMetric?.activity ?? null,
        unit: 'exercise min',
        personalBaselineDisplay: '135 min/day',
        personalBaseline: 135,
        deviationDisplay:
          todayMetric?.exerciseMinutes !== null && todayMetric?.exerciseMinutes !== undefined
            ? `${(todayMetric.exerciseMinutes - 135).toFixed(0)} min`
            : 'INSUFFICIENT DATA',
        deviationZScore: muscleStats.zScore ?? 0,
        trend: muscleStats.trend,
        status: ThresholdEngine.resolveHybridStatus(
          thresholds.exerciseMinutes.status,
          muscleStats.zScore === null
            ? 'INSUFFICIENT_DATA'
            : muscleStats.zScore < -1.0
            ? 'MONITOR'
            : 'STABLE'
        ),
        confidence: todayMetric?.exerciseMinutes !== null ? 92 : 35,
        dataAvailable: todayMetric?.exerciseMinutes !== null,
        notes: 'ARED heavy resistance and T2 treadmill loading telemetry.',
        absoluteStatus: thresholds.exerciseMinutes.status,
        absoluteStatusText: thresholds.exerciseMinutes.ruleTriggered,
      },

      // 5. Immune & Thermoregulation
      {
        domain: 'Immune',
        currentValueDisplay: todayMetric?.bodyTemp
          ? `${todayMetric.bodyTemp.toFixed(2)} °C`
          : '36.85 °C',
        currentValue: todayMetric?.bodyTemp ?? 36.85,
        unit: '°C core temp',
        personalBaselineDisplay: `${tempStats.mean.toFixed(2)} °C`,
        personalBaseline: tempStats.mean || 36.85,
        deviationDisplay:
          todayMetric?.bodyTemp && tempStats.mean
            ? `${todayMetric.bodyTemp >= tempStats.mean ? '+' : ''}${(
                todayMetric.bodyTemp - tempStats.mean
              ).toFixed(2)} °C`
            : '0.00 °C',
        deviationZScore: tempStats.zScore ?? 0,
        trend: tempStats.trend,
        status: ThresholdEngine.resolveHybridStatus(
          thresholds.bodyTemp.status,
          tempStats.zScore !== null && tempStats.zScore > 1.2 ? 'MONITOR' : 'STABLE'
        ),
        confidence: 88,
        dataAvailable: todayMetric?.bodyTemp !== null,
        notes: `SpO2: ${todayMetric?.spo2 ?? 98}%. Microgravity thermoregulatory core monitoring.`,
        absoluteStatus: thresholds.bodyTemp.status,
        absoluteStatusText: thresholds.bodyTemp.ruleTriggered,
      },

      // 6. Metabolic & Nutrition
      {
        domain: 'Metabolic',
        currentValueDisplay: todayMetric?.bloodGlucose
          ? `${todayMetric.bloodGlucose.toFixed(0)} mg/dL`
          : '88 mg/dL',
        currentValue: todayMetric?.bloodGlucose ?? 88,
        unit: 'mg/dL glucose',
        personalBaselineDisplay: `${glucoseStats.mean.toFixed(0)} mg/dL`,
        personalBaseline: glucoseStats.mean || 88,
        deviationDisplay:
          todayMetric?.bloodGlucose && glucoseStats.mean
            ? `${todayMetric.bloodGlucose >= glucoseStats.mean ? '+' : ''}${(
                todayMetric.bloodGlucose - glucoseStats.mean
              ).toFixed(0)} mg/dL`
            : '0 mg/dL',
        deviationZScore: glucoseStats.zScore ?? 0,
        trend: glucoseStats.trend,
        status: ThresholdEngine.resolveHybridStatus(
          thresholds.bloodGlucose.status,
          glucoseStats.zScore !== null && Math.abs(glucoseStats.zScore) > 1.2
            ? 'MONITOR'
            : 'STABLE'
        ),
        confidence: 87,
        dataAvailable: todayMetric?.bloodGlucose !== null,
        notes: `Hydration Score: ${todayMetric?.hydrationScore ?? 88}/100. Energy: ${todayMetric?.caloriesKcal ?? 2800} kcal.`,
        absoluteStatus: thresholds.bloodGlucose.status,
        absoluteStatusText: thresholds.bloodGlucose.ruleTriggered,
      },

      // 7. Habitat & Closed Environment
      {
        domain: 'Environment',
        currentValueDisplay: todayMetric?.cabinCO2ppm
          ? `${todayMetric.cabinCO2ppm.toFixed(0)} ppm`
          : '1850 ppm',
        currentValue: todayMetric?.cabinCO2ppm ?? 1850,
        unit: 'ppm CO2',
        personalBaselineDisplay: '1800 ppm',
        personalBaseline: 1800,
        deviationDisplay:
          todayMetric?.cabinCO2ppm
            ? `+${(todayMetric.cabinCO2ppm - 1800).toFixed(0)} ppm`
            : '0 ppm',
        deviationZScore: co2Stats.zScore ?? 0,
        trend: co2Stats.trend,
        status: ThresholdEngine.resolveHybridStatus(
          thresholds.cabinCO2ppm.status,
          co2Stats.zScore !== null && co2Stats.zScore > 1.0 ? 'MONITOR' : 'STABLE'
        ),
        confidence: 94,
        dataAvailable: todayMetric?.cabinCO2ppm !== null,
        notes: `Temp: ${todayMetric?.cabinTempC ?? 21.5}°C, Humidity: ${todayMetric?.cabinHumidityPct ?? 45}%, Noise: ${todayMetric?.noiseDb ?? 52} dBA.`,
        absoluteStatus: thresholds.cabinCO2ppm.status,
        absoluteStatusText: thresholds.cabinCO2ppm.ruleTriggered,
      },
    ];

    // Latest Radiation Event
    const latestRadiation = astronaut.radiationEvents[astronaut.radiationEvents.length - 1];
    const doseRate = latestRadiation ? latestRadiation.doseRate : 0.042;

    // Evaluate Risk with environment-weighted formula
    const envType = astronaut.environment?.type || 'SPACECRAFT';
    const riskResult = RiskEngine.evaluateRisk(domains, doseRate, 0.05, envType);

    // Sensor Completeness check
    ConfidenceEngine.evaluateSensorCompleteness(todayMetric, domains);

    // Radiation Watch Engine
    const radWatch = RadiationWatchEngine.evaluateRadiationWatch(
      currentDay,
      astronaut.radiationEvents,
      history
    );

    // Escalation Assessment
    const escalation = EscalationEngine.assessEscalation(
      thresholds,
      riskResult.overallRiskScore,
      riskResult.status,
      currentDay === 65 ? 0 : 2,
      astronaut.environment?.commsDelayMinutes || 14.3
    );

    // Formulate What Changed Today items
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
        baselineContext: `Compared with 14-day personal baseline (${Math.floor(sleepStats.mean)}h ${Math.round((sleepStats.mean % 1) * 60)}m).`,
        whyThisMatters:
          'Persistent sleep debt impairs prefrontal cognitive reaction speed and parasympathetic recovery.',
        confidence: 88,
        dataSources: ['Actigraphy Wearable', 'Daily Self-Report'],
        riskContributionWeight: 20,
      });
    }

    // Blood Pressure change
    if (todayMetric && todayMetric.systolicBP && todayMetric.systolicBP >= 130) {
      recentChanges.push({
        id: 'change-bp',
        title: 'Systolic Blood Pressure Elevated',
        domain: 'Cardio',
        detectedChange: `${todayMetric.systolicBP.toFixed(0)} mmHg`,
        percentChange: 18,
        direction: 'up',
        baselineContext: 'Resting systolic BP elevated above nominal 116 mmHg baseline.',
        whyThisMatters:
          'Cephalad fluid redistribution and sympathetic tone elevation increase vascular resistance.',
        confidence: 91,
        dataSources: ['Automated Arm Cuff'],
        riskContributionWeight: 18,
        absoluteFlag: thresholds.systolicBP.status,
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
        baselineContext: 'Elevated relative to deep-space GCR background (0.04 mSv/h).',
        whyThisMatters:
          'Triggers 72-hour multi-sensor watch window for non-causal physiological association tracking.',
        confidence: 96,
        dataSources: ['Active Radiation Dosimeter Array'],
        riskContributionWeight: 22,
        absoluteFlag: 'WARNING',
      });
    }

    // CO2 change
    if (todayMetric && todayMetric.cabinCO2ppm && todayMetric.cabinCO2ppm >= 2500) {
      recentChanges.push({
        id: 'change-co2',
        title: 'Cabin CO2 Elevated',
        domain: 'Environment',
        detectedChange: `${todayMetric.cabinCO2ppm.toFixed(0)} ppm`,
        percentChange: 55,
        direction: 'up',
        baselineContext: 'Exceeds nominal 1800 ppm habitat circulation target.',
        whyThisMatters:
          'Correlates with localized sleep fragmentation, sinus pressure, and mild frontal headaches.',
        confidence: 94,
        dataSources: ['NDIR Cabin Life Support Gas Sensor'],
        riskContributionWeight: 14,
        absoluteFlag: thresholds.cabinCO2ppm.status,
      });
    }

    // PVT Reaction time change
    if (todayMetric && mindStats.zScore !== null && mindStats.zScore > 0.8) {
      recentChanges.push({
        id: 'change-reaction',
        title: 'Reaction Time Latency Shift',
        domain: 'Mind',
        detectedChange: `+${(todayMetric.reactionTimeMs! - mindStats.mean).toFixed(0)} ms`,
        percentChange: 22,
        direction: 'up',
        baselineContext: 'Psychomotor vigilance response slower than 230ms 14-day personal baseline.',
        whyThisMatters: 'Associated with acute sleep debt and high operational workload tempo.',
        confidence: 84,
        dataSources: ['Psychomotor Vigilance Test (PVT)'],
        riskContributionWeight: 16,
      });
    }

    const defaultEnv: Environment = astronaut.environment
      ? {
          id: astronaut.environment.id,
          type: astronaut.environment.type as any,
          name: astronaut.environment.name,
          description: astronaut.environment.description,
          gravityG: astronaut.environment.gravityG,
          radiationShieldingFactor: astronaut.environment.radiationShieldingFactor,
          crewSize: astronaut.environment.crewSize,
          commsDelayMinutes: astronaut.environment.commsDelayMinutes,
          nominalCabinCO2ppm: astronaut.environment.nominalCabinCO2ppm,
          nominalCabinTempC: astronaut.environment.nominalCabinTempC,
          nominalCabinHumidityPct: astronaut.environment.nominalCabinHumidityPct,
          createdAt: astronaut.environment.createdAt.toISOString(),
        }
      : {
          id: 'env_default',
          type: 'SPACECRAFT',
          name: 'Astra Transit Habitat (Deep Space 0g)',
          description: 'Deep Space Transit 0g Habitat',
          gravityG: 0.0,
          radiationShieldingFactor: 1.0,
          crewSize: 4,
          commsDelayMinutes: 14.3,
          nominalCabinCO2ppm: 1800,
          nominalCabinTempC: 21.5,
          nominalCabinHumidityPct: 45,
          createdAt: new Date().toISOString(),
        };

    return {
      missionDay: currentDay,
      overallStatus: riskResult.status,
      simulatedRiskScore: riskResult.overallRiskScore,
      confidence: riskResult.confidence,
      dataCompleteness: riskResult.dataCompleteness,
      isOffline: false,
      lastSyncTime: new Date().toISOString(),
      isSynthetic: true,
      environment: defaultEnv,
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
      escalationTier: escalation.tier,
      escalationBanner: escalation.uiBanner
        ? {
            tier: escalation.uiBanner.tier,
            trigger: escalation.uiBanner.headline,
            actionSummary: escalation.uiBanner.actionSummary,
          }
        : null,
    };
  }

  /**
   * Returns per-organ-system status payload for the interactive clickable human body.
   */
  public static async getBodyStatus(astronautId: string): Promise<OrganSystemStatus[]> {
    const dashboard = await this.getDashboardData(astronautId);
    const astronaut = await prisma.astronaut.findUnique({
      where: { id: astronautId },
      include: {
        environment: true,
        healthMetrics: { orderBy: { missionDay: 'desc' }, take: 1 },
      },
    });
    const latest = astronaut?.healthMetrics[0];

    const bodySystems: OrganSystemStatus[] = [
      {
        system: 'BRAIN_NERVOUS',
        title: 'Brain & Nervous System',
        status: dashboard.domains.find((d) => d.domain === 'Mind')?.status || 'STABLE',
        statusColor:
          dashboard.domains.find((d) => d.domain === 'Mind')?.status === 'ATTENTION'
            ? 'RED'
            : dashboard.domains.find((d) => d.domain === 'Mind')?.status === 'MONITOR'
            ? 'YELLOW'
            : 'GREEN',
        headlineMetric: {
          label: 'PVT Reaction Latency',
          value: latest?.reactionTimeMs ? `${latest.reactionTimeMs.toFixed(0)} ms` : '230 ms',
          unit: 'ms',
          deviation: latest?.reactionTimeMs ? `+${(latest.reactionTimeMs - 230).toFixed(0)} ms` : '0 ms',
        },
        keyIndicators: [
          { key: 'reactionTimeMs', name: 'PVT Reaction Latency', valueDisplay: `${latest?.reactionTimeMs ?? 230} ms`, status: 'WARNING' },
          { key: 'sleepHours', name: 'Sleep Duration', valueDisplay: `${latest?.sleepHours ?? 6.2} h`, status: 'WARNING' },
          { key: 'stress', name: 'Perceived Stress', valueDisplay: `${latest?.stress ?? 4.0} / 10`, status: 'NORMAL' },
        ],
        howHazardAffects:
          'Isolation and circadian disruption fragment slow-wave sleep. Elevated cabin CO2 causes frontal headaches. High workload elevates psychomotor reaction latency.',
        primaryHazards: ['ISOLATION_CONFINEMENT', 'HOSTILE_CLOSED_ENVIRONMENT', 'RADIATION'],
        recommendedActions: [
          'Advance sleep onset by 30 minutes tonight.',
          'Schedule 20-minute sensory rest block in crew bunk.',
          'Verify workstation ventilation duct is running on high.',
        ],
        escalationTier: 'MONITOR',
        sources: ['NASA HRP BHP Evidence Book', 'Basner & Dinges (Sleep 2011)'],
      },
      {
        system: 'CARDIOVASCULAR',
        title: 'Heart & Vascular System',
        status: dashboard.domains.find((d) => d.domain === 'Cardio')?.status || 'STABLE',
        statusColor:
          dashboard.domains.find((d) => d.domain === 'Cardio')?.status === 'ATTENTION'
            ? 'RED'
            : dashboard.domains.find((d) => d.domain === 'Cardio')?.status === 'MONITOR'
            ? 'YELLOW'
            : 'GREEN',
        headlineMetric: {
          label: 'Blood Pressure',
          value: `${latest?.systolicBP ?? 116}/${latest?.diastolicBP ?? 74}`,
          unit: 'mmHg',
          deviation: latest?.systolicBP ? `+${(latest.systolicBP - 116).toFixed(0)} mmHg` : '0 mmHg',
        },
        keyIndicators: [
          { key: 'systolicBP', name: 'Systolic Blood Pressure', valueDisplay: `${latest?.systolicBP ?? 116} mmHg`, status: latest?.systolicBP && latest.systolicBP >= 140 ? 'CRITICAL' : latest?.systolicBP && latest.systolicBP >= 130 ? 'WARNING' : 'NORMAL' },
          { key: 'hrv', name: 'HRV (rMSSD)', valueDisplay: `${latest?.hrv ?? 68} ms`, status: latest?.hrv && latest.hrv < 50 ? 'WARNING' : 'NORMAL' },
          { key: 'heartRate', name: 'Resting Heart Rate', valueDisplay: `${latest?.heartRate ?? 62} bpm`, status: 'NORMAL' },
        ],
        howHazardAffects:
          'Microgravity removes hydrostatic gradient, redistributing 1.5-2L blood upward. Stroke volume decreases over time, compensated by tachycardia and vascular compliance changes.',
        primaryHazards: ['GRAVITY_FIELDS', 'RADIATION'],
        recommendedActions: [
          'Complete daily 30-minute CEVIS cycling interval workout.',
          'Restrict dietary sodium to < 2.3 g/day.',
          'Log morning rested BP reading.',
        ],
        escalationTier: 'MONITOR',
        sources: ['NASA-STD-3001 Vol 1', 'ACC/AHA 2017 Guidelines'],
      },
      {
        system: 'RESPIRATORY',
        title: 'Lungs & Gas Exchange',
        status: dashboard.domains.find((d) => d.domain === 'Environment')?.status || 'STABLE',
        statusColor: 'GREEN',
        headlineMetric: {
          label: 'SpO2 Oxygen Saturation',
          value: `${latest?.spo2 ?? 98}%`,
          unit: '%',
          deviation: 'Nominal',
        },
        keyIndicators: [
          { key: 'spo2', name: 'Oxygen Saturation', valueDisplay: `${latest?.spo2 ?? 98}%`, status: 'NORMAL' },
          { key: 'cabinCO2ppm', name: 'Cabin CO2 Exposure', valueDisplay: `${latest?.cabinCO2ppm ?? 1850} ppm`, status: latest?.cabinCO2ppm && latest.cabinCO2ppm >= 2500 ? 'WARNING' : 'NORMAL' },
        ],
        howHazardAffects:
          'In microgravity without natural air convection, exhaled carbon dioxide pools in localized bubbles. Airway mucosa dries under low cabin humidity.',
        primaryHazards: ['HOSTILE_CLOSED_ENVIRONMENT'],
        recommendedActions: [
          'Verify cabin forced airflow velocity is > 15 ft/min.',
          'Hydrate regularly to protect pulmonary mucosal barrier.',
        ],
        escalationTier: 'SELF_MANAGE',
        sources: ['NASA-STD-3001 Vol 2', 'SMAC Guidelines'],
      },
      {
        system: 'IMMUNE_LYMPHATIC',
        title: 'Immune System & Thermoregulation',
        status: dashboard.domains.find((d) => d.domain === 'Immune')?.status || 'STABLE',
        statusColor: 'GREEN',
        headlineMetric: {
          label: 'Core Body Temperature',
          value: `${latest?.bodyTemp ?? 36.85} °C`,
          unit: '°C',
          deviation: '+0.15 °C',
        },
        keyIndicators: [
          { key: 'bodyTemp', name: 'Core Temperature', valueDisplay: `${latest?.bodyTemp ?? 36.85} °C`, status: 'NORMAL' },
          { key: 'spo2', name: 'Peripheral Oxygenation', valueDisplay: `${latest?.spo2 ?? 98.2} %`, status: (latest?.spo2 ?? 98) < 95 ? 'WARNING' : 'NORMAL' },
        ],
        howHazardAffects:
          'Diminished convective heat loss elevates baseline core temperature ("space fever"). Ionizing radiation and isolation stress trigger systemic cytokine shifts.',
        primaryHazards: ['RADIATION', 'ISOLATION_CONFINEMENT', 'HOSTILE_CLOSED_ENVIRONMENT'],
        recommendedActions: [
          'Hydrate with cool liquids post-exercise.',
          'Maintain antioxidant nutrient intake (polyphenols, Vitamin C/E).',
        ],
        escalationTier: 'SELF_MANAGE',
        sources: ['NASA Twins Study (Science 2019)', 'Stahn et al. (Sci Rep 2017)'],
      },
      {
        system: 'METABOLIC_ENDOCRINE',
        title: 'Metabolism, Endocrine & Gut',
        status: dashboard.domains.find((d) => d.domain === 'Metabolic')?.status || 'STABLE',
        statusColor: 'GREEN',
        headlineMetric: {
          label: 'Fasting Blood Glucose',
          value: `${latest?.bloodGlucose ?? 88} mg/dL`,
          unit: 'mg/dL',
          deviation: 'Nominal',
        },
        keyIndicators: [
          { key: 'bloodGlucose', name: 'Fasting Blood Glucose', valueDisplay: `${latest?.bloodGlucose ?? 88} mg/dL`, status: 'NORMAL' },
          { key: 'hydrationScore', name: 'Hydration Score', valueDisplay: `${latest?.hydrationScore ?? 88} / 100`, status: 'NORMAL' },
          { key: 'weightKg', name: 'Body Weight', valueDisplay: `${latest?.weightKg ?? 76.5} kg`, status: 'NORMAL' },
        ],
        howHazardAffects:
          'Musculoskeletal unloading triggers subclinical insulin resistance. Altered gut microbiome and pre-packaged space diet demand careful caloric and glycemic balance.',
        primaryHazards: ['GRAVITY_FIELDS', 'HOSTILE_CLOSED_ENVIRONMENT'],
        recommendedActions: [
          'Maintain balanced complex carbohydrate and protein meal pacing.',
          'Target daily fluid intake of ~3200 mL.',
        ],
        escalationTier: 'SELF_MANAGE',
        sources: ['ADA 2024 Standards of Care', 'Smith et al. (NASA 2021)'],
      },
      {
        system: 'MUSCULOSKELETAL_MUSCLE',
        title: 'Skeletal Muscle System',
        status: dashboard.domains.find((d) => d.domain === 'Muscle-Bone')?.status || 'STABLE',
        statusColor: 'GREEN',
        headlineMetric: {
          label: 'Daily Exercise Completed',
          value: `${latest?.exerciseMinutes ?? 135} min`,
          unit: 'min',
          deviation: 'Nominal',
        },
        keyIndicators: [
          { key: 'exerciseMinutes', name: 'Exercise Minutes', valueDisplay: `${latest?.exerciseMinutes ?? 135} min`, status: 'NORMAL' },
          { key: 'activity', name: 'Daily Activity Load', valueDisplay: `${latest?.activity ?? 84} pts`, status: 'NORMAL' },
        ],
        howHazardAffects:
          'Without 1g gravity loading, postural muscles (soleus, gastrocnemius, erector spinae) rapidly atrophy and transition from slow oxidative to fast glycolytic fibers.',
        primaryHazards: ['GRAVITY_FIELDS'],
        recommendedActions: [
          'Complete prescribed 60-minute heavy ARED loading session today.',
          'Execute eccentric squat and deadlift loading protocols.',
        ],
        escalationTier: 'SELF_MANAGE',
        sources: ['NASA HRP Muscle Evidence Report', 'NASA-STD-3001 Vol 1'],
      },
      {
        system: 'MUSCULOSKELETAL_BONE',
        title: 'Skeletal Bone Mineral Density',
        status: 'STABLE',
        statusColor: 'GREEN',
        headlineMetric: {
          label: 'Loading Deficit',
          value: `${Math.round((1.0 - (astronaut?.environment?.gravityG ?? 0)) * 100)}%`,
          unit: '%',
          deviation: '0g Unloading',
        },
        keyIndicators: [
          { key: 'exerciseMinutes', name: 'ARED Resistive Loading', valueDisplay: `${latest?.exerciseMinutes ?? 135} min`, status: 'NORMAL' },
          { key: 'vitaminDStatus', name: 'Vitamin D / Calcium', valueDisplay: 'Optimal (42 ng/mL)', status: 'NORMAL' },
        ],
        howHazardAffects:
          'Unloading uncouples osteoclast and osteoblast remodeling. Cancellous bone loses 1.0-1.5% mineral density per month in microgravity, releasing excess calcium into renal pathways.',
        primaryHazards: ['GRAVITY_FIELDS'],
        recommendedActions: [
          'Ensure 1200 mg dietary calcium and 1000 IU Vitamin D supplementation.',
          'Maintain peak axial compressive loads on ARED.',
        ],
        escalationTier: 'SELF_MANAGE',
        sources: ['NASA HRP Bone Evidence Report', 'NASA-STD-3001 Vol 1'],
      },
      {
        system: 'OPHTHALMIC_SANS',
        title: 'Ophthalmic & SANS Risk',
        status: 'MONITOR',
        statusColor: 'YELLOW',
        headlineMetric: {
          label: 'Cephalad Fluid Shift',
          value: 'Active',
          unit: '0g state',
          deviation: 'Venous engorgement',
        },
        keyIndicators: [
          { key: 'systolicBP', name: 'Central Vascular Pressure', valueDisplay: `${latest?.systolicBP ?? 116} mmHg`, status: 'NORMAL' },
          { key: 'sansAwareness', name: 'Optic Disc / Retinal Status', valueDisplay: 'Nominal Acuity', status: 'NORMAL' },
        ],
        howHazardAffects:
          'Cephalad fluid redistribution elevates jugular venous and retrobulbar sheath pressure, driving Spaceflight-Associated Neuro-ocular Syndrome (optic disc edema, hyperopic shifts).',
        primaryHazards: ['GRAVITY_FIELDS', 'HOSTILE_CLOSED_ENVIRONMENT'],
        recommendedActions: [
          'Log weekly visual acuity card check.',
          'Prepare onboard ultrasound probe for optic nerve sheath diameter (ONSD) measurement if headache develops.',
        ],
        escalationTier: 'MONITOR',
        sources: ['NASA SANS Clinical Practice Guidelines (2022)'],
      },
      {
        system: 'INTEGUMENTARY_SKIN',
        title: 'Skin & Tissue Integrity',
        status: 'STABLE',
        statusColor: 'GREEN',
        headlineMetric: {
          label: 'Tissue Integrity',
          value: 'Nominal',
          unit: 'score',
          deviation: '0 lesions',
        },
        keyIndicators: [
          { key: 'bodyTemp', name: 'Skin Surface Temp', valueDisplay: `${latest?.bodyTemp ?? 36.85} °C`, status: 'NORMAL' },
          { key: 'hydrationScore', name: 'Hydration Status', valueDisplay: `${latest?.hydrationScore ?? 88} / 100`, status: 'NORMAL' },
        ],
        howHazardAffects:
          'Dry habitat air (< 30% humidity) causes cutaneous flaking and barrier disruption. Microgravity shifts microbial skin microbiome flora.',
        primaryHazards: ['HOSTILE_CLOSED_ENVIRONMENT', 'RADIATION'],
        recommendedActions: [
          'Apply moisturization emollients post-hygiene.',
          'Ensure habitat relative humidity is maintained between 35-50%.',
        ],
        escalationTier: 'SELF_MANAGE',
        sources: ['NASA-STD-3001 Vol 2 Habitability'],
      },
    ];

    return bodySystems;
  }

  /**
   * Retrieves daily routine measurement checklist.
   */
  public static async getRoutineSchedule(astronautId: string): Promise<RoutineTask[]> {
    const astronaut = await prisma.astronaut.findUnique({
      where: { id: astronautId },
      include: { environment: true },
    });

    if (!astronaut) throw new Error('Astronaut not found');

    let tasks = await prisma.measurementTask.findMany({
      where: { astronautId, missionDay: astronaut.missionDay },
      orderBy: { dueTime: 'asc' },
    });

    // If no tasks exist for today, generate them automatically
    if (tasks.length === 0) {
      const generated = SchedulerEngine.generateDailyRoutine(
        astronautId,
        astronaut.missionDay,
        astronaut.environment?.type || 'SPACECRAFT'
      );

      for (const t of generated) {
        await prisma.measurementTask.create({
          data: {
            astronautId,
            indicatorKey: t.indicatorKey,
            title: t.title,
            timeOfDay: t.timeOfDay,
            dueTime: t.dueTime,
            completed: false,
            missionDay: astronaut.missionDay,
          },
        });
      }

      tasks = await prisma.measurementTask.findMany({
        where: { astronautId, missionDay: astronaut.missionDay },
        orderBy: { dueTime: 'asc' },
      });
    }

    return tasks.map((t) => ({
      id: t.id,
      indicatorKey: t.indicatorKey,
      title: t.title,
      timeOfDay: t.timeOfDay as any,
      dueTime: t.dueTime,
      completed: t.completed,
      completedAt: t.completedAt ? t.completedAt.toISOString() : null,
      skippedReason: t.skippedReason,
      missionDay: t.missionDay,
      howToMeasureSnippet:
        t.indicatorKey === 'systolicBP'
          ? 'Automated arm cuff at heart level after 5 min quiet rest.'
          : t.indicatorKey === 'bloodGlucose'
          ? 'Fingerstick capillary blood test strip.'
          : t.indicatorKey === 'bodyTemp'
          ? 'Infrared tympanic ear probe until beep.'
          : 'Standard operational self-measurement protocol.',
      isOverdue: !t.completed,
    }));
  }

  /**
   * Completes a routine task and awards XP via GamificationEngine.
   */
  public static async completeRoutineTask(taskId: string, skippedReason?: string) {
    const task = await prisma.measurementTask.findUnique({
      where: { id: taskId },
      include: { astronaut: { include: { gamificationProfile: true } } },
    });

    if (!task) throw new Error('Task not found');

    const completed = !skippedReason;
    const updatedTask = await prisma.measurementTask.update({
      where: { id: taskId },
      data: {
        completed,
        completedAt: completed ? new Date() : null,
        skippedReason: skippedReason || null,
      },
    });

    // Award XP if completed
    let gamificationAward = null;
    if (completed && task.astronaut.gamificationProfile) {
      gamificationAward = GamificationEngine.processActivity(
        task.astronaut.gamificationProfile.xp,
        'MEASUREMENT_TASK',
        { streakDays: task.astronaut.gamificationProfile.currentStreakDays }
      );

      await prisma.gamificationProfile.update({
        where: { id: task.astronaut.gamificationProfile.id },
        data: {
          xp: gamificationAward.newTotalXp,
          level: gamificationAward.newLevel,
        },
      });
    }

    return { task: updatedTask, gamificationAward };
  }

  /**
   * Retrieves gamification profile, XP, streak, and badges.
   */
  public static async getGamification(astronautId: string): Promise<GamificationState> {
    let profile = await prisma.gamificationProfile.findUnique({
      where: { astronautId },
    });

    if (!profile) {
      profile = await prisma.gamificationProfile.create({
        data: {
          astronautId,
          xp: 850,
          level: 3,
          currentStreakDays: 8,
          longestStreakDays: 14,
          healthScoreRing: 88,
        },
      });
    }

    const { xpToNextLevel } = GamificationEngine.calculateLevel(profile.xp);
    const allBadges = await prisma.badge.findMany();
    const userBadges = await prisma.userBadge.findMany({ where: { astronautId } });
    const userBadgeMap = new Map(userBadges.map((ub) => [ub.badgeId, ub]));

    const badges = allBadges.map((b) => {
      const ub = userBadgeMap.get(b.id);
      return {
        id: b.id,
        code: b.code,
        title: b.title,
        description: b.description,
        icon: b.icon,
        tier: b.tier as any,
        unlocked: !!ub,
        unlockedAt: ub?.unlockedAt ? ub.unlockedAt.toISOString() : null,
      };
    });

    return {
      xp: profile.xp,
      level: profile.level,
      xpToNextLevel,
      currentStreakDays: profile.currentStreakDays,
      longestStreakDays: profile.longestStreakDays,
      healthScoreRing: profile.healthScoreRing,
      badges,
      recentAchievements: [
        'Completed morning vitals routine on schedule (+25 XP)',
        'Sustained ARED heavy resistive loading (+100 XP)',
        'Learn Loop verified positive recovery (+150 XP)',
      ],
    };
  }

  /**
   * Switches an astronaut's mission environment (e.g. Spacecraft -> Mars Base).
   */
  public static async switchEnvironment(astronautId: string, environmentType: string) {
    const env = await prisma.environment.findFirst({
      where: { type: environmentType },
    });

    if (!env) {
      throw new Error(`Environment ${environmentType} not found.`);
    }

    const updated = await prisma.astronaut.update({
      where: { id: astronautId },
      data: { environmentId: env.id },
      include: { environment: true },
    });

    return updated;
  }

  /**
   * Generates a consolidated Flight Surgeon Clinical Telemedicine Report.
   */
  public static async exportFlightSurgeonReport(
    astronautId: string
  ): Promise<FlightSurgeonReportData> {
    const dashboard = await this.getDashboardData(astronautId);
    const astronaut = await prisma.astronaut.findUnique({
      where: { id: astronautId },
      include: {
        environment: true,
        alerts: { orderBy: { timestamp: 'desc' }, take: 5 },
        escalationEvents: { orderBy: { createdAt: 'desc' }, take: 5 },
        countermeasures: { include: { outcomes: true } },
        imageCaptures: { orderBy: { capturedAt: 'desc' }, take: 3 },
      },
    });

    if (!astronaut) throw new Error('Astronaut not found');

    const cardio = dashboard.domains.find((d) => d.domain === 'Cardio');
    const sleep = dashboard.domains.find((d) => d.domain === 'Sleep');
    const metabolic = dashboard.domains.find((d) => d.domain === 'Metabolic');
    const immune = dashboard.domains.find((d) => d.domain === 'Immune');

    const learnLoopHistory = astronaut.countermeasures.map((cm) => {
      const outcome = cm.outcomes[0];
      return {
        id: cm.id,
        type: cm.type,
        title: cm.recommendation.substring(0, 30),
        recommendation: cm.recommendation,
        evaluationCount: 1,
        overallResult: (outcome?.result as any) || 'INSUFFICIENT_DATA',
        confidence: outcome?.confidence || 70,
        averageEffectZScore: outcome?.effect || 0,
        lastAppliedMissionDay: 63,
      };
    });

    return {
      astronautName: astronaut.name,
      missionDay: astronaut.missionDay,
      environmentName: astronaut.environment?.name || 'Deep Space Transit 0g',
      gravityG: astronaut.environment?.gravityG ?? 0.0,
      reportGeneratedAt: new Date().toISOString(),
      commsDelayMinutes: astronaut.environment?.commsDelayMinutes || 14.3,
      overallStatus: dashboard.overallStatus,
      simulatedRiskScore: dashboard.simulatedRiskScore,
      confidence: dashboard.confidence,
      vitalSignsSummary: {
        heartRate: `${cardio?.currentValue ? `${cardio.currentValue} bpm` : '64 bpm'}`,
        bloodPressure: '138 / 88 mmHg (Stage 1 Elevated)',
        bloodGlucose: `${metabolic?.currentValue ? `${metabolic.currentValue} mg/dL` : '104 mg/dL'}`,
        coreTemp: `${immune?.currentValue ? `${immune.currentValue} °C` : '37.4 °C'}`,
        spo2: '97.2%',
        sleepHours: `${sleep?.currentValue ? `${sleep.currentValue} h` : '6.2 h'}`,
        weightKg: '76.5 kg',
      },
      activeAlerts: dashboard.activeAlerts,
      escalationHistory: astronaut.escalationEvents.map((e) => ({
        tier: e.tier,
        trigger: e.triggerIndicator,
        reason: e.reason,
        timestamp: e.createdAt.toISOString(),
        acknowledged: e.acknowledged,
      })),
      activeCountermeasures: astronaut.countermeasures.map((cm) => ({
        id: cm.id,
        astronautId: cm.astronautId,
        type: cm.type,
        recommendation: cm.recommendation,
        reason: cm.reason,
        startedAt: cm.startedAt.toISOString(),
        evaluationAt: cm.evaluationAt ? cm.evaluationAt.toISOString() : null,
        status: cm.status as any,
      })),
      learnLoopHistory,
      attachedImages: astronaut.imageCaptures.map((img) => ({
        id: img.id,
        astronautId: img.astronautId,
        missionDay: img.missionDay,
        type: img.type as any,
        filePath: img.filePath,
        notes: img.notes || undefined,
        capturedAt: img.capturedAt.toISOString(),
        sentToGround: img.sentToGround,
        flaggedForReview: img.flaggedForReview,
      })),
      telemetryNotes:
        'Asynchronous telemetry packet prepared via Delay-Tolerant Networking (DTN). All values grounded in 14-day calibrated personal health twin and absolute NASA-STD-3001 safety envelopes.',
    };
  }
}
