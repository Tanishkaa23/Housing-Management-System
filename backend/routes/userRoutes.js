import express from 'express';
import { getResidents, getUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, adminOnly);
router.get('/', getResidents);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

export default router;
