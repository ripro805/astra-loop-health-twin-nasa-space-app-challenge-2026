import { Router } from 'express';
import { DemoController } from '../controllers/demo.controller.js';

const router = Router();

router.post('/reset', DemoController.resetDemo);
router.post('/set-day', DemoController.setMissionDay);
router.post('/advance-day', DemoController.advance24Hours);
router.post('/trigger-radiation', DemoController.triggerRadiation);
router.post('/apply-countermeasure', DemoController.applyCountermeasure);
router.post('/missing-sensor', DemoController.missingSensor);

export default router;
