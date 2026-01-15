import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { loginUser as apiLoginUser, registerUser as apiRegisterUser, getUserData } from '../api/backend';
import { toast } from 'react-toastify';
import type { User, CoinMarketData, LoginCredentials, RegisterUserData } from '../types';

/**
 * Authentication Context
 */

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  wishlist: CoinMarketData[];
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  logout: () => void;
  updateWishlist: (newWishlist: CoinMarketData[]) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<CoinMarketData[]>([]);

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

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const data = await apiLoginUser(credentials);
      localStorage.setItem('token', JSON.stringify(data.token));
      
      setUser({
        id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
      setIsAuthenticated(true);
      
      const fullUserData = await getUserData();
      setWishlist(fullUserData.wishlist || []);
      
      toast.success('Login successful!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData: RegisterUserData): Promise<void> => {
    try {
      const data = await apiRegisterUser(userData);
      localStorage.setItem('token', JSON.stringify(data.token));
      
      setUser({
        id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
      setIsAuthenticated(true);
      setWishlist([]);
      
      toast.success('Registration successful!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setWishlist([]);
    toast.info('Logged out successfully');
  };

  const updateWishlist = (newWishlist: CoinMarketData[]): void => {
    setWishlist(newWishlist);
  };

  const value: AuthContextType = {
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
