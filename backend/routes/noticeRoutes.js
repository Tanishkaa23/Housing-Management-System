import express from 'express';
import { getNotices, createNotice, updateNotice, deleteNotice } from '../controllers/noticeController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.route('/').get(getNotices).post(adminOnly, createNotice);
router.route('/:id').put(adminOnly, updateNotice).delete(adminOnly, deleteNotice);

export default router;
