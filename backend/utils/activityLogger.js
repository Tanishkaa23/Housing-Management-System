import Activity from '../models/Activity.js';

export const logActivity = async (type, message, userId = null, metadata = {}) => {
  try {
    await Activity.create({ type, message, user: userId, metadata });
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
};
