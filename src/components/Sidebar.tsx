'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  LayoutDashboard,
  Upload,
  MessageCircle,
  BarChart3,
  FileText,
  MoreVertical,
  User,
  LogOut
} from 'lucide-react';
import Image from 'next/image';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { useAuth } from '@/hooks/useAuth';

const drawerWidth = 280;

interface SidebarProps {
  user: any;
}

const menuItems = [
  { text: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { text: 'Upload', icon: Upload, href: '/upload' },
  { text: 'Chat IA', icon: MessageCircle, href: '/chat' },
  { text: 'Análises', icon: BarChart3, href: '/analytics' },
  { text: 'Templates', icon: FileText, href: '/templates' },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { mobileOpen, setMobileOpen } = useSidebarContext();
  const { logout } = useAuth();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleProfile = () => {
    router.push('/profile');
    handleMenuClose();
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    setMobileOpen(false);
    router.push('/');
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 3
        }}
      >
        <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image 
            src="/logo-up-ai-trasnparent.png" 
            alt="Up Ai Logo" 
            width={40} 
            height={40}
            style={{ objectFit: 'contain' }}
          />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Up Ai
        </Typography>
      </Toolbar>
      <Divider />
      
      {/* Menu Items */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              selected={pathname === item.href}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: 'rgba(59, 130, 246, 0.12)',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(59, 130, 246, 0.18)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: pathname === item.href ? 'primary.main' : 'text.primary',
                }}
              >
                <item.icon size={20} />
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  sx: {
                    color: pathname === item.href ? 'primary.main' : 'text.primary',
                    fontWeight: pathname === item.href ? 600 : 400
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* User Section */}
      <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
            {user?.first_name?.[0] || user?.email?.[0] || 'U'}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>
              {user?.first_name || user?.email?.split('@')[0] || 'Usuário'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {user?.email}
            </Typography>
          </Box>
          <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={handleMenuOpen}>
            <MoreVertical size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
          }
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <User size={16} />
          </ListItemIcon>
          <Typography variant="body2">Perfil</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogOut size={16} />
          </ListItemIcon>
          <Typography variant="body2">Sair</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );

  return (
    <>
      {/* Mobile Temporary Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

