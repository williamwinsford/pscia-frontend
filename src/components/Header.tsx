'use client';

import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import { 
  Menu as MenuIcon,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Contrast,
  Palette,
  Languages
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

export function Header() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const { toggleMobile } = useSidebarContext();
  const { theme, changeTheme } = useTheme();
  const { locale, currentLanguage, currentFlag, changeLanguage, languages, t } = useLanguage();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = React.useState<null | HTMLElement>(null);
  const [languageMenuOpen, setLanguageMenuOpen] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    window.location.href = '/';
  };

  const handleMobileMenuToggle = () => {
    if (user) {
      // If logged in, open sidebar
      toggleMobile();
    } else {
      // If not logged in, open menu
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setThemeMenuOpen(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeMenuOpen(null);
  };

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuOpen(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuOpen(null);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                    color: 'white',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Up Ai
                </Typography>
              </Box>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                {/* User Menu */}
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                    <User size={16} />
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {user.first_name || user.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => { window.location.href = '/profile'; handleMenuClose(); }}>
                    <Settings size={16} style={{ marginRight: 8 }} />
                    Configurações
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogOut size={16} style={{ marginRight: 8 }} />
                    Sair
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  href="/"
                  sx={{ 
                    color: 'white', 
                    fontWeight: pathname === '/' ? 600 : 500,
                    background: pathname === '/' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {t('navigation.home')}
                </Button>
                <Button
                  component={Link}
                  href="/about"
                  sx={{ 
                    color: 'white', 
                    fontWeight: pathname === '/about' ? 600 : 500,
                    background: pathname === '/about' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {t('navigation.about')}
                </Button>
                <Button
                  component={Link}
                  href="/pricing"
                  sx={{ 
                    color: 'white', 
                    fontWeight: pathname === '/pricing' ? 600 : 500,
                    background: pathname === '/pricing' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {t('navigation.pricing')}
                </Button>
                <Button
                  component={Link}
                  href="/contact"
                  sx={{ 
                    color: 'white', 
                    fontWeight: pathname === '/contact' ? 600 : 500,
                    background: pathname === '/contact' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {t('navigation.contact')}
                </Button>
                <Button
                  component={Link}
                  href="/login"
                  sx={{ 
                    color: 'white', 
                    fontWeight: pathname === '/login' ? 600 : 500,
                    background: pathname === '/login' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {t('navigation.login')}
                </Button>
                <Button
                  component={Link}
                  href="/register"
                  sx={{ 
                    color: 'white',
                    fontWeight: pathname === '/register' ? 600 : 500,
                    background: pathname === '/register' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {t('navigation.register')}
                </Button>
                
                {/* Theme Switcher - Apenas área externa */}
                <IconButton
                  onClick={handleThemeMenuOpen}
                  sx={{ 
                    color: 'white',
                    ml: 1,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  title="Alterar tema"
                >
                  <Palette size={20} />
                </IconButton>

                <Menu
                  anchorEl={themeMenuOpen}
                  open={Boolean(themeMenuOpen)}
                  onClose={handleThemeMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 180,
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                    }
                  }}
                >
                  <MenuItem 
                    onClick={() => { changeTheme('light'); handleThemeMenuClose(); }}
                    selected={theme === 'light'}
                  >
                    <Sun size={16} style={{ marginRight: 12 }} />
                    {t('theme.light')}
                  </MenuItem>
                  <MenuItem 
                    onClick={() => { changeTheme('dark'); handleThemeMenuClose(); }}
                    selected={theme === 'dark'}
                  >
                    <Moon size={16} style={{ marginRight: 12 }} />
                    {t('theme.dark')}
                  </MenuItem>
                  <MenuItem 
                    onClick={() => { changeTheme('high-contrast'); handleThemeMenuClose(); }}
                    selected={theme === 'high-contrast'}
                  >
                    <Contrast size={16} style={{ marginRight: 12 }} />
                    {t('theme.highContrast')}
                  </MenuItem>
                </Menu>

                {/* Language Switcher - Apenas área externa */}
                <IconButton
                  onClick={handleLanguageMenuOpen}
                  sx={{ 
                    color: 'white',
                    ml: 1,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  title={t('language.changeLanguage')}
                >
                  <Languages size={20} />
                </IconButton>

                <Menu
                  anchorEl={languageMenuOpen}
                  open={Boolean(languageMenuOpen)}
                  onClose={handleLanguageMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 180,
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                    }
                  }}
                >
                  {languages.map((lang) => (
                    <MenuItem 
                      key={lang.code}
                      onClick={() => { changeLanguage(lang.code); handleLanguageMenuClose(); }}
                      selected={locale === lang.code}
                    >
                      <span style={{ marginRight: 12, fontSize: '1.2rem' }}>{lang.flag}</span>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              onClick={handleMobileMenuToggle}
              sx={{ color: 'white' }}
            >
              <MenuIcon size={24} />
            </IconButton>
          </Box>
        </Toolbar>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <Box sx={{ 
            display: { xs: 'block', md: 'none' },
            pb: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {user ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2 }}>
                <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                    {user.first_name || user.email}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {user.email}
                  </Typography>
                </Box>
                <Button
                  onClick={() => { window.location.href = '/profile'; setMobileMenuOpen(false); }}
                  sx={{ color: 'white', justifyContent: 'flex-start', py: 1.5 }}
                  startIcon={<Settings size={20} />}
                >
                  Configurações
                </Button>
                <Button
                  onClick={handleLogout}
                  sx={{ color: 'white', justifyContent: 'flex-start', py: 1.5 }}
                  startIcon={<LogOut size={20} />}
                >
                  Sair
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2 }}>
                <Button
                  component={Link}
                  href="/"
                  sx={{ 
                    color: 'white', 
                    justifyContent: 'flex-start', 
                    py: 1.5,
                    fontWeight: pathname === '/' ? 600 : 500,
                    background: pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  {t('navigation.home')}
                </Button>
                <Button
                  component={Link}
                  href="/about"
                  sx={{ 
                    color: 'white', 
                    justifyContent: 'flex-start', 
                    py: 1.5,
                    fontWeight: pathname === '/about' ? 600 : 500,
                    background: pathname === '/about' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  {t('navigation.about')}
                </Button>
                <Button
                  component={Link}
                  href="/pricing"
                  sx={{ 
                    color: 'white', 
                    justifyContent: 'flex-start', 
                    py: 1.5,
                    fontWeight: pathname === '/pricing' ? 600 : 500,
                    background: pathname === '/pricing' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  {t('navigation.pricing')}
                </Button>
                <Button
                  component={Link}
                  href="/contact"
                  sx={{ 
                    color: 'white', 
                    justifyContent: 'flex-start', 
                    py: 1.5,
                    fontWeight: pathname === '/contact' ? 600 : 500,
                    background: pathname === '/contact' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  {t('navigation.contact')}
                </Button>
                <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                <Button
                  component={Link}
                  href="/login"
                  sx={{ 
                    color: 'white', 
                    justifyContent: 'flex-start', 
                    py: 1.5,
                    fontWeight: pathname === '/login' ? 600 : 500,
                    background: pathname === '/login' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  {t('navigation.login')}
                </Button>
                <Button
                  component={Link}
                  href="/register"
                  sx={{ 
                    color: 'white', 
                    justifyContent: 'flex-start', 
                    py: 1.5,
                    fontWeight: pathname === '/register' ? 600 : 500,
                    background: pathname === '/register' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  {t('navigation.register')}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </AppBar>
  );
}
