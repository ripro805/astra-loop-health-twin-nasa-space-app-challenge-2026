import { Router } from 'express';
import { GuidanceController } from '../controllers/guidance.controller.js';

const router = Router();

router.get('/trees', GuidanceController.getTrees);
router.get('/trees/:id', GuidanceController.getTreeById);
router.post('/trees/:id/resolve', GuidanceController.resolveStep);

export default router;
