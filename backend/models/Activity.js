import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
