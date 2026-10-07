import { Router } from 'express';
import { SyncController } from '../controllers/sync.controller.js';

const router = Router();

router.post('/', SyncController.processSyncQueue);
router.get('/status', SyncController.getSyncStatus);

export default router;
