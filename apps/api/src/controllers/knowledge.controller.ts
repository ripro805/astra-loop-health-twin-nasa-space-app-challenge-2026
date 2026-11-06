import { Request, Response, NextFunction } from 'express';
import {
  INDICATOR_CATALOG,
  IndicatorDefinition,
  HRP_HAZARDS,
  HRPHazardInfo,
  SPACEFLIGHT_REFERENCE_STATS,
} from '@astra-loop/shared';

export class KnowledgeController {
  public static async getIndicators(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        total: INDICATOR_CATALOG.length,
        indicators: INDICATOR_CATALOG,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getIndicatorById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const indicator = INDICATOR_CATALOG.find((ind: IndicatorDefinition) => ind.id === id);
      if (!indicator) {
        return res.status(404).json({ error: `Indicator '${id}' not found in knowledge base.` });
      }
      res.json(indicator);
    } catch (err) {
      next(err);
    }
  }

  public static async getHazards(req: Request, res: Response, next: NextFunction) {
    try {
      const hazardsList: HRPHazardInfo[] = Object.values(HRP_HAZARDS);
      res.json({
        total: hazardsList.length,
        hazards: hazardsList,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getHazardById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const hazardsList: HRPHazardInfo[] = Object.values(HRP_HAZARDS);
      const hazard = hazardsList.find((h: HRPHazardInfo) => h.id === id);
      if (!hazard) {
        return res.status(404).json({ error: `Hazard '${id}' not found.` });
      }
      res.json(hazard);
    } catch (err) {
      next(err);
    }
  }

  public static async getReferenceStats(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        stats: SPACEFLIGHT_REFERENCE_STATS,
      });
    } catch (err) {
      next(err);
    }
  }
}
