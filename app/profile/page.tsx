'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { NoIndex } from '@/components/NoIndex';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  User,
  Mail,
  Calendar,
  Settings,
  Save,
  Edit
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function ProfilePage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    }
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validar senhas se foram preenchidas
    if (profileData.new_password) {
      if (profileData.new_password !== profileData.confirm_password) {
        setErrorMessage('As senhas não coincidem');
        setIsLoading(false);
        return;
      }
      if (profileData.new_password.length < 8) {
        setErrorMessage('A senha deve ter pelo menos 8 caracteres');
        setIsLoading(false);
        return;
      }
    }

    try {
      // Aqui você faria a chamada à API para atualizar o perfil
      // await authService.updateProfile(profileData);
      
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccessMessage('Perfil atualizado com sucesso!');
      setIsEditing(false);
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <>
      <NoIndex />
      <DashboardLayout>
      <Container maxWidth="lg" sx={{ py: 2 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Meu Perfil
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Gerencie suas informações pessoais e configurações
            </Typography>
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
              {successMessage}
            </Alert>
          )}

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>
              {errorMessage}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Profile Overview */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar
                    sx={{
                      width: 96,
                      height: 96,
                      mx: 'auto',
                      mb: 2,
                      fontSize: '2.5rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                    }}
                  >
                    {user.first_name?.[0] || user.email?.[0] || 'U'}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {user.first_name} {user.last_name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    {user.email}
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Calendar size={16} color="#9ca3af" />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Membro desde {formatDate(user.date_joined || '')}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Profile Settings */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Settings size={20} />
                        Configurações da Conta
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Atualize suas informações pessoais e senha
                      </Typography>
                    </Box>
                    <Button
                      variant={isEditing ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      startIcon={isEditing ? <Save size={18} /> : <Edit size={18} />}
                    >
                      {isEditing ? 'Salvar' : 'Editar'}
                    </Button>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Personal Information */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <User size={18} />
                      Informações Pessoais
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Nome"
                          value={profileData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Sobrenome"
                          value={profileData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider sx={{ mb: 4 }} />

                  {/* Password Section */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Mail size={18} />
                      Segurança
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Senha Atual"
                          type="password"
                          value={profileData.current_password}
                          onChange={(e) => handleInputChange('current_password', e.target.value)}
                          disabled={!isEditing}
                          helperText={isEditing ? 'Deixe em branco se não deseja alterar' : ''}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Nova Senha"
                          type="password"
                          value={profileData.new_password}
                          onChange={(e) => handleInputChange('new_password', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Confirmar Nova Senha"
                          type="password"
                          value={profileData.confirm_password}
                          onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {isEditing && (
                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button variant="outlined" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={18} /> : <Save size={18} />}
                      >
                        Salvar Alterações
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      </Container>
    </DashboardLayout>
    </>
  );
}

