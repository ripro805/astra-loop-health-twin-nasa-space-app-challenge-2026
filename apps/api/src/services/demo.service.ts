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

  /**
   * Spikes cabin CO2 to test Environmental domain and habitability alert.
   */
  public static async spikeCO2(astronautId: string, ppm = 3400) {
    const astronaut = await prisma.astronaut.findUnique({ where: { id: astronautId } });
    if (!astronaut) throw new Error('Astronaut not found');

    const metric = await prisma.healthMetric.findFirst({
      where: { astronautId, missionDay: astronaut.missionDay },
    });

    if (metric) {
      await prisma.healthMetric.update({
        where: { id: metric.id },
        data: { cabinCO2ppm: ppm },
      });
    }

    await prisma.alert.create({
      data: {
        astronautId,
        timestamp: new Date(),
        domain: 'Environment',
        severity: ppm >= 5000 ? 'CRITICAL' : 'WARNING',
        title: 'Cabin CO2 Hypercapnia Warning',
        explanation: `Life Support System scrubber saturation detected. Cabin CO2 at ${ppm} ppm (threshold: 3000 ppm). Check scrubbers and increase cabin air circulation.`,
        confidence: 98,
      },
    });

    return { message: `Cabin CO2 spiked to ${ppm} ppm. Environmental warning active.` };
  }

  /**
   * Raises blood pressure to simulate acute stress or hypertensive excursion.
   */
  public static async raiseBP(astronautId: string, systolic = 145, diastolic = 92) {
    const astronaut = await prisma.astronaut.findUnique({ where: { id: astronautId } });
    if (!astronaut) throw new Error('Astronaut not found');

    const metric = await prisma.healthMetric.findFirst({
      where: { astronautId, missionDay: astronaut.missionDay },
    });

    if (metric) {
      await prisma.healthMetric.update({
        where: { id: metric.id },
        data: { systolicBP: systolic, diastolicBP: diastolic },
      });
    }

    await prisma.alert.create({
      data: {
        astronautId,
        timestamp: new Date(),
        domain: 'Cardiovascular',
        severity: systolic >= 140 ? 'WARNING' : 'INFO',
        title: 'Elevated Arterial Blood Pressure (Stage 2)',
        explanation: `Systolic ${systolic} / Diastolic ${diastolic} mmHg exceeds AHA/NASA clinical safety limit. Check hydration, sodium intake, and intracranial pressure signs.`,
        confidence: 94,
      },
    });

    return { message: `Blood pressure set to ${systolic}/${diastolic} mmHg. Cardiopulmonary warning logged.` };
  }

  /**
   * Triggers blood glucose excursion (post-prandial spike or metabolic shift).
   */
  public static async triggerGlucoseExcursion(astronautId: string, glucose = 165) {
    const astronaut = await prisma.astronaut.findUnique({ where: { id: astronautId } });
    if (!astronaut) throw new Error('Astronaut not found');

    const metric = await prisma.healthMetric.findFirst({
      where: { astronautId, missionDay: astronaut.missionDay },
    });

    if (metric) {
      await prisma.healthMetric.update({
        where: { id: metric.id },
        data: { bloodGlucose: glucose },
      });
    }

    await prisma.alert.create({
      data: {
        astronautId,
        timestamp: new Date(),
        domain: 'Metabolic',
        severity: glucose > 140 ? 'WARNING' : 'INFO',
        title: 'Postprandial Hyperglycemia Excursion',
        explanation: `Venous glucose at ${glucose} mg/dL (fasting threshold: 100 mg/dL, postprandial: 140 mg/dL). Spaceflight insulin resistance pattern observed.`,
        confidence: 92,
      },
    });

    return { message: `Blood glucose set to ${glucose} mg/dL. Metabolic alert logged.` };
  }

  /**
   * Triggers fever / immune inflammatory signs.
   */
  public static async triggerFeverSigns(astronautId: string, temp = 38.2) {
    const astronaut = await prisma.astronaut.findUnique({ where: { id: astronautId } });
    if (!astronaut) throw new Error('Astronaut not found');

    const metric = await prisma.healthMetric.findFirst({
      where: { astronautId, missionDay: astronaut.missionDay },
    });

    if (metric) {
      await prisma.healthMetric.update({
        where: { id: metric.id },
        data: { bodyTemp: temp },
      });
    }

    await prisma.alert.create({
      data: {
        astronautId,
        timestamp: new Date(),
        domain: 'Immune',
        severity: temp >= 38.0 ? 'WARNING' : 'INFO',
        title: 'Elevated Core Body Temperature (Pyrexia)',
        explanation: `Core temperature at ${temp}°C. Spaceflight-associated immune dysregulation / latent viral reactivation risk indicated.`,
        confidence: 95,
      },
    });

    return { message: `Core body temperature set to ${temp}°C. Immune fever alert triggered.` };
  }

  /**
   * Switches mission operational environment.
   */
  public static async switchEnvironment(astronautId: string, environmentType: string) {
    const astronaut = await prisma.astronaut.findUnique({ where: { id: astronautId } });
    if (!astronaut) throw new Error('Astronaut not found');

    const env = await prisma.environment.findFirst({
      where: { type: environmentType as any },
    });

    if (!env) {
      throw new Error(`Environment '${environmentType}' not found in registry.`);
    }

    await prisma.astronaut.update({
      where: { id: astronautId },
      data: { environmentId: env.id },
    });

    return {
      message: `Astronaut ${astronaut.name} successfully relocated to ${env.name} (${env.type}, ${env.gravityG}g).`,
      environment: env,
    };
  }
}
