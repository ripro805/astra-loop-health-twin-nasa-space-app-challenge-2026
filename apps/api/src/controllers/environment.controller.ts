import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma.js';
import { AstronautService } from '../services/astronaut.service.js';

export class EnvironmentController {
  public static async listEnvironments(req: Request, res: Response, next: NextFunction) {
    try {
      const environments = await prisma.environment.findMany({
        orderBy: { gravityG: 'asc' },
      });
      res.json(environments);
    } catch (err) {
      next(err);
    }
  }

  public static async switchAstronautEnvironment(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (!id || id === 'demo') {
        const primary = await AstronautService.getPrimaryAstronaut();
        id = primary.id;
      }
      const { environmentId, environmentType } = req.body;
      const result = await AstronautService.switchEnvironment(id, environmentId || environmentType);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
