// import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [role, setRole] = useState(localStorage.getItem("role"));
//   const navigate = useNavigate();

//   const login = (token, role) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("role", role);
//     setToken(token);
//     setRole(role);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     setToken(null);
//     setRole(null);
//     navigate("/login");
//   };

//   useEffect(() => {
//     setToken(localStorage.getItem("token"));
//     setRole(localStorage.getItem("role"));
//   }, []);

//   return (
//     <AuthContext.Provider value={{ token, role, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Correct import for newer versions

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token); // Just call jwtDecode directly
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
          setUserRole(null);
        } else {
          setUser({ id: decoded.id });
          setUserRole(decoded.role);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (token, role) => {
    setIsAuthenticated(true);
    const decoded = jwtDecode(token); // Just call jwtDecode directly
    setUser({ id: decoded.id });
    setUserRole(role);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, userRole, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};