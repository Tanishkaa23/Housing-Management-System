import express from 'express';
import { triggerSOS, getSOSAlerts, resolveSOS } from '../controllers/sosController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.post('/', triggerSOS);
router.get('/', getSOSAlerts);
router.put('/:id/resolve', adminOnly, resolveSOS);

export default router;
