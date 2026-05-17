import Complaint from '../models/Complaint.js';
import { logActivity } from '../utils/activityLogger.js';

export const getComplaints = async (req, res) => {
  const filter = {};
  if (req.user.role === 'resident') filter.resident = req.user._id;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  const complaints = await Complaint.find(filter)
    .populate('resident', 'name email flatNumber')
    .populate('assignedStaff', 'name role phone')
    .sort({ createdAt: -1 });
  res.json(complaints);
};

export const getComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('resident', 'name email flatNumber')
    .populate('assignedStaff', 'name role phone');
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
  res.json(complaint);
};

export const createComplaint = async (req, res) => {
  const { title, description, category } = req.body;
  const complaint = await Complaint.create({
    title,
    description,
    category,
    image: req.file ? `/uploads/${req.file.filename}` : '',
    resident: req.user._id,
    flatNumber: req.user.flatNumber,
    timeline: [{ status: 'Pending', note: 'Complaint submitted' }],
  });
  await logActivity('complaint', `New complaint: ${title}`, req.user._id);
  res.status(201).json(complaint);
};

export const updateComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
  if (req.body.status) {
    complaint.status = req.body.status;
    complaint.timeline.push({
      status: req.body.status,
      note: req.body.note || `Status updated to ${req.body.status}`,
    });
  }
  if (req.body.assignedStaff) complaint.assignedStaff = req.body.assignedStaff;
  const updated = await complaint.save();
  await logActivity('complaint', `Complaint updated: ${updated.title}`, req.user._id);
  res.json(updated);
};

export const deleteComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
  await complaint.deleteOne();
  res.json({ message: 'Complaint removed' });
};

export const getComplaintStats = async (req, res) => {
  const total = await Complaint.countDocuments();
  const pending = await Complaint.countDocuments({ status: 'Pending' });
  const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
  const resolved = await Complaint.countDocuments({ status: 'Resolved' });
  const byCategory = await Complaint.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const monthly = await Complaint.aggregate([
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.json({ total, pending, inProgress, resolved, byCategory, monthly });
};
