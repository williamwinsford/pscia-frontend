'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  CardActions,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { 
  Zap, 
  Star, 
  Crown,
  CheckCircle,
  X,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Layout } from '@/components/Layout';

const plans = [
  {
    name: 'Básico',
    price: 'R$ 9',
    period: '/mês',
    description: 'Perfeito para começar e testar nossa plataforma',
    icon: Zap,
    popular: false,
    features: [
      'Até 2 horas de transcrição por mês',
      'Transcrição básica em português',
      'Resumos automáticos',
      'Suporte por email',
      'Templates básicos',
      'Histórico de 30 dias'
    ],
    limitations: [
      'Sem chat com IA',
      'Sem exportação avançada',
      'Sem templates personalizados'
    ],
    cta: 'Começar Agora',
    ctaVariant: 'outlined' as 'outlined' | 'contained'
  },
  {
    name: 'Profissional',
    price: 'R$ 29',
    period: '/mês',
    description: 'Ideal para profissionais e pequenas equipes',
    icon: Star,
    popular: true,
    features: [
      'Até 20 horas de transcrição por mês',
      'Transcrição em 20+ idiomas',
      'Chat com IA avançado',
      'Templates personalizados',
      'Exportação em PDF e DOCX',
      'Histórico ilimitado',
      'Suporte prioritário',
      'API básica'
    ],
    limitations: [],
    cta: 'Começar Agora',
    ctaVariant: 'contained' as 'outlined' | 'contained'
  },
  {
    name: 'Empresarial',
    price: 'R$ 99',
    period: '/mês',
    description: 'Para empresas que precisam de mais recursos',
    icon: Crown,
    popular: false,
    features: [
      'Transcrição ilimitada',
      'Todos os idiomas suportados',
      'Chat com IA premium',
      'Templates ilimitados',
      'Todas as opções de exportação',
      'Histórico ilimitado',
      'Suporte 24/7',
      'API completa',
      'Integração com ferramentas',
      'Usuários ilimitados',
      'Relatórios avançados',
      'Treinamento personalizado'
    ],
    limitations: [],
    cta: 'Falar com Vendas',
    ctaVariant: 'outlined' as 'outlined' | 'contained'
  }
];

const faqs = [
  {
    question: 'Posso mudar de plano a qualquer momento?',
    answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente.'
  },
  {
    question: 'O que acontece se eu exceder meu limite de horas?',
    answer: 'Você receberá uma notificação quando estiver próximo do limite. Pode comprar horas extras ou fazer upgrade do plano.'
  },
  {
    question: 'Oferecem desconto para pagamento anual?',
    answer: 'Sim! Oferecemos 20% de desconto para pagamentos anuais em todos os planos.'
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim, você pode cancelar sua assinatura a qualquer momento sem taxas de cancelamento.'
  },
  {
    question: 'Meus dados são seguros?',
    answer: 'Absolutamente! Utilizamos criptografia de nível bancário e nunca compartilhamos seus dados com terceiros.'
  },
  {
    question: 'Oferecem suporte técnico?',
    answer: 'Sim! Oferecemos suporte por email no plano gratuito e suporte prioritário nos planos pagos.'
  }
];

export default function PricingPage() {
  return (
    <Layout showHeader={true} showFooter={true}>
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
        width: '100%', 
        maxWidth: '100vw',
        overflowX: 'hidden',
        boxSizing: 'border-box'
      }}>
        {/* Hero Section */}
        <Box sx={{ py: { xs: 4, md: 12 }, width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          <Container 
            maxWidth="lg" 
            sx={{ 
              px: { xs: 1, sm: 1.5, md: 3 }, 
              width: '100%',
              maxWidth: { xs: '100%', md: '1200px' },
              boxSizing: 'border-box'
            }}
          >
            <Box sx={{ maxWidth: { xs: '100%', md: '800px' }, mx: 'auto', textAlign: 'center', px: { xs: 0.5, md: 0 }, width: '100%', boxSizing: 'border-box' }}>
              <Chip
                label="Planos e Preços"
                sx={{
                  mb: 3,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', md: '0.875rem' }
                }}
              />
              <Typography variant="h1" sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '4rem' }, fontWeight: 700, mb: 3, px: { xs: 1, md: 0 } }}>
                Escolha o plano
                <br />
                <Box component="span" sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  perfeito para você
                </Box>
              </Typography>
              <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto', fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, px: { xs: 1, md: 0 } }}>
                Comece e faça upgrade conforme suas necessidades crescem. 
                De forma planejada, sem surpresas.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Pricing Cards */}
        <Container 
          maxWidth="lg" 
          sx={{ 
            px: { xs: 1, sm: 1.5, md: 3 }, 
            width: '100%',
            maxWidth: { xs: '100%', md: '1200px' },
            boxSizing: 'border-box'
          }}
        >
          <Grid container spacing={{ xs: 1.5, md: 3 }} sx={{ width: '100%', mx: 0, boxSizing: 'border-box' }}>
            {plans.map((plan, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} sx={{ width: '100%' }}>
                <Card sx={{ 
                  height: '100%', 
                  position: 'relative',
                  transform: { xs: 'scale(1)', md: plan.popular ? 'scale(1.05)' : 'scale(1)' },
                  transition: 'all 0.3s ease',
                  boxShadow: plan.popular ? 6 : 3,
                  '&:hover': { 
                    transform: { xs: 'scale(1)', md: plan.popular ? 'translateY(-8px) scale(1.05)' : 'translateY(-8px) scale(1)' },
                    boxShadow: 8
                  }
                }}>
                  {plan.popular && (
                    <Chip
                      label="Mais Popular"
                      sx={{
                        position: 'absolute',
                        top: { xs: 16, md: 32 },
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        color: 'white',
                        fontWeight: 600,
                        zIndex: 1,
                        fontSize: { xs: '0.7rem', md: '0.875rem' }
                      }}
                    />
                  )}
                  <CardContent sx={{ p: { xs: 1.25, sm: 1.5, md: 4 }, pt: { xs: plan.popular ? 5 : 1.25, sm: plan.popular ? 6 : 1.5, md: plan.popular ? 14 : 4 }, boxSizing: 'border-box' }}>
                    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 3 } }}>
                      <Box sx={{
                        width: { xs: 48, md: 64 },
                        height: { xs: 48, md: 64 },
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2
                      }}>
                        <plan.icon size={32} color="white" style={{ width: 'clamp(24px, 6vw, 32px)', height: 'clamp(24px, 6vw, 32px)' }} />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '1.125rem', md: '1.5rem' } }}>
                        {plan.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', my: 1, fontSize: { xs: '0.8125rem', md: '1rem' } }}>
                        {plan.description}
                      </Typography>
                      <Box sx={{ mt: { xs: 2, md: 3 } }}>
                        <Typography variant="h3" component="span" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', md: '3rem' } }}>
                          {plan.price}
                        </Typography>
                        <Typography component="span" sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', md: '1.25rem' } }}>
                          {plan.period}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: { xs: 2, md: 3 } }}>
                      {plan.features.map((feature, featureIndex) => (
                        <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'flex-start', mb: { xs: 1, md: 1.5 }, gap: 0.75 }}>
                          <CheckCircle size={18} color="#10b981" style={{ marginTop: 2, flexShrink: 0, width: 'clamp(14px, 3.5vw, 18px)', height: 'clamp(14px, 3.5vw, 18px)' }} />
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.8125rem', md: '1rem' }, lineHeight: 1.5 }}>
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <Box key={limitationIndex} sx={{ display: 'flex', alignItems: 'flex-start', mb: { xs: 1, md: 1.5 }, gap: 0.75 }}>
                          <X size={18} color="#9ca3af" style={{ marginTop: 2, flexShrink: 0, width: 'clamp(14px, 3.5vw, 18px)', height: 'clamp(14px, 3.5vw, 18px)' }} />
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.8125rem', md: '1rem' }, lineHeight: 1.5 }}>
                            {limitation}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <CardActions sx={{ p: 0, mt: { xs: 1, md: 0 } }}>
                      <Button
                        component={Link}
                        href="/login"
                        variant={plan.ctaVariant}
                        fullWidth
                        size="large"
                        endIcon={<ArrowRight size={18} style={{ width: 'clamp(14px, 3.5vw, 18px)', height: 'clamp(14px, 3.5vw, 18px)' }} />}
                        sx={{ fontSize: { xs: '0.8125rem', md: '1rem' }, py: { xs: 1, md: 1.5 } }}
                      >
                        {plan.cta}
                      </Button>
                    </CardActions>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Features Comparison */}
        <Container 
          maxWidth="lg" 
          sx={{ 
            mt: { xs: 4, md: 8 }, 
            px: { xs: 1, sm: 1.5, md: 3 }, 
            width: '100%',
            maxWidth: { xs: '100%', md: '1200px' },
            boxSizing: 'border-box'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 6 }, px: { xs: 1, md: 0 } }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' }, fontWeight: 700, mb: 2 }}>
              Compare os Recursos
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', sm: '1.125rem', md: '1.5rem' } }}>
              Veja todos os recursos incluídos em cada plano.
            </Typography>
          </Box>

          <Box sx={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
            <TableContainer component={Paper} sx={{ boxShadow: 3, minWidth: { xs: 600, md: 'auto' }, width: '100%' }}>
              <Table sx={{ minWidth: { xs: 600, md: 'auto' }, width: '100%' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', md: '1rem' }, whiteSpace: 'nowrap' }}>Recursos</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', md: '1rem' }, whiteSpace: 'nowrap' }}>Básico</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', md: '1rem' }, whiteSpace: 'nowrap' }}>Profissional</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', md: '1rem' }, whiteSpace: 'nowrap' }}>Empresarial</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    ['Horas de transcrição', '2h/mês', '20h/mês', 'Ilimitado'],
                    ['Idiomas suportados', 'Português', '20+ idiomas', 'Todos'],
                    ['Chat com IA', '❌', '✅', '✅ Premium'],
                    ['Templates personalizados', '❌', '✅', '✅ Ilimitados'],
                    ['Exportação', 'Básica', 'PDF, DOCX', 'Todos os formatos'],
                    ['API', '❌', 'Básica', 'Completa'],
                    ['Suporte', 'Email', 'Prioritário', '24/7']
                  ].map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', md: '1rem' }, whiteSpace: 'nowrap' }}>{row[0]}</TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>{row[1]}</TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>{row[2]}</TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>{row[3]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>

        {/* FAQ Section */}
        <Container 
          maxWidth="lg" 
          sx={{ 
            mt: { xs: 4, md: 8 }, 
            px: { xs: 1, sm: 1.5, md: 3 }, 
            width: '100%',
            maxWidth: { xs: '100%', md: '1200px' },
            boxSizing: 'border-box'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 6 }, px: { xs: 1, md: 0 } }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' }, fontWeight: 700, mb: 2 }}>
              Perguntas Frequentes
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', sm: '1.125rem', md: '1.5rem' } }}>
              Respostas para as dúvidas mais comuns sobre nossos planos.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ width: '100%', mx: 0 }}>
            {faqs.map((faq, index) => (
              <Grid item xs={12} md={6} key={index} sx={{ width: '100%' }}>
                <Card>
                  <CardContent sx={{ p: { xs: 1.5, md: 3 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: { xs: '0.9375rem', md: '1.25rem' } }}>
                      {faq.question}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.8125rem', md: '1rem' } }}>
                      {faq.answer}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* CTA Section */}
        <Box sx={{ py: { xs: 4, md: 10 }, width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          <Container 
            maxWidth="lg" 
            sx={{ 
              px: { xs: 1, sm: 1.5, md: 3 }, 
              width: '100%',
              maxWidth: { xs: '100%', md: '1200px' },
              boxSizing: 'border-box'
            }}
          >
            <Box sx={{ maxWidth: { xs: '100%', md: '800px' }, mx: 'auto', textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.02)', p: { xs: 1.5, md: 6 }, borderRadius: 4, width: '100%', boxSizing: 'border-box' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.5rem' } }}>
                Pronto para Começar?
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, fontSize: { xs: '0.875rem', sm: '1.125rem', md: '1.5rem' } }}>
                Comece hoje mesmo e experimente o poder da transcrição com IA.
              </Typography>
              <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/login"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowRight size={18} style={{ width: 'clamp(14px, 3.5vw, 18px)', height: 'clamp(14px, 3.5vw, 18px)' }} />}
                  sx={{ fontSize: { xs: '0.8125rem', md: '1.1rem' }, px: { xs: 2, md: 4 }, py: { xs: 1, md: 1.5 } }}
                >
                  Começar Agora
                </Button>
                <Button
                  component={Link}
                  href="/contact"
                  variant="outlined"
                  size="large"
                  sx={{ fontSize: { xs: '0.8125rem', md: '1.1rem' }, px: { xs: 2, md: 4 }, py: { xs: 1, md: 1.5 } }}
                >
                  Falar com Vendas
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Layout>
  );
}
