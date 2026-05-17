import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Water', 'Electricity', 'Cleaning', 'Security', 'Internet', 'Lift Issue'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    image: { type: String, default: '' },
    resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    flatNumber: { type: String, required: true },
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    timeline: [
      {
        status: String,
        note: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Complaint', complaintSchema);
