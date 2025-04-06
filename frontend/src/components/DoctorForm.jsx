import React, { useState } from "react";
import axios from "axios";

const DoctorForm = () => {
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    phone: "",
    address: "",
    email: "",
    city: "",
    rating: 4,
    profileImage: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload image to Cloudinary
      const data = new FormData();
      data.append("file", imageFile);
      data.append("upload_preset", "doctor_uploads"); // replace with your preset
      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dcpgz3pum/image/upload", // replace
        data
      );

      const imageUrl = cloudRes.data.secure_url;

      // Submit form with image URL
      const res = await axios.post("/api/doctors", {
        ...form,
        profileImage: imageUrl,
      });
      setForm(res.data);
      alert("Doctor added!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded"
    >
      <input name="name" onChange={handleChange} placeholder="Name" required className="input" />
      <input name="specialty" onChange={handleChange} placeholder="Specialty" required className="input" />
      <input name="phone" onChange={handleChange} placeholder="Phone" required className="input" />
      <input name="address" onChange={handleChange} placeholder="Address" required className="input" />
      <input name="email" onChange={handleChange} placeholder="Email" required className="input" />
      <input name="city" onChange={handleChange} placeholder="City" className="input" />
      <input type="file" accept="image/*" onChange={handleImageChange} className="input" />

      <button type="submit" className="btn bg-blue-600 text-white mt-4 w-full">
        Add Doctor
      </button>
    </form>
  );
};

export default DoctorForm;
