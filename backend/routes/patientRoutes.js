import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getPatientReports } from "../controllers/patientController.js";
import { updatePatientProfile } from "../controllers/patientController.js";
import { getDoctors } from "../controllers/patientController.js";
import { addPatient, updatePatient } from "../controllers/patientController.js";

const router = express.Router();

router.get("/reports", protect, authorize("patient"), getPatientReports);
router.put("/profile", protect, authorize("patient"), updatePatientProfile);
router.get("/doctors", protect, getDoctors);
router.post("/add", protect, authorize("admin", "doctor"), addPatient); 
router.put("/update/:id", protect, authorize("admin", "doctor"), updatePatient);

export default router;
