'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Link as MuiLink,
  Divider,
  Stack
} from '@mui/material';
import { 
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
        color: 'white',
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg" sx={{ pt: 6, pb: 1 }}>
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                    Up Ai
                  </Typography>
                </Box>
              </Link>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3, lineHeight: 1.6 }}>
                Transformando áudio em texto e insights com inteligência artificial. 
                Nossa plataforma oferece transcrição precisa e análise avançada para 
                otimizar seu fluxo de trabalho.
              </Typography>
            </Box>
          </Grid>

          {/* Company */}
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
                Empresa
              </Typography>
              <Stack spacing={1}>
              <MuiLink
                component={Link}
                href="/about"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Sobre Nós
              </MuiLink>
              <MuiLink
                component={Link}
                href="/pricing"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Preços
              </MuiLink>
              <MuiLink
                component={Link}
                href="/contact"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Contato
              </MuiLink>
              </Stack>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
                Legal
              </Typography>
              <Stack spacing={1}>
              <MuiLink
                component={Link}
                href="/privacy"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Política de Privacidade
              </MuiLink>
              <MuiLink
                component={Link}
                href="/terms"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Termos de Serviço
              </MuiLink>
              <MuiLink
                component={Link}
                href="/cookies"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Política de Cookies
              </MuiLink>
              </Stack>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
                Contato
              </Typography>
              <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Mail size={16} color="rgba(255, 255, 255, 0.7)" />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  contato@clarityaudio.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Phone size={16} color="rgba(255, 255, 255, 0.7)" />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  +55 (11) 99999-9999
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <MapPin size={16} color="rgba(255, 255, 255, 0.7)" />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  São Paulo, SP - Brasil
                </Typography>
              </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 4, mb: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Copyright */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 2, md: 0 }
        }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: { xs: 'center', md: 'left' } }}>
            Owned by:{' '}
            <Box component="span" sx={{ fontWeight: 600 }}>
              Luthor Technologies
            </Box>
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
            &copy; {new Date().getFullYear()}{' '}
            <Box component="span" sx={{ fontWeight: 600 }}>
              Up Ai
            </Box>. Todos os direitos reservados.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: { xs: 'center', md: 'right' } }}>
            Powered by:{' '}
            <MuiLink 
              href="https://legatiosolutions.com" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { color: '#3b82f6', textDecoration: 'underline' }
              }}
            >
              Legatio Solutions
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}