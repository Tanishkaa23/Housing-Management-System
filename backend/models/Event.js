import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Society meeting', 'Festival', 'Sports', 'Maintenance drive', 'Other'],
      default: 'Other',
    },
    date: { type: Date, required: true },
    location: { type: String, default: 'Community Hall' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rsvps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
