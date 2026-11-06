import { Request, Response, NextFunction } from 'express';
import { DemoService } from '../services/demo.service.js';
import { AstronautService } from '../services/astronaut.service.js';
import { CountermeasureService } from '../services/countermeasure.service.js';

export class DemoController {
  public static async resetDemo(req: Request, res: Response, next: NextFunction) {
    try {
      const astronaut = await DemoService.resetDemo();
      res.json({ success: true, message: 'Demo environment reset to Mission Day 61 baseline.', astronaut });
    } catch (err) {
      next(err);
    }
  }

  public static async setMissionDay(req: Request, res: Response, next: NextFunction) {
    try {
      const { missionDay } = req.body;
      const astronaut = await AstronautService.getPrimaryAstronaut();
      const updated = await DemoService.setMissionDay(astronaut.id, Number(missionDay));
      res.json({ success: true, missionDay: updated.missionDay });
    } catch (err) {
      next(err);
    }
  }

  public static async advance24Hours(req: Request, res: Response, next: NextFunction) {
    try {
      const astronaut = await AstronautService.getPrimaryAstronaut();
      const updated = await DemoService.advance24Hours(astronaut.id);
      res.json({ success: true, missionDay: updated.missionDay });
    } catch (err) {
      next(err);
    }
  }

  public static async triggerRadiation(req: Request, res: Response, next: NextFunction) {
    try {
      const { doseRate = 1.45 } = req.body;
      const astronaut = await AstronautService.getPrimaryAstronaut();
      const event = await DemoService.triggerRadiationEvent(astronaut.id, Number(doseRate));
      res.json({ success: true, event });
    } catch (err) {
      next(err);
    }
  }

  public static async applyCountermeasure(req: Request, res: Response, next: NextFunction) {
    try {
      const { type = 'SLEEP_PHASE_ADJUSTMENT' } = req.body;
      const astronaut = await AstronautService.getPrimaryAstronaut();
      const cm = await CountermeasureService.startCountermeasure(astronaut.id, {
        type,
        recommendation: 'Advance sleep schedule by 30 minutes; ambient blue-light attenuation 45m prior to sleep onset.',
        reason: 'Acute sleep deficit and circadian delay detected following SPE event.',
      });
      res.json({ success: true, countermeasure: cm });
    } catch (err) {
      next(err);
    }
  }

  public static async missingSensor(req: Request, res: Response, next: NextFunction) {
    try {
      const { sensor = 'cardio' } = req.body;
      const astronaut = await AstronautService.getPrimaryAstronaut();
      const result = await DemoService.simulateMissingSensor(astronaut.id, sensor);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  public static async spikeCO2(req: Request, res: Response, next: NextFunction) {
    try {
      const { ppm = 3400 } = req.body;
      const astronaut = await AstronautService.getPrimaryAstronaut();
      const result = await DemoService.spikeCO2(astronaut.id, Number(ppm));
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  public static async raiseBP(req: Request, res: Response, next: NextFunction) {
    try {
      const { systolic = 145, diastolic = 92 } = req.body;
      const astronaut = await AstronautService.getPrimaryAstronaut();
      const result = await DemoService.raiseBP(astronaut.id, Number(systolic), Number(diastolic));
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  public static async triggerGlucoseExcursion(req: Request, res: Response, next: NextFunction) {
    try {
      const { glucose = 165 } = req.body;
      const astronaut = await AstronautService.getPrimaryAstronaut();
      const result = await DemoService.triggerGlucoseExcursion(astronaut.id, Number(glucose));
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  public static async triggerFeverSigns(req: Request, res: Response, next: NextFunction) {
    try {
      const { temp = 38.2 } = req.body;
      const astronaut = await AstronautService.getPrimaryAstronaut();
      const result = await DemoService.triggerFeverSigns(astronaut.id, Number(temp));
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  public static async switchEnvironment(req: Request, res: Response, next: NextFunction) {
    try {
      const { environmentType } = req.body;
      const astronaut = await AstronautService.getPrimaryAstronaut();
      const result = await DemoService.switchEnvironment(astronaut.id, environmentType);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}
