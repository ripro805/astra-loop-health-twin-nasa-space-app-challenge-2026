import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/health.service.js';
import { AstronautService } from '../services/astronaut.service.js';

export class MetricsController {
  public static async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const astronaut =
        id === 'primary' || id === 'demo'
          ? await AstronautService.getPrimaryAstronaut()
          : { id };

      const metrics = await HealthService.getMetrics(astronaut.id);
      res.json(metrics);
    } catch (err) {
      next(err);
    }
  }

  public static async recordMetric(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const astronaut =
        id === 'primary' || id === 'demo'
          ? await AstronautService.getPrimaryAstronaut()
          : { id };

      const record = await HealthService.recordMetric(astronaut.id, req.body);
      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  }
}
