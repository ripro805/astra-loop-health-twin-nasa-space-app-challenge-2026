import { Router } from 'express';
import { KnowledgeController } from '../controllers/knowledge.controller.js';

const router = Router();

router.get('/indicators', KnowledgeController.getIndicators);
router.get('/indicators/:id', KnowledgeController.getIndicatorById);
router.get('/hazards', KnowledgeController.getHazards);
router.get('/hazards/:id', KnowledgeController.getHazardById);
router.get('/reference-stats', KnowledgeController.getReferenceStats);

export default router;
