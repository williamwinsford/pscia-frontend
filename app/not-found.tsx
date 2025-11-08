'use client';

import {
  Box,
  Container,
  Typography,
  Button
} from '@mui/material';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        textAlign: 'center'
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '6rem', md: '8rem' },
            fontWeight: 700,
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 2
          }}
        >
          Página não encontrada
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 4,
            fontSize: '1.1rem'
          }}
        >
          Oops! A página que você está procurando não existe ou foi movida.
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="contained"
          size="large"
          startIcon={<Home size={20} />}
          sx={{ fontWeight: 600 }}
        >
          Voltar para o Início
        </Button>
      </Container>
    </Box>
  );
}

