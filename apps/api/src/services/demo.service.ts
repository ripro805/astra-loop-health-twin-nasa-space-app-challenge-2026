import { prisma } from '../utils/prisma.js';
import { seedDatabase } from '../../prisma/seed.js';

export class DemoService {
  /**
   * Resets demo to canonical Mission Day 61 storyline.
   */
  public static async resetDemo() {
    await seedDatabase();
    const astronaut = await prisma.astronaut.findFirst({ orderBy: { createdAt: 'asc' } });
    return astronaut;
  }

  /**
   * Sets current mission day for the demo astronaut.
   */
  public static async setMissionDay(astronautId: string, missionDay: number) {
    return prisma.astronaut.update({
      where: { id: astronautId },
      data: { missionDay },
    });
  }

  /**
   * Advances mission by 24 hours (1 mission day).
   */
  public static async advance24Hours(astronautId: string) {
    const astronaut = await prisma.astronaut.findUnique({ where: { id: astronautId } });
    if (!astronaut) throw new Error('Astronaut not found');
    const newDay = Math.min(90, astronaut.missionDay + 1);
    return prisma.astronaut.update({
      where: { id: astronautId },
      data: { missionDay: newDay },
    });
  }

  /**
   * Triggers an immediate Solar Particle Event (SPE) radiation spike.
   */
  public static async triggerRadiationEvent(astronautId: string, doseRate = 1.45) {
    const astronaut = await prisma.astronaut.findUnique({ where: { id: astronautId } });
    if (!astronaut) throw new Error('Astronaut not found');

    const latestEvent = await prisma.radiationEvent.findFirst({
      where: { astronautId },
      orderBy: { missionDay: 'desc' },
    });
    const cumulativeDose = (latestEvent?.cumulativeDose ?? 18.0) + (doseRate * 24) / 1000;

    const event = await prisma.radiationEvent.create({
      data: {
        astronautId,
        timestamp: new Date(),
        missionDay: astronaut.missionDay,
        doseRate,
        cumulativeDose,
        eventType: 'SOLAR_PARTICLE_EVENT',
        severity: 'ELEVATED',
      },
    });

    // Create high-visibility alert
    await prisma.alert.create({
      data: {
        astronautId,
        timestamp: new Date(),
        domain: 'Radiation',
        severity: 'WARNING',
        title: 'Solar Particle Event (SPE) In Progress',
        explanation: `Simulated dosimeter reads ${doseRate.toFixed(2)} mSv/h. Initiating 72-hour observation window.`,
        confidence: 96,
      },
    });

    return event;
  }

  /**
   * Simulates a missing sensor to test Blind-Spot-Aware sensor fusion.
   */
  public static async simulateMissingSensor(
    astronautId: string,
    sensor: 'cardio' | 'voice' | 'sleep' | 'activity'
  ) {
    const astronaut = await prisma.astronaut.findUnique({ where: { id: astronautId } });
    if (!astronaut) throw new Error('Astronaut not found');

    const metric = await prisma.healthMetric.findFirst({
      where: { astronautId, missionDay: astronaut.missionDay },
    });

    if (metric) {
      const updateData: any = {};
      if (sensor === 'cardio') {
        updateData.hrv = null;
        updateData.heartRate = null;
      } else if (sensor === 'voice') {
        updateData.voiceCadence = null;
      } else if (sensor === 'sleep') {
        updateData.sleepHours = null;
      } else if (sensor === 'activity') {
        updateData.activity = null;
      }

      await prisma.healthMetric.update({
        where: { id: metric.id },
        data: updateData,
      });
    }

    return {
      message: `Sensor '${sensor}' telemetry successfully suppressed for Mission Day ${astronaut.missionDay}. Blind-Spot-Aware Fusion engaged.`,
    };
  }
}
