export * from './knowledge/index.js';
export type SystemStatus = 'STABLE' | 'MONITOR' | 'ATTENTION' | 'INSUFFICIENT_DATA';
export type AbsoluteStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';
export type StatusColor = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' | 'GRAY';
export interface StatusIndicator {
    status: SystemStatus;
    color: StatusColor;
    label: string;
}
export type EnvironmentType = 'SPACECRAFT' | 'STATION' | 'ROVER' | 'MOON_BASE' | 'MARS_BASE';
export interface Environment {
    id: string;
    type: EnvironmentType;
    name: string;
    description: string;
    gravityG: number;
    radiationShieldingFactor: number;
    crewSize: number;
    commsDelayMinutes: number;
    nominalCabinCO2ppm: number;
    nominalCabinTempC: number;
    nominalCabinHumidityPct: number;
    createdAt: string;
}
export interface Astronaut {
    id: string;
    name: string;
    missionDay: number;
    calibrationDone: boolean;
    environmentId?: string | null;
    environment?: Environment | null;
    createdAt: string;
    updatedAt?: string;
}
export interface HealthMetric {
    id: string;
    astronautId: string;
    timestamp: string;
    missionDay: number;
    heartRate: number | null;
    hrv: number | null;
    systolicBP: number | null;
    diastolicBP: number | null;
    bloodGlucose: number | null;
    weightKg: number | null;
    hydrationScore: number | null;
    caloriesKcal: number | null;
    vitaminDStatusNote?: string | null;
    bodyTemp: number | null;
    spo2: number | null;
    stress: number | null;
    activity: number | null;
    exerciseMinutes: number | null;
    exerciseType?: string | null;
    sleepHours: number | null;
    mood: number | null;
    fatigue: number | null;
    reactionTimeMs: number | null;
    voiceCadence: number | null;
    cabinCO2ppm: number | null;
    cabinTempC: number | null;
    cabinHumidityPct: number | null;
    noiseDb: number | null;
    socialContactMinutes: number | null;
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
    systolicBP?: number | null;
    diastolicBP?: number | null;
    bloodGlucose?: number | null;
    bodyTemp?: number | null;
    spo2?: number | null;
    weightKg?: number | null;
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
    domain: 'Cardio' | 'Sleep' | 'Mind' | 'Muscle-Bone' | 'Immune' | 'Metabolic' | 'Environment' | 'Radiation';
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    title: string;
    explanation: string;
    confidence: number;
}
export type HealthDomain = 'Cardio' | 'Sleep' | 'Mind' | 'Muscle-Bone' | 'Immune' | 'Metabolic' | 'Environment';
export interface DomainMetricSummary {
    domain: HealthDomain;
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
    absoluteStatus?: AbsoluteStatus;
    absoluteStatusText?: string;
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
    absoluteFlag?: AbsoluteStatus;
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
    environment: Environment;
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
    escalationTier: 'SELF_MANAGE' | 'MONITOR' | 'CONTACT_FLIGHT_SURGEON' | 'EMERGENCY';
    escalationBanner?: {
        tier: string;
        trigger: string;
        actionSummary: string;
    } | null;
}
export interface RadiationWatchData {
    currentDoseRate: number;
    cumulativeDose: number;
    careerDoseLimit: number;
    careerLimitConsumedPct: number;
    missionDay: number;
    eventStatus: string;
    watchWindowActive: boolean;
    watchWindowHoursRemaining: number;
    watchPeriodTotalHours: number;
    spaceWeatherAlert?: {
        scale: string;
        description: string;
        source: string;
        status: 'LIVE' | 'CACHED' | 'SIMULATED';
    };
    timeline: {
        missionDay: number;
        hoursFromEvent: number;
        doseRate: number;
        sleepHours: number | null;
        hrv: number | null;
        reactionTimeMs: number | null;
        voiceCadence: number | null;
        systolicBP?: number | null;
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
    warningRange?: {
        low?: number;
        high?: number;
    };
    criticalRange?: {
        low?: number;
        high?: number;
    };
    historicalBand: {
        day: number;
        value: number | null;
        baselineMean: number;
        upperBand: number;
        lowerBand: number;
        upperWarning?: number;
        lowerWarning?: number;
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
        simulatedBPRisk?: number;
        confidence: number;
    }[];
    forecast30DaySummary: {
        sleepRiskChange: string;
        fatigueRiskChange: string;
        recoveryProjection: string;
        overallRiskProjected: number;
        timeToWarningThresholdDays?: number | null;
        confidence: number;
    };
}
export interface WhatIfInput {
    radiationExposure: number;
    sleepDuration: number;
    exerciseLoad: number;
    stress: number;
    cabinCO2ppm?: number;
    gravityG?: number;
    systolicBP?: number;
    bloodGlucose?: number;
    socialContactMinutes?: number;
}
export interface WhatIfOutput {
    sleepRiskChange: 'UP' | 'DOWN' | 'STABLE';
    fatigueRiskChange: 'UP' | 'DOWN' | 'STABLE';
    recoveryChange: 'UP' | 'DOWN' | 'STABLE';
    cardioRiskChange?: 'UP' | 'DOWN' | 'STABLE';
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
export interface OrganSystemStatus {
    system: string;
    title: string;
    status: AbsoluteStatus | SystemStatus;
    statusColor: StatusColor;
    headlineMetric: {
        label: string;
        value: string;
        unit: string;
        deviation: string;
    };
    keyIndicators: {
        key: string;
        name: string;
        valueDisplay: string;
        status: AbsoluteStatus;
    }[];
    howHazardAffects: string;
    primaryHazards: string[];
    recommendedActions: string[];
    escalationTier: 'SELF_MANAGE' | 'MONITOR' | 'CONTACT_FLIGHT_SURGEON' | 'EMERGENCY';
    sources: string[];
}
export interface RoutineTask {
    id: string;
    indicatorKey: string;
    title: string;
    timeOfDay: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'BEDTIME';
    dueTime: string;
    completed: boolean;
    completedAt?: string | null;
    skippedReason?: string | null;
    missionDay: number;
    howToMeasureSnippet: string;
    isOverdue: boolean;
}
export interface GamificationState {
    xp: number;
    level: number;
    xpToNextLevel: number;
    currentStreakDays: number;
    longestStreakDays: number;
    healthScoreRing: number;
    badges: {
        id: string;
        code: string;
        title: string;
        description: string;
        icon: string;
        tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
        unlocked: boolean;
        unlockedAt?: string | null;
    }[];
    recentAchievements: string[];
}
export interface ImageCapturePayload {
    id: string;
    astronautId: string;
    missionDay: number;
    type: 'ULTRASOUND' | 'FACE' | 'SKIN' | 'OTHER';
    filePath: string;
    notes?: string;
    capturedAt: string;
    sentToGround: boolean;
    flaggedForReview: boolean;
}
export interface FlightSurgeonReportData {
    astronautName: string;
    missionDay: number;
    environmentName: string;
    gravityG: number;
    reportGeneratedAt: string;
    commsDelayMinutes: number;
    overallStatus: SystemStatus;
    simulatedRiskScore: number;
    confidence: number;
    vitalSignsSummary: {
        heartRate: string;
        bloodPressure: string;
        bloodGlucose: string;
        coreTemp: string;
        spo2: string;
        sleepHours: string;
        weightKg: string;
    };
    activeAlerts: Alert[];
    escalationHistory: {
        tier: string;
        trigger: string;
        reason: string;
        timestamp: string;
        acknowledged: boolean;
    }[];
    activeCountermeasures: Countermeasure[];
    learnLoopHistory: CountermeasureRankItem[];
    attachedImages: ImageCapturePayload[];
    telemetryNotes: string;
}
