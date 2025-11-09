import { getApiEndpoint } from '@/lib/config';

const API_BASE_URL = getApiEndpoint('/accounts');

export interface User {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_tester: boolean;
  date_joined: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface AuthError {
  detail?: string;
  error?: string;
  message?: string;
  [key: string]: any;
}

class AuthService {
  private baseURL = API_BASE_URL;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    skipAuth: boolean = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available and not skipping auth
    if (!skipAuth) {
      const token = this.getAccessToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      const response = await fetch(url, config);
      
      // Handle 401 with automatic token refresh
      if (response.status === 401 && !skipAuth) {
        console.log('Received 401, attempting to refresh token...');
        
        try {
          // Attempt to refresh the token
          const refreshToken = this.getRefreshToken();
          if (!refreshToken) {
            this.clearTokens();
            throw new Error('Sessão expirada. Por favor, faça login novamente.');
          }

          // Make refresh request without auth - use direct fetch to avoid recursion
          const refreshUrl = `${this.baseURL}/refresh/`;
          const refreshResponse = await fetch(refreshUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (!refreshResponse.ok) {
            this.clearTokens();
            throw new Error('Sessão expirada. Por favor, faça login novamente.');
          }

          const refreshData = await refreshResponse.json() as LoginResponse;

          this.setTokens(refreshData.access, refreshData.refresh);
          
          // Retry the original request with the new token
          const newToken = this.getAccessToken();
          if (newToken) {
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            };
          }
          
          const retryResponse = await fetch(url, config);
          
          if (!retryResponse.ok) {
            const errorData = await retryResponse.json();
            throw new Error(errorData.detail || errorData.error || 'Ocorreu um erro.');
          }
          
          return await retryResponse.json();
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          this.clearTokens();
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }
      }
      
      if (!response.ok) {
        const errorData: AuthError = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Ocorreu um erro.');
      }

      return await response.json();
    } catch (error) {
      console.error('Auth service error:', error);
      throw error;
    }
  }

  // Token management
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  private setTokens(access: string, refresh: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Auth methods
  async login(email: string, password: string): Promise<LoginResponse> {
    // Clear any existing tokens before login
    this.clearTokens();
    
    // Login should not use auth token, so skip auth and don't attempt refresh
    const url = `${this.baseURL}/login/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData: AuthError = await response.json();
      throw new Error(errorData.detail || errorData.error || 'Credenciais inválidas. Por favor, verifique seu email e senha.');
    }

    const loginData = await response.json() as LoginResponse;
    this.setTokens(loginData.access, loginData.refresh);
    return loginData;
  }

  async register(
    email: string,
    password: string,
    username?: string,
    first_name?: string,
    last_name?: string
  ): Promise<RegisterResponse> {
    // Clear any existing tokens before register
    this.clearTokens();
    
    // Register should not use auth token, so skip auth and don't attempt refresh
    const url = `${this.baseURL}/create_user/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        username,
        first_name,
        last_name,
      }),
    });

    if (!response.ok) {
      const errorData: AuthError = await response.json();
      throw new Error(errorData.detail || errorData.error || 'Ocorreu um erro ao criar a conta.');
    }

    const registerData = await response.json() as RegisterResponse;
    this.setTokens(registerData.access, registerData.refresh);
    return registerData;
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      try {
        await this.request('/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    this.clearTokens();
  }

  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<LoginResponse>('/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });

    this.setTokens(response.access, response.refresh);
    return response;
  }

  async getCurrentUser(isAfterLogin: boolean = false, retryCount: number = 0): Promise<User> {
    const maxRetries = isAfterLogin ? 2 : 0;
    
    try {
      return await this.request<User>('/get_user/');
    } catch (error: any) {
      // If this is after login and we haven't exceeded retries, retry with delay
      if (isAfterLogin && retryCount < maxRetries) {
        console.log(`Retrying getCurrentUser (attempt ${retryCount + 1}/${maxRetries + 1})...`);
        // Wait progressively longer for each retry
        await new Promise(resolve => setTimeout(resolve, 100 * (retryCount + 1)));
        return this.getCurrentUser(true, retryCount + 1);
      }
      
      // If it's a 401 after login, it might be a token sync issue - don't clear tokens immediately
      if (isAfterLogin && error?.message && !error.message.includes('Sessão expirada')) {
        // Give it one more chance after a longer delay
        if (retryCount === 0) {
          console.log('Token might not be synced yet, retrying after longer delay...');
          await new Promise(resolve => setTimeout(resolve, 300));
          return this.getCurrentUser(true, retryCount + 1);
        }
      }
      
      throw error;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.request<User>('/update_profile/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await this.request('/changepassword/', {
      method: 'PUT',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });
  }

  async changeEmail(newEmail: string): Promise<void> {
    await this.request('/changeemail/', {
      method: 'PUT',
      body: JSON.stringify({ email: newEmail }),
    });
  }

  async deleteAccount(): Promise<void> {
    await this.request('/delete_user/', {
      method: 'DELETE',
    });
    this.clearTokens();
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  async checkAuth(): Promise<{ auth: string; user?: User }> {
    try {
      // Check auth without attempting token refresh to avoid loops
      const url = `${this.baseURL}/check_auth/`;
      const token = this.getAccessToken();
      
      const config: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Add token if available, but don't attempt refresh on 401
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await fetch(url, config);
      
      if (!response.ok) {
        // If unauthorized, clear tokens and return visitor status
        if (response.status === 401) {
          this.clearTokens();
          return { auth: 'Visitor' };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // If check fails (e.g., expired token, network error), return Visitor status
      console.log('Auth check failed, treating user as visitor');
      return { auth: 'Visitor' };
    }
  }
}

export const authService = new AuthService();
export default authService;
