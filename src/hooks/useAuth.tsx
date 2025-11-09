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
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const isAuthenticated = !!user;

  const clearError = () => setError(null);

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error);
    const errorMessage = error.message || 'Ocorreu um erro.';
    setError(errorMessage);
    throw error;
  };

  const login = async (email: string, password: string) => {
    // Prevent race condition with checkAuth
    if (isCheckingAuth) {
      // Wait a bit for checkAuth to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    try {
      setError(null);
      setIsLoggingIn(true);
      setIsLoading(true);
      
      // Perform login
      await authService.login(email, password);
      
      // Wait a small delay to ensure tokens are saved
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Load user with retry logic
      await loadUser(true);
      setError(null); // Clear error on successful login
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoggingIn(false);
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
    // Prevent race condition with checkAuth
    if (isCheckingAuth) {
      // Wait a bit for checkAuth to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    try {
      setError(null);
      setIsLoggingIn(true);
      setIsLoading(true);
      
      await authService.register(email, password, username, first_name, last_name);
      
      // Wait a small delay to ensure tokens are saved
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Load user with retry logic
      await loadUser(true);
      setError(null); // Clear error on successful register
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoggingIn(false);
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

  const loadUser = async (isAfterLogin: boolean = false, retryCount: number = 0) => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser(isAfterLogin, retryCount);
        setUser(userData);
        setError(null); // Clear any previous errors on successful user load
      }
    } catch (error: any) {
      console.error('Failed to load user:', error);
      
      // If this is after login and we haven't retried yet, retry once
      if (isAfterLogin && retryCount === 0) {
        console.log('Retrying loadUser after login...');
        await new Promise(resolve => setTimeout(resolve, 200));
        return loadUser(true, 1);
      }
      
      // Only clear tokens if it's a session expired error, otherwise just clear user
      // Don't propagate errors from loadUser as login errors - they are separate issues
      if (error?.message?.includes('Sessão expirada') || error?.message?.includes('Session expired')) {
        authService.logout();
      }
      
      // If this is after login, don't throw - login was successful, just user loading failed
      // The user can still use the app, we just couldn't load their profile yet
      if (isAfterLogin) {
        console.warn('Login successful but failed to load user profile. User can still use the app.');
        // Don't set user to null after successful login - keep the tokens
        return;
      }
      
      setUser(null);
    }
  };

  const checkAuth = async () => {
    // Prevent multiple simultaneous checkAuth calls
    if (isCheckingAuth) {
      return;
    }
    
    // Don't check auth if user is currently logging in
    if (isLoggingIn) {
      return;
    }
    
    try {
      setIsCheckingAuth(true);
      const authData = await authService.checkAuth();
      if (authData.auth !== 'Visitor' && authData.user) {
        setUser(authData.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsCheckingAuth(false);
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
