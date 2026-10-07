import { PrismaClient } from '@prisma/client';
import { generateSyntheticMission } from '../src/utils/seedGenerator.js';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('--- ASTRA-LOOP Synthetic Data Seeding Started ---');

  // Clear existing records
  await prisma.countermeasureOutcome.deleteMany();
  await prisma.countermeasure.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.radiationEvent.deleteMany();
  await prisma.healthMetric.deleteMany();
  await prisma.astronaut.deleteMany();

  // 1. Create Primary Demo Astronaut
  const astronaut = await prisma.astronaut.create({
    data: {
      name: 'CDR Alex Vance',
      missionDay: 61, // Primary judge presentation default
      calibrationDone: true,
    },
  });

  console.log(`Created Demo Astronaut: ${astronaut.name} (${astronaut.id}) on Mission Day ${astronaut.missionDay}`);

  // 2. Generate 90 Synthetic Mission Days
  const syntheticTimeline = generateSyntheticMission(90);

  // Bulk create Health Metrics
  const healthMetricsData = syntheticTimeline.map((item) => ({
    astronautId: astronaut.id,
    timestamp: item.timestamp,
    missionDay: item.missionDay,
    heartRate: item.heartRate,
    hrv: item.hrv,
    sleepHours: item.sleepHours,
    activity: item.activity,
    mood: item.mood,
    fatigue: item.fatigue,
    stress: item.stress,
    reactionTimeMs: item.reactionTimeMs,
    voiceCadence: item.voiceCadence,
    dataSource: 'WEARABLE_BIO_SENSOR_V4',
    isSynthetic: true,
  }));

  await prisma.healthMetric.createMany({
    data: healthMetricsData,
  });
  console.log(`Seeded ${healthMetricsData.length} daily health metrics.`);

  // Bulk create Radiation Events
  const radiationEventsData = syntheticTimeline.map((item) => ({
    astronautId: astronaut.id,
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

  // 3. Create Daily Check-Ins for Mission Days 1 to 61
  const checkInsData = syntheticTimeline
    .filter((item) => item.missionDay <= 61)
    .map((item) => ({
      astronautId: astronaut.id,
      timestamp: item.timestamp,
      missionDay: item.missionDay,
      mood: item.mood,
      fatigue: item.fatigue,
      stress: item.stress,
      reactionTimeMs: item.reactionTimeMs,
      voiceAvailable: item.missionDay !== 58, // simulate day 58 voice sensor missing
      voiceCadence: item.missionDay !== 58 ? item.voiceCadence : null,
      notes:
        item.missionDay === 61
          ? 'SPE alert audible in module 3. Minor sleep fragmentation, alertness nominal.'
          : 'Nominal mission routine maintained.',
    }));

  await prisma.checkIn.createMany({
    data: checkInsData,
  });
  console.log(`Seeded ${checkInsData.length} astronaut daily check-ins.`);

  // 4. Create Historical Countermeasures and Outcomes
  // Historical #1: Circadian Lighting Protocol (Day 35)
  const cm1 = await prisma.countermeasure.create({
    data: {
      astronautId: astronaut.id,
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

  // Historical #2: Structured Recovery Window (Day 21)
  const cm2 = await prisma.countermeasure.create({
    data: {
      astronautId: astronaut.id,
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
  const cm3 = await prisma.countermeasure.create({
    data: {
      astronautId: astronaut.id,
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

  // 5. Create Key Alerts for Mission Day 61
  await prisma.alert.createMany({
    data: [
      {
        astronautId: astronaut.id,
        timestamp: new Date('2026-09-30T04:15:00Z'),
        domain: 'Radiation',
        severity: 'WARNING',
        title: 'Solar Particle Event Detected',
        explanation: 'Simulated dose rate spike to 1.45 mSv/h. 72-Hour Watch Window initiated.',
        confidence: 96,
      },
      {
        astronautId: astronaut.id,
        timestamp: new Date('2026-09-30T07:30:00Z'),
        domain: 'Sleep',
        severity: 'WARNING',
        title: 'Sleep Duration Below Personal Baseline',
        explanation: 'Current sleep 6h 12m vs personal baseline 7h 21m (-1h 09m deviation).',
        confidence: 87,
      },
      {
        astronautId: astronaut.id,
        timestamp: new Date('2026-09-30T08:00:00Z'),
        domain: 'Cardio',
        severity: 'WARNING',
        title: 'HRV (rMSSD) Attenuation',
        explanation: 'Parasympathetic tone 47.5 ms deviates from 68.0 ms baseline (-1.6 Z).',
        confidence: 89,
      },
      {
        astronautId: astronaut.id,
        timestamp: new Date('2026-09-30T09:10:00Z'),
        domain: 'Mind',
        severity: 'INFO',
        title: 'Reaction Time Latency Shift',
        explanation: 'Psychomotor vigilance response increased from 230ms to 282ms.',
        confidence: 82,
      },
    ],
  });

  console.log('Seeded Mission Day 61 Alerts.');
  console.log('--- ASTRA-LOOP Synthetic Data Seeding Complete ---');
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
