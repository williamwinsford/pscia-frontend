'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Badge,
  Paper
} from '@mui/material';
import { ArrowLeft, Download, Copy, FileText, List, Star, Clock, MessageCircle } from 'lucide-react';
import { ChatIA } from './ChatIA';
import type { TranscriptionData } from './Dashboard';

interface TranscriptionResultsProps {
  transcription: TranscriptionData;
  onBack: () => void;
}

export const TranscriptionResults = ({ transcription, onBack }: TranscriptionResultsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleExport = (format: 'pdf' | 'docx') => {
    // Mock export functionality
    console.log(`Exporting as ${format}`);
  };

  if (transcription.status === 'processing') {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <IconButton onClick={onBack} sx={{ mb: 2 }}>
          <ArrowLeft size={20} />
        </IconButton>

        <Card sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  border: '4px solid #f3f4f6',
                  borderTopColor: '#3b82f6',
                  mx: 'auto',
                  mb: 3,
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Processando áudio...
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Nossa IA está transcrevendo e analisando seu arquivo
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {transcription.fileName}
              </Typography>
              <Paper sx={{ mt: 3, p: 2, bgcolor: 'rgba(59, 130, 246, 0.1)' }}>
                <Typography variant="body2">
                  ⏱️ Tempo estimado: 2-3 minutos para arquivos de até 30 minutos
                </Typography>
              </Paper>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <IconButton onClick={onBack}>
          <ArrowLeft size={20} />
        </IconButton>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            onClick={() => handleExport('pdf')}
            startIcon={<Download size={16} />}
          >
            PDF
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => handleExport('docx')}
            startIcon={<Download size={16} />}
          >
            DOCX
          </Button>
        </Box>
      </Box>

      {/* File Info */}
      <Card sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', mb: 3 }}>
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
                <Clock size={16} />
                {transcription.duration}
              </Typography>
              <Typography variant="body2">•</Typography>
              <Typography variant="body2">
                Processado em {transcription.uploadDate}
              </Typography>
            </Box>
          }
          action={
            <Badge 
              badgeContent="Concluído" 
              color="success"
              sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem' } }}
            >
              <Box />
            </Badge>
          }
        />
      </Card>

      {/* Results Tabs */}
      <Card sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<FileText size={20} />} label="Transcrição" iconPosition="start" />
          <Tab icon={<List size={20} />} label="Resumo" iconPosition="start" />
          <Tab icon={<Star size={20} />} label="Destaques" iconPosition="start" />
          <Tab icon={<MessageCircle size={20} />} label="Chat IA" iconPosition="start" />
        </Tabs>

        <CardContent>
          {/* Transcription Tab */}
          {activeTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Transcrição Completa</Typography>
                <IconButton 
                  onClick={() => handleCopy(transcription.transcription || '', 'Transcrição')}
                  size="small"
                >
                  <Copy size={16} />
                </IconButton>
              </Box>
              <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                  {transcription.transcription}
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Summary Tab */}
          {activeTab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6">Resumo Automático</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Principais pontos organizados automaticamente pela IA
                  </Typography>
                </Box>
                <IconButton 
                  onClick={() => handleCopy(transcription.summary || '', 'Resumo')}
                  size="small"
                >
                  <Copy size={16} />
                </IconButton>
              </Box>
              <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                  {transcription.summary}
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Highlights Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Pontos Relevantes
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                Decisões, ações e insights identificados pela IA
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {transcription.highlights?.map((highlight, index) => (
                  <Paper 
                    key={index} 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(59, 130, 246, 0.05)',
                      border: '1px solid',
                      borderColor: 'primary.light'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Star size={20} style={{ color: '#3b82f6', marginTop: 2 }} />
                      <Typography variant="body1">{highlight}</Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}

          {/* Chat Tab */}
          {activeTab === 3 && (
            <ChatIA transcription={transcription} />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

