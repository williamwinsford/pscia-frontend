'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useAudio } from '@/hooks/useAudio';
import { useAuth } from '@/hooks/useAuth';
import { useTemplates } from '@/hooks/useTemplates';
import { DashboardLayout } from '@/components/DashboardLayout';
import { NoIndex } from '@/components/NoIndex';
import { 
  ArrowLeft, 
  Copy, 
  Download, 
  MessageCircle, 
  FileAudio,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  RefreshCw,
  Smile,
  Key,
  FileCheck,
  Tag,
  FileEdit
} from 'lucide-react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Chip,
  Alert,
  Paper,
  Grid,
  Avatar,
  Stack,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TranscriptionPage() {
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const { 
    getTranscription, 
    analyzeAudio, 
    isLoading, 
    error, 
    clearError,
    formatFileSize,
    formatDuration,
    formatTranscriptionTemplate
  } = useAudio();
  
  const { loadTemplates, templates, isLoading: templatesLoading } = useTemplates();
  
  const [transcription, setTranscription] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [formatDialogOpen, setFormatDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | ''>('');
  const [isFormatting, setIsFormatting] = useState(false);

  const audioFileId = parseInt(params.id as string);

  // Mapear análises por tipo para acesso rápido
  const analysesMap = useMemo(() => {
    if (!transcription?.analyses) return {};
    const map: { [key: string]: any } = {};
    transcription.analyses.forEach((analysis: any) => {
      map[analysis.analysis_type] = analysis;
    });
    return map;
  }, [transcription]);

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login';
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (audioFileId && user) {
      loadTranscription();
    }
  }, [audioFileId, user]);

  const loadTranscription = async () => {
    try {
      clearError();
      const trans = await getTranscription(audioFileId);
      setTranscription(trans);
    } catch (error) {
      console.error('Error loading transcription:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const downloadTranscription = async () => {
    if (!transcription) return;
    
    try {
      // Importar jspdf dinamicamente
      const { default: jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (2 * margin);
      
      // Adicionar título
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Transcrição de Áudio', margin, 30);
      
      // Informações do arquivo
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Arquivo: ${transcription.audio_file.file_name}`, margin, 40);
      
      const uploadDate = new Date(transcription.audio_file.uploaded_at).toLocaleString('pt-BR');
      doc.text(`Data: ${uploadDate}`, margin, 47);
      
      if (transcription.audio_file.duration) {
        doc.text(`Duração: ${formatDuration(transcription.audio_file.duration)}`, margin, 54);
      }
      
      if (transcription.confidence) {
        doc.text(`Confiança: ${Math.round(transcription.confidence * 100)}%`, margin, 61);
      }
      
      // Linha separadora
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, 70, pageWidth - margin, 70);
      
      // Adicionar texto da transcrição
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      const text = transcription.text;
      const lines = doc.splitTextToSize(text, maxWidth);
      
      let yPosition = 82;
      const lineHeight = 6;
      
      lines.forEach((line: string) => {
        // Verificar se precisa de nova página
        if (yPosition + lineHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });

      // Adicionar análises de IA se existirem
      if (transcription.analyses && transcription.analyses.length > 0) {
        // Adicionar nova página para análises
        doc.addPage();
        yPosition = margin;

        // Título da seção de análises
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Análises de IA', margin, yPosition);
        yPosition += 15;

        // Linha separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        // Adicionar cada análise
        transcription.analyses.forEach((analysis: any) => {
          // Verificar se precisa de nova página
          if (yPosition + 40 > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }

          // Título da análise
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(getAnalysisTitle(analysis.analysis_type), margin, yPosition);
          yPosition += 8;

          // Conteúdo da análise
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          
          const result = analysis.result;
          let analysisText = formatAnalysisText(analysis);

          if (analysisText) {
            const analysisLines = doc.splitTextToSize(analysisText, maxWidth);
            analysisLines.forEach((line: string) => {
              if (yPosition + lineHeight > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
              }
              doc.text(line, margin, yPosition);
              yPosition += lineHeight;
            });
          }

          yPosition += 10; // Espaço entre análises
        });
      }
      
      // Adicionar footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
          doc.text(
          `Página ${i} de ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
      
      // Salvar PDF
      const fileName = `transcricao_${transcription.audio_file.file_name}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      // Fallback para download de texto se PDF falhar
      const element = document.createElement('a');
      const file = new Blob([transcription.text], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `transcricao_${transcription.audio_file.file_name}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const regenerateAnalysis = async (analysisType: string) => {
    try {
      setIsAnalyzing(prev => ({ ...prev, [analysisType]: true }));
      const analysis = await analyzeAudio(audioFileId, analysisType as any);
      
      // Atualizar transcrição com nova análise
      setTranscription((prev: any) => {
        if (!prev) return prev;
        const updatedAnalyses = prev.analyses 
          ? prev.analyses.filter((a: any) => a.analysis_type !== analysisType)
          : [];
        updatedAnalyses.push(analysis);
        return {
          ...prev,
          analyses: updatedAnalyses
        };
      });
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(prev => ({ ...prev, [analysisType]: false }));
    }
  };

  const getAnalysisTitle = (type: string) => {
    switch (type) {
      case 'sentiment':
        return 'Análise de Sentimento';
      case 'keywords':
        return 'Palavras-chave';
      case 'summary':
        return 'Resumo';
      case 'topics':
        return 'Tópicos';
      default:
        return 'Análise';
    }
  };

  const handleFormatTemplate = async () => {
    if (!selectedTemplateId || !transcription) return;
    
    setIsFormatting(true);
    try {
      const result = await formatTranscriptionTemplate(
        audioFileId,
        selectedTemplateId as number
      );
      
      // Gerar PDF
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (2 * margin);
      
      // Adicionar título
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(result.template_name, margin, 30);
      
      // Informações do arquivo
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Arquivo: ${transcription.audio_file.file_name}`, margin, 40);
      
      const uploadDate = new Date(transcription.audio_file.uploaded_at).toLocaleString('pt-BR');
      doc.text(`Data: ${uploadDate}`, margin, 47);
      
      // Linha separadora
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, 55, pageWidth - margin, 55);
      
      // Adicionar conteúdo preenchido
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      const text = result.filled_content;
      const lines = doc.splitTextToSize(text, maxWidth);
      
      let yPosition = 67;
      const lineHeight = 6;
      
      lines.forEach((line: string) => {
        // Verificar se precisa de nova página
        if (yPosition + lineHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      
      // Adicionar footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Página ${i} de ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
      
      // Salvar PDF
      const fileName = `${result.template_name}_${transcription.audio_file.file_name.replace(/\.[^/.]+$/, '')}.pdf`;
      doc.save(fileName);
      
      // Fechar diálogo e resetar
      setFormatDialogOpen(false);
      setSelectedTemplateId('');
    } catch (error: any) {
      console.error('Erro ao formatar template:', error);
      // O erro já será tratado pelo hook useAudio
    } finally {
      setIsFormatting(false);
    }
  };

  const formatAnalysisText = (analysis: any): string => {
    if (typeof analysis.result === 'string') {
      return analysis.result;
    }

    const result = analysis.result;
    
    switch (analysis.analysis_type) {
      case 'sentiment':
        if (result.sentiment && result.confidence !== undefined) {
          const sentimentMap: { [key: string]: string } = {
            'positive': 'Positivo',
            'negative': 'Negativo',
            'neutral': 'Neutro'
          };
          const sentimentKey = String(result.sentiment).toLowerCase();
          const sentimentPt = sentimentMap[sentimentKey] || String(result.sentiment);
          
          return `Sentimento: ${sentimentPt}\nConfiança: ${result.confidence}\nExplicação: ${result.explanation || 'N/A'}`;
        }
        break;
      
      case 'keywords':
        if (result.keywords && Array.isArray(result.keywords)) {
          let formatted = '';
          if (result.summary) {
            formatted += `${result.summary}\n\n`;
          }
          formatted += `Palavras-chave: ${result.keywords.join(', ')}`;
          if (result.categories && Array.isArray(result.categories)) {
            formatted += `\n\nCategorias: ${result.categories.join(', ')}`;
          }
          return formatted;
        }
        break;
      
      case 'summary':
        if (result.summary) {
          let formatted = result.summary;
          if (result.key_points && Array.isArray(result.key_points)) {
            formatted += '\n\nPontos principais:\n';
            result.key_points.forEach((point: string, idx: number) => {
              formatted += `${idx + 1}. ${point}\n`;
            });
          }
          if (result.word_count) {
            formatted += `\n\nTotal de palavras: ${result.word_count}`;
          }
          return formatted;
        }
        break;
      
      case 'topics':
        if (result.topics && Array.isArray(result.topics)) {
          let formatted = '';
          if (result.main_topic) {
            formatted += `Tópico Principal: ${result.main_topic}\n\n`;
          }
          formatted += 'Tópicos identificados:\n';
          result.topics.forEach((topic: string, idx: number) => {
            const relevance = result.relevance && result.relevance[idx] 
              ? ` (${Math.round(result.relevance[idx] * 100)}% relevância)` 
              : '';
            formatted += `${idx + 1}. ${topic}${relevance}\n`;
          });
          return formatted;
        }
        break;
    }
    
    // Fallback para JSON se não houver formatação específica
    return JSON.stringify(result, null, 2);
  };

  const renderAnalysisContent = (analysisType: string) => {
    const analysis = analysesMap[analysisType];
    const isRegenerating = isAnalyzing[analysisType];

    if (isRegenerating) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            Gerando análise...
          </Typography>
        </Box>
      );
    }

    if (!analysis) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Análise ainda não foi gerada.
          </Alert>
          <Button
            variant="contained"
            startIcon={<RefreshCw size={16} />}
            onClick={() => regenerateAnalysis(analysisType)}
          >
            Gerar Análise
          </Button>
        </Box>
      );
    }

    if (analysis.result?.error) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Erro ao gerar análise: {analysis.result.error}
          </Alert>
          <Button
            variant="contained"
            startIcon={<RefreshCw size={16} />}
            onClick={() => regenerateAnalysis(analysisType)}
          >
            Tentar Novamente
          </Button>
        </Box>
      );
    }

    return (
      <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
          {formatAnalysisText(analysis)}
        </Typography>
      </Paper>
    );
  };

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
          <Typography variant="body1" sx={{ mt: 2, ml: 2, color: 'text.secondary' }}>
            Carregando transcrição...
          </Typography>
        </Box>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  if (!transcription) {
    return (
      <DashboardLayout>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
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
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                Transcrição não encontrada
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                A transcrição solicitada não foi encontrada.
              </Typography>
              <Button variant="contained" onClick={() => window.location.href = '/upload'}>
                Voltar para Upload
              </Button>
            </CardContent>
          </Card>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <>
      <NoIndex />
      <DashboardLayout>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => window.history.back()} size="small">
                <ArrowLeft size={20} />
              </IconButton>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Transcrição
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {transcription.audio_file.file_name}
                </Typography>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<Copy size={16} />}
                onClick={() => copyToClipboard(transcription.text)}
                disabled={copySuccess}
              >
                {copySuccess ? 'Copiado!' : 'Copiar'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download size={16} />}
                onClick={downloadTranscription}
              >
                Baixar
              </Button>
              <Button
                variant="contained"
                startIcon={<MessageCircle size={16} />}
                onClick={() => window.location.href = `/chat?audio=${audioFileId}`}
              >
                Chat com IA
              </Button>
              <Button
                variant="contained"
                startIcon={<FileEdit size={16} />}
                onClick={() => {
                  setFormatDialogOpen(true);
                  loadTemplates();
                }}
              >
                Formatar em template
              </Button>
            </Stack>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* File Info */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                    <FileAudio size={32} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {transcription.audio_file.file_name}
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Clock size={14} />
                        {formatFileSize(transcription.audio_file.file_size)}
                      </Typography>
                      {transcription.audio_file.duration && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Clock size={14} />
                          {formatDuration(transcription.audio_file.duration)}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {new Date(transcription.audio_file.uploaded_at).toLocaleDateString('pt-BR')}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap">
                  <Chip
                    icon={<CheckCircle size={16} />}
                    label="Concluído"
                    color="success"
                    variant="outlined"
                  />
                  {transcription.confidence && (
                    <Chip
                      label={`${Math.round(transcription.confidence * 100)}% confiança`}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', overflow: 'hidden' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  minWidth: { xs: 'auto', sm: 120 },
                  px: { xs: 1.5, sm: 3 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                },
                '& .MuiTabs-scrollButtons': {
                  display: { xs: 'flex', sm: 'none' },
                },
                '& .MuiTabs-scrollableWrapper': {
                  overflowX: 'auto',
                  '&::-webkit-scrollbar': {
                    height: 4,
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 2,
                  },
                }
              }}
            >
              <Tab 
                icon={<FileText size={20} style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }} />} 
                iconPosition="start"
                label={<Box component="span" sx={{ whiteSpace: 'nowrap' }}>Transcrição</Box>}
              />
              <Tab 
                icon={<Smile size={20} style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }} />} 
                iconPosition="start"
                label={<Box component="span" sx={{ whiteSpace: 'nowrap' }}>Análise de Sentimento</Box>}
              />
              <Tab 
                icon={<Key size={20} style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }} />} 
                iconPosition="start"
                label={<Box component="span" sx={{ whiteSpace: 'nowrap' }}>Palavras Chave</Box>}
              />
              <Tab 
                icon={<FileCheck size={20} style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }} />} 
                iconPosition="start"
                label={<Box component="span" sx={{ whiteSpace: 'nowrap' }}>Resumo</Box>}
              />
              <Tab 
                icon={<Tag size={20} style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }} />} 
                iconPosition="start"
                label={<Box component="span" sx={{ whiteSpace: 'nowrap' }}>Tópicos</Box>}
              />
            </Tabs>
          </Box>

          <CardContent>
            <TabPanel value={activeTab} index={0}>
              <Paper sx={{ p: 3, bgcolor: 'grey.50', maxHeight: '600px', overflow: 'auto' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, textAlign: 'justify' }}>
                  {transcription.text}
                </Typography>
              </Paper>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {renderAnalysisContent('sentiment')}
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              {renderAnalysisContent('keywords')}
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
              {renderAnalysisContent('summary')}
            </TabPanel>

            <TabPanel value={activeTab} index={4}>
              {renderAnalysisContent('topics')}
            </TabPanel>
          </CardContent>
        </Card>
      </Container>

      {/* Dialog para formatar em template */}
      <Dialog 
        open={formatDialogOpen} 
        onClose={() => !isFormatting && setFormatDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Formatar em Template</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="template-select-label">Selecione um template</InputLabel>
              <Select
                labelId="template-select-label"
                id="template-select"
                value={selectedTemplateId}
                label="Selecione um template"
                onChange={(e) => setSelectedTemplateId(e.target.value as number | '')}
                disabled={templatesLoading || isFormatting}
              >
                {templatesLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Carregando templates...
                  </MenuItem>
                ) : templates.length === 0 ? (
                  <MenuItem disabled>Nenhum template disponível</MenuItem>
                ) : (
                  templates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name} {template.is_public && '(Público)'}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            {templates.length > 0 && selectedTemplateId && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {templates.find(t => t.id === selectedTemplateId)?.description || 'Sem descrição'}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setFormatDialogOpen(false);
              setSelectedTemplateId('');
            }}
            disabled={isFormatting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleFormatTemplate}
            variant="contained"
            disabled={!selectedTemplateId || isFormatting || templatesLoading}
            startIcon={isFormatting ? <CircularProgress size={16} /> : <FileEdit size={16} />}
          >
            {isFormatting ? 'Formatando...' : 'Formatar'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
    </>
  );
}
