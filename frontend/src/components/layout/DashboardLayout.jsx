import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Header from './Header';
import Sidebar from '../common/Sidebar';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Get appropriate dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'doctor':
        return '/doctor/dashboard';
      case 'patient':
        return '/patient/dashboard';
      case 'lab':
        return '/lab/dashboard';
      default:
        return '/dashboard';
    }
  };

  // Redirect to appropriate dashboard if on generic /dashboard
  useEffect(() => {
    if (location.pathname === '/dashboard' && user) {
      navigate(getDashboardLink());
    }
  }, [location.pathname, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          userRole={user?.role}
        />
        
        <motion.main 
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
          
          <footer className="mt-12 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Healthcare Management System. All rights reserved.</p>
          </footer>
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;