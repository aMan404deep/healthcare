import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import { FaCalendarCheck, FaFileMedical, FaUserMd } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const PatientDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchPatientStats = async () => {
      try {
        const { data } = await axios.get("/api/patient/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data);
      } catch (error) {
        console.error("❌ Error fetching patient dashboard:", error.message);
      }
    };

    fetchPatientStats();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Patient Dashboard</h2>
        {stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <DashboardCard title="Upcoming Appointments" value={stats.upcomingAppointments} icon={<FaCalendarCheck />} />
            <DashboardCard title="Reports Uploaded" value={stats.medicalReports} icon={<FaFileMedical />} />
            <DashboardCard title="Doctors Visited" value={stats.doctorsVisited} icon={<FaUserMd />} />
          </div>
        ) : (
          <p>Loading dashboard...</p>
        )}
      </div>
    </>
  );
};

export default PatientDashboard;
