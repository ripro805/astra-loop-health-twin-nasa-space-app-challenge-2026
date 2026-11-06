import { Request, Response, NextFunction } from 'express';
import { AstronautService } from '../services/astronaut.service.js';

export class BodyController {
  public static async getBodyStatus(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (!id || id === 'demo') {
        const primary = await AstronautService.getPrimaryAstronaut();
        id = primary.id;
      }
      const systems = await AstronautService.getBodyStatus(id);
      res.json({
        astronautId: id,
        timestamp: new Date().toISOString(),
        systems,
      });
    } catch (err) {
      next(err);
    }
  }
}

