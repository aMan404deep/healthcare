import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow px-6 py-4 ml-64 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-blue-800">
        {user?.role === "patient" && "Patient Dashboard"}
        {user?.role === "doctor" && "Doctor Dashboard"}
        {user?.role === "admin" && "Admin Dashboard"}
        {user?.role === "lab" && "Lab Dashboard"}
      </h1>
      <span className="text-sm text-gray-500">Welcome, {user?.name}</span>
    </nav>
  );
};

export default Navbar;
