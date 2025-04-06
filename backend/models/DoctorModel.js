import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    availability: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
    city: { type: String, default: "Unknown" }, // NEW
    profileImage: { type: String, default: "/default-doctor.jpg" }, // NEW
    rating: { type: Number, default: 4 }, // NEW (can be float like 4.3, 3.7, etc.)
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
