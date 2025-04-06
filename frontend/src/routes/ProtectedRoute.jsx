import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles && !roles.includes(role)) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;
