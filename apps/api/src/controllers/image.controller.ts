import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma.js';
import { AstronautService } from '../services/astronaut.service.js';

export class ImageController {
  public static async captureImage(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (!id || id === 'demo') {
        const primary = await AstronautService.getPrimaryAstronaut();
        id = primary.id;
      }

      const { type = 'ULTRASOUND', filePath = '', notes = '' } = req.body;

      const image = await prisma.imageCapture.create({
        data: {
          astronautId: id,
          type,
          filePath,
          notes,
          sentToGround: false,
        },
      });

      res.status(201).json({ success: true, image });
    } catch (err) {
      next(err);
    }
  }

  public static async listImages(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (!id || id === 'demo') {
        const primary = await AstronautService.getPrimaryAstronaut();
        id = primary.id;
      }

      const images = await prisma.imageCapture.findMany({
        where: { astronautId: id },
        orderBy: { capturedAt: 'desc' },
      });

      res.json(images);
    } catch (err) {
      next(err);
    }
  }
}

