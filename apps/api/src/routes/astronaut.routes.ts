import { Router } from 'express';
import { AstronautController } from '../controllers/astronaut.controller.js';

const router = Router();

router.get('/', AstronautController.listAstronauts);
router.get('/:id', AstronautController.getAstronaut);

export default router;
