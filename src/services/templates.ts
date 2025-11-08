import { getApiUrl, getApiEndpoint } from '@/lib/config';
import { ApiClient } from '@/lib/api-client';

export interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  category_display: string;
  content: string;
  variables: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user: number;
  user_name?: string;
}

export interface CreateTemplateDto {
  name: string;
  description: string;
  category: string;
  content: string;
  is_public?: boolean;
}

export interface UpdateTemplateDto {
  name?: string;
  description?: string;
  category?: string;
  content?: string;
  is_public?: boolean;
}

const API_BASE_URL = getApiEndpoint('/templates');

class TemplatesService {
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

  async getTemplates(filters?: {
    category?: string;
    is_public?: boolean;
    search?: string;
  }): Promise<Template[]> {
    const params = new URLSearchParams();
    
    if (filters?.category) {
      params.append('category', filters.category);
    }
    
    if (filters?.is_public !== undefined) {
      params.append('is_public', filters.is_public.toString());
    }
    
    if (filters?.search) {
      params.append('search', filters.search);
    }

    return this.request<Template[]>(`/templates/?${params.toString()}`);
  }

  async getTemplate(id: number): Promise<Template> {
    return this.request<Template>(`/templates/${id}/`);
  }

  async createTemplate(data: CreateTemplateDto): Promise<Template> {
    return this.request<Template>('/templates/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTemplate(id: number, data: UpdateTemplateDto): Promise<Template> {
    return this.request<Template>(`/templates/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTemplate(id: number): Promise<void> {
    return this.request<void>(`/templates/${id}/`, {
      method: 'DELETE',
    });
  }

  async duplicateTemplate(id: number): Promise<Template> {
    return this.request<Template>(`/templates/${id}/duplicate/`, {
      method: 'POST',
    });
  }

  async getMyTemplates(): Promise<Template[]> {
    return this.request<Template[]>('/templates/my_templates/');
  }

  async getPublicTemplates(): Promise<Template[]> {
    return this.request<Template[]>('/templates/public_templates/');
  }

  async getCategories(): Promise<Array<{ value: string; label: string }>> {
      return this.request<Array<{ value: string; label: string }>>('/templates/categories/');
  }

  async makeTemplatePublic(id: number): Promise<Template> {
    return this.request<Template>(`/templates/${id}/make_public/`, {
      method: 'POST',
    });
  }

  async makeTemplatePrivate(id: number): Promise<Template> {
    return this.request<Template>(`/templates/${id}/make_private/`, {
      method: 'POST',
    });
  }

  extractVariables(content: string): string[] {
    const matches = content.match(/\{\{([^}]+)\}\}/g);
    return matches 
      ? [...new Set(matches.map(match => match.replace(/\{\{|\}\}/g, '')))]
      : [];
  }
}

export const templatesService = new TemplatesService();
