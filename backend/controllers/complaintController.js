import Complaint from '../models/Complaint.js';
import Staff from '../models/Staff.js';
import { logActivity } from '../utils/activityLogger.js';

const categoryToRole = {
  Water: 'Plumber',
  Electricity: 'Electrician',
  Cleaning: 'Cleaner',
  Security: 'Security',
  Internet: 'Other',
  'Lift Issue': 'Electrician',
};

export const getComplaints = async (req, res) => {
  const filter = {};
  if (req.user.role === 'resident') filter.resident = req.user._id;
  
  if (req.user.role === 'staff') {
    const staffProfile = await Staff.findOne({ user: req.user._id });
    if (staffProfile) {
      filter.assignedStaff = staffProfile._id;
    } else {
      filter.assignedStaff = null;
    }
  }

  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  const complaints = await Complaint.find(filter)
    .select('-imageData')
    .populate('resident', 'name email flatNumber')
    .populate('assignedStaff', 'name role phone')
    .sort({ createdAt: -1 });
  res.json(complaints);
};

export const getComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .select('-imageData')
    .populate('resident', 'name email flatNumber')
    .populate('assignedStaff', 'name role phone');
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
  res.json(complaint);
};

export const getComplaintImage = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).select('imageData imageContentType');
  if (!complaint?.imageData) return res.status(404).json({ message: 'Image not found' });

  res.set('Content-Type', complaint.imageContentType || 'application/octet-stream');
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(complaint.imageData);
};

export const createComplaint = async (req, res) => {
  const { title, description, category } = req.body;

  const targetRole = categoryToRole[category] || 'Other';
  const availableStaff = await Staff.findOne({ role: targetRole, isAvailable: true });

  const timeline = [{ status: 'Pending', note: 'Complaint submitted' }];
  let assignedStaffId = undefined;

  if (availableStaff) {
    assignedStaffId = availableStaff._id;
    timeline.push({
      status: 'Pending',
      note: `Automatically assigned to ${availableStaff.name} (${availableStaff.role})`
    });
  } else {
    timeline.push({
      status: 'Pending',
      note: `No available staff found for ${category}. Pending manual assignment.`
    });
  }

  const complaint = await Complaint.create({
    title,
    description,
    category,
    image: '',
    imageData: req.file?.buffer,
    imageContentType: req.file?.mimetype || '',
    resident: req.user._id,
    flatNumber: req.user.flatNumber,
    assignedStaff: assignedStaffId,
    timeline,
  });

  if (req.file) {
    complaint.image = `/api/complaints/${complaint._id}/image`;
    await complaint.save();
  }

  await logActivity('complaint', `New complaint: ${title}`, req.user._id);
  res.status(201).json(complaint);
};

export const updateComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

  const isOwner = complaint.resident.toString() === req.user._id.toString();
  const canManage = req.user.role === 'admin' || req.user.role === 'staff';

  if (!isOwner && !canManage) {
    return res.status(403).json({ message: 'Not authorized to update this complaint' });
  }

  if (isOwner || req.user.role === 'admin') {
    if (req.body.title) complaint.title = req.body.title;
    if (req.body.description) complaint.description = req.body.description;
    if (req.body.category) complaint.category = req.body.category;
    if (req.file) {
      complaint.image = `/api/complaints/${complaint._id}/image`;
      complaint.imageData = req.file.buffer;
      complaint.imageContentType = req.file.mimetype;
    }
  }

  if (req.body.status) {
    if (!canManage) {
      return res.status(403).json({ message: 'Only staff or admin can update complaint status' });
    }
    complaint.status = req.body.status;
    complaint.timeline.push({
      status: req.body.status,
      note: req.body.note || `Status updated to ${req.body.status}`,
    });
  }
  if (req.body.assignedStaff) {
    if (!canManage) {
      return res.status(403).json({ message: 'Only staff or admin can assign staff' });
    }
    complaint.assignedStaff = req.body.assignedStaff;
  }
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
