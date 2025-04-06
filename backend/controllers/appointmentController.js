import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import moment from "moment";
import { sendSMS, sendEmail } from "../utils/notificationService.js";

// Book Appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(400).json({ message: "Invalid doctor ID." });
    }

    // Format date and time
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const formattedTime = moment(time, "HH:mm").format("HH:mm");

    // Check for time slot availability
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      date: formattedDate,
      time: formattedTime,
      status: { $ne: "cancelled" },
    });

    if (conflict) {
      return res.status(400).json({ message: "Time slot unavailable." });
    }

    // Create appointment with pending status
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date: formattedDate,
      time: formattedTime,
      status: "pending",
    });

    const patient = await User.findById(req.user.id);

    const message = `📅 Appointment Request!\n👩‍⚕️ Doctor: ${doctor.name}\n📆 Date: ${formattedDate}\n⏰ Time: ${formattedTime}`;

    // Notify Doctor
    sendEmail(doctor.email, "New Appointment Request", message);
    sendSMS(doctor.phone, message);

    // Confirm request to patient
    sendEmail(patient.email, "Appointment Request Sent", `We’ve sent your appointment request. Doctor will confirm soon.\n\n${message}`);
    sendSMS(patient.phone, `Your appointment request with Dr. ${doctor.name} is pending confirmation.`);

    res.status(201).json({ message: "Appointment request sent.", appointment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Doctor updates status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use approved/rejected." });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found." });

    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized." });
    }

    appointment.status = status;
    await appointment.save();

    const patient = await User.findById(appointment.patient);

    const message = `🔔 Appointment ${status.toUpperCase()}!\n📆 Date: ${appointment.date}\n⏰ Time: ${appointment.time}`;

    sendEmail(patient.email, `Appointment ${status.toUpperCase()}`, message);
    sendSMS(patient.phone, message);

    res.json({ message: `Appointment ${status}.`, appointment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Doctor's Dashboard
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate("patient", "name email phone")
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Patient's Dashboard
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate("doctor", "name email phone")
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel Appointment (by doctor or patient)
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found." });

    if (
      appointment.patient.toString() !== req.user.id &&
      appointment.doctor.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Unauthorized to cancel this appointment." });
    }

    appointment.status = "cancelled";
    await appointment.save();

    const patient = await User.findById(appointment.patient);
    const doctor = await User.findById(appointment.doctor);

    const message = `❌ Appointment Cancelled!\n📆 Date: ${appointment.date}\n⏰ Time: ${appointment.time}`;

    sendEmail(patient.email, "Appointment Cancelled", message);
    sendSMS(patient.phone, message);

    sendEmail(doctor.email, "Appointment Cancelled", message);
    sendSMS(doctor.phone, message);

    res.json({ message: "Appointment cancelled.", appointment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// In controller
export const acceptAppointment = async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(req.params.id, { status: "accepted" }, { new: true });
  res.json(updated);
};

export const rejectAppointment = async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
  res.json(updated);
};
