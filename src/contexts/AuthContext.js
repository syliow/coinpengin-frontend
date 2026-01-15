import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser as apiLoginUser, registerUser as apiRegisterUser, getUserData } from '../api/backend';
import { toast } from 'react-toastify';

/**
 * Authentication Context
 * Manages user authentication state and provides auth methods
 */

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = JSON.parse(localStorage.getItem('token') || 'null');
      
      if (token) {
        try {
          const userData = await getUserData();
          setUser(userData);
          setWishlist(userData.wishlist || []);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await apiLoginUser(credentials);
      
      // Save token
      localStorage.setItem('token', JSON.stringify(data.token));
      
      // Set user data
      setUser({
        id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
      setIsAuthenticated(true);
      
      // Fetch full user data with wishlist
      const fullUserData = await getUserData();
      setWishlist(fullUserData.wishlist || []);
      
      toast.success('Login successful!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await apiRegisterUser(userData);
      
      // Save token
      localStorage.setItem('token', JSON.stringify(data.token));
      
      // Set user data
      setUser({
        id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
      setIsAuthenticated(true);
      setWishlist([]);
      
      toast.success('Registration successful!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setWishlist([]);
    toast.info('Logged out successfully');
  };

  const updateWishlist = (newWishlist) => {
    setWishlist(newWishlist);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    wishlist,
    login,
    register,
    logout,
    updateWishlist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
