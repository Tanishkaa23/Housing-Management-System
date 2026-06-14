import mongoose from 'mongoose';

const ResidentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  flatNumber: { type: String, required: true },
  // add more fields as needed
}, { timestamps: true });

export default mongoose.model('Resident', ResidentSchema);
