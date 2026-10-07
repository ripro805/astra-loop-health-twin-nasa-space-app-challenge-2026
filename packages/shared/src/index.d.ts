export type SystemStatus = 'STABLE' | 'MONITOR' | 'ATTENTION' | 'INSUFFICIENT_DATA';
export type StatusColor = 'GREEN' | 'YELLOW' | 'RED' | 'GRAY';
export interface StatusIndicator {
    status: SystemStatus;
    color: StatusColor;
    label: string;
}
export interface Astronaut {
    id: string;
    name: string;
    missionDay: number;
    calibrationDone: boolean;
    createdAt: string;
}
export interface HealthMetric {
    id: string;
    astronautId: string;
    timestamp: string;
    missionDay: number;
    heartRate: number | null;
    hrv: number | null;
    sleepHours: number | null;
    activity: number | null;
    mood: number | null;
    fatigue: number | null;
    stress: number | null;
    reactionTimeMs: number | null;
    voiceCadence: number | null;
    dataSource: string;
    isSynthetic: boolean;
}
export interface RadiationEvent {
    id: string;
    astronautId: string;
    timestamp: string;
    missionDay: number;
    doseRate: number;
    cumulativeDose: number;
    eventType: string;
    severity: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
}
export interface CheckIn {
    id: string;
    astronautId: string;
    timestamp: string;
    missionDay: number;
    mood: number | null;
    fatigue: number | null;
    stress: number | null;
    reactionTimeMs: number | null;
    voiceAvailable: boolean;
    voiceCadence?: number | null;
    notes?: string | null;
}
export type CountermeasureStatus = 'RECOMMENDED' | 'ACTIVE' | 'EVALUATED' | 'DISMISSED';
export type CountermeasureResult = 'PROMISING' | 'UNCERTAIN' | 'WORSENING' | 'INSUFFICIENT_DATA';
export interface Countermeasure {
    id: string;
    astronautId: string;
    type: string;
    recommendation: string;
    reason: string;
    startedAt: string;
    evaluationAt: string | null;
    status: CountermeasureStatus;
    outcomes?: CountermeasureOutcome[];
}
export interface CountermeasureOutcome {
    id: string;
    countermeasureId: string;
    targetMetric: string;
    beforeScore: number | null;
    afterScore: number | null;
    effect: number | null;
    confidence: number | null;
    result: CountermeasureResult;
    evaluatedAt: string;
}
export interface Alert {
    id: string;
    astronautId: string;
    timestamp: string;
    domain: 'Cardio' | 'Sleep' | 'Mind' | 'Muscle-Bone' | 'Immune' | 'Radiation';
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    title: string;
    explanation: string;
    confidence: number;
}
export interface DomainMetricSummary {
    domain: 'Cardio' | 'Sleep' | 'Mind' | 'Muscle-Bone' | 'Immune';
    currentValueDisplay: string;
    currentValue: number | null;
    unit: string;
    personalBaselineDisplay: string;
    personalBaseline: number;
    deviationDisplay: string;
    deviationZScore: number;
    trend: 'improving' | 'stable' | 'declining';
    status: SystemStatus;
    confidence: number;
    dataAvailable: boolean;
    notes?: string;
}
export interface ChangeItem {
    id: string;
    title: string;
    domain: string;
    detectedChange: string;
    percentChange: number;
    direction: 'up' | 'down' | 'neutral';
    baselineContext: string;
    whyThisMatters: string;
    confidence: number;
    dataSources: string[];
    riskContributionWeight: number;
}
export interface DashboardData {
    missionDay: number;
    overallStatus: SystemStatus;
    simulatedRiskScore: number;
    confidence: number;
    dataCompleteness: number;
    isOffline: boolean;
    lastSyncTime: string;
    isSynthetic: boolean;
    domains: DomainMetricSummary[];
    recentChanges: ChangeItem[];
    riskContributions: {
        name: string;
        score: number;
        description: string;
    }[];
    activeWatchWindow: boolean;
    activeCountermeasureCount: number;
    activeAlerts: Alert[];
}
export interface RadiationWatchData {
    currentDoseRate: number;
    cumulativeDose: number;
    missionDay: number;
    eventStatus: string;
    watchWindowActive: boolean;
    watchWindowHoursRemaining: number;
    watchPeriodTotalHours: number;
    timeline: {
        missionDay: number;
        hoursFromEvent: number;
        doseRate: number;
        sleepHours: number | null;
        hrv: number | null;
        reactionTimeMs: number | null;
        voiceCadence: number | null;
    }[];
    scienceNote: string;
}
export interface PersonalBaselineMetric {
    metricKey: keyof HealthMetric;
    label: string;
    unit: string;
    mean: number;
    std: number;
    ewma: number;
    currentValue: number | null;
    zScore: number | null;
    confidence: number;
    historicalBand: {
        day: number;
        value: number | null;
        baselineMean: number;
        upperBand: number;
        lowerBand: number;
    }[];
}
export interface TwinForecastData {
    calibrationPeriodDays: number;
    isCalibrated: boolean;
    ewmaAlpha: number;
    metrics: PersonalBaselineMetric[];
    forecast7Day: {
        day: number;
        fatigueTrend: 'Increasing' | 'Stable' | 'Decreasing';
        sleepTrend: 'Increasing' | 'Stable' | 'Decreasing';
        recoveryTrend: 'Increasing' | 'Stable' | 'Decreasing';
        simulatedFatigueRisk: number;
        simulatedSleepRisk: number;
        confidence: number;
    }[];
    forecast30DaySummary: {
        sleepRiskChange: string;
        fatigueRiskChange: string;
        recoveryProjection: string;
        overallRiskProjected: number;
        confidence: number;
    };
}
export interface WhatIfInput {
    radiationExposure: number;
    sleepDuration: number;
    exerciseLoad: number;
    stress: number;
}
export interface WhatIfOutput {
    sleepRiskChange: 'UP' | 'DOWN' | 'STABLE';
    fatigueRiskChange: 'UP' | 'DOWN' | 'STABLE';
    recoveryChange: 'UP' | 'DOWN' | 'STABLE';
    simulatedRiskScore: number;
    previousRiskScore: number;
    delta: number;
    confidence: number;
    explanation: string;
}
export interface CountermeasureRankItem {
    id: string;
    type: string;
    title: string;
    recommendation: string;
    evaluationCount: number;
    overallResult: CountermeasureResult;
    confidence: number;
    averageEffectZScore: number;
    lastAppliedMissionDay: number;
}
