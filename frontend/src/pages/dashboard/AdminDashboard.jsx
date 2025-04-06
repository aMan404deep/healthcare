import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import { FaUserMd, FaUser, FaFlask } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/api/admin/statistics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data);
      } catch (err) {
        console.error("Error fetching admin stats:", err.message);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

        {stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <DashboardCard title="Total Patients" value={stats.totalPatients} icon={<FaUser />} />
            <DashboardCard title="Total Doctors" value={stats.totalDoctors} icon={<FaUserMd />} />
            <DashboardCard title="Total Labs" value={stats.totalLabs} icon={<FaFlask />} />
          </div>
        ) : (
          <p>Loading dashboard...</p>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
