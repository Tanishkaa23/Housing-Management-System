import mongoose from 'mongoose';

const sosSchema = new mongoose.Schema(
  {
    resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    flatNumber: { type: String, required: true },
    message: { type: String, default: 'Emergency SOS triggered' },
    status: { type: String, enum: ['Active', 'Resolved'], default: 'Active' },
  },
  { timestamps: true }
);

export default mongoose.model('SOS', sosSchema);
