// Register.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient", // adjust as needed
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      const { token } = res.data;

      // ✅ Save token to localStorage
      localStorage.setItem("token", token);

      // ✅ Redirect to OTP form
      navigate("/verify-otp");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        <input
          name="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
          <option value="lab">Lab</option>
        </select>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
