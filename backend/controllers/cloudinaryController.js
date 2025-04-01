import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Delete Medical Report from Cloudinary
export const deleteReport = async (req, res) => {
  const { publicId } = req.params; // Cloudinary public ID of the report

  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    res.status(200).json({ message: "Report deleted successfully", result });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete report", error: err });
  }
};

// Get Medical Report details from Cloudinary
export const getReport = async (req, res) => {
  const { publicId } = req.params; // Cloudinary public ID of the report

  try {
    const result = await cloudinary.v2.api.resource(publicId);
    res.status(200).json({ message: "Report fetched successfully", result });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch report", error: err });
  }
};
