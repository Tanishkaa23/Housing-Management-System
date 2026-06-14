import express from 'express';
import {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  getComplaintStats,
} from '../controllers/complaintController.js';
import { protect, adminOnly, staffOrAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
router.use(protect);
router.get('/stats', adminOnly, getComplaintStats);
router.route('/').get(getComplaints).post(upload.single('image'), createComplaint);
router.route('/:id').get(getComplaint).put(staffOrAdmin, updateComplaint).delete(adminOnly, deleteComplaint);

export default router;
