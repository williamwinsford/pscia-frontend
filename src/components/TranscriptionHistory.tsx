'use client';

import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Badge, 
  Button,
  Box,
  IconButton
} from '@mui/material';
import { FileText, Clock, Calendar, Eye, Download } from 'lucide-react';
import type { TranscriptionData } from './Dashboard';

interface TranscriptionHistoryProps {
  transcriptions: TranscriptionData[];
  onViewTranscription: (transcription: TranscriptionData) => void;
}

export const TranscriptionHistory = ({ transcriptions, onViewTranscription }: TranscriptionHistoryProps) => {
  const getStatusBadge = (status: TranscriptionData['status']) => {
    switch (status) {
      case 'completed':
        return <Badge badgeContent="Concluído" color="success" />;
      case 'processing':
        return <Badge badgeContent="Processando" color="info" />;
      case 'error':
        return <Badge badgeContent="Erro" color="error" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Transcrições
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Visualize e gerencie todos os seus arquivos processados
        </Typography>
      </Box>

      {transcriptions.length === 0 ? (
        <Card sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ textAlign: 'center' }}>
              <FileText size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Nenhuma transcrição encontrada
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Faça upload do seu primeiro arquivo para começar
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {transcriptions.map((transcription) => (
            <Card 
              key={transcription.id} 
              sx={{ 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s',
                '&:hover': { boxShadow: '0 6px 30px rgba(0, 0, 0, 0.12)' }
              }}
            >
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FileText size={20} />
                    <Typography variant="h6">{transcription.fileName}</Typography>
                  </Box>
                }
                subheader={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Calendar size={16} />
                      {formatDate(transcription.uploadDate)}
                    </Typography>
                    {transcription.duration && (
                      <>
                        <Typography variant="body2">•</Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Clock size={16} />
                          {transcription.duration}
                        </Typography>
                      </>
                    )}
                  </Box>
                }
                action={getStatusBadge(transcription.status)}
              />
              
              {transcription.status === 'completed' && (
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Transcrição, resumo e destaques disponíveis
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => onViewTranscription(transcription)}
                        startIcon={<Eye size={16} />}
                      >
                        Visualizar
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<Download size={16} />}
                      >
                        Baixar
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              )}
              
              {transcription.status === 'processing' && (
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        border: '2px solid #f3f4f6',
                        borderTopColor: '#3b82f6',
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Processando... Isso pode levar alguns minutos.
                    </Typography>
                  </Box>
                </CardContent>
              )}
              
              {transcription.status === 'error' && (
                <CardContent>
                  <Typography variant="body2" sx={{ color: 'error.main' }}>
                    Erro ao processar o arquivo. Tente novamente.
                  </Typography>
                </CardContent>
              )}
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

