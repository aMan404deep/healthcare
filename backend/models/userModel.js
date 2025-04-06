import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["patient", "doctor", "admin", "lab"], 
      required: true 
    },
    otp: { type: String },
    otpExpires: { type: Date },
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // For patients
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
