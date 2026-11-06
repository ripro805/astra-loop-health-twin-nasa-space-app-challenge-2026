import { Router } from 'express';
import { WhatIfController } from '../controllers/whatif.controller.js';

const router = Router({ mergeParams: true });

router.post('/:id/what-if', WhatIfController.simulate);
router.post('/what-if', WhatIfController.simulate);
router.post('/what-if/simulate', WhatIfController.simulate);

export default router;
