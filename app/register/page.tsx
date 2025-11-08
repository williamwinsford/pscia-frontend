'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Divider,
  Chip,
  Paper,
  Grid,
  Avatar,
  LinearProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, User, Shield, Zap, Users, Star } from 'lucide-react';
import Image from 'next/image';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { register, error, clearError } = useAuth();
  const router = useRouter();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    if (formData.password !== formData.confirmPassword) {
      // Handle password mismatch error
      setIsLoading(false);
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        formData.username,
        formData.firstName,
        formData.lastName
      );
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { text: 'Mínimo 8 caracteres', met: formData.password.length >= 8 },
    { text: 'Pelo menos 1 letra maiúscula', met: /[A-Z]/.test(formData.password) },
    { text: 'Pelo menos 1 número', met: /\d/.test(formData.password) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  const benefits = [
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Seus dados protegidos com criptografia de ponta'
    },
    {
      icon: Zap,
      title: 'Processamento Rápido',
      description: 'Transcrição em tempo real com IA avançada'
    },
    {
      icon: Users,
      title: 'Colaboração',
      description: 'Trabalhe em equipe e compartilhe facilmente'
    },
    {
      icon: Star,
      title: 'Qualidade Premium',
      description: 'Resultados de alta precisão e confiabilidade'
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
          <Grid container spacing={4} alignItems="flex-start">
            {/* Left Side - Benefits */}
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
                  Junte-se a nós!
                </Typography>
                
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.6 }}>
                  Crie sua conta gratuita e comece a transformar áudio em insights valiosos
                </Typography>
              </Box>

              {/* Benefits */}
              <Grid container spacing={2}>
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 1,
                          background: 'rgba(255, 255, 255, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          height: '100%',
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor: 'rgba(59, 130, 246, 0.1)',
                              color: 'primary.main',
                              width: 40,
                              height: 40
                            }}
                          >
                            <Icon size={20} />
                          </Avatar>
                          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                            {benefit.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {benefit.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>

            {/* Right Side - Registration Form */}
            <Grid item xs={12} md={6}>
              <Card
                elevation={8}
                sx={{
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  maxWidth: 520,
                  mx: 'auto'
                }}
              >
                <CardHeader sx={{ textAlign: 'center', pb: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Criar conta gratuita
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Preencha os dados abaixo para começar
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
                      {/* Name Fields */}
                      <Box sx={{ ml: -3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                              Nome
                            </Typography>
                            <TextField
                              fullWidth
                              placeholder="Seu nome"
                              value={formData.firstName}
                              onChange={handleChange('firstName')}
                              required
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <User size={20} color="#6b7280" />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 1,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                              Sobrenome
                            </Typography>
                            <TextField
                              fullWidth
                              placeholder="Seu sobrenome"
                              value={formData.lastName}
                              onChange={handleChange('lastName')}
                              required
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 1,
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Email */}
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Email
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="seu@email.com"
                        type="email"
                        value={formData.email}
                        onChange={handleChange('email')}
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
                          },
                        }}
                      />

                      {/* Username */}
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Nome de usuário
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="seu_usuario"
                        value={formData.username}
                        onChange={handleChange('username')}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                          },
                        }}
                      />

                      {/* Password */}
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Senha
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Digite sua senha"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange('password')}
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
                          },
                        }}
                      />

                      {/* Password Requirements */}
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Requisitos da senha:
                        </Typography>
                        {passwordRequirements.map((req, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <CheckCircle 
                              size={16} 
                              color={req.met ? '#10b981' : '#6b7280'} 
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: req.met ? 'success.main' : 'text.secondary',
                                fontSize: '0.75rem'
                              }}
                            >
                              {req.text}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      {/* Confirm Password */}
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Confirmar senha
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Confirme sua senha"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        required
                        error={formData.confirmPassword.length > 0 && !passwordsMatch}
                        helperText={formData.confirmPassword.length > 0 && !passwordsMatch ? 'As senhas não coincidem' : ''}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock size={20} color="#6b7280" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                                size="small"
                              >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                          },
                        }}
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                          />
                        }
                        label={
                          <Typography variant="body2">
                            Li e estou de acordo com os{' '}
                            <Link href="/terms" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                              Termos de Uso
                            </Link>
                            {' '}e{' '}
                            <Link href="/privacy" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                              Política de Privacidade*
                            </Link>
                          </Typography>
                        }
                        sx={{ mt: 1 }}
                      />

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isLoading || !allRequirementsMet || !passwordsMatch || !agreeToTerms}
                        endIcon={isLoading ? null : <ArrowRight size={20} />}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                          },
                          '&:disabled': {
                            background: 'rgba(0, 0, 0, 0.12)',
                          },
                        }}
                      >
                        {isLoading ? 'Criando conta...' : 'Criar conta'}
                      </Button>
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 3 }}>
                    <Chip label="ou" size="small" />
                  </Divider>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Já tem uma conta?{' '}
                      <Button
                        component={Link}
                        href="/login"
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
                        Faça login aqui
                      </Button>
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