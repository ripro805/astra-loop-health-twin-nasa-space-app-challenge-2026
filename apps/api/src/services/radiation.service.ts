import { prisma } from '../utils/prisma.js';
import { RadiationWatchEngine } from '../engines/radiationWatch.engine.js';
import { RadiationWatchData } from '@astra-loop/shared';

export class RadiationService {
  /**
   * Retrieves radiation events and current status.
   */
  public static async getRadiationEvents(astronautId: string) {
    return prisma.radiationEvent.findMany({
      where: { astronautId },
      orderBy: { missionDay: 'asc' },
    });
  }

  /**
   * Triggers or logs a radiation event (e.g. Solar Particle Event).
   */
  public static async logRadiationEvent(
    astronautId: string,
    data: {
      missionDay: number;
      doseRate: number;
      cumulativeDose: number;
      eventType: string;
      severity: string;
    }
  ) {
    return prisma.radiationEvent.create({
      data: {
        astronautId,
        timestamp: new Date(),
        missionDay: data.missionDay,
        doseRate: data.doseRate,
        cumulativeDose: data.cumulativeDose,
        eventType: data.eventType,
        severity: data.severity,
      },
    });
  }

  /**
   * Evaluates the 72-Hour Radiation Watch Window and temporal overlay.
   */
  public static async getRadiationWatchData(astronautId: string): Promise<RadiationWatchData> {
    const astronaut = await prisma.astronaut.findUnique({
      where: { id: astronautId },
      include: {
        radiationEvents: { orderBy: { missionDay: 'asc' } },
        healthMetrics: { orderBy: { missionDay: 'asc' } },
      },
    });

    if (!astronaut) {
      throw new Error(`Astronaut ${astronautId} not found.`);
    }

    return RadiationWatchEngine.evaluateRadiationWatch(
      astronaut.missionDay,
      astronaut.radiationEvents,
      astronaut.healthMetrics
    );
  }
}
