import Staff from '../models/Staff.js';

export const getStaff = async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  const staff = await Staff.find(filter).sort({ name: 1 });
  res.json(staff);
};

export const createStaff = async (req, res) => {
  const staff = await Staff.create(req.body);
  res.status(201).json(staff);
};

export const updateStaff = async (req, res) => {
  const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!staff) return res.status(404).json({ message: 'Staff not found' });
  res.json(staff);
};

export const deleteStaff = async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) return res.status(404).json({ message: 'Staff not found' });
  await staff.deleteOne();
  res.json({ message: 'Staff removed' });
};

export const markAttendance = async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) return res.status(404).json({ message: 'Staff not found' });
  staff.attendance.push({ date: new Date(), present: req.body.present !== false });
  await staff.save();
  res.json(staff);
};
