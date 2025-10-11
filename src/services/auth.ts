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
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = this.getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: AuthError = await response.json();
        throw new Error(errorData.detail || errorData.error || 'An error occurred');
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
    const response = await this.request<LoginResponse>('/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setTokens(response.access, response.refresh);
    return response;
  }

  async register(
    email: string,
    password: string,
    username?: string,
    first_name?: string,
    last_name?: string
  ): Promise<RegisterResponse> {
    const response = await this.request<RegisterResponse>('/create_user/', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        username,
        first_name,
        last_name,
      }),
    });

    this.setTokens(response.access, response.refresh);
    return response;
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

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/get_user/');
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
      return await this.request<{ auth: string; user?: User }>('/check_auth/', {
        method: 'POST',
      });
    } catch (error) {
      return { auth: 'Visitor' };
    }
  }
}

export const authService = new AuthService();
export default authService;


