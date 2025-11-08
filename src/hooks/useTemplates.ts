'use client';

import { useState, useCallback } from 'react';
import { templatesService, Template, CreateTemplateDto, UpdateTemplateDto } from '@/services/templates';

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleError = (error: any) => {
    console.error('Templates hook error:', error);
    const errorMessage = error.message || 'An error occurred';
    setError(errorMessage);
  };

  const loadTemplates = useCallback(async (filters?: {
    category?: string;
    is_public?: boolean;
    search?: string;
  }) => {
    setIsLoading(true);
    clearError();
    
    try {
      const data = await templatesService.getTemplates(filters);
      setTemplates(data);
      return data;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadTemplate = useCallback(async (id: number) => {
    setIsLoading(true);
    clearError();
    
    try {
      const data = await templatesService.getTemplate(id);
      return data;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (data: CreateTemplateDto) => {
    setIsLoading(true);
    clearError();
    
    try {
      const newTemplate = await templatesService.createTemplate(data);
      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTemplate = useCallback(async (id: number, data: UpdateTemplateDto) => {
    setIsLoading(true);
    clearError();
    
    try {
      const updatedTemplate = await templatesService.updateTemplate(id, data);
      setTemplates(prev => 
        prev.map(t => t.id === id ? updatedTemplate : t)
      );
      return updatedTemplate;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTemplate = useCallback(async (id: number) => {
    setIsLoading(true);
    clearError();
    
    try {
      await templatesService.deleteTemplate(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const duplicateTemplate = useCallback(async (id: number) => {
    setIsLoading(true);
    clearError();
    
    try {
      const duplicated = await templatesService.duplicateTemplate(id);
      setTemplates(prev => [duplicated, ...prev]);
      return duplicated;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMyTemplates = useCallback(async () => {
    setIsLoading(true);
    clearError();
    
    try {
      const data = await templatesService.getMyTemplates();
      return data;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPublicTemplates = useCallback(async () => {
    setIsLoading(true);
    clearError();
    
    try {
      const data = await templatesService.getPublicTemplates();
      return data;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCategories = useCallback(async () => {
    setIsLoading(true);
    clearError();
    
    try {
      const data = await templatesService.getCategories();
      return data;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    templates,
    isLoading,
    error,
    clearError,
    loadTemplates,
    loadTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    loadMyTemplates,
    loadPublicTemplates,
    getCategories,
    extractVariables: templatesService.extractVariables.bind(templatesService),
  };
};