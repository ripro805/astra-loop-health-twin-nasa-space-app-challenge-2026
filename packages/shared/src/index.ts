// Re-export Knowledge Base
export * from './knowledge/index.js';

// Status and Risk levels
export type SystemStatus = 'STABLE' | 'MONITOR' | 'ATTENTION' | 'INSUFFICIENT_DATA';
export type AbsoluteStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';
export type StatusColor = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' | 'GRAY';

export interface StatusIndicator {
  status: SystemStatus;
  color: StatusColor;
  label: string;
}

// Environment Models
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

// Astronaut Model
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

// Complete Health Metrics Model
export interface HealthMetric {
  id: string;
  astronautId: string;
  timestamp: string;
  missionDay: number;

  // Cardiovascular
  heartRate: number | null;
  hrv: number | null; // rMSSD in ms
  systolicBP: number | null; // mmHg
  diastolicBP: number | null; // mmHg

  // Metabolic & Nutrition
  bloodGlucose: number | null; // mg/dL
  weightKg: number | null;
  hydrationScore: number | null; // 0 - 100
  caloriesKcal: number | null;
  vitaminDStatusNote?: string | null;

  // Thermoregulation & Immune
  bodyTemp: number | null; // °C
  spo2: number | null; // % peripheral capillary oxygen saturation
  stress: number | null; // 1-10

  // Musculoskeletal & Exercise
  activity: number | null; // metabolic equivalent activity score
  exerciseMinutes: number | null;
  exerciseType?: string | null;

  // Cognitive & Behavioral
  sleepHours: number | null;
  mood: number | null; // 1-10
  fatigue: number | null; // 1-10
  reactionTimeMs: number | null; // PVT latency ms
  voiceCadence: number | null; // syllables/sec

  // Habitability & Closed Environment
  cabinCO2ppm: number | null;
  cabinTempC: number | null;
  cabinHumidityPct: number | null;
  noiseDb: number | null;
  socialContactMinutes: number | null;

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
  eventType: string; // "BACKGROUND" | "SOLAR_PARTICLE_EVENT" | "SOLAR_PARTICLE_EVENT_DECAY"
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
  domain: 'Cardio' | 'Sleep' | 'Mind' | 'Muscle-Bone' | 'Immune' | 'Metabolic' | 'Environment' | 'Radiation';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  explanation: string;
  confidence: number;
}

// 7 Domains for Today Dashboard
export type HealthDomain =
  | 'Cardio'
  | 'Sleep'
  | 'Mind'
  | 'Muscle-Bone'
  | 'Immune'
  | 'Metabolic'
  | 'Environment';

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
  confidence: number; // 0-100
  dataAvailable: boolean;
  notes?: string;
  absoluteStatus?: AbsoluteStatus;
  absoluteStatusText?: string;
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
  riskContributionWeight: number;
  absoluteFlag?: AbsoluteStatus;
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

// Radiation Watch Data
export interface RadiationWatchData {
  currentDoseRate: number; // µSv/h or mSv/h
  cumulativeDose: number; // mSv
  careerDoseLimit: number; // mSv (e.g. 600 mSv)
  careerLimitConsumedPct: number; // %
  missionDay: number;
  eventStatus: string;
  watchWindowActive: boolean;
  watchWindowHoursRemaining: number;
  watchPeriodTotalHours: number;
  spaceWeatherAlert?: {
    scale: string; // S1 to S5
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
  warningRange?: { low?: number; high?: number };
  criticalRange?: { low?: number; high?: number };
  historicalBand: {
    day: number;
    value: number | null;
    baselineMean: number;
    upperBand: number; // mean + 1.5 * std
    lowerBand: number; // mean - 1.5 * std
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

// What-If Simulation
export interface WhatIfInput {
  radiationExposure: number; // slider 0 - 100
  sleepDuration: number; // slider 4 - 10 hours
  exerciseLoad: number; // slider 0 - 100
  stress: number; // slider 0 - 100
  cabinCO2ppm?: number; // slider 400 - 5000 ppm
  gravityG?: number; // slider 0 - 1.0 g
  systolicBP?: number; // slider 90 - 180 mmHg
  bloodGlucose?: number; // slider 50 - 250 mg/dL
  socialContactMinutes?: number; // slider 0 - 180 min
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

// Interactive Body Organ Status (Clickable Body Figure)
export interface OrganSystemStatus {
  system: string; // BRAIN_NERVOUS, CARDIOVASCULAR, etc.
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

// Routine & Scheduler
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

// Gamification
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

// Image Capture Telemedicine Packet
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

// Flight Surgeon Consolidated Report
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
