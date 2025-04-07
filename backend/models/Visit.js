import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  }
}, { timestamps: true });

const Visit =  mongoose.model('Visit', visitSchema);
export default Visit;