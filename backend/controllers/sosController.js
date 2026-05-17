import SOS from '../models/SOS.js';
import { logActivity } from '../utils/activityLogger.js';

export const triggerSOS = async (req, res) => {
  const sos = await SOS.create({
    resident: req.user._id,
    flatNumber: req.user.flatNumber,
    message: req.body.message || 'Emergency SOS triggered',
  });
  await logActivity('sos', `SOS from ${req.user.flatNumber}`, req.user._id);
  res.status(201).json(sos);
};

export const getSOSAlerts = async (req, res) => {
  const alerts = await SOS.find({ status: 'Active' })
    .populate('resident', 'name phone flatNumber')
    .sort({ createdAt: -1 });
  res.json(alerts);
};

export const resolveSOS = async (req, res) => {
  const sos = await SOS.findByIdAndUpdate(req.params.id, { status: 'Resolved' }, { new: true });
  if (!sos) return res.status(404).json({ message: 'SOS not found' });
  res.json(sos);
};
