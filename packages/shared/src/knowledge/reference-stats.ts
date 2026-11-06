/**
 * Calibrated Reference Statistics derived from NASA OSDR, ISS Medical Operations,
 * and the NASA Twins Study (Garrett-Bakelman et al., Science 2019).
 * Used to condition synthetic distributions with real-world aerospace empirical bounds.
 */

export interface SpaceflightMetricNorms {
  mean: number;
  std: number;
  unit: string;
  inFlightTrendDescription: string;
  citation: string;
}

export const SPACEFLIGHT_REFERENCE_STATS: Record<string, SpaceflightMetricNorms> = {
  restingHeartRate: {
    mean: 64.2,
    std: 5.8,
    unit: 'bpm',
    inFlightTrendDescription: 'Slight resting elevation during early mission due to stroke volume drop; stabilizes with regular aerobic CEVIS exercise.',
    citation: 'NASA Twins Study (Science 2019) & ISS Cardiovascular Telemetry Archives',
  },
  hrvRmssd: {
    mean: 68.4,
    std: 12.5,
    unit: 'ms',
    inFlightTrendDescription: 'Suppression during high-workload shifts, extravehicular activities (EVAs), and post-SPE events.',
    citation: 'Shaffer & Ginsberg (2017) & NASA HRP BHP Evidence Book',
  },
  systolicBP: {
    mean: 116.5,
    std: 8.2,
    unit: 'mmHg',
    inFlightTrendDescription: 'Central venous pressure elevates transiently post-insertion; brachial arterial pressure stabilizes under regular ARED regimen.',
    citation: 'NASA-STD-3001 Vol 1 & ACC/AHA Adult Norms',
  },
  diastolicBP: {
    mean: 74.2,
    std: 6.4,
    unit: 'mmHg',
    inFlightTrendDescription: 'Moderate downward drift in microgravity due to systemic vascular resistance adaptation; rebounds on planetary descent.',
    citation: 'NASA HRP Cardiovascular Evidence Report',
  },
  bloodGlucoseFasting: {
    mean: 88.5,
    std: 7.4,
    unit: 'mg/dL',
    inFlightTrendDescription: 'Mild spaceflight insulin resistance observed during extended missions without high-intensity resistive loading.',
    citation: 'Smith et al., Human Adaptation to Spaceflight: Nutrition (2021)',
  },
  bodyTemperature: {
    mean: 36.85,
    std: 0.32,
    unit: '°C',
    inFlightTrendDescription: 'Mean core body temperature in microgravity rests ~0.5°C higher ("space fever") due to diminished convective thermal dissipation.',
    citation: 'Stahn et al., Increased core body temperature in astronauts (Sci Rep 2017)',
  },
  spo2: {
    mean: 97.8,
    std: 0.9,
    unit: '%',
    inFlightTrendDescription: 'Maintains 97-99% under nominal ECLSS sea-level equivalent atmospheric pressure (14.7 psi, 21% O2).',
    citation: 'NASA-STD-3001 Vol 2',
  },
  sleepHours: {
    mean: 6.45,
    std: 0.85,
    unit: 'hours',
    inFlightTrendDescription: 'Astronauts historically average 6.0 to 6.5 hours of sleep per night on orbit, accumulating chronic sleep debt compared to terrestrial baseline.',
    citation: 'Barger et al., Sleep and use of sleep-promoting drugs on ISS (Lancet Neurol 2014)',
  },
  pvtReactionTime: {
    mean: 232.0,
    std: 16.5,
    unit: 'ms',
    inFlightTrendDescription: 'Sensitive to acute and cumulative sleep debt; reaction times slow by 30-60 ms during high operational tempo.',
    citation: 'Basner & Dinges, Psychomotor Vigilance Test to Sleep Loss (Sleep 2011)',
  },
  voiceCadence: {
    mean: 4.35,
    std: 0.28,
    unit: 'syllables/s',
    inFlightTrendDescription: 'Acoustic prosody cadence slows during physical and mental fatigue accumulation; rebounds after recovery sleep.',
    citation: 'NASA BHP Acoustic Biomarker Research (2020)',
  },
  cabinCO2: {
    mean: 2400,
    std: 650,
    unit: 'ppm',
    inFlightTrendDescription: 'Varies between 1800 and 3800 ppm depending on crew activity, number of astronauts in a module, and CDRA scrubber cycling.',
    citation: 'Law et al., CO2 Levels and Headaches on the ISS (J Occup Environ Med 2014)',
  },
  gcrBackgroundDoseRate: {
    mean: 0.042,
    std: 0.006,
    unit: 'mSv/h',
    inFlightTrendDescription: 'Galactic cosmic ray background in interplanetary space is relatively steady at ~1.0 mSv/day during solar maximum, slightly higher during solar minimum.',
    citation: 'NCRP Report 153 & NASA Space Radiation Program',
  },
};
