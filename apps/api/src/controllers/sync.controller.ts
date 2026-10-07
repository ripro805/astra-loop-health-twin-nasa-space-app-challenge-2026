import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/health.service.js';
import { CountermeasureService } from '../services/countermeasure.service.js';
import { AstronautService } from '../services/astronaut.service.js';

export class SyncController {
  public static async processSyncQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const { items } = req.body; // Array of queued actions from IndexedDB
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Expected array of queue items' });
      }

      const astronaut = await AstronautService.getPrimaryAstronaut();
      let processedCount = 0;

      for (const item of items) {
        if (item.type === 'CHECK_IN') {
          await HealthService.submitCheckIn(astronaut.id, item.payload);
          processedCount++;
        } else if (item.type === 'COUNTERMEASURE_START') {
          await CountermeasureService.startCountermeasure(astronaut.id, item.payload);
          processedCount++;
        }
      }

      res.json({
        success: true,
        processedCount,
        syncedAt: new Date().toISOString(),
        message: `${processedCount} records synchronized successfully with spacecraft local server.`,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getSyncStatus(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        isOnline: true,
        earthCommunicationDelayMinutes: 14.3,
        lastGroundSyncTime: '2026-10-05T12:00:00Z',
        localDatabaseStatus: 'OPERATIONAL',
        pendingSyncItemsCount: 0,
        syncProtocol: 'DELAY_TOLERANT_NETWORKING_DTN',
      });
    } catch (err) {
      next(err);
    }
  }
}
