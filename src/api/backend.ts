import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { 
  AuthResponse, 
  WishlistResponse, 
  UserWithWishlist, 
  RegisterUserData, 
  LoginCredentials, 
  WishlistUpdateData 
} from '../types';

/**
 * Backend API Service
 * All backend API calls for authentication and wishlist
 */

// Create axios instance with base URL
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = JSON.parse(localStorage.getItem('token') || 'null');
    if (token && config.headers) {
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
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

/**
 * Register a new user
 */
export const registerUser = async (userData: RegisterUserData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/api/users/register', userData);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message || 'Registration failed');
  }
};

/**
 * Login user
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/api/users/login', credentials);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message || 'Login failed');
  }
};

/**
 * Get user data
 */
export const getUserData = async (): Promise<UserWithWishlist> => {
  try {
    const response = await axiosInstance.get<UserWithWishlist>('/api/users/get');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message || 'Failed to get user data');
  }
};

/**
 * Update wishlist (add or remove coin)
 */
export const updateWishlist = async (data: WishlistUpdateData): Promise<WishlistResponse> => {
  try {
    const response = await axiosInstance.post<WishlistResponse>('/api/users/wishlist', data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message || 'Failed to update wishlist');
  }
};

export default axiosInstance;
