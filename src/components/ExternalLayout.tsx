'use client';

import { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Container,
  Drawer,
  Stack
} from '@mui/material';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface ExternalLayoutProps {
  children: React.ReactNode;
}

export const ExternalLayout = ({ children }: ExternalLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Quem Somos', href: '/about' },
    { name: 'Preços', href: '/pricing' },
    { name: 'Contato', href: '/contact' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar 
        position="sticky"
        sx={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 2 }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', gap: 3 }}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isActive(item.href) ? 600 : 500,
                      color: isActive(item.href) ? 'primary.main' : 'text.secondary',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    {item.name}
                  </Typography>
                </Link>
              ))}
            </Box>

            {/* CTA Buttons */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              {user ? (
                <Button
                  variant="contained"
                  onClick={() => router.push('/dashboard')}
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: 'white',
                    fontWeight: 600
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="text"
                    onClick={() => router.push('/login')}
                    sx={{ fontWeight: 500 }}
                  >
                    Entrar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => router.push('/register')}
                    sx={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  >
                    Começar Agora
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <Menu size={24} />
            </IconButton>
          </Toolbar>
        </Container>

        {/* Mobile Navigation */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <Box sx={{ width: 280, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Menu
              </Typography>
              <IconButton onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </IconButton>
            </Box>

            <Stack spacing={2}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: isActive(item.href) ? 600 : 500,
                      color: isActive(item.href) ? 'primary.main' : 'text.secondary',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    {item.name}
                  </Typography>
                </Link>
              ))}
              
              <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                {user ? (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      router.push('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <Stack spacing={1}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => {
                        router.push('/login');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Entrar
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        router.push('/register');
                        setMobileMenuOpen(false);
                      }}
                      sx={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    >
                      Começar Agora
                    </Button>
                  </Stack>
                )}
              </Box>
            </Stack>
          </Box>
        </Drawer>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

