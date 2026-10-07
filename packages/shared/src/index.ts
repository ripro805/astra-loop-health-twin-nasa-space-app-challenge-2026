// Status and Risk levels
export type SystemStatus = 'STABLE' | 'MONITOR' | 'ATTENTION' | 'INSUFFICIENT_DATA';
export type StatusColor = 'GREEN' | 'YELLOW' | 'RED' | 'GRAY';

export interface StatusIndicator {
  status: SystemStatus;
  color: StatusColor;
  label: string;
}

// Astronaut Model
export interface Astronaut {
  id: string;
  name: string;
  missionDay: number;
  calibrationDone: boolean;
  createdAt: string;
}

// Health Metrics Model
export interface HealthMetric {
  id: string;
  astronautId: string;
  timestamp: string;
  missionDay: number;
  heartRate: number | null;
  hrv: number | null; // rMSSD in ms
  sleepHours: number | null;
  activity: number | null; // metabolic equivalent or activity score
  mood: number | null; // 1-10 scale
  fatigue: number | null; // 1-10 scale
  stress: number | null; // 1-10 scale
  reactionTimeMs: number | null;
  voiceCadence: number | null; // syllables/sec or pitch stability score
  dataSource: string;
  isSynthetic: boolean;
}

// Radiation Event
export interface RadiationEvent {
  id: string;
  astronautId: string;
  timestamp: string;
  missionDay: number;
  doseRate: number; // mSv/hr
  cumulativeDose: number; // mSv
  eventType: string; // "BACKGROUND" | "SOLAR_PARTICLE_EVENT" | "CORONAL_MASS_EJECTION"
  severity: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
}

// Daily Check-in
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

// Countermeasure and Outcome
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
  beforeScore: number | null; // Z-score before
  afterScore: number | null;  // Z-score after
  effect: number | null;      // Improvement delta
  confidence: number | null;  // 0 - 100%
  result: CountermeasureResult;
  evaluatedAt: string;
}

// Alert Model
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

// Domain Breakdown for Today Dashboard
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
  confidence: number; // 0-100
  dataAvailable: boolean;
  notes?: string;
}

// What Changed Today items
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
  riskContributionWeight: number; // For the explainability chart
}

// Dashboard Overview Payload
export interface DashboardData {
  missionDay: number;
  overallStatus: SystemStatus;
  simulatedRiskScore: number; // 0 - 100
  confidence: number; // 0 - 100%
  dataCompleteness: number; // 0 - 100%
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

// Radiation Watch Data
export interface RadiationWatchData {
  currentDoseRate: number; // µSv/h or mSv/h
  cumulativeDose: number; // mSv
  missionDay: number;
  eventStatus: string;
  watchWindowActive: boolean;
  watchWindowHoursRemaining: number;
  watchPeriodTotalHours: number;
  timeline: {
    missionDay: number;
    hoursFromEvent: number; // e.g. -168 to +72
    doseRate: number;
    sleepHours: number | null;
    hrv: number | null;
    reactionTimeMs: number | null;
    voiceCadence: number | null;
  }[];
  scienceNote: string;
}

// Personal Health Twin & Forecast
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
    upperBand: number; // mean + 1.5 * std
    lowerBand: number; // mean - 1.5 * std
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

// What-If Simulation
export interface WhatIfInput {
  radiationExposure: number; // slider 0 - 100
  sleepDuration: number; // slider 4 - 10 hours
  exerciseLoad: number; // slider 0 - 100
  stress: number; // slider 0 - 100
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

// Countermeasure Ranking (Personalized Learn Loop History)
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
