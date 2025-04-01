import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate phone numbers
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure no duplicate emails
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // Default status
    },
    availability: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available", // Default availability
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
