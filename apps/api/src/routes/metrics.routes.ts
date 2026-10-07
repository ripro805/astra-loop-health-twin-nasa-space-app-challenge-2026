import { Router } from 'express';
import { MetricsController } from '../controllers/metrics.controller.js';

const router = Router({ mergeParams: true });

router.get('/:id/metrics', MetricsController.getMetrics);
router.post('/:id/metrics', MetricsController.recordMetric);

export default router;
