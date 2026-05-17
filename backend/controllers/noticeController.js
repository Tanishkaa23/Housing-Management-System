import Notice from '../models/Notice.js';
import { logActivity } from '../utils/activityLogger.js';

export const getNotices = async (req, res) => {
  const filter = {};
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { content: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  const notices = await Notice.find(filter)
    .populate('postedBy', 'name')
    .sort({ isPinned: -1, createdAt: -1 });
  res.json(notices);
};

export const createNotice = async (req, res) => {
  const notice = await Notice.create({ ...req.body, postedBy: req.user._id });
  await logActivity('notice', `Notice posted: ${notice.title}`, req.user._id);
  res.status(201).json(notice);
};

export const updateNotice = async (req, res) => {
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!notice) return res.status(404).json({ message: 'Notice not found' });
  res.json(notice);
};

export const deleteNotice = async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) return res.status(404).json({ message: 'Notice not found' });
  await notice.deleteOne();
  res.json({ message: 'Notice removed' });
};
