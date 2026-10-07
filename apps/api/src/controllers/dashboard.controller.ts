import { Request, Response, NextFunction } from 'express';
import { AstronautService } from '../services/astronaut.service.js';

export class DashboardController {
  public static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const astronaut =
        id === 'primary' || id === 'demo'
          ? await AstronautService.getPrimaryAstronaut()
          : { id };

      const dashboard = await AstronautService.getDashboardData(astronaut.id);
      res.json(dashboard);
    } catch (err) {
      next(err);
    }
  }

  public static async getChanges(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const astronaut =
        id === 'primary' || id === 'demo'
          ? await AstronautService.getPrimaryAstronaut()
          : { id };

      const dashboard = await AstronautService.getDashboardData(astronaut.id);
      res.json({
        missionDay: dashboard.missionDay,
        recentChanges: dashboard.recentChanges,
        riskContributions: dashboard.riskContributions,
        overallStatus: dashboard.overallStatus,
        simulatedRiskScore: dashboard.simulatedRiskScore,
        confidence: dashboard.confidence,
      });
    } catch (err) {
      next(err);
    }
  }
}
