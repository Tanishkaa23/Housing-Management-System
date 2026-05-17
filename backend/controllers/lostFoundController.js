import LostFound from '../models/LostFound.js';

export const getLostFound = async (req, res) => {
  const items = await LostFound.find()
    .populate('postedBy', 'name flatNumber')
    .sort({ createdAt: -1 });
  res.json(items);
};

export const createLostFound = async (req, res) => {
  const item = await LostFound.create({ ...req.body, postedBy: req.user._id });
  res.status(201).json(item);
};

export const updateLostFound = async (req, res) => {
  const item = await LostFound.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
};
