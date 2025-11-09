'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { NoIndex } from '@/components/NoIndex';
import { RequireAuth } from '@/components/RequireAuth';
import { audioService, DashboardStatistics } from '@/services/audio';
import { 
  Upload, 
  MessageCircle, 
  BarChart3, 
  FileAudio, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Stack,
  Alert
} from '@mui/material';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadStatistics();
    }
  }, [user, pathname]);

  const loadStatistics = async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      const data = await audioService.getStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
      setStatsError('Erro ao carregar estatísticas. Tente novamente.');
    } finally {
      setStatsLoading(false);
    }
  };

  if (statsLoading) {
    return (
      <RequireAuth>
        <DashboardLayout>
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
        </DashboardLayout>
      </RequireAuth>
    );
  }

  const quickActions = [
    {
      title: 'Transcrição de Áudio',
      description: 'Converta seus arquivos de áudio em texto com precisão',
      icon: Upload,
      color: 'primary.main',
      bgColor: 'rgba(59, 130, 246, 0.08)',
      href: '/upload',
      primary: true,
    },
    {
      title: 'Chat com IA',
      description: 'Converse com IA sobre seus áudios e obtenha insights',
      icon: MessageCircle,
      color: 'secondary.main',
      bgColor: 'rgba(139, 92, 246, 0.08)',
      href: '/chat',
    },
    {
      title: 'Análises Avançadas',
      description: 'Analise sentimentos e extraia insights valiosos',
      icon: BarChart3,
      color: 'success.main',
      bgColor: 'rgba(16, 185, 129, 0.08)',
      href: '/analytics',
    },
  ];

  // Estatísticas dinâmicas baseadas em dados reais
  const stats = statistics ? [
    { 
      label: 'Arquivos Processados', 
      value: statistics.total_files.toString(), 
      icon: FileAudio, 
      color: 'primary.main' 
    },
    { 
      label: 'Templates', 
      value: (statistics.total_templates ?? 0).toString(), 
      icon: FileText, 
      color: 'success.main' 
    },
    { 
      label: 'Precisão Média', 
      value: `${statistics.average_accuracy}%`, 
      icon: CheckCircle, 
      color: 'secondary.main' 
    },
    { 
      label: 'Conversas com IA', 
      value: statistics.total_conversations.toString(), 
      icon: MessageCircle, 
      color: 'warning.main' 
    },
  ] : [];

  return (
    <RequireAuth>
      <NoIndex />
      <DashboardLayout>
      <Box 
        sx={{
          maxWidth: '1200px',
          py: 2,
          px: { xs: 2, md: 4 },
          pl: { xs: 2, md: 45 },
          width: '100%'
        }}
      >
          {/* Header */}
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
                Bem-vindo de volta, {user?.first_name || user?.email?.split('@')[0] || 'Usuário'}! 👋
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                Aqui está um resumo da sua atividade no Up Ai
              </Typography>
            </Box>
          </Box>

          {/* Error Message */}
          {statsError && (
            <Alert severity="error" sx={{ mb: 4 }} onClose={() => setStatsError(null)}>
              {statsError}
            </Alert>
          )}

          {/* Stats */}
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Grid item xs={12} sm={6} md={6} key={index}>
                  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {stat.label}
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                            {stat.value}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            color: stat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            position: 'absolute',
                            right: { xs: 8, md: 16 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            flexShrink: 0
                          }}
                        >
                          <Icon size={40} style={{ width: 'clamp(28px, 8vw, 40px)', height: 'clamp(28px, 8vw, 40px)' }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Quick Actions */}
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: { xs: 2, md: 3 }, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              Ações Rápidas
            </Typography>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Grid item xs={12} md={4} key={index}>
                    <Link href={action.href} style={{ textDecoration: 'none' }}>
                      <Card
                        sx={{
                          height: '100%',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6
                          }
                        }}
                      >
                      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Stack spacing={2}>
                          <Avatar
                            sx={{
                              bgcolor: action.bgColor,
                              color: action.color,
                              width: { xs: 48, md: 56 },
                              height: { xs: 48, md: 56 }
                            }}
                          >
                            <Icon size={28} style={{ width: 'clamp(20px, 5vw, 28px)', height: 'clamp(20px, 5vw, 28px)' }} />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                              {action.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                              {action.description}
                            </Typography>
                            <Button
                              variant={action.primary ? 'contained' : 'outlined'}
                              endIcon={<ArrowRight size={20} />}
                              fullWidth
                              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                            >
                              {action.primary ? 'Começar Agora' : 'Acessar'}
                            </Button>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {/* Recent Activity */}
            <Grid item xs={12} lg={6}>
              <Card>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp size={20} style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                        Atividade Recente
                      </Typography>
                    </Box>
                  }
                  subheader="Suas últimas ações na plataforma"
                  sx={{ 
                    '& .MuiCardHeader-subheader': { fontSize: { xs: '0.75rem', md: '0.875rem' } }
                  }}
                />
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  {statistics && statistics.recent_activity.length > 0 ? (
                    <Stack spacing={2}>
                      {statistics.recent_activity.map((activity, index) => (
                        <Link
                          key={index}
                          href={activity.type === 'audio' ? `/transcription/${activity.id}` : '/chat'}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              p: 2,
                              borderRadius: 0.5,
                              backgroundColor: 'action.hover',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'chain.selected'
                              }
                            }}
                          >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: activity.status === 'completed' ? 'success.main' : 'info.main'
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {activity.action}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.file} • {activity.time}
                            </Typography>
                          </Box>
                          <Chip
                            label={activity.status === 'completed' || activity.status === 'failed' ? 
                              (activity.status === 'completed' ? 'Concluído' : 'Falhou') : 'Ativo'}
                            color={activity.status === 'completed' ? 'success' : activity.status === 'failed' ? 'error' : 'info'}
                            size="small"
                          />
                          </Box>
                        </Link>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      Nenhuma atividade recente
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Account Info */}
            <Grid item xs={12} lg={6}>
              <Card>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <User size={20} style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                        Informações da Conta
                      </Typography>
                    </Box>
                  }
                  subheader="Detalhes do seu perfil"
                  sx={{ 
                    '& .MuiCardHeader-subheader': { fontSize: { xs: '0.75rem', md: '0.875rem' } }
                  }}
                />
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                        Email
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, wordBreak: 'break-word' }}>
                        {user?.email || 'N/A'}
                      </Typography>
                    </Box>
                    {user?.username && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="body2" color="text.secondary">
                          Username
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          @{user?.username}
                        </Typography>
                      </Box>
                    )}
                    {user?.first_name && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="body2" color="text.secondary">
                          Nome
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user?.first_name} {user?.last_name}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant="body2" color="text.secondary">
                        Membro desde
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('pt-BR') : 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={user?.is_tester ? 'Beta Tester' : 'Usuário Ativo'}
                        color={user?.is_tester ? 'warning' : 'success'}
                        size="small"
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      </Box>
    </DashboardLayout>
    </RequireAuth>
  );
}
