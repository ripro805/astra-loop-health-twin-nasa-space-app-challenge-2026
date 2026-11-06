import { Router } from 'express';
import { BodyController } from '../controllers/body.controller.js';

const router = Router();

router.get('/:id/body', BodyController.getBodyStatus);
router.get('/demo/body', BodyController.getBodyStatus);

export default router;
