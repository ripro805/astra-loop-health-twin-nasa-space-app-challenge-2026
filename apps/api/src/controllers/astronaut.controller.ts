import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma.js';
import { AstronautService } from '../services/astronaut.service.js';

export class AstronautController {
  public static async listAstronauts(req: Request, res: Response, next: NextFunction) {
    try {
      const astronauts = await prisma.astronaut.findMany({
        orderBy: { createdAt: 'asc' },
      });
      res.json(astronauts);
    } catch (err) {
      next(err);
    }
  }

  public static async getAstronaut(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const astronaut =
        id === 'primary' || id === 'demo'
          ? await AstronautService.getPrimaryAstronaut()
          : await prisma.astronaut.findUnique({ where: { id } });

      if (!astronaut) {
        return res.status(404).json({ error: 'Astronaut not found' });
      }
      res.json(astronaut);
    } catch (err) {
      next(err);
    }
  }
}
