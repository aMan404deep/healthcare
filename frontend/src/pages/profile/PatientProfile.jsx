import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const PatientProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/patient/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/patient/profile", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("✅ Profile updated");
    } catch (err) {
      alert("❌ Failed to update profile");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">Update Patient Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border p-2 rounded"
        />
        <input
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          className="w-full border p-2 rounded"
        />
        <input
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          placeholder="Gender"
          className="w-full border p-2 rounded"
        />
        <input
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          placeholder="Contact Number"
          className="w-full border p-2 rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default PatientProfile;
