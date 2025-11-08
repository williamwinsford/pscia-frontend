'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService, User, AuthError } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username?: string,
    first_name?: string,
    last_name?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  changeEmail: (newEmail: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const clearError = () => setError(null);

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error);
    const errorMessage = error.message || 'Ocorreu um erro.';
    setError(errorMessage);
    throw error;
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await authService.login(email, password);
      await loadUser();
      setError(null); // Clear error on successful login
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    username?: string,
    first_name?: string,
    last_name?: string
  ) => {
    try {
      setError(null);
      setIsLoading(true);
      await authService.register(email, password, username, first_name, last_name);
      await loadUser();
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setError(null);
      await authService.changePassword(oldPassword, newPassword);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const changeEmail = async (newEmail: string) => {
    try {
      setError(null);
      await authService.changeEmail(newEmail);
      // Reload user to get updated email
      await loadUser();
    } catch (error) {
      handleAuthError(error);
    }
  };

  const deleteAccount = async () => {
    try {
      setError(null);
      await authService.deleteAccount();
      setUser(null);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const loadUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setError(null); // Clear any previous errors on successful user load
      }
    } catch (error: any) {
      console.error('Failed to load user:', error);
      // Only clear tokens if it's a session expired error, otherwise just clear user
      if (error?.message?.includes('Sessão expirada') || error?.message?.includes('Session expired')) {
        authService.logout();
      }
      setUser(null);
    }
  };

  const checkAuth = async () => {
    try {
      const authData = await authService.checkAuth();
      if (authData.auth !== 'Visitor' && authData.user) {
        setUser(authData.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        await checkAuth();
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    changeEmail,
    deleteAccount,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
