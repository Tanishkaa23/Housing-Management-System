import express from 'express';
import { getLostFound, createLostFound, getLostFoundImage, updateLostFound } from '../controllers/lostFoundController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
router.get('/:id/image', getLostFoundImage);
router.use(protect);
router.route('/').get(getLostFound).post(upload.single('image'), createLostFound);
router.put('/:id', upload.single('image'), updateLostFound);

export default router;
