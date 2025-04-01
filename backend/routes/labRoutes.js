import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadReport } from "../controllers/labController.js";

const router = express.Router();

// Upload Report (Lab Only)
router.post("/upload", protect, authorize("lab"), upload.single("file"), uploadReport);

export default router;
