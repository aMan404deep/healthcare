import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OtpForm = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Session expired or token missing. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { verifiedToken, role } = res.data;

      // Save to localStorage and context
      login(verifiedToken, role);
      localStorage.setItem("token", verifiedToken);

      // Navigate based on role
      if (role === "patient") navigate("/dashboard");
      else if (role === "doctor") navigate("/doctor-dashboard");
      else if (role === "admin") navigate("/admin-dashboard");
      else if (role === "lab") navigate("/lab-dashboard");
      else navigate("/unauthorized");

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to verify OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError(null);
    
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/auth/resend-otp",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Show success message
      setError("OTP sent successfully to your email!");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to resend OTP. Please try logging in again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Enter OTP</h2>
        <p className="text-gray-600 mb-4 text-center">
          Please enter the OTP sent to your email
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full border p-2 rounded mb-4"
            required
          />

          {error && <p className={`text-sm mb-4 ${error.includes("sent successfully") ? "text-green-500" : "text-red-500"}`}>{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-2"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          onClick={handleResendOtp}
          className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default OtpForm;