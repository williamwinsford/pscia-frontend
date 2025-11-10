'use client';

import { useState, useCallback } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  LinearProgress,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { audioService, AudioFile } from '@/services/audio';

interface UploadAreaProps {
  onFileUploaded: (file: AudioFile) => void;
}

export const UploadArea = ({ onFileUploaded }: UploadAreaProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const resetUpload = () => {
    setUploadingFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setErrorMessage('');
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg',
      'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'
    ];
    const allowedExtensions = ['.mp3', '.mpeg', '.wav', '.m4a', '.ogg', '.mp4', '.avi', '.mov', '.mkv', '.webm'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setErrorMessage('Tipo de arquivo não suportado. Por favor, envie arquivos de áudio (MP3, MPEG, WAV, M4A, OGG) ou vídeo (MP4, AVI, MOV, MKV, WebM).');
      setUploadStatus('error');
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setErrorMessage('Arquivo muito grande. O arquivo deve ter no máximo 100MB.');
      setUploadStatus('error');
      return;
    }

    // Start real upload
    setUploadingFile(file.name);
    setUploadStatus('uploading');
    setUploadProgress(0);
    setErrorMessage('');

    try {
      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Upload to backend
      const uploadedFile = await audioService.uploadAudio(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      
      // Callback after success animation
      setTimeout(() => {
        onFileUploaded(uploadedFile);
        resetUpload();
      }, 1500);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(error.message || 'Erro ao fazer upload do arquivo. Tente novamente.');
      setUploadProgress(0);
      
      // Reset after showing error
      setTimeout(() => {
        resetUpload();
      }, 3000);
    }

  }, [onFileUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.mpeg', '.wav', '.m4a', '.ogg'],
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm']
    },
    multiple: false,
    maxSize: 100 * 1024 * 1024 // 100MB
  });

  const handleCloseSnackbar = () => {
    setErrorMessage('');
    if (uploadStatus === 'error') {
      setUploadStatus('idle');
    }
  };

  if (uploadStatus === 'uploading' || uploadStatus === 'success') {
    return (
      <Card sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', space: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              {uploadStatus === 'uploading' && (
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    border: '4px solid #f3f4f6',
                    borderTopColor: '#3b82f6',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }}
                />
              )}
              {uploadStatus === 'success' && (
                <CheckCircle size={48} color="green" />
              )}
            </Box>
            
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {uploadStatus === 'uploading' ? 'Enviando arquivo...' : 'Upload concluído!'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {uploadingFile}
            </Typography>
            
            {uploadStatus === 'uploading' && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress} 
                  sx={{ mb: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {uploadProgress}% concluído
                </Typography>
              </Box>
            )}
            
            {uploadStatus === 'success' && (
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                Processando com IA... Aguarde um momento.
              </Typography>
            )}
            
            {uploadStatus === 'uploading' && (
              <Button 
                variant="outlined" 
                startIcon={<X size={20} />}
                onClick={resetUpload}
                size="small"
                sx={{ mt: 2 }}
              >
                Cancelar
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            {...getRootProps()}
            sx={{
              border: `2px dashed ${isDragActive ? '#3b82f6' : '#e5e7eb'}`,
              borderRadius: 3,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              bgcolor: isDragActive ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
              '&:hover': {
                borderColor: '#3b82f6',
                bgcolor: 'rgba(59, 130, 246, 0.05)'
              }
            }}
          >
            <input {...getInputProps()} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <Upload size={32} color="white" />
                </Box>
              </Box>
              
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {isDragActive ? 'Solte o arquivo aqui' : 'Envie seu arquivo de áudio ou vídeo'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Arraste e solte ou clique para selecionar
              </Typography>
              
              {!isDragActive && (
                <Button variant="contained" 
                  size="large"
                  startIcon={<File size={20} />}
                  sx={{
                    mb: 2,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: 'white',
                    fontWeight: 600
                  }}
                >
                  Selecionar Arquivo
                </Button>
              )}
              
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Suporta áudio (MP3, MPEG, WAV, M4A, OGG) e vídeo (MP4, AVI, MOV, MKV, WebM) • Máximo 100MB
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar 
        open={!!errorMessage} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};