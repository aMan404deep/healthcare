// import { createContext, useContext, useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode"; 

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Initialize auth state from localStorage
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token); 
        
//         if (decoded.exp * 1000 < Date.now()) {
//           localStorage.removeItem("token");
//           setIsAuthenticated(false);
//           setUser(null);
//           setUserRole(null);
//         } else {
//           setUser({ id: decoded.id });
//           setUserRole(decoded.role);
//           setIsAuthenticated(true);
//         }
//       } catch (error) {
//         console.error("Invalid token:", error);
//         localStorage.removeItem("token");
//         setIsAuthenticated(false);
//         setUser(null);
//         setUserRole(null);
//       }
//     }
//     setLoading(false);
//   }, []);

//   // Login function
//   const login = (token, role) => {
//     setIsAuthenticated(true);
//     const decoded = jwtDecode(token); // Just call jwtDecode directly
//     setUser({ id: decoded.id });
//     setUserRole(role);
//   };

//   // Logout function
//   const logout = () => {
//     localStorage.removeItem("token");
//     setIsAuthenticated(false);
//     setUser(null);
//     setUserRole(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, isAuthenticated, userRole, login, logout, loading }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode"; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    userRole: null,
    loading: true,
    token: null
  });

  // Initialize auth state from localStorage - only runs once
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setAuthState(prev => ({ 
          ...prev, 
          loading: false,
          isAuthenticated: false,
          user: null,
          userRole: null,
          token: null
        }));
        return;
      }
      
      try {
        const decoded = jwtDecode(token);
        
        if (decoded.exp * 1000 < Date.now()) {
          // Token expired
          localStorage.removeItem("token");
          setAuthState(prev => ({ 
            ...prev, 
            loading: false,
            isAuthenticated: false,
            user: null,
            userRole: null,
            token: null
          }));
        } else {
          // Valid token
          setAuthState({
            user: { id: decoded.id },
            userRole: decoded.role,
            isAuthenticated: true,
            loading: false,
            token
          });
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setAuthState(prev => ({ 
          ...prev, 
          loading: false,
          isAuthenticated: false,
          user: null,
          userRole: null,
          token: null
        }));
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = (token, role) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setAuthState({
      user: { id: decoded.id },
      userRole: role,
      isAuthenticated: true,
      loading: false,
      token
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      user: null,
      userRole: null,
      isAuthenticated: false,
      loading: false,
      token: null
    });
  };

  // Create a memoized value of the auth context
  const contextValue = useMemo(
    () => ({
      ...authState,
      login,
      logout
    }),
    [authState]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};