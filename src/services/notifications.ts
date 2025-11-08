import { getApiEndpoint } from '@/lib/config';
import { ApiClient } from '@/lib/api-client';

export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: 'info' | 'success' | 'warning' | 'error' | 'system';
  is_read: boolean;
  created_at: string;
  read_at: string | null;
  expires_at: string | null;
  action_url: string | null;
  action_text: string | null;
}

export interface UnreadCountResponse {
  unread_count: number;
}

const API_BASE_URL = getApiEndpoint('/notifications');

class NotificationsService {
  private client: ApiClient;

  constructor() {
    this.client = new ApiClient({
      baseURL: API_BASE_URL,
      getAccessToken: () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('access_token');
      },
    });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    return this.client.request<T>(endpoint, options);
  }

  async getNotifications(): Promise<Notification[]> {
    return this.request<Notification[]>('/user/');
  }

  async getUnreadCount(): Promise<number> {
    const response = await this.request<UnreadCountResponse>('/user/unread-count/');
    return response.unread_count;
  }

  async markAsRead(id: number): Promise<void> {
    await this.request(`/user/mark-read/${id}/`, {
      method: 'PUT',
    });
  }

  async markAllAsRead(): Promise<void> {
    await this.request('/user/mark-all-read/', {
      method: 'PUT',
    });
  }
}

export const notificationsService = new NotificationsService();

