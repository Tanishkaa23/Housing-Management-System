import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { logActivity } from '../utils/activityLogger.js';

export const register = async (req, res) => {
  const { name, email, password, phone, flatNumber, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const user = await User.create({
    name,
    email,
    password,
    phone: phone || '',
    flatNumber: flatNumber || '',
    role: role === 'admin' ? 'admin' : 'resident',
  });
  await logActivity('auth', `${user.name} registered`, user._id);
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    flatNumber: user.flatNumber,
    token: generateToken(user._id),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    await logActivity('auth', `${user.name} logged in`, user._id);
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      flatNumber: user.flatNumber,
      token: generateToken(user._id),
    });
  }
  res.status(401).json({ message: 'Invalid email or password' });
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.name = req.body.name || user.name;
  user.phone = req.body.phone ?? user.phone;
  user.flatNumber = req.body.flatNumber ?? user.flatNumber;
  if (req.body.password) user.password = req.body.password;
  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    phone: updated.phone,
    flatNumber: updated.flatNumber,
  });
};
