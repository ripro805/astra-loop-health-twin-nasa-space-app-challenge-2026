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

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'ASTRA-LOOP Autonomous Health Twin API',
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

export default router;
