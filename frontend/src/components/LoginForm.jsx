import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      
      // Save token temporarily to verify it via OTP later
      localStorage.setItem("token", res.data.token);

      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Mail className="w-5 h-5" />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder:text-slate-400"
        />
      </div>
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Lock className="w-5 h-5" />
        </div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder:text-slate-400"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500" />
          <span className="text-sm text-slate-600">Remember me</span>
        </label>
        <a href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700">Forgot password?</a>
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="group relative w-full px-6 py-3 rounded-xl font-medium transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 transition-transform group-hover:scale-105" />
        <div className="relative flex items-center justify-center gap-2 text-white">
          <span>{isLoading ? "Signing in..." : "Sign In"}</span>
          {!isLoading && (
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          )}
        </div>
      </button>

    </form>
  );
}