/**
 * Deterministic pseudo-random number generator (LCG)
 * Ensures 100% reproducible synthetic datasets across all seeds.
 */
class DeterministicRNG {
  private seed: number;

  constructor(seed = 42) {
    this.seed = seed;
  }

  // Returns float in [0, 1)
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  // Float in range [min, max]
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Normal distribution approximation using Box-Muller transform
  gaussian(mean = 0, std = 1): number {
    const u1 = Math.max(1e-6, this.next());
    const u2 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * std;
  }
}

export interface SyntheticDayData {
  missionDay: number;
  timestamp: Date;

  // Cardiovascular
  heartRate: number;
  hrv: number;
  systolicBP: number;
  diastolicBP: number;

  // Metabolic & Nutrition
  bloodGlucose: number;
  weightKg: number;
  hydrationScore: number;
  caloriesKcal: number;
  vitaminDStatusNote: string;

  // Thermoregulation & Immune
  bodyTemp: number;
  spo2: number;
  stress: number;

  // Musculoskeletal & Exercise
  activity: number;
  exerciseMinutes: number;
  exerciseType: string;

  // Cognitive & Behavioral
  sleepHours: number;
  mood: number;
  fatigue: number;
  reactionTimeMs: number;
  voiceCadence: number;

  // Habitability & Closed Environment
  cabinCO2ppm: number;
  cabinTempC: number;
  cabinHumidityPct: number;
  noiseDb: number;
  socialContactMinutes: number;

  // Radiation
  radiationDoseRate: number;
  cumulativeDose: number;
  radiationEventType: string;
  radiationSeverity: string;
  isSynthetic: boolean;
}

export function generateSyntheticMission(totalDays = 90): SyntheticDayData[] {
  const rng = new DeterministicRNG(2026);
  const data: SyntheticDayData[] = [];
  const baseDate = new Date('2026-08-01T00:00:00Z');

  let cumulativeDose = 15.0; // Initial baseline mission cumulative dose in mSv

  for (let day = 1; day <= totalDays; day++) {
    const dayDate = new Date(baseDate.getTime() + (day - 1) * 24 * 3600 * 1000);

    // Baseline nominal distributions
    let sleepHours = 7.35 + rng.gaussian(0, 0.25);
    let hrv = 68.0 + rng.gaussian(0, 3.5);
    let heartRate = 62.0 + rng.gaussian(0, 2.0);
    let systolicBP = 116.0 + rng.gaussian(0, 2.5);
    let diastolicBP = 74.0 + rng.gaussian(0, 2.0);

    let bloodGlucose = 88.0 + rng.gaussian(0, 3.0);
    let weightKg = 76.5 + rng.gaussian(0, 0.2);
    let hydrationScore = 88.0 + rng.gaussian(0, 3.0);
    let caloriesKcal = 2850.0 + rng.gaussian(0, 60.0);
    let vitaminDStatusNote = 'OPTIMAL (42 ng/mL)';

    let bodyTemp = 36.85 + rng.gaussian(0, 0.12);
    let spo2 = 98.0 + rng.gaussian(0, 0.4);
    let stress = 2.8 + rng.gaussian(0, 0.4);

    let activity = 85.0 + rng.gaussian(0, 4.0);
    let exerciseMinutes = 135.0 + rng.gaussian(0, 5.0);
    let exerciseType = 'ARED_RESISTIVE_AND_T2';

    let mood = 8.0 + rng.gaussian(0, 0.4);
    let fatigue = 2.5 + rng.gaussian(0, 0.4);
    let reactionTimeMs = 230.0 + rng.gaussian(0, 8.0);
    let voiceCadence = 4.35 + rng.gaussian(0, 0.15);

    let cabinCO2ppm = 1850.0 + rng.gaussian(0, 80.0);
    let cabinTempC = 21.8 + rng.gaussian(0, 0.4);
    let cabinHumidityPct = 46.0 + rng.gaussian(0, 2.0);
    let noiseDb = 52.0 + rng.gaussian(0, 1.5);
    let socialContactMinutes = 120.0 + rng.gaussian(0, 10.0);

    let doseRate = 0.042 + rng.gaussian(0, 0.003); // GCR background ~0.04 mSv/h
    let radiationEventType = 'BACKGROUND';
    let radiationSeverity = 'NORMAL';

    // Phase 1: Days 1-14 Normal Calibration
    if (day <= 14) {
      // Nominal calibration window
    }
    // Phase 2: Days 15-45 Stable Mission Routine
    else if (day <= 45) {
      sleepHours += rng.range(-0.1, 0.1);
      hrv += rng.range(-1, 1);
    }
    // Phase 3: Days 46-55 Gradual Sleep Deterioration & Mild Vascular Drift
    else if (day <= 55) {
      const prog = (day - 45) / 10; // 0 to 1
      sleepHours -= prog * 1.15; // Drops towards 6.2h
      fatigue += prog * 1.8;
      stress += prog * 1.2;
      systolicBP += prog * 6.0; // Creeps to ~122
      diastolicBP += prog * 4.0;
      bloodGlucose += prog * 8.0; // Mild insulin resistance
      cabinCO2ppm += prog * 400.0; // Creeps to 2250 ppm
      hydrationScore -= prog * 6.0;
    }
    // Phase 4: Days 56-60 Autonomic Drift, HRV Drops, CO2 Rises
    else if (day < 61) {
      const prog = (day - 55) / 6; // 0 to 1
      sleepHours = 6.2 - prog * 0.4;
      hrv = 68.0 - 18.0 * prog; // Drops from ~68 to ~50
      fatigue = 4.3 + prog * 2.2;
      stress = 4.0 + prog * 1.8;
      reactionTimeMs = 230.0 + prog * 45; // Rises to 275ms
      voiceCadence = 4.35 - prog * 0.4;
      systolicBP = 122.0 + prog * 10.0; // Rises to 132 mmHg (Stage 1)
      diastolicBP = 78.0 + prog * 6.0; // 84 mmHg
      cabinCO2ppm = 2250.0 + prog * 550.0; // Up to 2800 ppm
      bodyTemp = 36.95 + prog * 0.2;
    }
    // Phase 5: Day 61 Solar Particle Event (SPE HERO DAY)!
    else if (day === 61) {
      sleepHours = 6.2;
      hrv = 47.5;
      heartRate = 67.2;
      systolicBP = 138.0; // High Stage 1 BP
      diastolicBP = 88.0;
      bloodGlucose = 104.0;
      bodyTemp = 37.4; // Subfebrile cytokine inflammatory response!
      spo2 = 97.2;
      activity = 74.0;
      exerciseMinutes = 90.0;
      mood = 5.2;
      fatigue = 6.4;
      stress = 6.8;
      reactionTimeMs = 282.0; // PVT latency shift
      voiceCadence = 3.82; // Cadence slowed
      cabinCO2ppm = 2950.0;
      hydrationScore = 76.0;

      doseRate = 1.45; // Severe Solar Particle Event spike!
      cumulativeDose += 3.2;
      radiationEventType = 'SOLAR_PARTICLE_EVENT';
      radiationSeverity = 'ELEVATED';
    }
    // Phase 6: Days 62-63 Delayed Impact Window (72h Watch Window)
    else if (day <= 63) {
      const postDay = day - 61; // 1 or 2
      sleepHours = 5.85 - postDay * 0.2; // 5.65h
      hrv = 43.0 - postDay * 1.5; // ~40ms
      heartRate = 69.5;
      systolicBP = 142.0; // Stage 2 Hypertension under acute stress
      diastolicBP = 90.0;
      bloodGlucose = 112.0;
      bodyTemp = 37.3;
      fatigue = 7.5;
      stress = 7.1;
      reactionTimeMs = 320.0 + postDay * 10; // 330-340ms latency
      voiceCadence = 3.48;
      cabinCO2ppm = 3150.0; // Cabin scrubber load high
      hydrationScore = 72.0;

      doseRate = 0.45 / postDay; // Decaying SPE flux
      cumulativeDose += 0.8;
      radiationEventType = 'SOLAR_PARTICLE_EVENT_DECAY';
      radiationSeverity = 'ELEVATED';
    }
    // Phase 7: Days 64-65 Recovery under Sleep-Phase & Hydration Countermeasure!
    else if (day <= 65) {
      const recDay = day - 63; // 1 or 2
      sleepHours = 6.55 + recDay * 0.55; // Recovers to ~7.1h
      hrv = 52.0 + recDay * 6.5; // Recovers to ~65ms
      heartRate = 64.0;
      systolicBP = 126.0 - recDay * 8.0; // Recovers to 118 mmHg!
      diastolicBP = 82.0 - recDay * 6.0; // Recovers to 76 mmHg!
      bloodGlucose = 94.0 - recDay * 4.0; // Recovers to 90 mg/dL
      bodyTemp = 36.9;
      fatigue = 5.0 - recDay * 1.2;
      stress = 4.8 - recDay * 1.1;
      reactionTimeMs = 275.0 - recDay * 25; // Improves back to 225ms
      voiceCadence = 3.9 + recDay * 0.25;
      cabinCO2ppm = 2100.0 - recDay * 200.0;
      hydrationScore = 86.0;
      doseRate = 0.045;
      radiationEventType = 'BACKGROUND';
      radiationSeverity = 'NORMAL';
    }
    // Phase 8: Days 66-90 Sustained Multi-System Stabilization
    else {
      sleepHours = 7.25 + rng.gaussian(0, 0.2);
      hrv = 66.0 + rng.gaussian(0, 3.0);
      heartRate = 61.5 + rng.gaussian(0, 1.8);
      systolicBP = 117.0 + rng.gaussian(0, 2.0);
      diastolicBP = 75.0 + rng.gaussian(0, 1.5);
      bloodGlucose = 89.0 + rng.gaussian(0, 2.5);
      bodyTemp = 36.85 + rng.gaussian(0, 0.1);
      spo2 = 98.2 + rng.gaussian(0, 0.3);
      activity = 84.0 + rng.gaussian(0, 3.5);
      exerciseMinutes = 135.0 + rng.gaussian(0, 4.0);
      mood = 7.8 + rng.gaussian(0, 0.3);
      fatigue = 2.8 + rng.gaussian(0, 0.4);
      stress = 3.0 + rng.gaussian(0, 0.4);
      reactionTimeMs = 232.0 + rng.gaussian(0, 7.0);
      voiceCadence = 4.3 + rng.gaussian(0, 0.12);
      cabinCO2ppm = 1880.0 + rng.gaussian(0, 70.0);
      hydrationScore = 89.0 + rng.gaussian(0, 2.0);
      doseRate = 0.042;
    }

    cumulativeDose += (doseRate * 24) / 1000; // Accumulate daily dose in mSv

    data.push({
      missionDay: day,
      timestamp: dayDate,
      heartRate: Number(heartRate.toFixed(1)),
      hrv: Number(hrv.toFixed(1)),
      systolicBP: Number(systolicBP.toFixed(1)),
      diastolicBP: Number(diastolicBP.toFixed(1)),
      bloodGlucose: Number(bloodGlucose.toFixed(1)),
      weightKg: Number(weightKg.toFixed(1)),
      hydrationScore: Number(hydrationScore.toFixed(1)),
      caloriesKcal: Number(caloriesKcal.toFixed(0)),
      vitaminDStatusNote,
      bodyTemp: Number(bodyTemp.toFixed(2)),
      spo2: Number(spo2.toFixed(1)),
      stress: Number(Math.max(1, Math.min(10, stress)).toFixed(1)),
      activity: Number(activity.toFixed(1)),
      exerciseMinutes: Number(exerciseMinutes.toFixed(0)),
      exerciseType,
      sleepHours: Number(sleepHours.toFixed(2)),
      mood: Number(Math.max(1, Math.min(10, mood)).toFixed(1)),
      fatigue: Number(Math.max(1, Math.min(10, fatigue)).toFixed(1)),
      reactionTimeMs: Number(reactionTimeMs.toFixed(1)),
      voiceCadence: Number(voiceCadence.toFixed(2)),
      cabinCO2ppm: Number(cabinCO2ppm.toFixed(0)),
      cabinTempC: Number(cabinTempC.toFixed(1)),
      cabinHumidityPct: Number(cabinHumidityPct.toFixed(1)),
      noiseDb: Number(noiseDb.toFixed(1)),
      socialContactMinutes: Number(socialContactMinutes.toFixed(0)),
      radiationDoseRate: Number(doseRate.toFixed(3)),
      cumulativeDose: Number(cumulativeDose.toFixed(2)),
      radiationEventType,
      radiationSeverity,
      isSynthetic: true,
    });
  }

  return data;
}
