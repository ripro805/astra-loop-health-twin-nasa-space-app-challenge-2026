import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';

const router = Router({ mergeParams: true });

router.get('/:id/dashboard', DashboardController.getDashboard);
router.get('/:id/changes', DashboardController.getChanges);

export default router;
