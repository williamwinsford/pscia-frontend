'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  CardHeader,
  Alert,
  Stack,
  IconButton,
  InputAdornment,
  Paper,
  Grid,
  Avatar,
  CircularProgress
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Zap, Users } from 'lucide-react';
import Image from 'next/image';
import packageJson from '../../package.json';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoading: authLoading, login, error, clearError } = useAuth();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      window.location.href = '/dashboard';
    }
  }, [user, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (err) {
      // Error is handled by useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <Layout showHeader={true} showFooter={true}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  const features = [
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Seus dados protegidos com criptografia de ponta'
    },
    {
      icon: Zap,
      title: 'Processamento Rápido',
      description: 'Transcrição em tempo real com IA de última geração'
    },
    {
      icon: Users,
      title: 'Colaboração',
      description: 'Compartilhe e trabalhe em equipe facilmente'
    }
  ];

  return (
    <Layout showHeader={true} showFooter={true}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          display: 'flex',
          alignItems: 'center',
          py: 4
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left Side - Features */}
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 3 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}
                  >
                    <Image 
                      src="/logo-up-ai-trasnparent.png" 
                      alt="Up Ai Logo" 
                      width={60} 
                      height={60}
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Up Ai
                  </Typography>
                </Box>
                
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Bem-vindo de volta!
                </Typography>
                
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.6 }}>
                  Acesse sua conta e continue transformando áudio em insights valiosos
                </Typography>
              </Box>

              {/* Features */}
              <Stack spacing={3}>
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 1,
                        background: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'rgba(59, 130, 246, 0.1)',
                            color: 'primary.main',
                            width: 48,
                            height: 48
                          }}
                        >
                          <Icon size={24} />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}
              </Stack>
            </Grid>

            {/* Right Side - Login Form */}
            <Grid item xs={12} md={6}>
              <Card
                elevation={8}
                sx={{
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  maxWidth: 480,
                  mx: 'auto'
                }}
              >
                <CardHeader sx={{ textAlign: 'center', pb: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Entrar na sua conta
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Digite suas credenciais para acessar o dashboard
                  </Typography>
                </CardHeader>

                <CardContent sx={{ p: 4 }}>
                  {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Email"
                        placeholder="seu@email.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Mail size={20} color="#6b7280" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Senha"
                        placeholder="Digite sua senha"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock size={20} color="#6b7280" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                size="small"
                              >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
                          },
                        }}
                      />


                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isLoading}
                        endIcon={isLoading ? null : <ArrowRight size={20} />}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                          },
                        }}
                      >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                      </Button>
                    </Stack>
                  </Box>

                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Não tem uma conta?{' '}
                      <Button
                        component={Link}
                        href="/register"
                        variant="text"
                        sx={{ 
                          color: 'primary.main',
                          fontWeight: 600,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Cadastre-se aqui
                      </Button>
                    </Typography>
                  </Box>

                  {/* Version - Discreta */}
                  <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.disabled',
                        fontSize: '0.7rem',
                        opacity: 0.6
                      }}
                    >
                      Versão {packageJson.version}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
}