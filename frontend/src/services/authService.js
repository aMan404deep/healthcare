import api from './api';

export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await api.post('/api/auth/verify-otp', { email, otp });
  return response.data;
};