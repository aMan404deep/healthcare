import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import { FaFileMedical, FaBell } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const LabDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/api/lab/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data);
      } catch (err) {
        console.error("Error fetching lab stats:", err.message);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Lab Dashboard</h2>

        {stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <DashboardCard title="Total Reports Uploaded" value={stats.totalReports} icon={<FaFileMedical />} />
            <DashboardCard title="New Notifications" value={stats.newNotifications} icon={<FaBell />} />
          </div>
        ) : (
          <p>Loading dashboard...</p>
        )}
      </div>
    </>
  );
};

export default LabDashboard;
