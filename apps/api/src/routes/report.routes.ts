import { Router } from 'express';
import { ReportController } from '../controllers/report.controller.js';

const router = Router();

router.get('/:id/export/flight-surgeon-report', ReportController.getFlightSurgeonReport);
router.get('/demo/export/flight-surgeon-report', ReportController.getFlightSurgeonReport);

export default router;
