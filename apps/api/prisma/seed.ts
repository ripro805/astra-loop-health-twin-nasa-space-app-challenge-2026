import { PrismaClient } from '@prisma/client';
import { generateSyntheticMission } from '../src/utils/seedGenerator.js';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('--- ASTRA-LOOP v2 Synthetic Data Seeding Started ---');

  // Clear existing records in cascade order
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.gamificationProfile.deleteMany();
  await prisma.measurementTask.deleteMany();
  await prisma.imageCapture.deleteMany();
  await prisma.escalationEvent.deleteMany();
  await prisma.crewInteractionLog.deleteMany();
  await prisma.countermeasureOutcome.deleteMany();
  await prisma.countermeasure.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.radiationEvent.deleteMany();
  await prisma.healthMetric.deleteMany();
  await prisma.astronaut.deleteMany();
  await prisma.environment.deleteMany();

  // 1. Create 5 Mission Environments
  const envSpacecraft = await prisma.environment.create({
    data: {
      type: 'SPACECRAFT',
      name: 'Astra Transit Habitat (Deep Space 0g)',
      description: 'Interplanetary transit habitat en route to Mars. Microgravity 0g with 14.3 min Earth communication delay.',
      gravityG: 0.0,
      radiationShieldingFactor: 1.0,
      crewSize: 4,
      commsDelayMinutes: 14.3,
      nominalCabinCO2ppm: 1800.0,
      nominalCabinTempC: 21.5,
      nominalCabinHumidityPct: 45.0,
    },
  });

  const envMars = await prisma.environment.create({
    data: {
      type: 'MARS_BASE',
      name: 'Chryse Planitia Mars Base',
      description: 'Partial gravity surface habitat (0.38g). Regolith-shielded dome with 18.2 min one-way light speed delay.',
      gravityG: 0.38,
      radiationShieldingFactor: 0.5,
      crewSize: 6,
      commsDelayMinutes: 18.2,
      nominalCabinCO2ppm: 1600.0,
      nominalCabinTempC: 22.0,
      nominalCabinHumidityPct: 40.0,
    },
  });

  await prisma.environment.createMany({
    data: [
      {
        type: 'MOON_BASE',
        name: 'Artemis Shackleton Basecamp',
        description: 'Lunar south pole permanent outpost (0.16g). 1.3 second communication delay.',
        gravityG: 0.16,
        radiationShieldingFactor: 0.65,
        crewSize: 4,
        commsDelayMinutes: 0.02,
        nominalCabinCO2ppm: 1700.0,
        nominalCabinTempC: 21.0,
        nominalCabinHumidityPct: 42.0,
      },
      {
        type: 'STATION',
        name: 'Lunar Orbital Gateway',
        description: 'Near-Rectilinear Halo Orbit orbital research platform (0g microgravity).',
        gravityG: 0.0,
        radiationShieldingFactor: 0.9,
        crewSize: 4,
        commsDelayMinutes: 0.02,
        nominalCabinCO2ppm: 1900.0,
        nominalCabinTempC: 21.5,
        nominalCabinHumidityPct: 45.0,
      },
      {
        type: 'ROVER',
        name: 'Pressurized Exploration Rover-2',
        description: 'Mobile long-range 14-day surface excursion cabin for 2 crew members.',
        gravityG: 0.38,
        radiationShieldingFactor: 1.2,
        crewSize: 2,
        commsDelayMinutes: 18.2,
        nominalCabinCO2ppm: 2200.0,
        nominalCabinTempC: 20.5,
        nominalCabinHumidityPct: 48.0,
      },
    ],
  });

  console.log('Seeded 5 Mission Environments.');

  // 2. Create Core Gamification Badges
  const badgesData = [
    {
      code: 'BONE_GUARDIAN',
      title: 'Bone Guardian',
      description: 'Completed 14 consecutive daily ARED resistive loading sessions with zero skipped cycles.',
      icon: 'Shield',
      tier: 'GOLD',
      xpAward: 250,
    },
    {
      code: 'STEADY_HEART',
      title: 'Steady Heart',
      description: 'Maintained autonomic parasympathetic recovery HRV band across 21 consecutive mission days.',
      icon: 'Heart',
      tier: 'SILVER',
      xpAward: 150,
    },
    {
      code: 'CIRCADIAN_MASTER',
      title: 'Circadian Master',
      description: 'Achieved ≥ 7.0 hours of actigraphy-confirmed sleep on 10 consecutive nights.',
      icon: 'Moon',
      tier: 'SILVER',
      xpAward: 150,
    },
    {
      code: 'RADIATION_READY',
      title: 'Radiation Ready',
      description: 'Demonstrated flawless storm shelter ingress and 72-hour lag-window surveillance protocol.',
      icon: 'Radiation',
      tier: 'PLATINUM',
      xpAward: 500,
    },
    {
      code: 'HYDRATION_HERO',
      title: 'Hydration Hero',
      description: 'Maintained hydration score ≥ 85 throughout a high-load EVA mission cycle.',
      icon: 'Droplets',
      tier: 'BRONZE',
      xpAward: 100,
    },
  ];

  for (const b of badgesData) {
    await prisma.badge.create({ data: b });
  }
  console.log('Seeded 5 Core Gamification Badges.');

  // 3. Create Primary Demo Astronaut (CDR Alex Vance - Deep Space Transit 0g)
  const astronautAlex = await prisma.astronaut.create({
    data: {
      name: 'CDR Alex Vance',
      missionDay: 61, // Primary hero presentation day
      calibrationDone: true,
      environmentId: envSpacecraft.id,
    },
  });

  // Create Secondary Demo Astronaut (Dr. Maya Lin - Mars Surface Base 0.38g)
  const astronautMaya = await prisma.astronaut.create({
    data: {
      name: 'Dr. Maya Lin',
      missionDay: 120,
      calibrationDone: true,
      environmentId: envMars.id,
    },
  });

  console.log(`Created Primary Astronaut: ${astronautAlex.name} on Day ${astronautAlex.missionDay} in ${envSpacecraft.name}`);
  console.log(`Created Secondary Astronaut: ${astronautMaya.name} on Day ${astronautMaya.missionDay} in ${envMars.name}`);

  // 4. Generate 90 Synthetic Mission Days for Alex Vance
  const syntheticTimeline = generateSyntheticMission(90);

  const healthMetricsData = syntheticTimeline.map((item) => ({
    astronautId: astronautAlex.id,
    timestamp: item.timestamp,
    missionDay: item.missionDay,
    heartRate: item.heartRate,
    hrv: item.hrv,
    systolicBP: item.systolicBP,
    diastolicBP: item.diastolicBP,
    bloodGlucose: item.bloodGlucose,
    weightKg: item.weightKg,
    hydrationScore: item.hydrationScore,
    caloriesKcal: item.caloriesKcal,
    vitaminDStatusNote: item.vitaminDStatusNote,
    bodyTemp: item.bodyTemp,
    spo2: item.spo2,
    stress: item.stress,
    activity: item.activity,
    exerciseMinutes: item.exerciseMinutes,
    exerciseType: item.exerciseType,
    sleepHours: item.sleepHours,
    mood: item.mood,
    fatigue: item.fatigue,
    reactionTimeMs: item.reactionTimeMs,
    voiceCadence: item.voiceCadence,
    cabinCO2ppm: item.cabinCO2ppm,
    cabinTempC: item.cabinTempC,
    cabinHumidityPct: item.cabinHumidityPct,
    noiseDb: item.noiseDb,
    socialContactMinutes: item.socialContactMinutes,
    dataSource: 'WEARABLE_BIO_SUITE_V2',
    isSynthetic: true,
  }));

  await prisma.healthMetric.createMany({
    data: healthMetricsData,
  });
  console.log(`Seeded ${healthMetricsData.length} daily multi-domain health metrics for Alex Vance.`);

  // Bulk create Radiation Events for Alex Vance
  const radiationEventsData = syntheticTimeline.map((item) => ({
    astronautId: astronautAlex.id,
    timestamp: item.timestamp,
    missionDay: item.missionDay,
    doseRate: item.radiationDoseRate,
    cumulativeDose: item.cumulativeDose,
    eventType: item.radiationEventType,
    severity: item.radiationSeverity,
  }));

  await prisma.radiationEvent.createMany({
    data: radiationEventsData,
  });
  console.log(`Seeded ${radiationEventsData.length} radiation monitoring events.`);

  // 5. Create Daily Check-Ins for Days 1 to 61 for Alex Vance
  const checkInsData = syntheticTimeline
    .filter((item) => item.missionDay <= 61)
    .map((item) => ({
      astronautId: astronautAlex.id,
      timestamp: item.timestamp,
      missionDay: item.missionDay,
      mood: item.mood,
      fatigue: item.fatigue,
      stress: item.stress,
      reactionTimeMs: item.reactionTimeMs,
      systolicBP: item.systolicBP,
      diastolicBP: item.diastolicBP,
      bloodGlucose: item.bloodGlucose,
      bodyTemp: item.bodyTemp,
      spo2: item.spo2,
      weightKg: item.weightKg,
      voiceAvailable: item.missionDay !== 58, // Simulate Day 58 voice sensor dropout
      voiceCadence: item.missionDay !== 58 ? item.voiceCadence : null,
      notes:
        item.missionDay === 61
          ? 'SPE alert sounded in Bay 3. Mild sinus pressure and sleep fragmentation. Alertness nominal.'
          : 'Nominal deep-space transit routine maintained.',
    }));

  await prisma.checkIn.createMany({
    data: checkInsData,
  });
  console.log(`Seeded ${checkInsData.length} astronaut daily clinical check-ins.`);

  // 6. Create Historical Countermeasures and Learn Loop Outcomes
  await prisma.countermeasure.create({
    data: {
      astronautId: astronautAlex.id,
      type: 'LIGHTING_SCHEDULE',
      recommendation: 'Dynamic spectrum adjustment: 480nm morning peak, red-shifted pre-sleep spectrum.',
      reason: 'Circadian desynchrony observed during transit realignment.',
      startedAt: new Date('2026-09-04T00:00:00Z'),
      evaluationAt: new Date('2026-09-07T00:00:00Z'),
      status: 'EVALUATED',
      outcomes: {
        create: {
          targetMetric: 'sleepHours',
          beforeScore: -1.2,
          afterScore: -0.4,
          effect: 0.8,
          confidence: 64,
          result: 'PROMISING',
          evaluatedAt: new Date('2026-09-07T00:00:00Z'),
        },
      },
    },
  });

  await prisma.countermeasure.create({
    data: {
      astronautId: astronautAlex.id,
      type: 'RECOVERY_PERIOD',
      recommendation: 'Scheduled 45-minute low-stimulation cognitive reset and sensory quiet period.',
      reason: 'Post-EVA physical fatigue accumulation.',
      startedAt: new Date('2026-08-21T00:00:00Z'),
      evaluationAt: new Date('2026-08-24T00:00:00Z'),
      status: 'EVALUATED',
      outcomes: {
        create: {
          targetMetric: 'fatigue',
          beforeScore: 1.4,
          afterScore: 1.3,
          effect: 0.1,
          confidence: 41,
          result: 'UNCERTAIN',
          evaluatedAt: new Date('2026-08-24T00:00:00Z'),
        },
      },
    },
  });

  // Primary Demo Countermeasure: Sleep Phase Adjustment (Started Day 63)
  await prisma.countermeasure.create({
    data: {
      astronautId: astronautAlex.id,
      type: 'SLEEP_PHASE_ADJUSTMENT',
      recommendation: 'Advance sleep schedule by 30 minutes; ambient blue-light attenuation 45m prior to sleep onset.',
      reason: 'Sleep duration decreased 15% below 14-day personal baseline following solar event.',
      startedAt: new Date('2026-10-02T00:00:00Z'), // Day 63
      evaluationAt: new Date('2026-10-05T00:00:00Z'), // Day 65 (48-72h)
      status: 'ACTIVE',
      outcomes: {
        create: {
          targetMetric: 'sleepHours',
          beforeScore: -1.8,
          afterScore: -0.6,
          effect: 1.2,
          confidence: 72,
          result: 'PROMISING',
          evaluatedAt: new Date('2026-10-05T00:00:00Z'),
        },
      },
    },
  });

  console.log('Seeded Countermeasures and Learn Loop historical evaluation outcomes.');

  // 7. Seed Gamification Profile & User Badges
  await prisma.gamificationProfile.create({
    data: {
      astronautId: astronautAlex.id,
      xp: 1450,
      level: 4,
      currentStreakDays: 14,
      longestStreakDays: 28,
      healthScoreRing: 86,
    },
  });

  const allBadges = await prisma.badge.findMany();
  const unlockedBadges = allBadges.filter((b) =>
    ['BONE_GUARDIAN', 'STEADY_HEART', 'CIRCADIAN_MASTER'].includes(b.code)
  );

  for (const b of unlockedBadges) {
    await prisma.userBadge.create({
      data: {
        astronautId: astronautAlex.id,
        badgeId: b.id,
      },
    });
  }
  console.log('Seeded Gamification Profile and 3 unlocked Badges for Alex Vance.');

  // 8. Seed Routine Scheduled Tasks for Mission Day 61
  const routineTasks = [
    {
      astronautId: astronautAlex.id,
      indicatorKey: 'systolicBP',
      title: 'Morning Blood Pressure & Heart Rate Check',
      timeOfDay: 'MORNING',
      dueTime: '07:15',
      completed: true,
      completedAt: new Date('2026-09-30T07:18:00Z'),
      missionDay: 61,
    },
    {
      astronautId: astronautAlex.id,
      indicatorKey: 'bloodGlucose',
      title: 'Fasting Blood Glucose Capillary Check',
      timeOfDay: 'MORNING',
      dueTime: '07:30',
      completed: true,
      completedAt: new Date('2026-09-30T07:32:00Z'),
      missionDay: 61,
    },
    {
      astronautId: astronautAlex.id,
      indicatorKey: 'bodyTemp',
      title: 'Core Body Temperature Verification',
      timeOfDay: 'MORNING',
      dueTime: '07:45',
      completed: true,
      completedAt: new Date('2026-09-30T07:46:00Z'),
      missionDay: 61,
    },
    {
      astronautId: astronautAlex.id,
      indicatorKey: 'exerciseMinutes',
      title: 'ARED Heavy Resistive & T2 Aerobic Countermeasure',
      timeOfDay: 'AFTERNOON',
      dueTime: '14:00',
      completed: true,
      completedAt: new Date('2026-09-30T15:35:00Z'),
      missionDay: 61,
    },
    {
      astronautId: astronautAlex.id,
      indicatorKey: 'reactionTimeMs',
      title: 'Evening Psychomotor Vigilance (PVT) & Check-In',
      timeOfDay: 'EVENING',
      dueTime: '20:30',
      completed: true,
      completedAt: new Date('2026-09-30T20:34:00Z'),
      missionDay: 61,
    },
    {
      astronautId: astronautAlex.id,
      indicatorKey: 'cabinCO2ppm',
      title: 'Pre-Sleep Quarters Ventilation Sweep',
      timeOfDay: 'BEDTIME',
      dueTime: '21:45',
      completed: false,
      missionDay: 61,
    },
  ];

  await prisma.measurementTask.createMany({
    data: routineTasks,
  });
  console.log(`Seeded ${routineTasks.length} scheduled measurement routine tasks for Day 61.`);

  // 9. Seed Escalation Events
  await prisma.escalationEvent.create({
    data: {
      astronautId: astronautAlex.id,
      missionDay: 61,
      tier: 'MONITOR',
      triggerIndicator: 'radiationDoseRate',
      triggerValue: 1.45,
      reason: 'Solar Particle Event (SPE) dosimeter spike to 1.45 mSv/h initiated 72h physiological watch window.',
      acknowledged: true,
      acknowledgedAt: new Date('2026-09-30T04:20:00Z'),
    },
  });

  // 10. Seed Mission Day 61 Alerts
  await prisma.alert.createMany({
    data: [
      {
        astronautId: astronautAlex.id,
        timestamp: new Date('2026-09-30T04:15:00Z'),
        domain: 'Radiation',
        severity: 'WARNING',
        title: 'Solar Particle Event Detected',
        explanation: 'Simulated dose rate spike to 1.45 mSv/h. 72-Hour Watch Window initiated.',
        confidence: 96,
      },
      {
        astronautId: astronautAlex.id,
        timestamp: new Date('2026-09-30T07:30:00Z'),
        domain: 'Sleep',
        severity: 'WARNING',
        title: 'Sleep Duration Below Personal Baseline',
        explanation: 'Current sleep 6h 12m vs personal baseline 7h 21m (-1h 09m deviation).',
        confidence: 87,
      },
      {
        astronautId: astronautAlex.id,
        timestamp: new Date('2026-09-30T08:00:00Z'),
        domain: 'Cardio',
        severity: 'WARNING',
        title: 'HRV (rMSSD) Attenuation & Elevated BP',
        explanation: 'Parasympathetic tone 47.5 ms deviates from 68.0 ms baseline (-1.6 Z). Blood pressure 138/88 mmHg elevated.',
        confidence: 89,
      },
      {
        astronautId: astronautAlex.id,
        timestamp: new Date('2026-09-30T09:10:00Z'),
        domain: 'Mind',
        severity: 'INFO',
        title: 'Reaction Time Latency Shift',
        explanation: 'Psychomotor vigilance response increased from 230ms to 282ms.',
        confidence: 82,
      },
      {
        astronautId: astronautAlex.id,
        timestamp: new Date('2026-09-30T09:30:00Z'),
        domain: 'Environment',
        severity: 'INFO',
        title: 'Cabin CO2 Elevated (2950 ppm)',
        explanation: 'Elevated habitat CO2 level correlates with localized sleep fragmentation and sinus fullness.',
        confidence: 94,
      },
    ],
  });

  console.log('Seeded Mission Day 61 Alerts.');

  // Also seed baseline metrics for Secondary Astronaut (Dr. Maya Lin on Mars Base)
  const mayaMetrics = generateSyntheticMission(120);
  const mayaMetricsData = mayaMetrics.map((item) => ({
    astronautId: astronautMaya.id,
    timestamp: item.timestamp,
    missionDay: item.missionDay,
    heartRate: item.heartRate,
    hrv: item.hrv,
    systolicBP: item.systolicBP,
    diastolicBP: item.diastolicBP,
    bloodGlucose: item.bloodGlucose,
    weightKg: 64.0,
    hydrationScore: 92.0,
    caloriesKcal: 2550.0,
    vitaminDStatusNote: 'OPTIMAL (45 ng/mL)',
    bodyTemp: item.bodyTemp,
    spo2: item.spo2,
    stress: item.stress,
    activity: 82.0,
    exerciseMinutes: 105.0, // Partial gravity 0.38g offset!
    exerciseType: 'MARS_HABITAT_T2_CYCLE',
    sleepHours: item.sleepHours,
    mood: 8.2,
    fatigue: 2.6,
    reactionTimeMs: item.reactionTimeMs,
    voiceCadence: item.voiceCadence,
    cabinCO2ppm: 1650.0,
    cabinTempC: 22.0,
    cabinHumidityPct: 40.0,
    noiseDb: 48.0,
    socialContactMinutes: 140.0,
    dataSource: 'MARS_HAB_BIO_ARRAY',
    isSynthetic: true,
  }));

  await prisma.healthMetric.createMany({
    data: mayaMetricsData,
  });

  await prisma.gamificationProfile.create({
    data: {
      astronautId: astronautMaya.id,
      xp: 3200,
      level: 7,
      currentStreakDays: 32,
      longestStreakDays: 45,
      healthScoreRing: 92,
    },
  });

  console.log(`Seeded 120 days of Mars Base telemetry for Dr. Maya Lin.`);
  console.log('--- ASTRA-LOOP v2 Synthetic Data Seeding Complete ---');
}

if (process.argv[1]?.includes('seed.ts') || process.argv[1]?.includes('seed.js')) {
  seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
