import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Notice from '../models/Notice.js';
import Event from '../models/Event.js';
import Flat from '../models/Flat.js';
import Activity from '../models/Activity.js';

export const getAdminDashboard = async (req, res) => {
  const [
    totalResidents,
    totalComplaints,
    pendingComplaints,
    flatStats,
    recentActivities,
  ] = await Promise.all([
    User.countDocuments({ role: 'resident' }),
    Complaint.countDocuments(),
    Complaint.countDocuments({ status: { $in: ['Pending', 'In Progress'] } }),
    Flat.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Activity.find().populate('user', 'name').sort({ createdAt: -1 }).limit(10),
  ]);
  const complaintAnalytics = await Complaint.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const categoryAnalytics = await Complaint.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  res.json({
    totalResidents,
    totalComplaints,
    pendingComplaints,
    flatStats,
    totalCollected: 0,
    paymentStats: [],
    activeSOS: [],
    recentActivities,
    complaintAnalytics,
    categoryAnalytics,
    monthlyCollection: [],
  });
};

export const getResidentDashboard = async (req, res) => {
  const userId = req.user._id;
  const [
    complaints,
    notices,
    events,
  ] = await Promise.all([
    Complaint.find({ resident: userId }).sort({ createdAt: -1 }).limit(5),
    Notice.find({ priority: { $in: ['Urgent', 'General'] } }).sort({ createdAt: -1 }).limit(5),
    Event.find({ date: { $gte: new Date() } }).sort({ date: 1 }).limit(5),
  ]);
  const activeComplaints = await Complaint.countDocuments({
    resident: userId,
    status: { $ne: 'Resolved' },
  });
  res.json({
    totalDues: 0,
    activeComplaints,
    pendingPayments: [],
    complaints,
    notices,
    events,
    visitors: [],
    emergencyAlerts: notices.filter((n) => n.priority === 'Urgent'),
    activeSOS: [],
  });
};
