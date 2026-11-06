import { Request, Response, NextFunction } from 'express';
import { AstronautService } from '../services/astronaut.service.js';

export class GamificationController {
  public static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (!id || id === 'demo') {
        const primary = await AstronautService.getPrimaryAstronaut();
        id = primary.id;
      }
      const profile = await AstronautService.getGamification(id);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }
}
