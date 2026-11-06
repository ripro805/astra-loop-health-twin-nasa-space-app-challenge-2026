import { Router } from 'express';
import { EscalationController } from '../controllers/escalation.controller.js';

const router = Router();

router.get('/:id/escalation', EscalationController.getEscalationStatus);
router.get('/demo/escalation', EscalationController.getEscalationStatus);
router.post('/events/:id/acknowledge', EscalationController.acknowledgeEvent);

export default router;

