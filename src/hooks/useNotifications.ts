'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { notificationsService, Notification } from '@/services/notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearError = () => setError(null);

  const handleError = (error: any) => {
    console.error('Notifications hook error:', error);
    let errorMessage = 'Ocorreu um erro ao carregar notificações.';
    
    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.detail) {
      errorMessage = error.detail;
    } else if (error?.error) {
      errorMessage = error.error;
    }
    
    setError(errorMessage);
  };

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    clearError();
    
    try {
      const data = await notificationsService.getNotifications();
      setNotifications(data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUnreadCount = useCallback(async () => {
    // Evitar múltiplas chamadas simultâneas
    if (isLoadingRef.current) {
      return;
    }
    
    isLoadingRef.current = true;
    try {
      const count = await notificationsService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      // Não mostrar erro no contador para não poluir a UI
      console.error('Error loading unread count:', error);
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationsService.markAsRead(id);
      // Atualizar estado local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id 
            ? { ...notif, is_read: true, read_at: new Date().toISOString() }
            : notif
        )
      );
      // Atualizar contador
      if (unreadCount > 0) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [unreadCount]);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsService.markAllAsRead();
      // Atualizar estado local
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, []);

  // Retornar últimas 3 notificações (não lidas primeiro)
  const getRecentNotifications = useCallback((limit: number = 3): Notification[] => {
    const unread = notifications.filter(n => !n.is_read);
    const read = notifications.filter(n => n.is_read);
    
    const sorted = [...unread, ...read].slice(0, limit);
    return sorted;
  }, [notifications]);

  // Auto-refresh do contador a cada 60 segundos (aumentado de 30 para reduzir requisições)
  useEffect(() => {
    // Limpar intervalo anterior se existir
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Carregar imediatamente apenas uma vez
    loadUnreadCount();
    
    // Configurar intervalo de 60 segundos
    intervalRef.current = setInterval(() => {
      loadUnreadCount();
    }, 60000); // 60 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remover loadUnreadCount das dependências para evitar re-criação do intervalo

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    getRecentNotifications,
    clearError,
  };
};

