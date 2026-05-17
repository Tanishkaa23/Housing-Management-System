import Event from '../models/Event.js';
import { logActivity } from '../utils/activityLogger.js';

export const getEvents = async (req, res) => {
  const events = await Event.find()
    .populate('createdBy', 'name')
    .populate('rsvps', 'name flatNumber')
    .sort({ date: 1 });
  res.json(events);
};

export const createEvent = async (req, res) => {
  const event = await Event.create({ ...req.body, createdBy: req.user._id });
  await logActivity('event', `Event created: ${event.title}`, req.user._id);
  res.status(201).json(event);
};

export const updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
};

export const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  await event.deleteOne();
  res.json({ message: 'Event removed' });
};

export const rsvpEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  const idx = event.rsvps.indexOf(req.user._id);
  if (idx > -1) event.rsvps.splice(idx, 1);
  else event.rsvps.push(req.user._id);
  await event.save();
  res.json(event);
};
