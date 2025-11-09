'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rotas, garantindo que apenas usuários autenticados possam acessar
 * Redireciona automaticamente para /login se o usuário não estiver autenticado
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Aguarda o carregamento da autenticação antes de verificar
    if (!isLoading && !user) {
      // Redireciona imediatamente para login
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Verificando autenticação...
        </Typography>
      </Box>
    );
  }

  // Se não há usuário, não renderiza nada (já está redirecionando)
  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Redirecionando para login...
        </Typography>
      </Box>
    );
  }

  // Usuário autenticado, renderiza o conteúdo
  return <>{children}</>;
}



