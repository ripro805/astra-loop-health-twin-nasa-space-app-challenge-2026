import { Request, Response, NextFunction } from 'express';
import { RadiationService } from '../services/radiation.service.js';
import { AstronautService } from '../services/astronaut.service.js';

export class RadiationController {
  public static async getRadiation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const astronaut =
        id === 'primary' || id === 'demo'
          ? await AstronautService.getPrimaryAstronaut()
          : { id };

      const events = await RadiationService.getRadiationEvents(astronaut.id);
      res.json(events);
    } catch (err) {
      next(err);
    }
  }

  public static async logEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const astronaut =
        id === 'primary' || id === 'demo'
          ? await AstronautService.getPrimaryAstronaut()
          : { id };

      const event = await RadiationService.logRadiationEvent(astronaut.id, req.body);
      res.status(201).json(event);
    } catch (err) {
      next(err);
    }
  }

  public static async getWatchWindow(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const astronaut =
        id === 'primary' || id === 'demo'
          ? await AstronautService.getPrimaryAstronaut()
          : { id };

      const watchData = await RadiationService.getRadiationWatchData(astronaut.id);
      res.json(watchData);
    } catch (err) {
      next(err);
    }
  }
}
