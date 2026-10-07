import { Router } from 'express';
import { RadiationController } from '../controllers/radiation.controller.js';

const router = Router({ mergeParams: true });

router.get('/:id/radiation', RadiationController.getRadiation);
router.post('/:id/radiation/events', RadiationController.logEvent);
router.get('/:id/radiation/watch', RadiationController.getWatchWindow);

export default router;
