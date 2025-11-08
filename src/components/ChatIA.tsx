'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  Paper,
  CircularProgress
} from '@mui/material';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import type { TranscriptionData } from './Dashboard';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatIAProps {
  transcription: TranscriptionData;
}

export const ChatIA = ({ transcription }: ChatIAProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Olá! Sou sua assistente de IA e posso ajudá-lo a analisar a transcrição do arquivo "${transcription.fileName}". Posso responder perguntas sobre o conteúdo, criar resumos específicos, identificar temas principais, ou qualquer outra análise que você precise. O que gostaria de saber?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('resumo') || message.includes('summarize')) {
      return `Com base na transcrição, aqui está um resumo mais detalhado:\n\n${transcription.summary}\n\nPosso criar resumos mais específicos se você me disser sobre qual aspecto gostaria de focar.`;
    }
    
    if (message.includes('principais pontos') || message.includes('destaques')) {
      return `Os principais pontos identificados na transcrição são:\n\n${transcription.highlights?.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\nGostaria que eu analise algum ponto específico com mais profundidade?`;
    }
    
    if (message.includes('duração') || message.includes('tempo')) {
      return `A transcrição tem duração de ${transcription.duration} e foi processada em ${transcription.uploadDate}. O arquivo "${transcription.fileName}" foi analisado com sucesso pela nossa IA.`;
    }
    
    return `Interessante pergunta! Com base na transcrição do arquivo "${transcription.fileName}", posso ajudá-lo de várias formas:\n\n• Analisar aspectos específicos do conteúdo\n• Criar resumos personalizados\n• Identificar padrões ou temas\n• Explicar como nossa IA processou o áudio\n• Sugerir próximos passos ou aplicações\n\nPode reformular sua pergunta ou me dizer especificamente o que gostaria de explorar?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card sx={{ height: 600, display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <Bot size={20} />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Chat com IA
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Faça perguntas sobre a transcrição
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Box sx={{ 
              display: 'inline-flex', 
              px: 1.5, 
              py: 0.5, 
              borderRadius: 2, 
              bgcolor: 'success.light', 
              color: 'success.dark',
              fontSize: '0.75rem'
            }}>
              Online
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              gap: 2,
              mb: 2,
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {message.sender === 'ai' && (
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <Bot size={20} />
              </Avatar>
            )}
            
            <Paper
              sx={{
                p: 2,
                maxWidth: '80%',
                bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                color: message.sender === 'user' ? 'white' : 'text.primary'
              }}
            >
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 0.5 }}>
                {message.content}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {message.timestamp.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Typography>
            </Paper>

            {message.sender === 'user' && (
              <Avatar sx={{ bgcolor: 'grey.400' }}>
                <User size={20} />
              </Avatar>
            )}
          </Box>
        ))}

        {isLoading && (
          <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'flex-start' }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Bot size={20} />
            </Avatar>
            <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  IA está pensando...
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta sobre a transcrição..."
            disabled={isLoading}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            color="primary"
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              '&.Mui-disabled': { bgcolor: 'grey.300' }
            }}
          >
            <Send size={20} />
          </IconButton>
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
          💡 Dica: Pergunte sobre resumos, temas principais, qualidade da transcrição ou aplicações
        </Typography>
      </Box>
    </Card>
  );
};

