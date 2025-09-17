import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, ApiError } from '../services/api';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  last_login?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored authentication on mount
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const token = localStorage.getItem('auth-token');

      if (token) {
        // Validate token with server
        const userData = await apiService.getMe();
        setUser(userData.admin);
      }
    } catch (error) {
      console.error('Error checking stored auth:', error);
      // Clear invalid stored data
      apiService.clearToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.login(username, password);
      setUser(response.admin);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Error de conexión. Por favor intente nuevamente.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};