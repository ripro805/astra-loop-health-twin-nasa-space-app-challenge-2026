import { Request, Response, NextFunction } from 'express';
import { SpaceWeatherService } from '../services/spaceWeather.service.js';

export class SpaceWeatherController {
  public static async getCurrent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SpaceWeatherService.getCurrentSpaceWeather();
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
}
