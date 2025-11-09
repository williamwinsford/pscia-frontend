'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { NoIndex } from '@/components/NoIndex';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Stack,
  Paper,
  Avatar,
  Divider,
  Button,
  Chip
} from '@mui/material';
import {
  BarChart,
  TrendingUp,
  FileAudio,
  Clock,
  CheckCircle,
  MessageCircle,
  Target,
  ArrowRight
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router, pathname]);

  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          Carregando...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  const stats = [
    { label: 'Total de Transcrições', value: '24', icon: FileAudio, color: 'primary.main', change: '+12%' },
    { label: 'Tempo Total', value: '8.5h', icon: Clock, color: 'info.main', change: '+20%' },
    { label: 'Taxa de Sucesso', value: '98.2%', icon: CheckCircle, color: 'success.main', change: '+2.5%' },
    { label: 'Interações IA', value: '156', icon: MessageCircle, color: 'secondary.main', change: '+45%' },
  ];

  const recentInsights = [
    { title: 'Análise de Sentimentos', description: 'Média de 3.8/5 nos últimos 30 dias', trend: '+0.3', icon: TrendingUp },
    { title: 'Palavras-chave Top', description: 'Reunião, produto, mercado, cliente', trend: 'Stable', icon: Target },
    { title: 'Tempo Médio', description: '15.2 minutos por transcrição', trend: '-1.2min', icon: Clock },
  ];

  return (
    <>
      <NoIndex />
      <DashboardLayout>
      <Container maxWidth="lg" sx={{ py: 2, px: { xs: 2, md: 3 } }}>
          {/* Header */}
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
              Análises Avançadas
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
              Insights e métricas sobre seu uso da plataforma
            </Typography>
          </Box>

          {/* Stats Grid */}
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {stat.label}
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                            {stat.value}
                          </Typography>
                        </Box>
                        <Avatar
                          sx={{
                            bgcolor: stat.color + '10',
                            color: stat.color,
                            width: { xs: 48, md: 56 },
                            height: { xs: 48, md: 56 },
                            ml: 1
                          }}
                        >
                          <Icon size={28} style={{ width: 'clamp(20px, 5vw, 28px)', height: 'clamp(20px, 5vw, 28px)' }} />
                        </Avatar>
                      </Box>
                      <Chip
                        label={stat.change}
                        size="small"
                        color={stat.change.startsWith('+') ? 'success' : 'default'}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {/* Insights */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader
                  title="Insights Recentes"
                  subheader="Análises automáticas dos seus dados"
                  sx={{ 
                    '& .MuiCardHeader-title': { fontSize: { xs: '1rem', md: '1.25rem' } },
                    '& .MuiCardHeader-subheader': { fontSize: { xs: '0.75rem', md: '0.875rem' } }
                  }}
                />
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Stack spacing={2}>
                    {recentInsights.map((insight, index) => {
                      const Icon = insight.icon;
                      return (
                        <Paper key={index} sx={{ p: { xs: 2, md: 3 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                <Icon size={20} color="primary" style={{ flexShrink: 0 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                  {insight.title}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                {insight.description}
                              </Typography>
                            </Box>
                            <Chip
                              label={insight.trend}
                              size="small"
                              color={insight.trend === 'Stable' ? 'default' : 'success'}
                              sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                            />
                          </Box>
                        </Paper>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader
                  title="Ações Rápidas"
                  subheader="Explorar análises"
                  sx={{ 
                    '& .MuiCardHeader-title': { fontSize: { xs: '1rem', md: '1.25rem' } },
                    '& .MuiCardHeader-subheader': { fontSize: { xs: '0.75rem', md: '0.875rem' } }
                  }}
                />
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Stack spacing={2}>
                    <Link href="/history" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<BarChart size={20} />}
                        sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                      >
                        Ver Transcrições
                      </Button>
                    </Link>
                    <Link href="/upload" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<TrendingUp size={20} />}
                        sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                      >
                        Nova Transcrição
                      </Button>
                    </Link>
                    <Link href="/chat" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<MessageCircle size={20} />}
                        sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                      >
                        Chat com IA
                      </Button>
                    </Link>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      </Container>
    </DashboardLayout>
    </>
  );
}

