import { Router } from 'express';
import astronautRoutes from './astronaut.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import metricsRoutes from './metrics.routes.js';
import checkinRoutes from './checkin.routes.js';
import radiationRoutes from './radiation.routes.js';
import twinRoutes from './twin.routes.js';
import countermeasuresRoutes from './countermeasures.routes.js';
import whatifRoutes from './whatif.routes.js';
import syncRoutes from './sync.routes.js';
import demoRoutes from './demo.routes.js';
import knowledgeRoutes from './knowledge.routes.js';
import bodyRoutes from './body.routes.js';
import routineRoutes from './routine.routes.js';
import gamificationRoutes from './gamification.routes.js';
import guidanceRoutes from './guidance.routes.js';
import escalationRoutes from './escalation.routes.js';
import environmentRoutes from './environment.routes.js';
import spaceWeatherRoutes from './spaceWeather.routes.js';
import reportRoutes from './report.routes.js';
import imageRoutes from './image.routes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'ASTRA-LOOP Autonomous Health Twin API v2',
    missionTime: new Date().toISOString(),
    isSynthetic: true,
  });
});

// Mounted feature endpoints
router.use('/astronauts', astronautRoutes);
router.use('/astronauts', dashboardRoutes);
router.use('/astronauts', metricsRoutes);
router.use('/astronauts', checkinRoutes);
router.use('/astronauts', radiationRoutes);
router.use('/astronauts', twinRoutes);
router.use('/astronauts', countermeasuresRoutes);
router.use('/countermeasures', countermeasuresRoutes);
router.use('/astronauts', whatifRoutes);
router.use('/sync', syncRoutes);
router.use('/demo', demoRoutes);

// v2 feature endpoints
router.use('/knowledge', knowledgeRoutes);
router.use('/astronauts', bodyRoutes);
router.use('/astronauts', routineRoutes);
router.use('/schedule', routineRoutes);
router.use('/astronauts', gamificationRoutes);
router.use('/guidance', guidanceRoutes);
router.use('/astronauts', escalationRoutes);
router.use('/escalation', escalationRoutes);
router.use('/environments', environmentRoutes);
router.use('/astronauts', environmentRoutes);
router.use('/space-weather', spaceWeatherRoutes);
router.use('/astronauts', reportRoutes);
router.use('/astronauts', imageRoutes);

export default router;
