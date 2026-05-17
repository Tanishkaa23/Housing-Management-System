import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
  {
    visitorName: { type: String, required: true },
    flatNumber: { type: String, required: true },
    purpose: { type: String, required: true },
    entryTime: { type: Date },
    exitTime: { type: Date },
    expectedDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Expected', 'Approved', 'Checked In', 'Checked Out', 'Rejected'],
      default: 'Expected',
    },
    resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Visitor', visitorSchema);
