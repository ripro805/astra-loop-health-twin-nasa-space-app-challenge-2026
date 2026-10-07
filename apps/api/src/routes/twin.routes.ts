import { Router } from 'express';
import { TwinController } from '../controllers/twin.controller.js';

const router = Router({ mergeParams: true });

router.get('/:id/twin', TwinController.getTwin);
router.get('/:id/forecast', TwinController.getForecast);

export default router;
