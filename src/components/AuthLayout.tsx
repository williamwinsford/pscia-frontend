'use client';

import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Mic, 
  Eye, 
  EyeOff 
} from 'lucide-react';

interface AuthLayoutProps {
  onAuthenticated: () => void;
}

export const AuthLayout = ({ onAuthenticated }: AuthLayoutProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - in real app would connect to backend
    onAuthenticated();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 448 }}>
        {/* Logo/Brand */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
              }}
            >
              <Mic size={24} color="white" />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Up Ai
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Transforme seus áudios em texto com inteligência artificial
          </Typography>
        </Box>

        {/* Auth Form */}
        <Card sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isLogin
                  ? 'Acesse sua conta para continuar'
                  : 'Crie sua conta para começar'}
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                id="email"
                type="email"
                label="Email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
              />
              
              <TextField
                fullWidth
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Senha"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: 'white',
                  fontWeight: 600,
                  py: 1.5,
                  mt: 1,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                  }
                }}
              >
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                <Button
                  onClick={() => setIsLogin(!isLogin)}
                  sx={{ ml: 0.5, textTransform: 'none' }}
                >
                  {isLogin ? 'Criar conta' : 'Entrar'}
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

