import { Request, Response, NextFunction } from 'express';
import { CountermeasureService } from '../services/countermeasure.service.js';
import { AstronautService } from '../services/astronaut.service.js';

export class CountermeasuresController {
  public static async listCountermeasures(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const astronaut =
        id === 'primary' || id === 'demo'
          ? await AstronautService.getPrimaryAstronaut()
          : { id };

      const countermeasures = await CountermeasureService.getCountermeasures(astronaut.id);
      const suggestions = await CountermeasureService.getAvailableSuggestions(astronaut.id);
      const ranking = await CountermeasureService.getPersonalizedRanking(astronaut.id);

      res.json({
        countermeasures,
        suggestions,
        ranking,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async startCountermeasure(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const astronaut =
        id === 'primary' || id === 'demo'
          ? await AstronautService.getPrimaryAstronaut()
          : { id };

      const cm = await CountermeasureService.startCountermeasure(astronaut.id, req.body);
      res.status(201).json(cm);
    } catch (err) {
      next(err);
    }
  }

  public static async evaluateCountermeasure(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // countermeasureId
      const outcome = await CountermeasureService.evaluateCountermeasure(id);
      res.json(outcome);
    } catch (err) {
      next(err);
    }
  }
}
