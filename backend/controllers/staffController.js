import Staff from '../models/Staff.js';
import User from '../models/User.js';

export const getStaff = async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  const staff = await Staff.find(filter).populate('user', 'email').sort({ name: 1 });
  res.json(staff);
};

export const createStaff = async (req, res) => {
  const { name, role, phone, email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required for staff login creation' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'A user or staff member with this email already exists' });
  }

  // Create User credentials for login
  const user = await User.create({
    name,
    email,
    password: 'staff123', // default password for new staff
    role: 'staff',
    phone: phone || '',
  });

  // Create Staff profile
  const staff = await Staff.create({
    name,
    role,
    phone,
    email,
    user: user._id,
  });

  res.status(201).json(staff);
};

export const updateStaff = async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) return res.status(404).json({ message: 'Staff not found' });
  
  // If email or name changes, update User model too
  if (staff.user) {
    const user = await User.findById(staff.user);
    if (user) {
      if (req.body.name) user.name = req.body.name;
      if (req.body.phone) user.phone = req.body.phone;
      if (req.body.email) user.email = req.body.email;
      await user.save();
    }
  }

  Object.assign(staff, req.body);
  await staff.save();
  res.json(staff);
};

export const deleteStaff = async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) return res.status(404).json({ message: 'Staff not found' });
  
  if (staff.user) {
    await User.findByIdAndDelete(staff.user);
  }
  
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
