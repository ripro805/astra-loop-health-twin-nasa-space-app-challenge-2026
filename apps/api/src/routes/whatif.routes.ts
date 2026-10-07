import { Router } from 'express';
import { WhatIfController } from '../controllers/whatif.controller.js';

const router = Router({ mergeParams: true });

router.post('/:id/what-if', WhatIfController.simulate);

export default router;
