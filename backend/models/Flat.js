import mongoose from 'mongoose';

const flatSchema = new mongoose.Schema(
  {
    flatNumber: { type: String, required: true, unique: true },
    floor: { type: Number, required: true },
    block: { type: String, default: 'A' },
    bedrooms: { type: Number, default: 2 },
    status: { type: String, enum: ['Occupied', 'Vacant'], default: 'Vacant' },
    resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Flat', flatSchema);
