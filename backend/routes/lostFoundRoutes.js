import express from 'express';
import { getLostFound, createLostFound, updateLostFound } from '../controllers/lostFoundController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.route('/').get(getLostFound).post(createLostFound);
router.put('/:id', updateLostFound);

export default router;
