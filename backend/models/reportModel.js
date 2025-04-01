import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lab: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reportUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
