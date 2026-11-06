import { Router } from 'express';
import { SpaceWeatherController } from '../controllers/spaceWeather.controller.js';

const router = Router();

router.get('/current', SpaceWeatherController.getCurrent);

export default router;

