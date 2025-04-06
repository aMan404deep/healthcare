import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Landing from "./pages/Landing"
// Auth Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";

// Dashboards
import DoctorDashboard from "./pages/dashboard/DoctorDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import LabDashboard from "./pages/dashboard/LabDashboard";
import PatientDashboard from "./pages/dashboard/PatientDashboard"

// Utils
import ProtectedRoute from "./routes/ProtectedRoute";

import DoctorProfile from "./pages/profile/DoctorProfile"
import PatientProfile from "./pages/profile/PatientProfile"

import Appointments from "./pages/appointments/Appointments"

import LabReports from "./pages/lab/LabReports"

import DoctorList from "./pages/DoctorList"
import BookAppointment from "./pages/BookAppointment"
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
        <Route path="/" element={<Landing />} />
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          
          {/* Patient Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientDashboard/>
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Lab Routes */}
          <Route
            path="/lab-dashboard"
            element={
              <ProtectedRoute allowedRoles={["lab"]}>
                <LabDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor-profile"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-profile"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments"
            element={
              <ProtectedRoute allowedRoles={["doctor", "patient"]}>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-appointment/:doctorId"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab-reports"
            element={
              <ProtectedRoute allowedRoles={["lab"]}>
                <LabReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <DoctorList />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized Route */}
          <Route path="/unauthorized" element={<div>Unauthorized</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
