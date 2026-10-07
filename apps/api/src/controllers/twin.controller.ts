import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/health.service.js';
import { AstronautService } from '../services/astronaut.service.js';

export class TwinController {
  public static async getTwin(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const astronaut =
        id === 'primary' || id === 'demo'
          ? await AstronautService.getPrimaryAstronaut()
          : { id };

      const twin = await HealthService.getTwinAndForecast(astronaut.id);
      res.json(twin);
    } catch (err) {
      next(err);
    }
  }

  public static async getForecast(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const astronaut =
        id === 'primary' || id === 'demo'
          ? await AstronautService.getPrimaryAstronaut()
          : { id };

      const twin = await HealthService.getTwinAndForecast(astronaut.id);
      res.json({
        forecast7Day: twin.forecast7Day,
        forecast30DaySummary: twin.forecast30DaySummary,
      });
    } catch (err) {
      next(err);
    }
  }
}
