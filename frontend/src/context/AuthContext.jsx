import { createContext, useEffect, useReducer } from 'react';
import { loginUser, registerUser, verifyOtp } from '../services/authService';

export const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  otpSent: false,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
        otpSent: false,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'OTP_SENT':
      return {
        ...state,
        loading: false,
        otpSent: true,
        email: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored token on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: JSON.parse(storedUser),
        });
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };
    
    checkAuth();
  }, []);

  // Register user
  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      await registerUser(userData);
      return true;
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'Registration failed',
      });
      return false;
    }
  };

  // Login user (first step: send OTP)
  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      await loginUser(email, password);
      dispatch({
        type: 'OTP_SENT',
        payload: email,
      });
      return true;
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'Login failed',
      });
      return false;
    }
  };

  // Verify OTP
  const verify = async (email, otp) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await verifyOtp(email, otp);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: response.user,
      });
      return true;
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'OTP verification failed',
      });
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        otpSent: state.otpSent,
        email: state.email,
        register,
        login,
        verify,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}