'use client';

import { useState, useEffect, startTransition } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  CssBaseline,
  Badge,
  Chip
} from '@mui/material';
import {
  Home,
  Upload,
  MessageCircle,
  FileText,
  History,
  User,
  LogOut,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  FileAudio as Templates,
  MoreVertical,
  Bell
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import packageJson from '../../package.json';

const DRAWER_WIDTH = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Transcrições', href: '/history', icon: History },
  { name: 'Templates', href: '/templates', icon: Templates },
  { name: 'Chat IA', href: '/chat', icon: MessageCircle },
  { name: 'Notificações', href: '/notifications', icon: Bell },
];

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
      year: 'numeric'
    });
  }
};

// Função para obter cor do tipo de notificação
const getNotificationColor = (type: string) => {
  switch (type) {
    case 'info':
      return 'primary';
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    default:
      return 'default';
  }
};

// Função para formatar o label do tipo de notificação
const getNotificationTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'info': 'Informação',
    'success': 'Sucesso',
    'warning': 'Aviso',
    'error': 'Erro',
    'system': 'Sistema'
  };
  return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { 
    notifications,
    unreadCount, 
    getRecentNotifications, 
    loadNotifications, 
    markAsRead,
    loadUnreadCount
  } = useNotifications();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const handleNotificationsMenuOpen = async (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsMenuAnchor(event.currentTarget);
    // Carregar notificações quando abrir o menu
    await loadNotifications();
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsMenuAnchor(null);
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    handleNotificationsMenuClose();
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };

  // Carregar contador quando o componente monta (apenas uma vez)
  useEffect(() => {
    if (user) {
      // O hook useNotifications já carrega automaticamente, não precisa chamar aqui
      // Isso evita chamadas duplicadas
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Remover loadUnreadCount das dependências

  const isActive = (href: string) => pathname === href;
  
  // Mapeamento de rotas para títulos
  const getPageTitle = () => {
    // Verificar rotas exatas primeiro
    const exactMatch = navigation.find(item => isActive(item.href));
    if (exactMatch) return exactMatch.name;
    
    // Mapeamento de rotas para títulos
    const routeTitles: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/upload': 'Upload',
      '/history': 'Transcrições',
      '/templates': 'Templates',
      '/chat': 'Chat IA',
      '/notifications': 'Notificações',
      '/analytics': 'Análises',
      '/profile': 'Perfil',
    };
    
    // Verificar rotas exatas
    if (routeTitles[pathname]) {
      return routeTitles[pathname];
    }
    
    // Verificar rotas dinâmicas
    if (pathname.startsWith('/transcription/')) {
      return 'Transcrição';
    }
    
    // Fallback
    return 'Dashboard';
  };
  
  const recentNotifications = getRecentNotifications(3);
  const hasMoreNotifications = notifications.length > 3;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image 
              src="/logo-up-ai-trasnparent.png" 
              alt="Up Ai Logo" 
              width={40} 
              height={40}
              style={{ objectFit: 'contain' }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Up Ai
          </Typography>
        </Box>
      </Link>

      <Divider />

      {/* Navigation */}
      <List sx={{ flex: 1, pt: 2 }}>
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <ListItem key={item.name} disablePadding sx={{ mb: 0.5, px: 2 }}>
              <ListItemButton
                onClick={(e) => {
                  e.preventDefault();
                  if (pathname !== item.href) {
                    window.location.href = item.href;
                  }
                }}
                sx={{
                  borderRadius: 1,
                  backgroundColor: active ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                  color: active ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: active ? 'rgba(59, 130, 246, 0.18)' : 'grey.100',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: active ? 'primary.main' : 'inherit' }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary={item.name}
                  primaryTypographyProps={{ 
                    fontWeight: active ? 600 : 500,
                    color: active ? 'primary.main' : 'inherit'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Version */}
      <Box 
        sx={{ 
          px: 2, 
          py: 1.5, 
          borderColor: 'divider',
          backgroundColor: 'rgba(0, 0, 0, 0.02)'
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.primary',
            fontSize: '0.8125rem',
            fontWeight: 500,
            textAlign: 'center'
          }}
        >
          Versão {packageJson.version}
        </Typography>
      </Box>

      <Divider />

      {/* User Info */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
            }}
          >
            {user?.first_name?.[0] || user?.email?.[0] || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {user?.first_name || 'Usuário'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleUserMenuOpen}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { backgroundColor: 'grey.100' }
            }}
          >
            <MoreVertical size={18} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ py: 1.25 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon size={24} />
          </IconButton>
          
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontWeight: 600
            }}
          >
            {getPageTitle()}
          </Typography>

          {/* Notifications Icon */}
          <IconButton 
            onClick={handleNotificationsMenuOpen}
            sx={{ ml: 1 }}
            aria-label="notificações"
          >
            <Badge 
              badgeContent={unreadCount > 0 ? unreadCount : 0} 
              color="error"
              invisible={unreadCount === 0}
            >
              <Bell size={20} />
            </Badge>
          </IconButton>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationsMenuAnchor}
            open={Boolean(notificationsMenuAnchor)}
            onClose={handleNotificationsMenuClose}
            PaperProps={{
              sx: { 
                minWidth: 320, 
                maxWidth: 400,
                mt: 1,
                maxHeight: 480,
                overflow: 'auto'
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {recentNotifications.length === 0 ? (
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', width: '100%', py: 2 }}>
                  Nenhuma notificação
                </Typography>
              </MenuItem>
            ) : (
              <>
                {recentNotifications.map((notification) => (
                  <MenuItem
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderLeft: `3px solid`,
                      borderColor: `${getNotificationColor(notification.notification_type)}.main`,
                      backgroundColor: notification.is_read ? 'transparent' : 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: notification.is_read ? 500 : 600,
                            color: notification.is_read ? 'text.secondary' : 'text.primary'
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Chip 
                          label={getNotificationTypeLabel(notification.notification_type)}
                          size="small"
                          color={getNotificationColor(notification.notification_type) as any}
                          sx={{ ml: 1, height: 20, fontSize: '0.65rem' }}
                        />
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          mb: 0.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatRelativeTime(notification.created_at)}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
                {hasMoreNotifications && (
                  <>
                    <Divider />
                    <MenuItem 
                      onClick={() => {
                        handleNotificationsMenuClose();
                        window.location.href = '/notifications';
                      }}
                      sx={{ justifyContent: 'center', fontWeight: 600 }}
                    >
                      Ver todas as notificações
                    </MenuItem>
                  </>
                )}
              </>
            )}
          </Menu>

          <IconButton onClick={handleUserMenuOpen} sx={{ ml: 1 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                fontSize: '0.875rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
              }}
            >
              {user?.first_name?.[0] || user?.email?.[0] || 'U'}
            </Avatar>
          </IconButton>

          {/* User Menu */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            PaperProps={{
              sx: { minWidth: 200, mt: 1 }
            }}
          >
            <MenuItem 
              onClick={() => {
                handleUserMenuClose();
                window.location.href = '/profile';
              }}
            >
              <User size={18} style={{ marginRight: 8 }} />
              Perfil
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogOut size={18} style={{ marginRight: 8 }} />
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

        {/* Drawer */}
        <Box
          component="nav"
          sx={{ 
            width: { xs: 0, md: 0 },
            flexShrink: 0
          }}
        >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              border: 'none',
              boxShadow: 2
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              border: 'none',
              boxShadow: 2
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
            ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
            minWidth: 0,
            transition: 'margin-left 0.3s ease'
          }}
        >
        <Box sx={{ 
          flexGrow: 1, 
          backgroundColor: 'grey.50', 
          width: '100%',
          minWidth: 0,
          overflow: 'hidden'
        }}>
          <Toolbar />
          <Box sx={{ 
            width: '100%', 
            pt: 4,
            px: { xs: 2, sm: 3, md: 4, lg: 6 },
            minWidth: 0,
            boxSizing: 'border-box',
            mx: 'auto',
            maxWidth: '100%'
          }}>
            {children}
          </Box>
        </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3.38,
          px: 3,
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          width: '100%'
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          Owned by: <strong>Luthor Technologies</strong> • © {new Date().getFullYear()} <strong>Up Ai</strong> • Powered by: <a href="https://legatiosolutions.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}>Legatio Solutions</a>
        </Typography>
      </Box>
    </Box>
  );
}

