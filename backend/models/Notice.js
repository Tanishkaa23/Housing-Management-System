import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    priority: {
      type: String,
      enum: ['Urgent', 'General', 'Event', 'Maintenance'],
      default: 'General',
    },
    type: {
      type: String,
      enum: [
        'Water shortage',
        'Power cut',
        'Cleaner unavailable',
        'Emergency',
        'Society meeting',
        'Festival',
        'Maintenance work',
        'General',
      ],
      default: 'General',
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Notice', noticeSchema);
