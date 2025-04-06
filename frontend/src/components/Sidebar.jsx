import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const commonLinks = (
    <>
      <Link to="/profile" className="block py-2 hover:underline">Profile</Link>
      <button onClick={logout} className="block py-2 text-red-400 hover:text-red-600">
        Logout
      </button>
    </>
  );

  return (
    <div className="bg-blue-950 text-white w-64 h-screen p-6 fixed">
      <h2 className="text-2xl font-bold mb-8">Healthcare</h2>
      
      {user?.role === "patient" && (
        <>
          <Link to="/dashboard" className="block py-2 hover:underline">Dashboard</Link>
          <Link to="/appointments" className="block py-2 hover:underline">Appointments</Link>
          <Link to="/doctors" className="block py-2 hover:underline">Doctors</Link>
          <Link to="/reports" className="block py-2 hover:underline">Reports</Link>
          {commonLinks}
        </>
      )}

      {user?.role === "doctor" && (
        <>
          <Link to="/doctor-dashboard" className="block py-2 hover:underline">Dashboard</Link>
          <Link to="/appointments" className="block py-2 hover:underline">Appointments</Link>
          {commonLinks}
        </>
      )}

      {user?.role === "admin" && (
        <>
          <Link to="/admin-dashboard" className="block py-2 hover:underline">Dashboard</Link>
          {commonLinks}
        </>
      )}

      {user?.role === "lab" && (
        <>
          <Link to="/lab-dashboard" className="block py-2 hover:underline">Dashboard</Link>
          <Link to="/reports" className="block py-2 hover:underline">Manage Reports</Link>
          {commonLinks}
        </>
      )}
    </div>
  );
};

export default Sidebar;
