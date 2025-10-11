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
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.detail || 'An error occurred');
      }

      return await response.json();
    } catch (error) {
      console.error('Audio service error:', error);
      throw error;
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

    const token = this.getAccessToken();
    const response = await fetch(`${this.baseURL}/upload/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    return await response.json();
  }

  async getAudioFiles(): Promise<AudioFile[]> {
    return this.request<AudioFile[]>('/files/');
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
    return this.request<Conversation>('/conversation/', {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
        audio_file_id: audioFileId,
      }),
    });
  }

  async getConversations(): Promise<Conversation[]> {
    return this.request<Conversation[]>('/conversations/');
  }

  async getConversation(conversationId: number): Promise<Conversation> {
    return this.request<Conversation>(`/conversation/${conversationId}/`);
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


