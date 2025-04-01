import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import moment from "moment";
import { sendSMS, sendEmail } from "../utils/notificationService.js";

// Book Appointment with Notification
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    // Validate doctor
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    // Check for conflicts (Doctor has another appointment at the same time)
    const existingAppointment = await Appointment.findOne({ doctor: doctorId, date, time });
    if (existingAppointment) {
      return res.status(400).json({ message: "Doctor is unavailable at this time" });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
      date,
      time,
    });

    await appointment.save();

    // Get patient details
    const patient = await User.findById(req.user.id);

    // Notification Message
    const message = `📅 Appointment booked!\n👩‍⚕️ Doctor: ${doctor.name}\n📆 Date: ${date}\n⏰ Time: ${time}`;

    // Send Email & SMS to Doctor
    sendEmail(doctor.email, "New Appointment Request", `You have a new appointment request.\n\n${message}`);
    sendSMS(doctor.phone, message);

    // Send Email & SMS to Patient
    sendEmail(patient.email, "Appointment Confirmation", `Your appointment has been booked!\n\n${message}`);
    sendSMS(patient.phone, message);

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Update Appointment Status (Doctor)
// Approve/Reject Appointment with Notification
export const updateAppointmentStatus = async (req, res) => {
    try {
      const { appointmentId, status } = req.body;
  
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) return res.status(404).json({ message: "Appointment not found" });
  
      // Check if logged-in doctor is the owner of this appointment
      if (appointment.doctor.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
  
      appointment.status = status;
      await appointment.save();
  
      // Get patient details
      const patient = await User.findById(appointment.patient);
  
      // Notification Message
      const message = `🔔 Appointment ${status.toUpperCase()}!\n📆 Date: ${appointment.date}\n⏰ Time: ${appointment.time}`;
  
      // Send Email & SMS to Patient
      sendEmail(patient.email, `Appointment ${status.toUpperCase()}`, message);
      sendSMS(patient.phone, message);
  
      res.json({ message: `Appointment ${status}`, appointment });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  
// Get Doctor's Appointments
export const getDoctorAppointments = async (req, res) => {
    try {
      const appointments = await Appointment.find({ doctor: req.user.id })
        .populate("patient", "name email")
        .sort({ date: 1, time: 1 });
  
      res.json(appointments);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };

// Get Patient's Appointments
export const getPatientAppointments = async (req, res) => {
    try {
      const appointments = await Appointment.find({ patient: req.user.id })
        .populate("doctor", "name email")
        .sort({ date: 1, time: 1 });
  
      res.json(appointments);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // Cancel Appointment
  export const cancelAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.body;
  
      // Find the appointment by ID
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
  
      // Check if the logged-in user is the patient or the doctor associated with this appointment
      if (appointment.patient.toString() !== req.user.id && appointment.doctor.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access. Only the doctor or patient can cancel this appointment" });
      }
  
      // Cancel the appointment (set status to 'cancelled')
      appointment.status = "cancelled";
      await appointment.save();
  
      // Get patient and doctor details
      const patient = await User.findById(appointment.patient);
      const doctor = await User.findById(appointment.doctor);
  
      // Notification Message
      const message = `❌ Appointment Cancelled!\n📆 Date: ${appointment.date}\n⏰ Time: ${appointment.time}\nPatient: ${patient.name}`;
  
      // Send Email & SMS to Patient
      sendEmail(patient.email, "Appointment Cancelled", `Your appointment has been cancelled.\n\n${message}`);
      sendSMS(patient.phone, message);
  
      // Send Email & SMS to Doctor
      sendEmail(doctor.email, "Appointment Cancelled", `The appointment has been cancelled by the patient or doctor.\n\n${message}`);
      sendSMS(doctor.phone, message);
  
      res.json({ message: "Appointment cancelled successfully", appointment });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };