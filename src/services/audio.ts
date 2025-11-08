import { getApiEndpoint } from '@/lib/config';

const API_BASE_URL = getApiEndpoint('/audio');

export interface AudioFile {
  id: number;
  file_name: string;
  file_size: number;
  duration?: number;
  mime_type: string;
  uploaded_at: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
}

export interface Transcription {
  id: number;
  audio_file: AudioFile;
  text: string;
  language: string;
  confidence?: number;
  created_at: string;
  updated_at: string;
  analyses?: AudioAnalysis[];
}

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  title: string;
  messages: Message[];
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface AudioAnalysis {
  id: number;
  audio_file: number;
  analysis_type: 'sentiment' | 'keywords' | 'summary' | 'topics';
  result: any;
  created_at: string;
}

export interface DashboardStatistics {
  total_files: number;
  completed_files: number;
  time_saved_hours: number;
  average_accuracy: number;
  total_conversations: number;
  total_templates: number;
  recent_activity: Array<{
    action: string;
    file: string;
    time: string;
    status: string;
    id: number;
    type?: 'audio' | 'conversation';
  }>;
}

class AudioService {
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
        // Handle 401 - token expired, try to refresh
        if (response.status === 401) {
          try {
            await this.refreshAccessToken();
            
            // Retry the request with the new token
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
              throw new Error(errorData.error || errorData.detail || 'Ocorreu um erro.');
            }
            
            return await retryResponse.json();
          } catch (refreshError) {
            console.error('Failed to refresh token:', refreshError);
            // Redirect to login on refresh failure
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            throw new Error('Sessão expirada. Por favor, faça login novamente.');
          }
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.detail || 'Ocorreu um erro.');
      }

      return await response.json();
    } catch (error) {
      console.error('Audio service error:', error);
      throw error;
    }
  }

  private async refreshAccessToken(): Promise<void> {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refresh_token')
      : null;
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const { getApiEndpoint } = await import('@/lib/config');
    const refreshUrl = getApiEndpoint('/accounts/refresh/');
    
    const response = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access);
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }
    }
  }

  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  // Audio file management
  async uploadAudio(file: File, language: string = 'pt-BR'): Promise<AudioFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    let token = this.getAccessToken();
    
    try {
      let response = await fetch(`${this.baseURL}/upload/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // Handle 401 - token expired
      if (response.status === 401) {
        await this.refreshAccessToken();
        token = this.getAccessToken();
        
        // Retry with new token
        response = await fetch(`${this.baseURL}/upload/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.detail || 'Upload failed');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Upload error:', error);
      // Redirect to login if token refresh failed
      if (error.message?.includes('Session expired') || error.message?.includes('Failed to refresh')) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      throw error;
    }
  }

  async getAudioFiles(): Promise<AudioFile[]> {
    return this.request<AudioFile[]>('/files/');
  }

  async deleteAudioFile(audioFileId: number): Promise<void> {
    return this.request<void>(`/files/${audioFileId}/`, {
      method: 'DELETE',
    });
  }

  async getTranscription(audioFileId: number): Promise<Transcription> {
    return this.request<Transcription>(`/transcription/${audioFileId}/`);
  }

  // Conversation with AI
  async startConversation(
    message: string,
    conversationId?: number,
    audioFileId?: number
  ): Promise<Conversation> {
    const body: any = {
      message,
    };
    
    if (conversationId !== undefined && conversationId !== null) {
      body.conversation_id = conversationId;
    }
    
    if (audioFileId !== undefined && audioFileId !== null) {
      body.audio_file_id = audioFileId;
    }
    
    return this.request<Conversation>('/conversation/', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async getConversations(): Promise<Conversation[]> {
    return this.request<Conversation[]>('/conversations/');
  }

  async getConversation(conversationId: number): Promise<Conversation> {
    return this.request<Conversation>(`/conversation/${conversationId}/`);
  }

  async updateConversation(conversationId: number, title: string): Promise<Conversation> {
    return this.request<Conversation>(`/conversation/${conversationId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ title }),
    });
  }

  async deleteConversation(conversationId: number): Promise<void> {
    return this.request<void>(`/conversation/${conversationId}/`, {
      method: 'DELETE',
    });
  }

  // Audio analysis
  async analyzeAudio(
    audioFileId: number,
    analysisType: 'sentiment' | 'keywords' | 'summary' | 'topics'
  ): Promise<AudioAnalysis> {
    return this.request<AudioAnalysis>('/analyze/', {
      method: 'POST',
      body: JSON.stringify({
        audio_file_id: audioFileId,
        analysis_type: analysisType,
      }),
    });
  }

  async getAudioAnalyses(audioFileId: number): Promise<AudioAnalysis[]> {
    return this.request<AudioAnalysis[]>(`/analyses/${audioFileId}/`);
  }

  // Format transcription with template
  async formatTranscriptionTemplate(
    audioFileId: number,
    templateId: number
  ): Promise<{ filled_content: string; template_name: string; template_id: number }> {
    return this.request<{ filled_content: string; template_name: string; template_id: number }>(
      `/transcription/${audioFileId}/format-template/`,
      {
        method: 'POST',
        body: JSON.stringify({ template_id: templateId }),
      }
    );
  }

  // Dashboard statistics
  async getStatistics(): Promise<DashboardStatistics> {
    return this.request<DashboardStatistics>('/statistics/');
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'uploading':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'uploading':
        return 'Enviando';
      case 'processing':
        return 'Processando';
      case 'completed':
        return 'Concluído';
      case 'failed':
        return 'Falhou';
      default:
        return 'Desconhecido';
    }
  }
}

export const audioService = new AudioService();
export default audioService;


