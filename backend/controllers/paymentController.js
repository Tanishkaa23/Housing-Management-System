import Payment from '../models/Payment.js';
import { logActivity } from '../utils/activityLogger.js';

const LATE_FEE_PERCENT = 5;

const calcLateFee = (amount, dueDate) => {
  if (new Date() <= new Date(dueDate)) return 0;
  return Math.round(amount * (LATE_FEE_PERCENT / 100));
};

export const getPayments = async (req, res) => {
  const filter = {};
  if (req.user.role === 'resident') filter.resident = req.user._id;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { flatNumber: { $regex: req.query.search, $options: 'i' } },
      { month: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  const payments = await Payment.find(filter)
    .populate('resident', 'name email flatNumber')
    .sort({ createdAt: -1 });
  res.json(payments);
};

export const createPayment = async (req, res) => {
  const fine = calcLateFee(req.body.amount, req.body.dueDate);
  const totalAmount = req.body.amount + fine;
  const payment = await Payment.create({
    ...req.body,
    fine,
    totalAmount,
    status: req.body.status || 'Pending',
  });
  res.status(201).json(payment);
};

export const markPaid = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  payment.status = 'Paid';
  payment.paidDate = new Date();
  payment.paymentMode = req.body.paymentMode || 'UPI';
  payment.receiptNumber = `RCP-${Date.now()}`;
  const updated = await payment.save();
  await logActivity('payment', `Payment received: ${payment.flatNumber}`, req.user._id);
  res.json(updated);
};

export const getPaymentStats = async (req, res) => {
  const total = await Payment.countDocuments();
  const paid = await Payment.countDocuments({ status: 'Paid' });
  const pending = await Payment.countDocuments({ status: 'Pending' });
  const overdue = await Payment.countDocuments({ status: 'Overdue' });
  const collected = await Payment.aggregate([
    { $match: { status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);
  const monthly = await Payment.aggregate([
    { $match: { status: 'Paid' } },
    {
      $group: {
        _id: { month: '$month', year: '$year' },
        amount: { $sum: '$totalAmount' },
        count: { $sum: 1 },
      },
    },
  ]);
  res.json({
    total,
    paid,
    pending,
    overdue,
    totalCollected: collected[0]?.total || 0,
    monthly,
  });
};

export const updateOverduePayments = async () => {
  const pending = await Payment.find({ status: 'Pending', dueDate: { $lt: new Date() } });
  for (const p of pending) {
    p.status = 'Overdue';
    p.fine = calcLateFee(p.amount, p.dueDate);
    p.totalAmount = p.amount + p.fine;
    await p.save();
  }
};
