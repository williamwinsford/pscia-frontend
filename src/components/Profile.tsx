'use client';

import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Avatar, 
  Badge, 
  Divider,
  IconButton
} from '@mui/material';
import { ArrowLeft, User, Lock, Mail, Settings, Save, Edit3 } from 'lucide-react';

interface ProfileProps {
  onBack: () => void;
}

export const Profile = ({ onBack }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    memberSince: '2024-01-15',
    plan: 'Premium',
    totalTranscriptions: 47,
    totalMinutes: 1240
  });

  const handleSave = () => {
    // Mock save - in real app would connect to backend
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={onBack}>
          <ArrowLeft size={20} />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Meu Perfil
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Gerencie suas informações pessoais e configurações
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
            <CardHeader sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
                  {profileData.name.charAt(0)}
                </Avatar>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {profileData.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {profileData.email}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Badge 
                  badgeContent={profileData.plan} 
                  color="primary"
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem', px: 1 } }}
                >
                  <Box />
                </Badge>
              </Box>
            </CardHeader>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Membro desde {new Date(profileData.memberSince).toLocaleDateString('pt-BR')}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Transcrições
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {profileData.totalTranscriptions}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Minutos processados
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {profileData.totalMinutes.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Settings */}
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Settings size={20} />
                  <Typography variant="h6">Configurações da Conta</Typography>
                </Box>
              }
              subheader="Atualize suas informações pessoais e senha"
              action={
                <Button
                  variant={isEditing ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  startIcon={isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                >
                  {isEditing ? 'Salvar' : 'Editar'}
                </Button>
              }
            />
            <CardContent>
              {/* Personal Information */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <User size={20} />
                  Informações Pessoais
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="name"
                      label="Nome completo"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="email"
                      type="email"
                      label="Email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Password Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Lock size={20} />
                  Segurança
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="currentPassword"
                      type="password"
                      label="Senha atual"
                      placeholder="Digite sua senha atual"
                      value={profileData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="newPassword"
                      type="password"
                      label="Nova senha"
                      placeholder="Digite a nova senha"
                      value={profileData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="confirmPassword"
                      type="password"
                      label="Confirmar nova senha"
                      placeholder="Confirme a nova senha"
                      value={profileData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Account Information */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Mail size={20} />
                  Informações da Conta
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Plano atual"
                      value={profileData.plan}
                      disabled
                      InputProps={{
                        endAdornment: (
                          <Button size="small" sx={{ textTransform: 'none' }}>
                            Alterar plano
                          </Button>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Data de criação"
                      value={new Date(profileData.memberSince).toLocaleDateString('pt-BR')}
                      disabled
                    />
                  </Grid>
                </Grid>
              </Box>

              {isEditing && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    startIcon={<Save size={16} />}
                    sx={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                      }
                    }}
                  >
                    Salvar alterações
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

