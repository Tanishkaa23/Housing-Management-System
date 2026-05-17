import Flat from '../models/Flat.js';
import User from '../models/User.js';

export const getFlats = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.flatNumber = { $regex: req.query.search, $options: 'i' };
  }
  const flats = await Flat.find(filter).populate('resident', 'name email phone').sort({ flatNumber: 1 });
  res.json(flats);
};

export const createFlat = async (req, res) => {
  const flat = await Flat.create(req.body);
  res.status(201).json(flat);
};

export const updateFlat = async (req, res) => {
  const flat = await Flat.findById(req.params.id);
  if (!flat) return res.status(404).json({ message: 'Flat not found' });
  if (req.body.resident) {
    flat.resident = req.body.resident;
    flat.status = 'Occupied';
    await User.findByIdAndUpdate(req.body.resident, { flatNumber: flat.flatNumber });
  }
  if (req.body.status === 'Vacant') {
    flat.resident = null;
    flat.status = 'Vacant';
  }
  Object.assign(flat, req.body);
  const updated = await flat.save();
  res.json(updated);
};

export const getFlatStats = async (req, res) => {
  const total = await Flat.countDocuments();
  const occupied = await Flat.countDocuments({ status: 'Occupied' });
  const vacant = await Flat.countDocuments({ status: 'Vacant' });
  res.json({ total, occupied, vacant });
};
