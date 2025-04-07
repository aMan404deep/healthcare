import asyncHandler from "express-async-handler";
import Appointment from "../models/appointmentModel.js";
import Vital from "../models/vitalModel.js";
import Prescription from "../models/prescriptionModel.js";
import Tip from "../models/tipModel.js";

import User from "../models/userModel.js";
import Report from "../models/reportModel.js";
import Patient from "../models/PatientModel.js"; 
import Doctor from "../models/DoctorModel.js";
import Visit from "../models/Visit.js";

export const addPatient = async (req, res) => {
    try {
      const { name, age, gender, phone, address, email } = req.body;
      
      // Check if the patient already exists
      const patientExists = await Patient.findOne({ phone });
      if (patientExists) {
        return res.status(400).json({ message: "Patient with this phone number already exists." });
      }
  
      // Create and save the new patient
      const newPatient = new Patient({
        name,
        age,
        gender,
        phone,
        address,
        email,
      });
  
      await newPatient.save();
  
      return res.status(201).json({ message: "Patient added successfully", newPatient });
    } catch (err) {
      return res.status(500).json({ message: "Failed to add patient", error: err.message });
    }
  };

// Get Reports for a Patient
export const getPatientReports = async (req, res) => {
  try {
    const reports = await Report.find({ patient: req.user.id }).populate("lab", "name");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getPatientProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // Update Patient Profile
  export const updatePatientProfile = async (req, res) => {
    try {
      const patientId = req.user._id; // Get the logged-in patient's ID from the token (authenticated)
      const { name, age, gender, phone, address } = req.body; // Destructure the fields that can be updated
  
      // Find patient by ID and update
      const updatedPatient = await Patient.findByIdAndUpdate(
        patientId,
        { name, age, gender, phone, address },
        { new: true } // Return the updated document
      );
  
      if (!updatedPatient) {
        return res.status(404).json({ message: "Patient not found." });
      }
  
      return res.status(200).json({ message: "Profile updated successfully", updatedPatient });
    } catch (err) {
      return res.status(500).json({ message: "Failed to update profile", error: err.message });
    }
  };

  // Get All Available Doctors
  export const getDoctors = async (req, res) => {
    try {
      const doctors = await Doctor.find({ status: "active" }); // Fetch only active doctors
  
      if (!doctors.length) {
        return res.status(404).json({ message: "No available doctors." });
      }
  
      return res.status(200).json({ doctors });
    } catch (err) {
      return res.status(500).json({ message: "Failed to fetch doctors", error: err.message });
    }
  };
  
  export const updatePatient = async (req, res) => {
    try {
      const patientId = req.params.id;
      const { name, age, gender, phone, address, email } = req.body;
  
      const updatedPatient = await Patient.findByIdAndUpdate(
        patientId,
        { name, age, gender, phone, address, email },
        { new: true } // Return the updated document
      );
  
      if (!updatedPatient) {
        return res.status(404).json({ message: "Patient not found." });
      }
  
      return res.status(200).json({ message: "Patient updated successfully", updatedPatient });
    } catch (err) {
      return res.status(500).json({ message: "Failed to update patient", error: err.message });
    }
  };


  export const getPatientDashboard = asyncHandler(async (req, res) => {
    const patientId = req.user.id;
    const [appointments, reports, doctors] = await Promise.all([
      Appointment.find({ patient: patientId }),
      Report.find({ patient: patientId }),
      Doctor.find({ patients: patientId })
    ]);
  
    res.json({
      upcomingAppointments: appointments.length,
      medicalReports: reports.length,
      doctorsVisited: doctors.length
    });
  });
  
  // GET /api/patient/vitals
  export const getVitals = asyncHandler(async (req, res) => {
    const vitals = await Vital.find({ patient: req.user.id }).sort({ createdAt: 1 });
    res.json(vitals);
  });
  
  // GET /api/patient/prescriptions
  export const getPrescriptions = asyncHandler(async (req, res) => {
    try {
      const prescriptions = await Prescription.find({ patient: req.user.id })
        .populate('doctor', 'name specialization')
        .sort({ prescribedAt: -1 });
      
      res.json(prescriptions); 
    } catch (error) {
      console.error("Error fetching prescriptions:", error.message);
      res.status(500).json({ message: "Failed to fetch prescriptions", error: error.message });
    }
  });
  
  // Updated getWellnessTip with better error handling
  export const getWellnessTip = asyncHandler(async (req, res) => {
    try {
      const tips = await Tip.find();
      
      if (!tips || tips.length === 0) {
        return res.json({ tip: "Stay healthy!" });
      }
      
      const random = tips[Math.floor(Math.random() * tips.length)];
      // Check if tip has a message field (based on your model) or title
      const tipText = random?.message || random?.title || "Stay healthy!";
      
      res.json({ tip: tipText });
    } catch (error) {
      console.error("Error fetching wellness tip:", error.message);
      res.status(500).json({ message: "Failed to fetch wellness tip", error: error.message });
    }
  });
  
  // GET /api/patient/next-appointment
  export const getNextAppointment = asyncHandler(async (req, res) => {
    const next = await Appointment.findOne({ patient: req.user.id }).sort({ date: 1 });
    res.json(next);
  });
  
  // // GET /api/patient/wellness-tip
  // export const getWellnessTip = asyncHandler(async (req, res) => {
  //   const tips = await Tip.find();
  //   const random = tips[Math.floor(Math.random() * tips.length)];
  //   res.json({ tip: random?.text || "Stay healthy!" });
  // });
  
  // POST /api/patient/upload-report
  export const uploadReport = asyncHandler(async (req, res) => {
    const { originalname, path } = req.file;
    const newReport = new Report({
      name: originalname,
      fileUrl: path,
      patient: req.user.id
    });
    await newReport.save();
    res.status(201).json({ message: "Report uploaded." });
  });
  

  export const getRecentVisits = asyncHandler(async (req, res) => {
    try {
      const patientId = req.user._id || req.user.id;
  
      // Fetch the last 5 visits, most recent first
      const recentVisits = await Visit.find({ patientId })
        .sort({ date: -1 }) // newest first
        .limit(5);
  
      res.status(200).json(recentVisits);
    } catch (error) {
      console.error("Error fetching recent visits:", error.message);
      res.status(500).json({ message: "Failed to fetch recent visits", error: error.message });
    }
  });
  