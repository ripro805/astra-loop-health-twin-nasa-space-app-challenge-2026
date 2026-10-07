/**
 * Deterministic pseudo-random number generator (LCG)
 * Ensures reproducible synthetic datasets across all seeds.
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

  // Normal distribution approximation using Box-Muller
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
  heartRate: number;
  hrv: number;
  sleepHours: number;
  activity: number;
  mood: number;
  fatigue: number;
  stress: number;
  reactionTimeMs: number;
  voiceCadence: number;
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

  let cumulativeDose = 15.0; // initial baseline mission dose in mSv

  for (let day = 1; day <= totalDays; day++) {
    const dayDate = new Date(baseDate.getTime() + (day - 1) * 24 * 3600 * 1000);

    let sleepHours = 7.35 + rng.gaussian(0, 0.25);
    let hrv = 68.0 + rng.gaussian(0, 3.5);
    let heartRate = 62.0 + rng.gaussian(0, 2.0);
    let activity = 85.0 + rng.gaussian(0, 4.0);
    let mood = 8.0 + rng.gaussian(0, 0.4);
    let fatigue = 2.5 + rng.gaussian(0, 0.4);
    let stress = 2.8 + rng.gaussian(0, 0.4);
    let reactionTimeMs = 230.0 + rng.gaussian(0, 8.0);
    let voiceCadence = 4.35 + rng.gaussian(0, 0.15);

    let doseRate = 0.042 + rng.gaussian(0, 0.003); // background galactic cosmic rays ~0.04 mSv/h
    let radiationEventType = 'BACKGROUND';
    let radiationSeverity = 'NORMAL';

    // Storyline Phase 1: Days 1-14 Normal Calibration
    if (day <= 14) {
      // baseline nominal calibration
    }
    // Storyline Phase 2: Days 15-45 Stable Mission Routine
    else if (day <= 45) {
      // Nominal minor fluctuations
      sleepHours += rng.range(-0.1, 0.1);
      hrv += rng.range(-1, 1);
    }
    // Storyline Phase 3: Days 45-55 Gradual Sleep Deterioration
    else if (day <= 55) {
      const prog = (day - 45) / 10; // 0 to 1
      sleepHours -= prog * 1.15; // drops down towards 6.2h
      fatigue += prog * 1.8;
      stress += prog * 1.2;
    }
    // Storyline Phase 4: Days 55-61 HRV Drops and Fatigue Increases
    else if (day < 61) {
      const prog = (day - 55) / 6; // 0 to 1
      sleepHours = 6.2 - prog * 0.4; // 6.2 to 5.8
      hrv = 68.0 - 18.0 * prog; // drops from ~68 down to ~50
      fatigue = 4.3 + prog * 2.2; // rises to 6.5
      stress = 4.0 + prog * 1.8; // rises to 5.8
      reactionTimeMs = 230.0 + prog * 45; // rises to 275ms
      voiceCadence = 4.35 - prog * 0.4;
    }
    // Storyline Phase 5: Day 61 Solar Particle Event (SPE)!
    else if (day === 61) {
      sleepHours = 6.2;
      hrv = 47.5;
      heartRate = 67.2;
      activity = 74.0;
      mood = 5.2;
      fatigue = 6.4;
      stress = 6.8;
      reactionTimeMs = 282.0;
      voiceCadence = 3.82;

      doseRate = 1.45; // Severe Solar Particle Event spike!
      cumulativeDose += 3.2;
      radiationEventType = 'SOLAR_PARTICLE_EVENT';
      radiationSeverity = 'ELEVATED';
    }
    // Storyline Phase 6: Days 62-63 Delayed impact window
    else if (day <= 63) {
      const postDay = day - 61; // 1 or 2
      sleepHours = 5.85 - postDay * 0.2; // 5.65h
      hrv = 43.0 - postDay * 1.5; // ~40ms
      heartRate = 69.5;
      fatigue = 7.5;
      stress = 7.1;
      reactionTimeMs = 320.0 + postDay * 10; // 330-340ms latency
      voiceCadence = 3.48; // cadence slowed down
      doseRate = 0.45 / postDay; // decaying SPE dose
      cumulativeDose += 0.8;
      radiationEventType = 'SOLAR_PARTICLE_EVENT_DECAY';
      radiationSeverity = 'ELEVATED';
    }
    // Storyline Phase 7: Days 64-65 Recovery under Sleep-Phase Countermeasure!
    else if (day <= 65) {
      const recDay = day - 63; // 1 or 2
      sleepHours = 6.55 + recDay * 0.55; // recovers back to ~7.1h
      hrv = 52.0 + recDay * 6.5; // recovers back to ~65ms
      heartRate = 64.0;
      fatigue = 5.0 - recDay * 1.2;
      stress = 4.8 - recDay * 1.1;
      reactionTimeMs = 275.0 - recDay * 25; // improves back to 225ms
      voiceCadence = 3.9 + recDay * 0.25;
      doseRate = 0.045;
      radiationEventType = 'BACKGROUND';
      radiationSeverity = 'NORMAL';
    }
    // Storyline Phase 8: Days 66-90 Sustained stabilization
    else {
      sleepHours = 7.25 + rng.gaussian(0, 0.2);
      hrv = 66.0 + rng.gaussian(0, 3.0);
      heartRate = 61.5 + rng.gaussian(0, 1.8);
      activity = 84.0 + rng.gaussian(0, 3.5);
      mood = 7.8 + rng.gaussian(0, 0.3);
      fatigue = 2.8 + rng.gaussian(0, 0.4);
      stress = 3.0 + rng.gaussian(0, 0.4);
      reactionTimeMs = 232.0 + rng.gaussian(0, 7.0);
      voiceCadence = 4.3 + rng.gaussian(0, 0.12);
      doseRate = 0.042;
    }

    cumulativeDose += (doseRate * 24) / 1000; // accumulate daily dose in mSv

    data.push({
      missionDay: day,
      timestamp: dayDate,
      heartRate: Number(heartRate.toFixed(1)),
      hrv: Number(hrv.toFixed(1)),
      sleepHours: Number(sleepHours.toFixed(2)),
      activity: Number(activity.toFixed(1)),
      mood: Number(Math.max(1, Math.min(10, mood)).toFixed(1)),
      fatigue: Number(Math.max(1, Math.min(10, fatigue)).toFixed(1)),
      stress: Number(Math.max(1, Math.min(10, stress)).toFixed(1)),
      reactionTimeMs: Number(reactionTimeMs.toFixed(1)),
      voiceCadence: Number(voiceCadence.toFixed(2)),
      radiationDoseRate: Number(doseRate.toFixed(3)),
      cumulativeDose: Number(cumulativeDose.toFixed(2)),
      radiationEventType,
      radiationSeverity,
      isSynthetic: true,
    });
  }

  return data;
}
