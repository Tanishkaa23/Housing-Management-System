import express from 'express';
import {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  getComplaintStats,
  getComplaintImage,
} from '../controllers/complaintController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
router.get('/:id/image', getComplaintImage);
router.use(protect);
router.get('/stats', adminOnly, getComplaintStats);
router.route('/').get(getComplaints).post(upload.single('image'), createComplaint);
router.route('/:id').get(getComplaint).put(upload.single('image'), updateComplaint).delete(adminOnly, deleteComplaint);

export default router;
