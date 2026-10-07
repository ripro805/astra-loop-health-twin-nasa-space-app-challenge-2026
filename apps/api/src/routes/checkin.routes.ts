import { Router } from 'express';
import { CheckInController } from '../controllers/checkin.controller.js';

const router = Router({ mergeParams: true });

router.post('/:id/check-ins', CheckInController.submitCheckIn);
router.get('/:id/check-ins', CheckInController.getCheckIns);

export default router;
