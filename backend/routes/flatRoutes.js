import express from 'express';
import { getFlats, createFlat, updateFlat, getFlatStats } from '../controllers/flatController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, adminOnly);
router.get('/stats', getFlatStats);
router.route('/').get(getFlats).post(createFlat);
router.put('/:id', updateFlat);

export default router;
