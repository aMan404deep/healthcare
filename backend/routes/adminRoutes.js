import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js"; // Assuming you have auth and admin authorization middleware
import { 
    getAllAppointments, 
    getAppointmentById, 
    approveAppointment, 
    cancelAppointmentByAdmin 
} from "../controllers/adminController.js";
import { getAdminStatistics } from "../controllers/adminController.js";

const router = express.Router();

// Admin Routes (only accessible by admins)
router.use(authenticate); // Ensure the user is authenticated

// Admin can view all appointments
router.get("/appointments", authorizeAdmin, getAllAppointments);

// Admin can approve/reject appointment
router.put("/appointments/approve/:appointmentId", authorizeAdmin, approveAppointment);
router.put("/appointments/cancel/:appointmentId", authorizeAdmin, cancelAppointmentByAdmin);

// Admin can view all doctors
router.get("/doctors", authorizeAdmin, getAllDoctors);

// Admin can view all patients
router.get("/patients", authorizeAdmin, getAllPatients);
router.get("/statistics", protect, authorize("admin"), getAdminStatistics);

export default router;
