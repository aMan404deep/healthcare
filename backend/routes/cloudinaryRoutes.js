import express from "express";
import { deleteReport, getReport } from "../controllers/cloudinaryController.js";
import { protect } from "../middleware/authMiddleware.js"; // Assuming you have auth middleware

const router = express.Router();

// Delete report from Cloudinary
router.delete("/report/:publicId", protect, deleteReport);

// Get report details from Cloudinary
router.get("/report/:publicId", protect, getReport);

export default router;
