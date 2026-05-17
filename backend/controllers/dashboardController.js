import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Payment from '../models/Payment.js';
import Notice from '../models/Notice.js';
import Event from '../models/Event.js';
import Visitor from '../models/Visitor.js';
import Flat from '../models/Flat.js';
import SOS from '../models/SOS.js';
import Activity from '../models/Activity.js';
import { updateOverduePayments } from './paymentController.js';

export const getAdminDashboard = async (req, res) => {
  await updateOverduePayments();
  const [
    totalResidents,
    totalComplaints,
    pendingComplaints,
    paymentStats,
    flatStats,
    activeSOS,
    recentActivities,
  ] = await Promise.all([
    User.countDocuments({ role: 'resident' }),
    Complaint.countDocuments(),
    Complaint.countDocuments({ status: { $in: ['Pending', 'In Progress'] } }),
    Payment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          amount: { $sum: '$totalAmount' },
        },
      },
    ]),
    Flat.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    SOS.find({ status: 'Active' }).populate('resident', 'name flatNumber phone'),
    Activity.find().populate('user', 'name').sort({ createdAt: -1 }).limit(10),
  ]);
  const collected = await Payment.aggregate([
    { $match: { status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);
  const complaintAnalytics = await Complaint.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const categoryAnalytics = await Complaint.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const monthlyCollection = await Payment.aggregate([
    { $match: { status: 'Paid' } },
    { $group: { _id: { month: '$month', year: '$year' }, amount: { $sum: '$totalAmount' } } },
  ]);
  res.json({
    totalResidents,
    totalComplaints,
    pendingComplaints,
    totalCollected: collected[0]?.total || 0,
    paymentStats,
    flatStats,
    activeSOS,
    recentActivities,
    complaintAnalytics,
    categoryAnalytics,
    monthlyCollection,
  });
};

export const getResidentDashboard = async (req, res) => {
  await updateOverduePayments();
  const userId = req.user._id;
  const [
    pendingPayments,
    complaints,
    notices,
    events,
    visitors,
    activeSOS,
  ] = await Promise.all([
    Payment.find({ resident: userId, status: { $in: ['Pending', 'Overdue'] } }),
    Complaint.find({ resident: userId }).sort({ createdAt: -1 }).limit(5),
    Notice.find({ priority: { $in: ['Urgent', 'General'] } }).sort({ createdAt: -1 }).limit(5),
    Event.find({ date: { $gte: new Date() } }).sort({ date: 1 }).limit(5),
    Visitor.find({ resident: userId, status: { $in: ['Expected', 'Approved'] } }).limit(5),
    SOS.find({ status: 'Active' }).populate('resident', 'name flatNumber'),
  ]);
  const totalDues = pendingPayments.reduce((s, p) => s + p.totalAmount, 0);
  const activeComplaints = await Complaint.countDocuments({
    resident: userId,
    status: { $ne: 'Resolved' },
  });
  res.json({
    totalDues,
    activeComplaints,
    pendingPayments,
    complaints,
    notices,
    events,
    visitors,
    emergencyAlerts: notices.filter((n) => n.priority === 'Urgent'),
    activeSOS,
  });
};
