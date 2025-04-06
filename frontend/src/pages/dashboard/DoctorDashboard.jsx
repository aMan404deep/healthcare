import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import { FaUser, FaClipboardList, FaCalendarCheck } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const DoctorDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDoctorStats = async () => {
      try {
        const { data } = await axios.get("/api/doctor/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data);
      } catch (error) {
        console.error("❌ Error fetching doctor dashboard:", error.message);
      }
    };

    fetchDoctorStats();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Doctor Dashboard</h2>
        {stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <DashboardCard title="Today's Appointments" value={stats.todaysAppointments} icon={<FaCalendarCheck />} />
            <DashboardCard title="Total Patients Seen" value={stats.totalPatients} icon={<FaUser />} />
            <DashboardCard title="Prescriptions Given" value={stats.totalPrescriptions} icon={<FaClipboardList />} />
          </div>
        ) : (
          <p>Loading dashboard...</p>
        )}
      </div>
    </>
  );
};

export default DoctorDashboard;
