import { Router } from 'express';
import { EnvironmentController } from '../controllers/environment.controller.js';

const router = Router();

router.get('/', EnvironmentController.listEnvironments);
router.post('/:id/environment', EnvironmentController.switchAstronautEnvironment);
router.post('/demo/environment', EnvironmentController.switchAstronautEnvironment);

export default router;

