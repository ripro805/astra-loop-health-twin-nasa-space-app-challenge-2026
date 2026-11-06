import { Router } from 'express';
import { GamificationController } from '../controllers/gamification.controller.js';

const router = Router();

router.get('/:id/gamification', GamificationController.getProfile);
router.get('/demo/gamification', GamificationController.getProfile);

export default router;

