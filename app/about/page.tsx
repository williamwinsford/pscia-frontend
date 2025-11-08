'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Button
} from '@mui/material';
import { 
  Target, 
  Zap, 
  Shield, 
  Heart,
  Mic,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Layout } from '@/components/Layout';

const values = [
  {
    icon: Target,
    title: 'Foco no Cliente',
    description: 'Cada funcionalidade é desenvolvida pensando nas necessidades reais dos nossos usuários.',
    color: '#3b82f6',
    bgColor: '#eff6ff'
  },
  {
    icon: Zap,
    title: 'Inovação Constante',
    description: 'Sempre buscamos as mais recentes tecnologias de IA para melhorar nossa plataforma.',
    color: '#f59e0b',
    bgColor: '#fffbeb'
  },
  {
    icon: Shield,
    title: 'Privacidade e Segurança',
    description: 'Seus dados são tratados com o máximo cuidado e proteção possível.',
    color: '#10b981',
    bgColor: '#f0fdf4'
  },
  {
    icon: Heart,
    title: 'Acessibilidade',
    description: 'Acreditamos que tecnologia avançada deve ser acessível para todos.',
    color: '#ef4444',
    bgColor: '#fef2f2'
  }
];


export default function AboutPage() {
  return (
    <Layout showHeader={true} showFooter={true}>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
        {/* Hero Section */}
        <Box sx={{ py: { xs: 10, md: 16 } }}>
          <Container maxWidth="lg">
            <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center' }}>
              <Chip
                label="Sobre a Up Ai"
                sx={{
                  mb: 3,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
              <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 700, mb: 3 }}>
                Revolucionando a forma como
                <br />
                <Box component="span" sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  trabalhamos com áudio
                </Box>
              </Typography>
              <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4, maxWidth: '600px', mx: 'auto' }}>
                Somos uma empresa de tecnologia focada em democratizar o acesso 
                à inteligência artificial para transcrição e análise de áudio.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Mission Section */}
        <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
          <Container maxWidth="lg">
            <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
              <Grid item xs={12} lg={6}>
                <Typography variant="h2" sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' }, fontWeight: 700, mb: 3, px: { xs: 2, md: 0 } }}>
                  Nossa Missão
                </Typography>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' }, color: 'text.secondary', mb: 3, px: { xs: 2, md: 0 } }}>
                  Acreditamos que a tecnologia deve ser acessível e útil para todos. 
                  Nossa missão é transformar a forma como as pessoas trabalham com 
                  áudio, oferecendo ferramentas de IA que são poderosas, precisas e 
                  fáceis de usar.
                </Typography>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' }, color: 'text.secondary', mb: 4, px: { xs: 2, md: 0 } }}>
                  Desde nossa fundação, trabalhamos incansavelmente para criar 
                  soluções que não apenas transcrevem áudio, mas que extraem 
                  insights valiosos e facilitam a tomada de decisões.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', px: { xs: 2, md: 0 } }}>
                  <Button
                    component={Link}
                    href="/login"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowRight size={20} />}
                  >
                    Começar Agora
                  </Button>
                  <Button
                    component={Link}
                    href="/contact"
                    variant="outlined"
                    size="large"
                  >
                    Fale Conosco
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Box sx={{ 
                  width: '100%', 
                  height: { xs: 250, md: 400 }, 
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: { xs: 2, md: 0 }
                }}>
                  <Mic size={96} color="#3b82f6" style={{ width: 'clamp(48px, 20vw, 96px)', height: 'clamp(48px, 20vw, 96px)' }} />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Vision Section */}
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg">
            <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
              <Grid item xs={12} lg={6} sx={{ order: { xs: 2, lg: 1 } }}>
                <Box sx={{ 
                  width: '100%', 
                  height: { xs: 250, md: 400 }, 
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: { xs: 2, md: 0 }
                }}>
                  <Target size={96} color="#8b5cf6" style={{ width: 'clamp(48px, 20vw, 96px)', height: 'clamp(48px, 20vw, 96px)' }} />
                </Box>
              </Grid>
              <Grid item xs={12} lg={6} sx={{ order: { xs: 1, lg: 2 } }}>
                <Typography variant="h2" sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' }, fontWeight: 700, mb: 3, px: { xs: 2, md: 0 } }}>
                  Nossa Visão
                </Typography>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' }, color: 'text.secondary', mb: 3, px: { xs: 2, md: 0 } }}>
                  Enxergamos um futuro onde a tecnologia de transcrição e análise de áudio 
                  seja onipresente e acessível. Nossa visão é ser a plataforma líder mundial 
                  que conecta pessoas e empresas com o poder transformador da IA.
                </Typography>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' }, color: 'text.secondary', mb: 4, px: { xs: 2, md: 0 } }}>
                  Queremos que cada profissional, independentemente do seu campo de atuação, 
                  possa aproveitar ao máximo o conteúdo de áudio, transformando-o em insights 
                  acionáveis e em valor real para seus negócios.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', px: { xs: 2, md: 0 } }}>
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowRight size={20} />}
                  >
                    Junte-se a Nós
                  </Button>
                  <Button
                    component={Link}
                    href="/pricing"
                    variant="outlined"
                    size="large"
                  >
                    Ver Planos
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Values Section */}
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 8 } }}>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' }, fontWeight: 700, mb: 2, px: { xs: 2, md: 0 } }}>
                Nossos Valores
              </Typography>
              <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto', fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, px: { xs: 2, md: 0 } }}>
                Os princípios que guiam cada decisão e cada linha de código que escrevemos.
              </Typography>
            </Box>
            
            <Grid container spacing={{ xs: 2, md: 4 }}>
              {values.map((value, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ height: '100%', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${value.color} 0%, ${value.color}dd 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                      }}>
                        <value.icon size={24} color="white" />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {value.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Stats Section */}
        <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 8 } }}>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' }, fontWeight: 700, mb: 2, px: { xs: 2, md: 0 } }}>
                Números que Impressionam
              </Typography>
              <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto', fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, px: { xs: 2, md: 0 } }}>
                O impacto da Up Ai em números.
              </Typography>
            </Box>
            
            <Grid container spacing={{ xs: 2, md: 4 }} sx={{ maxWidth: '800px', mx: 'auto' }}>
              {[
                { label: 'Usuários Ativos', value: '10K+' },
                { label: 'Horas Transcritas', value: '1M+' },
                { label: 'Precisão', value: '99%' },
                { label: 'Idiomas', value: '20+' }
              ].map((stat, index) => (
                <Grid item xs={6} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' }, fontWeight: 700, color: 'primary.main', mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg">
            <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center', px: { xs: 2, md: 0 } }}>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' }, fontWeight: 700, mb: 2 }}>
                Faça Parte da Nossa História
              </Typography>
              <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4, fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                Junte-se a milhares de profissionais que já transformaram sua produtividade com a Up Ai.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/login"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowRight size={20} />}
                  sx={{ fontSize: '1.1rem', px: 4 }}
                >
                  Começar Agora
                </Button>
                <Button
                  component={Link}
                  href="/contact"
                  variant="outlined"
                  size="large"
                  sx={{ fontSize: '1.1rem', px: 4 }}
                >
                  Fale Conosco
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Layout>
  );
}

