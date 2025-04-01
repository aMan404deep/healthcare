import User from "../models/userModel.js";
import Report from "../models/reportModel.js";
import Patient from "../models/PatientModel.js"; 
import Doctor from "../models/DoctorModel.js";

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