import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent, rsvpEvent } from '../controllers/eventController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.route('/').get(getEvents).post(adminOnly, createEvent);
router.put('/:id/rsvp', rsvpEvent);
router.route('/:id').put(adminOnly, updateEvent).delete(adminOnly, deleteEvent);

export default router;
