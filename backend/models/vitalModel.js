import mongoose from "mongoose";

const vitalSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    heartRate: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
    },
    oxygenLevel: Number,
    temperature: Number,
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Vital = mongoose.model("Vital", vitalSchema);
export default Vital;
