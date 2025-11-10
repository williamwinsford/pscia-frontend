'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { DashboardLayout } from '@/components/DashboardLayout';
import { NoIndex } from '@/components/NoIndex';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tabs,
  Tab,
  Alert,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Bell,
  CheckCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  Settings,
  Filter
} from 'lucide-react';

// Função para formatar data relativa
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'agora';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
  } else {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

// Função para obter cor e ícone do tipo de notificação
const getNotificationTypeConfig = (type: string) => {
  switch (type) {
    case 'info':
      return { color: 'primary' as const, icon: Info, label: 'Informação' };
    case 'success':
      return { color: 'success' as const, icon: CheckCircle, label: 'Sucesso' };
    case 'warning':
      return { color: 'warning' as const, icon: AlertTriangle, label: 'Aviso' };
    case 'error':
      return { color: 'error' as const, icon: XCircle, label: 'Erro' };
    default:
      return { color: 'primary' as const, icon: Bell, label: 'Sistema' };
  }
};

export default function NotificationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    clearError
  } = useNotifications();

  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login';
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user, loadNotifications]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };

  // Filtrar notificações
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

    // Filtro por status
    if (statusFilter === 'unread') {
      filtered = filtered.filter(n => !n.is_read);
    } else if (statusFilter === 'read') {
      filtered = filtered.filter(n => n.is_read);
    }

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.notification_type === typeFilter);
    }

    return filtered;
  }, [notifications, statusFilter, typeFilter]);

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <NoIndex />
      <DashboardLayout>
      <Box
        sx={{
          maxWidth: { xs: '100%', md: '1400px', lg: '1600px' },
          py: 2,
          width: '100%',
          mx: 'auto'
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Notificações
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {unreadCount > 0 
                  ? `${unreadCount} ${unreadCount === 1 ? 'notificação não lida' : 'notificações não lidas'}`
                  : 'Todas as notificações foram lidas'
                }
              </Typography>
            </Box>
            {unreadCount > 0 && (
              <Button
                variant="outlined"
                startIcon={<CheckCircle2 size={18} />}
                onClick={handleMarkAllAsRead}
                disabled={markingAll}
                sx={{ minWidth: 200 }}
              >
                {markingAll ? 'Marcando...' : 'Marcar todas como lidas'}
              </Button>
            )}
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          {/* Filters */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Tabs
                value={statusFilter}
                onChange={(_, newValue) => setStatusFilter(newValue)}
                sx={{ 
                  minHeight: 'auto',
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500
                  }
                }}
              >
                <Tab label="Todas" value="all" sx={{ minHeight: 'auto', py: 1, textTransform: 'none' }} />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Não lidas
                      {unreadCount > 0 && (
                        <Chip label={unreadCount} size="small" color="error" sx={{ height: 20 }} />
                      )}
                    </Box>
                  } 
                  value="unread" 
                  sx={{ minHeight: 'auto', py: 1, textTransform: 'none' }} 
                />
                <Tab label="Lidas" value="read" sx={{ minHeight: 'auto', py: 1, textTransform: 'none' }} />
              </Tabs>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="Todos os tipos"
                onClick={() => setTypeFilter('all')}
                color={typeFilter === 'all' ? 'primary' : 'default'}
                variant={typeFilter === 'all' ? 'filled' : 'outlined'}
                size="small"
              />
              <Chip
                label="Informação"
                onClick={() => setTypeFilter('info')}
                color={typeFilter === 'info' ? 'primary' : 'default'}
                variant={typeFilter === 'info' ? 'filled' : 'outlined'}
                size="small"
              />
              <Chip
                label="Sucesso"
                onClick={() => setTypeFilter('success')}
                color={typeFilter === 'success' ? 'success' : 'default'}
                variant={typeFilter === 'success' ? 'filled' : 'outlined'}
                size="small"
              />
              <Chip
                label="Aviso"
                onClick={() => setTypeFilter('warning')}
                color={typeFilter === 'warning' ? 'warning' : 'default'}
                variant={typeFilter === 'warning' ? 'filled' : 'outlined'}
                size="small"
              />
              <Chip
                label="Erro"
                onClick={() => setTypeFilter('error')}
                color={typeFilter === 'error' ? 'error' : 'default'}
                variant={typeFilter === 'error' ? 'filled' : 'outlined'}
                size="small"
              />
              <Chip
                label="Sistema"
                onClick={() => setTypeFilter('system')}
                color={typeFilter === 'system' ? 'default' : 'default'}
                variant={typeFilter === 'system' ? 'filled' : 'outlined'}
                size="small"
              />
            </Stack>
          </Box>
        </Box>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Bell size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Nenhuma notificação
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {statusFilter === 'unread' 
                  ? 'Você não tem notificações não lidas'
                  : 'Você não tem notificações para exibir'
                }
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {filteredNotifications.map((notification) => {
              const typeConfig = getNotificationTypeConfig(notification.notification_type);
              const Icon = typeConfig.icon;

              return (
                <Card
                  key={notification.id}
                  sx={{
                    borderLeft: `4px solid`,
                    borderColor: `${typeConfig.color}.main`,
                    backgroundColor: notification.is_read ? 'background.paper' : 'action.hover',
                    cursor: notification.action_url ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: `${typeConfig.color}.light`,
                            color: `${typeConfig.color}.main`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Icon size={20} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: notification.is_read ? 500 : 700,
                                color: notification.is_read ? 'text.secondary' : 'text.primary'
                              }}
                            >
                              {notification.title}
                            </Typography>
                            <Chip
                              label={typeConfig.label}
                              size="small"
                              color={typeConfig.color}
                              sx={{ height: 20, fontSize: '0.65rem' }}
                            />
                            {!notification.is_read && (
                              <Chip
                                label="Não lida"
                                size="small"
                                color="error"
                                sx={{ height: 20, fontSize: '0.65rem' }}
                              />
                            )}
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1, whiteSpace: 'pre-wrap' }}
                          >
                            {notification.message}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Typography variant="caption" color="text.secondary">
                              {formatRelativeTime(notification.created_at)}
                            </Typography>
                            {notification.action_url && notification.action_text && (
                              <Button
                                size="small"
                                variant="text"
                                color={typeConfig.color}
                                sx={{ minWidth: 'auto', px: 1 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNotificationClick(notification);
                                }}
                              >
                                {notification.action_text} →
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Box>
                      {!notification.is_read && (
                        <Tooltip title="Marcar como lida">
                          <IconButton
                            size="small"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await handleMarkAsRead(notification.id);
                            }}
                            sx={{ ml: 1 }}
                          >
                            <CheckCircle2 size={18} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
      </Box>
    </DashboardLayout>
    </>
  );
}

