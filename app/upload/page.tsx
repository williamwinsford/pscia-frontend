'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAudio } from '@/hooks/useAudio';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { NoIndex } from '@/components/NoIndex';
import { RequireAuth } from '@/components/RequireAuth';
import { Upload, FileAudio, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Alert,
  LinearProgress,
  Chip,
  Avatar,
  CircularProgress,
  Stack,
  Paper,
  IconButton
} from '@mui/material';

export default function UploadPage() {
  const { user } = useAuth();
  const { 
    audioFiles, 
    uploadAudio, 
    loadAudioFiles, 
    isLoading, 
    error, 
    clearError,
    formatFileSize,
    formatDuration,
    getStatusColor,
    getStatusText
  } = useAudio();
  const router = useRouter();
  const pathname = usePathname();
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (user && pathname === '/upload') {
      loadAudioFiles();
    }
  }, [user, pathname, loadAudioFiles]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    clearError();
    
    for (const file of acceptedFiles) {
      try {
        setUploadProgress(0);
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        await uploadAudio(file);
        setUploadProgress(100);
        
        setTimeout(() => {
          setUploadProgress(0);
        }, 1000);
        
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  }, [uploadAudio, clearError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.wma']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: true
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'failed':
        return <XCircle size={16} />;
      case 'processing':
      case 'uploading':
        return <Clock size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  if (isLoading) {
    return (
      <RequireAuth>
        <DashboardLayout>
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            <CircularProgress size={60} />
            <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
              Carregando...
            </Typography>
          </Box>
        </DashboardLayout>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
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
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              Upload de Áudio
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Faça upload de seus arquivos de áudio para transcrição e análise
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {/* Upload Area */}
          <Card sx={{ mb: 4 }}>
            <CardHeader
              title="Arraste e solte seus arquivos de áudio"
              subheader="Formatos suportados: MP3, WAV, M4A, OGG, WMA (máximo 100MB)"
            />
            <CardContent>
              <Paper
                {...getRootProps()}
                elevation={0}
                sx={{
                  border: 2,
                  borderStyle: 'dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.300',
                  borderRadius: 3,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragActive ? 'primary.main' + '08' : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.main' + '05'
                  }
                }}
              >
                <input {...getInputProps()} />
                <Avatar
                  sx={{
                    mx: 'auto',
                    mb: 2,
                    width: 64,
                    height: 64,
                    bgcolor: 'action.disabledBackground',
                    color: 'action.disabled'
                  }}
                >
                  <Upload size={32} />
                </Avatar>
                {isDragActive ? (
                  <Typography variant="h6" color="primary">
                    Solte os arquivos aqui...
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    <Typography variant="body1" color="text.secondary">
                      Arraste arquivos de áudio aqui ou clique para selecionar
                    </Typography>
                    <Button variant="outlined" sx={{ mx: 'auto' }}>
                      Selecionar Arquivos
                    </Button>
                  </Stack>
                )}
              </Paper>

              {uploadProgress > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Enviando arquivo...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {uploadProgress}%
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Audio Files List */}
          <Card>
            <CardHeader
              title="Seus Arquivos de Áudio"
              subheader={`${audioFiles.length} arquivo(s) enviado(s)`}
              action={
                <IconButton
                  onClick={loadAudioFiles}
                  disabled={isLoading}
                  color="primary"
                >
                  <RefreshCw size={20} />
                </IconButton>
              }
            />
            <CardContent>
              {audioFiles.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Avatar
                    sx={{
                      mx: 'auto',
                      mb: 2,
                      width: 80,
                      height: 80,
                      bgcolor: 'action.disabledBackground',
                      color: 'action.disabled'
                    }}
                  >
                    <FileAudio size={40} />
                  </Avatar>
                  <Typography variant="body1" color="text.secondary">
                    Nenhum arquivo de áudio enviado ainda
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {audioFiles.map((file) => (
                    <Paper
                      key={file.id}
                      elevation={0}
                      sx={{
                        p: 3,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          boxShadow: 2
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <FileAudio size={24} />
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 200 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {file.file_name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                {formatFileSize(file.file_size)}
                              </Typography>
                              {file.duration && (
                                <Typography variant="caption" color="text.secondary">
                                  {formatDuration(file.duration)}
                                </Typography>
                              )}
                              <Typography variant="caption" color="text.secondary">
                                {new Date(file.uploaded_at).toLocaleDateString('pt-BR')}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip
                            icon={getStatusIcon(file.status)}
                            label={getStatusText(file.status)}
                            color={file.status === 'completed' ? 'success' : file.status === 'failed' ? 'error' : 'info'}
                            variant="outlined"
                            size="small"
                          />
                          
                          {file.status === 'completed' && (
                            <Link href={`/transcription/${file.id}`} style={{ textDecoration: 'none' }}>
                              <Button
                                variant="contained"
                                size="small"
                              >
                                Ver Transcrição
                              </Button>
                            </Link>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
      </Box>
    </DashboardLayout>
    </RequireAuth>
  );
}
