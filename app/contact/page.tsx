'use client';

import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Headphones
} from 'lucide-react';
import Link from 'next/link';
import { Layout } from '@/components/Layout';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    description: 'contato@transcribeai.com',
    subtitle: 'Resposta em até 24h'
  },
  {
    icon: Phone,
    title: 'Telefone',
    description: '+55 (11) 99999-9999',
    subtitle: 'Seg-Sex, 9h às 18h'
  },
  {
    icon: MapPin,
    title: 'Endereço',
    description: 'São Paulo, SP - Brasil',
    subtitle: 'Escritório principal'
  },
  {
    icon: Clock,
    title: 'Horário',
    description: 'Segunda a Sexta',
    subtitle: '9h às 18h (Brasil)'
  }
];

const faqs = [
  {
    question: 'Como funciona a transcrição?',
    answer: 'Nossa IA analisa o áudio e converte em texto com 99% de precisão, gerando também resumos e destaques automaticamente.'
  },
  {
    question: 'Quais formatos de áudio são suportados?',
    answer: 'Suportamos MP3, MPEG, WAV, M4A, FLAC e outros formatos populares de áudio.'
  },
  {
    question: 'Meus dados estão seguros?',
    answer: 'Sim! Utilizamos criptografia de nível bancário e nunca compartilhamos seus dados com terceiros.'
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim, você pode cancelar sua assinatura a qualquer momento sem taxas de cancelamento.'
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', company: '', subject: '', message: '' });

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <Layout showHeader={true} showFooter={true}>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', py: 8 }}>
        {/* Hero Section */}
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center', mb: 8 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 700, mb: 3 }}>
              Entre em
              <Box component="span" sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {' '}Contato
              </Box>
            </Typography>
            <Typography variant="h5" sx={{ color: 'text.secondary' }}>
              Estamos aqui para ajudar! Entre em contato conosco para dúvidas, 
              sugestões ou para saber mais sobre nossos serviços.
            </Typography>
          </Box>
        </Container>

        {/* Contact Form & Info */}
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {/* Contact Form */}
            <Grid item xs={12} lg={7}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                    Envie uma Mensagem
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    Preencha o formulário abaixo e entraremos em contato em breve.
                  </Typography>

                  {submitted && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      Mensagem enviada com sucesso! Entraremos em contato em breve.
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Nome *"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="email"
                          label="Email *"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Empresa"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Assunto *"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={6}
                          label="Mensagem *"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          fullWidth
                          disabled={isSubmitting}
                          startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send size={20} />}
                        >
                          {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} lg={5}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  Informações de Contato
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 }, mb: 4 }}>
                  {contactInfo.map((info, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{
                        width: { xs: 40, md: 48 },
                        height: { xs: 40, md: 48 },
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <info.icon size={24} color="white" style={{ width: 'clamp(20px, 5vw, 24px)', height: 'clamp(20px, 5vw, 24px)' }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', md: '1.25rem' } }}>
                          {info.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                          {info.description}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                          {info.subtitle}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Quick Actions */}
                <Card sx={{ boxShadow: 2 }}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      Ações Rápidas
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        component={Link}
                        href="/login"
                        variant="outlined"
                        fullWidth
                        startIcon={<MessageCircle size={18} />}
                        sx={{ justifyContent: 'flex-start', fontSize: { xs: '0.875rem', md: '1rem' } }}
                      >
                        Acessar Suporte
                      </Button>
                      <Button
                        component={Link}
                        href="/pricing"
                        variant="outlined"
                        fullWidth
                        startIcon={<Headphones size={18} />}
                        sx={{ justifyContent: 'flex-start', fontSize: { xs: '0.875rem', md: '1rem' } }}
                      >
                        Ver Planos
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* FAQ Section */}
        <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 8 }, px: { xs: 2, md: 3 } }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' }, fontWeight: 700, mb: 2, px: { xs: 2, md: 0 } }}>
              Perguntas Frequentes
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, px: { xs: 2, md: 0 } }}>
              Respostas para as dúvidas mais comuns sobre nossos serviços.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {faqs.map((faq, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      {faq.question}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                      {faq.answer}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* CTA Section */}
        <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 8 }, mb: 4, px: { xs: 2, md: 3 } }}>
          <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center', px: { xs: 2, md: 0 } }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
              Pronto para Começar?
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
              Experimente a Up Ai gratuitamente e veja como podemos transformar sua produtividade.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/login"
                variant="contained"
                size="large"
                sx={{ fontSize: '1.1rem', px: 4 }}
              >
                Começar Agora
              </Button>
              <Button
                component={Link}
                href="/about"
                variant="outlined"
                size="large"
                sx={{ fontSize: '1.1rem', px: 4 }}
              >
                Conhecer Mais
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
}

