'use client';

import Link from 'next/link';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  Stack,
  Avatar,
  CircularProgress
} from '@mui/material';
import { 
  AudioLines, 
  Target, 
  Zap, 
  Shield, 
  Brain, 
  Clock, 
  Users, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Layout } from '@/components/Layout';

export default function HomePageClient() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      window.location.href = '/dashboard';
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="100vh"
        flexDirection="column"
      >
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          Carregando...
        </Typography>
      </Box>
    );
  }

  const features = [
    {
      icon: Target,
      title: 'Precisão Extrema',
      description: 'Transcreva áudio com 99% de precisão usando IA de última geração',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Zap,
      title: 'Velocidade Lightning',
      description: 'Processe arquivos de áudio em segundos, não em horas',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Seus dados são protegidos com criptografia de nível bancário',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Brain,
      title: 'IA Avançada',
      description: 'Análise de sentimentos e extração de insights automáticos',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Clock,
      title: 'Tempo Real',
      description: 'Processamento instantâneo com feedback em tempo real',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Users,
      title: 'Colaboração',
      description: 'Compartilhe transcrições e análises com sua equipe',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  const stats = [
    { label: 'Arquivos Processados', value: '1M+' },
    { label: 'Precisão de Transcrição', value: '99%' },
    { label: 'Tempo Médio de Processo', value: '< 30s' },
    { label: 'Usuários Ativos', value: '10K+' },
  ];

  return (
    <Layout showHeader={true}>
      <Box>
        {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Chip 
              label="✨ Tecnologia de IA Avançada" 
              sx={{ 
                mb: 3, 
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: 500
              }} 
            />
            
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '3rem', md: '4.5rem' },
                fontWeight: 700,
                mb: 3,
                lineHeight: 1.1
              }}
            >
              Transforme Áudio em{' '}
              <Box 
                component="span" 
                sx={{ 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Texto
              </Box>
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Use nossa IA avançada para converter seus arquivos de áudio em transcrições precisas
              e extrair insights valiosos automaticamente.
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center" 
              sx={{ mb: 6 }}
            >
              <Button 
                component={Link} 
                href="/register"
                variant="contained" 
                size="large"
                endIcon={<ArrowRight size={20} />}
                sx={{ px: 4, py: 1.5 }}
              >
                Começar Agora
              </Button>
              <Button 
                component={Link} 
                href="/login"
                variant="outlined" 
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Já tenho conta
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1,
                      color: 'primary.main'
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 8 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                mb: 3,
                fontWeight: 700
              }}
            >
              Por que escolher o{' '}
              <Box 
                component="span" 
                sx={{ 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Clarity Audio
              </Box>
              ?
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: '600px', mx: 'auto' }}
            >
              Nossa plataforma combina tecnologia de ponta com facilidade de uso
              para oferecer a melhor experiência de transcrição de áudio.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: feature.bgColor.replace('bg-', '').replace('-50', '.light'),
                          color: feature.color.replace('text-', ''),
                          mb: 2,
                          width: 48,
                          height: 48
                        }}
                      >
                        <Icon size={24} />
                      </Avatar>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography 
              variant="h2" 
              sx={{ 
                mb: 3,
                fontWeight: 700
              }}
            >
              Pronto para começar?
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Junte-se a milhares de usuários que já transformaram seu fluxo de trabalho
              com o Clarity Audio.
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
            >
              <Button 
                component={Link} 
                href="/register"
                variant="contained" 
                size="large"
                endIcon={<ArrowRight size={20} />}
                sx={{ px: 4, py: 1.5 }}
              >
                Começar Agora
              </Button>
              <Button 
                component={Link} 
                href="/contact"
                variant="outlined" 
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Falar com Vendas
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
      </Box>
    </Layout>
  );
}

