'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import { Upload, History, User, LogOut, FileText, Mic } from 'lucide-react';
import { UploadArea } from './UploadArea';
import { TranscriptionResults } from './TranscriptionResults';
import { TranscriptionHistory } from './TranscriptionHistory';
import { Profile } from './Profile';
import { Templates } from './Templates';
import { audioService, AudioFile } from '@/services/audio';
import { useAudio } from '@/hooks/useAudio';

interface DashboardProps {
  onLogout: () => void;
}

export interface TranscriptionData {
  id: string;
  fileName: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'error';
  transcription?: string;
  summary?: string;
  highlights?: string[];
  duration?: string;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [currentView, setCurrentView] = useState<'upload' | 'results' | 'history' | 'profile' | 'templates'>('upload');
  const [selectedTranscription, setSelectedTranscription] = useState<TranscriptionData | null>(null);
  const { audioFiles, loadAudioFiles, isLoading } = useAudio();

  useEffect(() => {
    loadAudioFiles();
  }, [loadAudioFiles]);

  const handleFileUploaded = (file: AudioFile) => {
    // File uploaded successfully, reload files list
    loadAudioFiles();
    
    // Show the uploaded file in results
    const newTranscription: TranscriptionData = {
      id: file.id.toString(),
      fileName: file.file_name,
      uploadDate: file.uploaded_at,
      status: file.status as 'processing' | 'completed' | 'error',
      duration: file.duration ? audioService.formatDuration(file.duration) : '0:00'
    };
    
    setSelectedTranscription(newTranscription);
    
    // If already completed, show results immediately
    if (file.status === 'completed') {
      setCurrentView('results');
    } else {
      // Show processing state
      setCurrentView('results');
    }
  };

  const handleViewTranscription = (transcription: TranscriptionData) => {
    setSelectedTranscription(transcription);
    setCurrentView('results');
  };

  // Convert AudioFile[] to TranscriptionData[]
  const transcriptionsData: TranscriptionData[] = audioFiles.map(file => ({
    id: file.id.toString(),
    fileName: file.file_name,
    uploadDate: file.uploaded_at,
    status: file.status as 'processing' | 'completed' | 'error',
    duration: file.duration ? audioService.formatDuration(file.duration) : undefined
  }));

  return (
    <>
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">
          {currentView === 'upload' && (
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Transforme áudio em texto inteligente
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Faça upload do seu arquivo e receba transcrição, resumo e destaques automaticamente
                </Typography>
              </Box>
              <UploadArea onFileUploaded={handleFileUploaded} />
            </Box>
          )}

          {currentView === 'results' && selectedTranscription && (
            <TranscriptionResults 
              transcription={selectedTranscription}
              onBack={() => setCurrentView('upload')}
            />
          )}

          {currentView === 'history' && (
            isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <CircularProgress />
              </Box>
            ) : (
              <TranscriptionHistory 
                transcriptions={transcriptionsData}
                onViewTranscription={handleViewTranscription}
              />
            )
          )}

          {currentView === 'profile' && (
            <Profile onBack={() => setCurrentView('upload')} />
          )}

          {currentView === 'templates' && (
            <Templates onBack={() => setCurrentView('upload')} />
          )}
        </Container>
      </Box>
    </>
  );
};
