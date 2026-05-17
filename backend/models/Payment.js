import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    flatNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    fine: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Overdue'],
      default: 'Pending',
    },
    paymentMode: {
      type: String,
      enum: ['Cash', 'UPI', 'Bank Transfer', 'Card', ''],
      default: '',
    },
    receiptNumber: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
