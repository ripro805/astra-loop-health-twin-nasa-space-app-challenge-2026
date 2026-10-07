import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/health.service.js';
import { AstronautService } from '../services/astronaut.service.js';
import { prisma } from '../utils/prisma.js';

export class CheckInController {
  public static async submitCheckIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const astronaut =
        id === 'primary' || id === 'demo'
          ? await AstronautService.getPrimaryAstronaut()
          : { id };

      const checkIn = await HealthService.submitCheckIn(astronaut.id, req.body);
      res.status(201).json(checkIn);
    } catch (err) {
      next(err);
    }
  }

  public static async getCheckIns(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const astronaut =
        id === 'primary' || id === 'demo'
          ? await AstronautService.getPrimaryAstronaut()
          : { id };

      const checkIns = await prisma.checkIn.findMany({
        where: { astronautId: astronaut.id },
        orderBy: { missionDay: 'desc' },
      });
      res.json(checkIns);
    } catch (err) {
      next(err);
    }
  }
}
