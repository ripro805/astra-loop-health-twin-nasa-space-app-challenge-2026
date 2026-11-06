import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/health.service.js';
import { CountermeasureService } from '../services/countermeasure.service.js';
import { AstronautService } from '../services/astronaut.service.js';
import { prisma } from '../utils/prisma.js';

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
        if (item.type === 'CHECK_IN' || item.type === 'CHECK_IN_V2') {
          await HealthService.submitCheckIn(astronaut.id, item.payload);
          processedCount++;
        } else if (item.type === 'COUNTERMEASURE_START') {
          await CountermeasureService.startCountermeasure(astronaut.id, item.payload);
          processedCount++;
        } else if (item.type === 'ROUTINE_TASK_COMPLETE') {
          await AstronautService.completeRoutineTask(item.payload.taskId, item.payload.notes);
          processedCount++;
        } else if (item.type === 'IMAGE_CAPTURE') {
          await prisma.imageCapture.create({
            data: {
              astronautId: astronaut.id,
              type: item.payload.type || 'OTHER',
              filePath: item.payload.filePath || item.payload.dataUrl || '',
              notes: item.payload.notes || 'Captured offline via DTN queue',
              sentToGround: false,
            },
          });
          processedCount++;
        } else if (item.type === 'ESCALATION_ACK') {
          if (item.payload?.eventId) {
            await prisma.escalationEvent.update({
              where: { id: item.payload.eventId },
              data: { acknowledged: true },
            });
            processedCount++;
          }
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
      const astronaut = await AstronautService.getPrimaryAstronaut();
      const delay = (astronaut as any).environment?.commsDelayMinutes ?? 14.3;

      res.json({
        isOnline: true,
        earthCommunicationDelayMinutes: delay,
        lastGroundSyncTime: new Date(Date.now() - delay * 60000).toISOString(),
        localDatabaseStatus: 'OPERATIONAL',
        pendingSyncItemsCount: 0,
        syncProtocol: 'DELAY_TOLERANT_NETWORKING_DTN',
      });
    } catch (err) {
      next(err);
    }
  }
}
