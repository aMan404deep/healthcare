import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const DoctorProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    experience: "",
    bio: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/doctor/profile", {
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
      await axios.put("/api/doctor/profile", formData, {
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
      <h2 className="text-2xl font-bold mb-4">Update Doctor Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border p-2 rounded"
        />
        <input
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          placeholder="Specialization"
          className="w-full border p-2 rounded"
        />
        <input
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Years of Experience"
          type="number"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Bio"
          className="w-full border p-2 rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default DoctorProfile;
