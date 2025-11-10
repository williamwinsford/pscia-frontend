'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAudio } from '@/hooks/useAudio';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { NoIndex } from '@/components/NoIndex';
import { RequireAuth } from '@/components/RequireAuth';
import { Upload } from 'lucide-react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Alert,
  LinearProgress,
  Avatar,
  CircularProgress,
  Stack,
  Paper
} from '@mui/material';

export default function UploadPage() {
  const { user } = useAuth();
  const { 
    uploadAudio, 
    loadAudioFiles, 
    isLoading, 
    error, 
    clearError
  } = useAudio();
  const pathname = usePathname();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user && pathname === '/upload') {
      loadAudioFiles();
    }
  }, [user, pathname, loadAudioFiles]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    clearError();
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Upload todos os arquivos com progresso real
      const uploadPromises = acceptedFiles.map((file, index) => {
        return uploadAudio(
          file,
          'pt-BR',
          // Callback de progresso - atualiza progresso baseado no upload real
          (progress) => {
            // Calcular progresso total considerando todos os arquivos
            const progressPerFile = 100 / acceptedFiles.length;
            const baseProgress = (index * progressPerFile);
            const fileProgress = (progress * progressPerFile) / 100;
            const totalProgress = Math.min(99, Math.round(baseProgress + fileProgress));
            setUploadProgress(totalProgress);
          }
        );
      });
      
      // Aguardar todos os uploads completarem
      await Promise.all(uploadPromises);
      
      // Upload completo - mostrar 100% e redirecionar imediatamente
      setUploadProgress(100);
      
      // Redirecionar imediatamente após upload (não aguardar transcrição)
      // A transcrição acontecerá em background
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        // Redirect to history page using window.location to avoid React DOM issues
        window.location.href = '/history';
      }, 300);
      
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [uploadAudio, clearError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.mpeg', '.wav', '.m4a', '.ogg', '.wma']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: true,
    disabled: isUploading
  });

  return (
    <RequireAuth>
      <NoIndex />
      <DashboardLayout>
      <Box 
        sx={{
          maxWidth: { xs: '100%', md: '1400px', lg: '1600px' },
          py: 2,
          width: '100%',
          mx: 'auto'
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
              subheader="Formatos suportados: MP3, MPEG, WAV, M4A, OGG, WMA (máximo 100MB)"
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
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  backgroundColor: isDragActive ? 'primary.main' + '08' : 'transparent',
                  opacity: isUploading ? 0.6 : 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: isUploading ? 'grey.300' : 'primary.main',
                    backgroundColor: isUploading ? 'transparent' : 'primary.main' + '05'
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
                      {uploadProgress < 100 ? 'Enviando arquivo...' : 'Upload concluído! Redirecionando...'}
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
      </Box>
    </DashboardLayout>
    </RequireAuth>
  );
}
