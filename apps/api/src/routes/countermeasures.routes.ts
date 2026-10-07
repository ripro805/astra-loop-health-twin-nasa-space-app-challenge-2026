import { Router } from 'express';
import { CountermeasuresController } from '../controllers/countermeasures.controller.js';

const router = Router({ mergeParams: true });

router.get('/:id/countermeasures', CountermeasuresController.listCountermeasures);
router.post('/:id/countermeasures', CountermeasuresController.startCountermeasure);
router.post('/evaluate/:id', CountermeasuresController.evaluateCountermeasure);

export default router;
