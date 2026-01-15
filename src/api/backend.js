import axios from 'axios';

/**
 * Backend API Service
 * All backend API calls for authentication and wishlist
 */

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('token') || 'null');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User data with token
 */
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/api/users/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

/**
 * Login user
 * @param {Object} credentials - Email and password
 * @returns {Promise<Object>} User data with token
 */
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/api/users/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

/**
 * Get user data
 * @returns {Promise<Object>} User data with wishlist
 */
export const getUserData = async () => {
  try {
    const response = await axiosInstance.get('/api/users/get');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get user data');
  }
};

/**
 * Update wishlist (add or remove coin)
 * @param {Object} data - Coin data and user email
 * @returns {Promise<Object>} Response with message
 */
export const updateWishlist = async (data) => {
  try {
    const response = await axiosInstance.post('/api/users/wishlist', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update wishlist');
  }
};

export default axiosInstance;
