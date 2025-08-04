
import React, { useState, useEffect, ReactNode } from 'react';
import axiosInstance from '@/api/axiosConfig';
import { AuthContext } from '@/context/AuthContext';
import { User, LoginResponse, LoginRequest, AuthContextType } from '@/types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        const userData: User = JSON.parse(storedUser);
        // Check if token is still valid
        const tokenExpiration = new Date(userData.tokenExpiration);
        if (tokenExpiration > new Date()) {
          setUser(userData);
        } else {
          // Token expired, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<void> => {
    try {
      const loginData: LoginRequest = {
        email,
        password,
        rememberMe
      };

      const response = await axiosInstance.post<LoginResponse>('/Account/auth_login', loginData);
      const data = response.data;
      
      if (data.response?.status === 'Success' && data.userProfile) {
        const userData = data.userProfile;
        setUser(userData);
        
        // Store user data and token
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', userData.token);
      } else {
        throw new Error(data.response?.message || 'Login failed');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};