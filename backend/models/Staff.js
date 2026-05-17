import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ['Cleaner', 'Electrician', 'Plumber', 'Security', 'Other'],
      required: true,
    },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    attendance: [
      {
        date: { type: Date, default: Date.now },
        present: { type: Boolean, default: true },
      },
    ],
    assignedTasks: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Staff', staffSchema);
