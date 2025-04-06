import React, { useEffect, useState } from "react";
import RegisterForm from "../components/RegisterForm";
import { UserPlus, Building2 } from 'lucide-react';
import { Link } from "react-router-dom";

export default function Register() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e) => {
      // Get the cursor position relative to the window
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center">
      {/* Dynamic background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(0, 163, 173, 0.2) 0%, transparent 70%),
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 123, 255, 0.3) 0%, transparent 60%),
              radial-gradient(circle at 90% 90%, rgba(73, 197, 182, 0.15) 0%, transparent 50%)
            `,
            transition: 'background-position 0.2s ease-out'
          }}
        />
        <div className="absolute inset-0 backdrop-blur-[100px]" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[20%] w-64 h-64 rounded-full bg-gradient-to-r from-teal-500/10 to-cyan-500/10 animate-float blur-xl" />
        <div className="absolute bottom-40 right-[15%] w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-teal-500/10 animate-float-delayed blur-xl" />
      </div>

      {/* Glass card floating effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-white/5 to-white/0 rounded-full blur-3xl pointer-events-none" />

      <div className={`relative z-10 bg-white rounded-xl shadow-lg p-8 w-full max-w-md transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-teal-400 to-cyan-500 rounded-2xl p-3 mb-6 rotate-3 hover:rotate-6 transition-transform duration-300">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">Create Account</span>
          </h1>
          <p className="text-slate-600">Join MediCare Connect</p>
        </div>
        
        <RegisterForm />
        
        <div className="mt-8 text-center">
          <p className="text-slate-500 mb-4">Already have an account? 
            <Link to="/login" className="text-teal-600 hover:text-teal-700 ml-1">Sign In</Link>
          </p>
          
          <div className="mt-6">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-500">Trusted by leading healthcare providers</p>
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2 text-slate-500">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">MediGroup</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">LifeCare</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}