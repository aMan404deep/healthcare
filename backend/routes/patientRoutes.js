import multer from "multer";

// Configure storage for uploaded reports
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/reports"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Initialize multer with storage settings
const upload = multer({ storage });


import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getPatientReports } from "../controllers/patientController.js";
import { updatePatientProfile,getPatientDashboard,getVitals,getPrescriptions,getNextAppointment,getWellnessTip } from "../controllers/patientController.js";
import { getDoctors,uploadReport,getRecentVisits } from "../controllers/patientController.js";
import { addPatient, updatePatient } from "../controllers/patientController.js";

const router = express.Router();

router.get("/reports", protect, authorize("patient"), getPatientReports);
router.put("/profile", protect, authorize("patient"), updatePatientProfile);
router.get("/doctors", protect, getDoctors);
router.post("/add", protect, authorize("admin", "doctor"), addPatient); 
router.put("/update/:id", protect, authorize("admin", "doctor"), updatePatient);

router.get("/dashboard", protect, authorize("patient"), getPatientDashboard);
router.get("/vitals", protect, authorize("patient"), getVitals);
router.get("/prescriptions", protect, authorize("patient"), getPrescriptions);
router.get("/next-appointment", protect, authorize("patient"), getNextAppointment);
router.get("/wellness-tip", protect, authorize("patient"), getWellnessTip);
router.get("/recent-visits", protect, authorize("patient"), getRecentVisits);
router.post("/upload-report", protect, authorize("patient"), upload.single("report"), uploadReport);

export default router;
