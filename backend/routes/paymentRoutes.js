import express from 'express';
import { getPayments, createPayment, markPaid, getPaymentStats } from '../controllers/paymentController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.get('/stats', adminOnly, getPaymentStats);
router.route('/').get(getPayments).post(adminOnly, createPayment);
router.put('/:id/pay', adminOnly, markPaid);

export default router;
