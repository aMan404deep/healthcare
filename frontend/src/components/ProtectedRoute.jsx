import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import for newer versions

const ProtectedRoute = ({ allowedRoles, children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // null means checking
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    try {
      const decoded = jwtDecode(token); // Just call jwtDecode directly
      const role = decoded.role;

      if (allowedRoles.includes(role)) {
        setUserRole(role);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      console.error("Invalid token:", err);
      setIsAuthorized(false);
    }
  }, [allowedRoles]);

  if (isAuthorized === null) return <div>Loading...</div>; // you can show a spinner here

  return isAuthorized ? children : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;