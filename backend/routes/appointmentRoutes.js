import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  bookAppointment,
  updateAppointmentStatus,
  getDoctorAppointments,
  getPatientAppointments,
  cancelAppointment,
  acceptAppointment,
  rejectAppointment
} from "../controllers/appointmentController.js";

const router = express.Router();

// Patient books an appointment
router.post("/book", protect, authorize("patient"), bookAppointment);

// Doctor approves/rejects an appointment
router.put("/update", protect, authorize("doctor"), updateAppointmentStatus);

// Doctor gets their appointments
router.get("/doctor", protect, authorize("doctor"), getDoctorAppointments);

// Patient gets their appointments
router.get("/patient", protect, authorize("patient"), getPatientAppointments);
router.put("/cancel", protect, authorize("patient","doctor"), cancelAppointment);

// Add routes for accept/reject appointments
router.put("/:id/accept", protect,authorize("doctor"), acceptAppointment);
router.put("/:id/reject", protect,authorize("doctor"), rejectAppointment);

export default router;
