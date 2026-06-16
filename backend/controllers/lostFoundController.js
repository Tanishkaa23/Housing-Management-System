import LostFound from '../models/LostFound.js';

export const getLostFound = async (req, res) => {
  const items = await LostFound.find()
    .select('-imageData')
    .populate('postedBy', 'name flatNumber')
    .sort({ createdAt: -1 });
  res.json(items);
};

export const getLostFoundImage = async (req, res) => {
  const item = await LostFound.findById(req.params.id).select('imageData imageContentType');
  if (!item?.imageData) return res.status(404).json({ message: 'Image not found' });

  res.set('Content-Type', item.imageContentType || 'application/octet-stream');
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(item.imageData);
};

export const createLostFound = async (req, res) => {
  const item = await LostFound.create({
    ...req.body,
    imageUrl: '',
    imageData: req.file?.buffer,
    imageContentType: req.file?.mimetype || '',
    postedBy: req.user._id,
  });
  if (req.file) {
    item.imageUrl = `/api/lost-found/${item._id}/image`;
    await item.save();
  }
  res.status(201).json(item);
};

export const updateLostFound = async (req, res) => {
  const updates = { ...req.body };
  if (req.file) {
    updates.imageData = req.file.buffer;
    updates.imageContentType = req.file.mimetype;
  }

  const item = await LostFound.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (req.file) {
    item.imageUrl = `/api/lost-found/${item._id}/image`;
    await item.save();
  }
  res.json(item);
};
