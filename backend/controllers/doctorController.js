import User from "../models/userModel.js";
import Doctor from "../models/DoctorModel.js"; // Assuming you have a Doctor model

export const addDoctor = async (req, res) => {
    try {
      const { name, specialty, phone, address, email } = req.body;
      
      // Check if the doctor already exists
      const doctorExists = await Doctor.findOne({ phone });
      if (doctorExists) {
        return res.status(400).json({ message: "Doctor with this phone number already exists." });
      }
  
      // Create and save the new doctor
      const newDoctor = new Doctor({
        name,
        specialty,
        phone,
        address,
        email,
      });
  
      await newDoctor.save();
  
      return res.status(201).json({ message: "Doctor added successfully", newDoctor });
    } catch (err) {
      return res.status(500).json({ message: "Failed to add doctor", error: err.message });
    }
  };

  
export const getAssignedPatients = async (req, res) => {
    try {
      const patients = await User.find({ assignedDoctor: req.user.id }).select("-password");
      res.json(patients);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // Update Doctor Profile
  export const updateDoctorProfile = async (req, res) => {
    try {
      const doctorId = req.user._id; // Get the logged-in doctor's ID from the token (authenticated)
      const { name, specialty, phone, address } = req.body; // Destructure the fields that can be updated
  
      // Find doctor by ID and update
      const updatedDoctor = await Doctor.findByIdAndUpdate(
        doctorId,
        { name, specialty, phone, address },
        { new: true } // Return the updated document
      );
  
      if (!updatedDoctor) {
        return res.status(404).json({ message: "Doctor not found." });
      }
  
      return res.status(200).json({ message: "Profile updated successfully", updatedDoctor });
    } catch (err) {
      return res.status(500).json({ message: "Failed to update profile", error: err.message });
    }
  };
  
  export const updateDoctor = async (req, res) => {
    try {
      const doctorId = req.params.id;
      const { name, specialty, phone, address, email, availability } = req.body;
  
      const updatedDoctor = await Doctor.findByIdAndUpdate(
        doctorId,
        { name, specialty, phone, address, email, availability },
        { new: true } // Return the updated document
      );
  
      if (!updatedDoctor) {
        return res.status(404).json({ message: "Doctor not found." });
      }
  
      return res.status(200).json({ message: "Doctor updated successfully", updatedDoctor });
    } catch (err) {
      return res.status(500).json({ message: "Failed to update doctor", error: err.message });
    }
  };