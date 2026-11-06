import { Request, Response, NextFunction } from 'express';
import { AstronautService } from '../services/astronaut.service.js';
import { prisma } from '../utils/prisma.js';

export class RoutineController {
  public static async getSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (!id || id === 'demo') {
        const primary = await AstronautService.getPrimaryAstronaut();
        id = primary.id;
      }
      const schedule = await AstronautService.getRoutineSchedule(id);
      res.json(schedule);
    } catch (err) {
      next(err);
    }
  }

  public static async completeTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: taskId } = req.params;
      const { notes } = req.body;
      const result = await AstronautService.completeRoutineTask(taskId, notes);
      res.json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (!id || id === 'demo') {
        const primary = await AstronautService.getPrimaryAstronaut();
        id = primary.id;
      }
      const { title, indicatorKey, timeOfDay = 'MORNING', dueTime = '08:00', missionDay } = req.body;
      const astronaut = await prisma.astronaut.findUnique({ where: { id } });
      if (!astronaut) {
        return res.status(404).json({ error: 'Astronaut not found' });
      }

      const task = await prisma.measurementTask.create({
        data: {
          astronautId: id,
          title: title || `Daily ${indicatorKey} measurement`,
          indicatorKey: indicatorKey || 'vitals',
          timeOfDay,
          dueTime,
          missionDay: missionDay || astronaut.missionDay,
          completed: false,
        },
      });

      res.status(201).json({ success: true, task });
    } catch (err) {
      next(err);
    }
  }
}
