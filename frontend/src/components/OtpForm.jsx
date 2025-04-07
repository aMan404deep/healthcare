import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Check, RefreshCw, AlertCircle, Shield } from 'lucide-react';

const OtpForm = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds
  const navigate = useNavigate();
  const { login } = useAuth();

  // Timer for OTP expiry
  useEffect(() => {
    if (remainingTime <= 0) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [remainingTime]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;
    
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input field if current field is filled
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    // Clear error on input change
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Session expired or token missing. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { otp: otpValue },
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
      
      // Reset timer and show success message
      setRemainingTime(300);
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
          error.includes("sent successfully") 
            ? "bg-green-50 text-green-700" 
            : "bg-red-50 text-red-700"
        }`}>
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
      
      <div>
        <p className="text-slate-600 mb-3 text-center">Enter 6-digit verification code sent to your email</p>
        <div className="flex justify-center gap-2 mb-1">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              maxLength={1}
              className="w-12 h-14 text-xl font-semibold text-center bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          ))}
        </div>
        <div className="text-center text-sm text-slate-500">
          {remainingTime > 0 ? (
            <span>Code expires in {formatTime(remainingTime)}</span>
          ) : (
            <span className="text-red-500">Code expired. Please request a new one.</span>
          )}
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading || otp.join("").length !== 6}
        className="group relative w-full px-6 py-3 rounded-xl font-medium transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 transition-transform group-hover:scale-105" />
        <div className="relative flex items-center justify-center gap-2 text-white">
          <span>{isLoading ? "Verifying..." : "Verify OTP"}</span>
          {!isLoading && (
            <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </div>
      </button>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isLoading || remainingTime > 0}
          className="flex items-center justify-center gap-2 text-teal-600 hover:text-teal-700 disabled:text-slate-400 transition-colors px-3 py-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? "Sending..." : "Resend OTP"}</span>
        </button>
      </div>
    </form>
  );
};

export default OtpForm;