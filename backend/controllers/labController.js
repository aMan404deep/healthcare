import Report from "../models/reportModel.js";

// Upload Medical Report
export const uploadReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const newReport = new Report({
      patient: req.body.patientId, // Attach report to patient
      lab: req.user.id, // Assign lab user who uploaded
      reportUrl: req.file.path, // Cloudinary URL
    });

    await newReport.save();
    res.json({ message: "Report uploaded successfully", report: newReport });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
