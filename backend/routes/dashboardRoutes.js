import express from 'express';
import { getAdminDashboard, getResidentDashboard } from '../controllers/dashboardController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import Activity from '../models/Activity.js';

const router = express.Router();
router.use(protect);
router.get('/admin', adminOnly, getAdminDashboard);
router.get('/resident', getResidentDashboard);
router.get('/activities', async (req, res) => {
  const activities = await Activity.find()
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(activities);
});

export default router;
