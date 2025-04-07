import mongoose from "mongoose";

const tipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    category: String, // Optional: e.g., "Fitness", "Mental Health"
  },
  { timestamps: true }
);

const Tip = mongoose.model("Tip", tipSchema);
export default Tip;
