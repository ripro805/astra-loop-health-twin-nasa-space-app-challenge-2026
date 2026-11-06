import { Request, Response, NextFunction } from 'express';
import { AstronautService } from '../services/astronaut.service.js';

export class ReportController {
  public static async getFlightSurgeonReport(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (!id || id === 'demo') {
        const primary = await AstronautService.getPrimaryAstronaut();
        id = primary.id;
      }
      const report = await AstronautService.exportFlightSurgeonReport(id);
      res.json(report);
    } catch (err) {
      next(err);
    }
  }
}

