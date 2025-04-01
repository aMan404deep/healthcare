import User from "../models/userModel.js";
import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/DoctorModel.js"; 
import Patient from "../models/PatientModel.js";

// Get all appointments (admin can see all appointments)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("patient doctor");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};

// Get all doctors (admin can see a list of doctors)
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors", error: error.message });
  }
};

// Get all patients (admin can see a list of patients)
export const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error: error.message });
  }
};

// Approve an appointment (Admin approves patient-initiated appointment)
export const approveAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    appointment.status = "approved";
    await appointment.save();
    res.json({ message: "Appointment approved", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error approving appointment", error: error.message });
  }
};

// Cancel an appointment by Admin (Admin can cancel any appointment)
export const cancelAppointmentByAdmin = async (req, res) => {
  const { appointmentId } = req.params;
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    appointment.status = "cancelled";
    await appointment.save();
    res.json({ message: "Appointment cancelled by admin", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling appointment", error: error.message });
  }
};

// Get All Users (Admin Only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete User (Admin Only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Change User Role (Admin Only)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();
    res.json({ message: "User role updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdminStatistics = async (req, res) => {
    try {
      const appointmentCount = await Appointment.countDocuments();
      const doctorCount = await Doctor.countDocuments({ status: "active" });
      const patientCount = await Patient.countDocuments();
  
      return res.status(200).json({
        appointmentCount,
        doctorCount,
        patientCount,
      });
    } catch (err) {
      return res.status(500).json({ message: "Failed to fetch statistics", error: err.message });
    }
  };