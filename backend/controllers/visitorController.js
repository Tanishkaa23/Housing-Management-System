import Visitor from '../models/Visitor.js';
import { logActivity } from '../utils/activityLogger.js';

export const getVisitors = async (req, res) => {
  const filter = {};
  if (req.user.role === 'resident') filter.resident = req.user._id;
  if (req.query.status) filter.status = req.query.status;
  const visitors = await Visitor.find(filter)
    .populate('resident', 'name flatNumber')
    .sort({ createdAt: -1 });
  res.json(visitors);
};

export const createVisitor = async (req, res) => {
  const visitor = await Visitor.create({
    ...req.body,
    resident: req.user._id,
    flatNumber: req.user.flatNumber || req.body.flatNumber,
  });
  await logActivity('visitor', `Visitor expected: ${visitor.visitorName}`, req.user._id);
  res.status(201).json(visitor);
};

export const updateVisitor = async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
  Object.assign(visitor, req.body);
  if (req.body.status === 'Checked In') visitor.entryTime = new Date();
  if (req.body.status === 'Checked Out') visitor.exitTime = new Date();
  const updated = await visitor.save();
  res.json(updated);
};

export const approveVisitor = async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
  visitor.status = 'Approved';
  visitor.approvedBy = req.user._id;
  const updated = await visitor.save();
  res.json(updated);
};
