import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js"; // Assuming you have auth middleware
import { updateDoctorProfile } from "../controllers/doctorController.js";
import { addDoctor, updateDoctor } from "../controllers/doctorController.js";
const router = express.Router();

// Update Doctor Profile
router.put("/profile", protect, authorize("doctor"), updateDoctorProfile);
router.post("/add", protect, authorize("admin"), addDoctor); 
router.put("/update/:id", protect, authorize("admin"), updateDoctor);

export default router;
