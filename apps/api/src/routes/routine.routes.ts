import { Router } from 'express';
import { RoutineController } from '../controllers/routine.controller.js';

const router = Router();

router.get('/:id/schedule', RoutineController.getSchedule);
router.get('/demo/schedule', RoutineController.getSchedule);
router.post('/tasks/:id/complete', RoutineController.completeTask);
router.post('/:id/schedule/task', RoutineController.createTask);

export default router;
