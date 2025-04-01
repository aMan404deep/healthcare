import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getAllUsers, deleteUser, updateUserRole } from "../controllers/adminController.js";
import { getPatientProfile } from "../controllers/patientController.js";
import { getAssignedPatients } from "../controllers/doctorController.js";
import { uploadReport } from "../controllers/labController.js";

const router = express.Router();

// Admin Routes
router.get("/admin/users", protect, authorize("admin"), getAllUsers);
router.delete("/admin/user/:id", protect, authorize("admin"), deleteUser);
router.put("/admin/user/:id", protect, authorize("admin"), updateUserRole);

// Patient Routes
router.get("/patient/profile", protect, authorize("patient"), getPatientProfile);

// Doctor Routes
router.get("/doctor/patients", protect, authorize("doctor"), getAssignedPatients);

// Lab Routes
router.post("/lab/upload", protect, authorize("lab"), uploadReport);

export default router;
