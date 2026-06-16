import mongoose from 'mongoose';

const lostFoundSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Lost', 'Found'], required: true },
    location: { type: String, default: '' },
    contactInfo: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    imageData: { type: Buffer },
    imageContentType: { type: String, default: '' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Open', 'Claimed'], default: 'Open' },
  },
  { timestamps: true }
);

export default mongoose.model('LostFound', lostFoundSchema);
