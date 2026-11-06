import { Router } from 'express';
import { ImageController } from '../controllers/image.controller.js';

const router = Router();

router.post('/:id/images', ImageController.captureImage);
router.post('/demo/images', ImageController.captureImage);
router.get('/:id/images', ImageController.listImages);
router.get('/demo/images', ImageController.listImages);

export default router;

