'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/hooks/useAudio';
import { NoIndex } from '@/components/NoIndex';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Stack
} from '@mui/material';
import {
  FileAudio,
  Clock,
  Calendar,
  Eye,
  Download,
  Trash2,
  MoreVertical,
  Filter,
  Search
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import Link from 'next/link';

export default function HistoryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { audioFiles, loadAudioFiles, deleteAudioFile, isLoading } = useAudio();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadAudioFiles();
    }
  }, [user]);

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

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, file: any) => {
    setMenuAnchor(event.currentTarget);
    setSelectedFile(file);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedFile(null);
  };

  const handleDeleteFile = async () => {
    if (!selectedFile) return;
    
    if (!confirm(`Tem certeza que deseja excluir "${selectedFile.file_name}"? Esta ação não pode ser desfeita.`)) {
      handleCloseMenu();
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAudioFile(selectedFile.id);
      handleCloseMenu();
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error);
      alert('Erro ao excluir arquivo. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'info';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'processing':
        return 'Processando';
      case 'error':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  };

  const filteredFiles = audioFiles.filter(file => {
    const matchesSearch = !searchTerm || 
      file.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
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
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Transcrições
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Visualize e gerencie todos os seus arquivos processados
            </Typography>
          </Box>

          {/* Filters */}
          <Card sx={{ mb: 4, p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Buscar transcrições..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search size={20} style={{ marginRight: 8, color: '#9ca3af' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    label="Todos"
                    onClick={() => setStatusFilter('all')}
                    color={statusFilter === 'all' ? 'primary' : 'default'}
                    size="small"
                  />
                  <Chip
                    label="Concluído"
                    onClick={() => setStatusFilter('completed')}
                    color={statusFilter === 'completed' ? 'primary' : 'default'}
                    size="small"
                  />
                  <Chip
                    label="Processando"
                    onClick={() => setStatusFilter('processing')}
                    color={statusFilter === 'processing' ? 'primary' : 'default'}
                    size="small"
                  />
                </Stack>
              </Grid>
            </Grid>
          </Card>

          {/* Files List */}
          {filteredFiles.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <FileAudio size={48} color="#9ca3af" />
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  Nenhuma transcrição encontrada
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  {searchTerm || statusFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Faça upload do seu primeiro arquivo para começar'}
                </Typography>
                {!searchTerm && statusFilter === 'all' && (
                  <Button
                    component={Link}
                    href="/upload"
                    variant="contained"
                    size="large"
                  >
                    Fazer Upload
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {filteredFiles.map((file) => (
                <Grid item xs={12} key={file.id}>
                  <Card sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 } }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FileAudio size={20} color="#3b82f6" />
                            {file.file_name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                            {formatDate(file.uploaded_at)}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                            {file.duration && (
                              <Chip
                                icon={<Clock size={16} />}
                                label={file.duration}
                                size="small"
                                variant="outlined"
                              />
                            )}
                            <Chip
                              label={getStatusText(file.status)}
                              color={getStatusColor(file.status)}
                              size="small"
                            />
                          </Box>
                        </Box>
                        <IconButton size="small" onClick={(e) => handleOpenMenu(e, file)}>
                          <MoreVertical size={18} />
                        </IconButton>
                      </Box>

                      {file.status === 'completed' && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                            Transcrição disponível
                          </Typography>
                          <CardActions sx={{ p: 0 }}>
                            <Button
                              component={Link}
                              href={`/transcription/${file.id}`}
                              size="small"
                              startIcon={<Eye size={16} />}
                            >
                              Visualizar
                            </Button>
                          </CardActions>
                        </Box>
                      )}

                      {file.status === 'processing' && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={16} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Processando... Isso pode levar alguns minutos.
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
      </Box>

      {/* Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu}>
          {selectedFile && selectedFile.status === 'completed' && (
            <MenuItem
              component={Link}
              href={`/transcription/${selectedFile.id}`}
              onClick={handleCloseMenu}
            >
              <Eye size={18} style={{ marginRight: 8 }} />
              Visualizar
            </MenuItem>
          )}
          <MenuItem 
            onClick={handleDeleteFile} 
            disabled={isDeleting}
            sx={{ color: 'error.main' }}
          >
            <Trash2 size={18} style={{ marginRight: 8 }} />
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </MenuItem>
      </Menu>
    </DashboardLayout>
    </>
  );
}
