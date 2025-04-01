import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Common Components
import Loader from './components/common/Loader';

// Eagerly loaded pages
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';

// Lazily loaded pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AppointmentPage = lazy(() => import('./pages/AppointmentPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const DoctorsList = lazy(() => import('./components/admin/DoctorsList'));
const PatientsList = lazy(() => import('./components/admin/PatientsList'));
const AppointmentManagement = lazy(() => import('./components/admin/AppointmentManagement'));

// Doctor Pages
const DoctorDashboard = lazy(() => import('./components/doctor/DoctorDashboard'));
const AppointmentCalendar = lazy(() => import('./components/doctor/AppointmentCalendar'));
const PatientRecords = lazy(() => import('./components/doctor/PatientRecords'));

// Patient Pages
const PatientDashboard = lazy(() => import('./components/patient/PatientDashboard'));
const BookAppointment = lazy(() => import('./components/patient/BookAppointment'));
const MedicalReports = lazy(() => import('./components/patient/MedicalReports'));
const DoctorsDirectory = lazy(() => import('./components/patient/DoctorsList'));

// Lab Pages
const LabDashboard = lazy(() => import('./components/lab/LabDashboard'));
const ReportUpload = lazy(() => import('./components/lab/ReportUpload'));

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><Loader size="large" /></div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
        </Route>
        
        {/* Protected Routes */}
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/doctors" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DoctorsList />
            </ProtectedRoute>
          } />
          <Route path="/admin/patients" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PatientsList />
            </ProtectedRoute>
          } />
          <Route path="/admin/appointments" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AppointmentManagement />
            </ProtectedRoute>
          } />
          
          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor/appointments" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <AppointmentCalendar />
            </ProtectedRoute>
          } />
          <Route path="/doctor/patients" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <PatientRecords />
            </ProtectedRoute>
          } />
          
          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient/book-appointment" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <BookAppointment />
            </ProtectedRoute>
          } />
          <Route path="/patient/reports" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <MedicalReports />
            </ProtectedRoute>
          } />
          <Route path="/patient/doctors" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <DoctorsDirectory />
            </ProtectedRoute>
          } />
          
          {/* Lab Routes */}
          <Route path="/lab/dashboard" element={
            <ProtectedRoute allowedRoles={['lab']}>
              <LabDashboard />
            </ProtectedRoute>
          } />
          <Route path="/lab/upload" element={
            <ProtectedRoute allowedRoles={['lab']}>
              <ReportUpload />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;