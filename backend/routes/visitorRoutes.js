import express from 'express';
import { getVisitors, createVisitor, updateVisitor, approveVisitor } from '../controllers/visitorController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.route('/').get(getVisitors).post(createVisitor);
router.put('/:id/approve', approveVisitor);
router.put('/:id', updateVisitor);

export default router;
