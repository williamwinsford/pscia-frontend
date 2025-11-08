'use client';

import { useState, useCallback } from 'react';
import { audioService, AudioFile, Transcription, Conversation, AudioAnalysis } from '@/services/audio';

export const useAudio = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleError = (error: any) => {
    console.error('Audio hook error:', error);
    
    let errorMessage = 'Ocorreu um erro.';
    
    if (error?.message) {
      const message = error.message.toLowerCase();
      
      if (message.includes('negative indexing')) {
        errorMessage = 'Erro ao processar a resposta da IA. Por favor, tente novamente.';
      } else if (message.includes('session expired') || message.includes('sessão expirada')) {
        errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
      } else if (message.includes('network') || message.includes('fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else {
        errorMessage = error.message;
      }
    } else if (error?.detail) {
      errorMessage = error.detail;
    } else if (error?.error) {
      errorMessage = error.error;
    }
    
    setError(errorMessage);
  };

  // Audio file management
  const uploadAudio = useCallback(async (file: File, language: string = 'pt-BR') => {
    setIsLoading(true);
    clearError();
    
    try {
      const uploadedFile = await audioService.uploadAudio(file, language);
      setAudioFiles(prev => [uploadedFile, ...prev]);
      return uploadedFile;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAudioFiles = useCallback(async () => {
    setIsLoading(true);
    clearError();
    
    try {
      const files = await audioService.getAudioFiles();
      setAudioFiles(files);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAudioFile = useCallback(async (audioFileId: number) => {
    setIsLoading(true);
    clearError();
    
    try {
      await audioService.deleteAudioFile(audioFileId);
      setAudioFiles(prev => prev.filter(file => file.id !== audioFileId));
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTranscription = useCallback(async (audioFileId: number) => {
    setIsLoading(true);
    clearError();
    
    try {
      const transcription = await audioService.getTranscription(audioFileId);
      setTranscriptions(prev => {
        const existing = prev.find(t => t.audio_file.id === audioFileId);
        if (existing) {
          return prev.map(t => t.audio_file.id === audioFileId ? transcription : t);
        }
        return [transcription, ...prev];
      });
      return transcription;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Conversation management
  const startConversation = useCallback(async (
    message: string,
    conversationId?: number,
    audioFileId?: number
  ) => {
    setIsLoading(true);
    clearError();
    
    try {
      const conversation = await audioService.startConversation(message, conversationId, audioFileId);
      setConversations(prev => {
        if (conversationId) {
          // Atualizar conversa existente
          return prev.map(c => c.id === conversationId ? conversation : c);
        }
        // Verificar se a conversa já existe antes de adicionar (evitar duplicatas)
        const exists = prev.some(c => c.id === conversation.id);
        if (exists) {
          // Se já existe, atualizar ao invés de adicionar
          return prev.map(c => c.id === conversation.id ? conversation : c);
        }
        // Adicionar nova conversa no início
        return [conversation, ...prev];
      });
      return conversation;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    clearError();
    
    try {
      const convs = await audioService.getConversations();
      setConversations(convs);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getConversation = useCallback(async (conversationId: number) => {
    setIsLoading(true);
    clearError();
    
    try {
      const conversation = await audioService.getConversation(conversationId);
      setConversations(prev => {
        const existing = prev.find(c => c.id === conversationId);
        if (existing) {
          return prev.map(c => c.id === conversationId ? conversation : c);
        }
        return [conversation, ...prev];
      });
      return conversation;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConversation = useCallback(async (conversationId: number, title: string) => {
    setIsLoading(true);
    clearError();
    
    try {
      const conversation = await audioService.updateConversation(conversationId, title);
      setConversations(prev => prev.map(c => c.id === conversationId ? conversation : c));
      return conversation;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteConversation = useCallback(async (conversationId: number) => {
    setIsLoading(true);
    clearError();
    
    try {
      await audioService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Audio analysis
  const analyzeAudio = useCallback(async (
    audioFileId: number,
    analysisType: 'sentiment' | 'keywords' | 'summary' | 'topics'
  ) => {
    setIsLoading(true);
    clearError();
    
    try {
      const analysis = await audioService.analyzeAudio(audioFileId, analysisType);
      return analysis;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAudioAnalyses = useCallback(async (audioFileId: number) => {
    setIsLoading(true);
    clearError();
    
    try {
      const analyses = await audioService.getAudioAnalyses(audioFileId);
      return analyses;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatTranscriptionTemplate = useCallback(async (
    audioFileId: number,
    templateId: number
  ) => {
    setIsLoading(true);
    clearError();
    
    try {
      const result = await audioService.formatTranscriptionTemplate(audioFileId, templateId);
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Utility functions
  const formatFileSize = audioService.formatFileSize;
  const formatDuration = audioService.formatDuration;
  const getStatusColor = audioService.getStatusColor;
  const getStatusText = audioService.getStatusText;

  return {
    // State
    audioFiles,
    transcriptions,
    conversations,
    isLoading,
    error,
    
    // Actions
    uploadAudio,
    loadAudioFiles,
    deleteAudioFile,
    getTranscription,
    startConversation,
    loadConversations,
    getConversation,
    updateConversation,
    deleteConversation,
    analyzeAudio,
    getAudioAnalyses,
    formatTranscriptionTemplate,
    clearError,
    
    // Utilities
    formatFileSize,
    formatDuration,
    getStatusColor,
    getStatusText,
  };
};
