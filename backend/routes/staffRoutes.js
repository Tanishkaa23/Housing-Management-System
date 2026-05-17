import express from 'express';
import { getStaff, createStaff, updateStaff, deleteStaff, markAttendance } from '../controllers/staffController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, adminOnly);
router.route('/').get(getStaff).post(createStaff);
router.put('/:id/attendance', markAttendance);
router.route('/:id').put(updateStaff).delete(deleteStaff);

export default router;
