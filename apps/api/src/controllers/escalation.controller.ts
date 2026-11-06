import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma.js';
import { AstronautService } from '../services/astronaut.service.js';

export class EscalationController {
  public static async getEscalationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (!id || id === 'demo') {
        const primary = await AstronautService.getPrimaryAstronaut();
        id = primary.id;
      }

      const events = await prisma.escalationEvent.findMany({
        where: { astronautId: id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      const unacknowledged = events.filter((e) => !e.acknowledged);
      const highestTier = unacknowledged.some((e) => e.tier === 'EMERGENCY_AUTONOMOUS')
        ? 'EMERGENCY_AUTONOMOUS'
        : unacknowledged.some((e) => e.tier === 'CONTACT_FLIGHT_SURGEON')
        ? 'CONTACT_FLIGHT_SURGEON'
        : unacknowledged.some((e) => e.tier === 'CREW_MONITOR')
        ? 'CREW_MONITOR'
        : 'SELF_MANAGE';

      res.json({
        astronautId: id,
        highestTier,
        unacknowledgedCount: unacknowledged.length,
        events,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async acknowledgeEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const event = await prisma.escalationEvent.update({
        where: { id },
        data: { acknowledged: true },
      });
      res.json({ success: true, event });
    } catch (err) {
      next(err);
    }
  }
}
