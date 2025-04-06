// models/Appointment.js
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    timeSlot: { type: String, required: true }, // "10:00 AM"
    reason: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
