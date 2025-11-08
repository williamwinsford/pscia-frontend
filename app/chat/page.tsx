'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAudio } from '@/hooks/useAudio';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/DashboardLayout';
import { NoIndex } from '@/components/NoIndex';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  MessageCircle, 
  FileAudio, 
  Bot, 
  User,
  ArrowLeft,
  Plus,
  Copy,
  Check
} from 'lucide-react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

function ChatPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { 
    startConversation, 
    loadConversations, 
    getConversation,
    updateConversation,
    deleteConversation,
    conversations,
    isLoading, 
    error, 
    clearError,
    audioFiles,
    loadAudioFiles
  } = useAudio();
  
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isNewConversationReady, setIsNewConversationReady] = useState(false);
  const [selectedAudioFileId, setSelectedAudioFileId] = useState<number | null>(null);
  const [showTranscriptionDialog, setShowTranscriptionDialog] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [hasAutoCreatedConversation, setHasAutoCreatedConversation] = useState(false);
  const [isCreatingAutoConversation, setIsCreatingAutoConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const autoCreateAttemptedRef = useRef<string | null>(null);
  
  const audioFileId = searchParams.get('audio');

  useEffect(() => {
    if (user) {
      loadConversations();
      loadAudioFiles();
    }
  }, [user]);

  useEffect(() => {
    if (audioFileId) {
      setSelectedAudioFileId(parseInt(audioFileId));
      setIsNewConversationReady(true);
    }
  }, [audioFileId]);

  // Criar conversa automaticamente quando há audioFileId na URL
  useEffect(() => {
    const createAutoConversation = async () => {
      // Verificar condições: há audioFileId, não há conversa atual, ainda não foi criada, usuário está logado
      // Usar ref para garantir que só tenta criar uma vez por audioFileId
      if (
        audioFileId && 
        !currentConversation && 
        !hasAutoCreatedConversation && 
        !isCreatingAutoConversation &&
        user &&
        !isLoading &&
        autoCreateAttemptedRef.current !== audioFileId
      ) {
        // Marcar que já tentou criar para este audioFileId
        autoCreateAttemptedRef.current = audioFileId;
        setIsCreatingAutoConversation(true);
        
        try {
          const welcomeMessage = "Olá! Gostaria de fazer perguntas sobre esta transcrição.";
          const conversation = await startConversation(
            welcomeMessage,
            undefined,
            parseInt(audioFileId)
          );
          
          setCurrentConversation(conversation);
          setHasAutoCreatedConversation(true);
          setIsNewConversationReady(false);
          
          // Recarregar conversas para garantir sincronização e evitar duplicatas
          await loadConversations();
          
          // Limpar parâmetro da URL para evitar recriação
          router.replace('/chat');
        } catch (error) {
          console.error('Error creating auto conversation:', error);
          // Resetar ref em caso de erro para permitir nova tentativa
          autoCreateAttemptedRef.current = null;
          // Manter o audioFileId selecionado para tentativa manual
          // O erro já é tratado pelo hook useAudio
        } finally {
          setIsCreatingAutoConversation(false);
        }
      }
    };

    createAutoConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioFileId, currentConversation, hasAutoCreatedConversation, isCreatingAutoConversation, user, isLoading]);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation, pendingUserMessage, isAiTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    const userMessageText = message.trim();
    
    // Limpar input imediatamente
    setMessage('');
    
    // Mostrar mensagem do usuário imediatamente
    setPendingUserMessage(userMessageText);
    setIsAiTyping(true);
    setIsSending(true);
    clearError();
    
    try {
      const conversation = await startConversation(
        userMessageText,
        currentConversation?.id,
        selectedAudioFileId || undefined
      );
      
      // Atualizar conversa e remover estados temporários
      setCurrentConversation(conversation);
      setPendingUserMessage(null);
      setIsAiTyping(false);
      setIsNewConversationReady(false);
    } catch (error: any) {
      console.error('Error sending message:', error);
      // Limpar estados temporários em caso de erro
      setPendingUserMessage(null);
      setIsAiTyping(false);
      // O erro já é tratado pelo hook useAudio e exibido no componente
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const selectConversation = async (conversationId: number) => {
    try {
      const conversation = await getConversation(conversationId);
      setCurrentConversation(conversation);
      setIsNewConversationReady(false);
      setHasAutoCreatedConversation(false);
      setSelectedAudioFileId(null);
      autoCreateAttemptedRef.current = null;
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const startNewConversation = () => {
    setShowTranscriptionDialog(true);
  };

  const handleSelectTranscription = (audioFileId: number) => {
    setSelectedAudioFileId(audioFileId);
    setShowTranscriptionDialog(false);
    setCurrentConversation(null);
    setMessage('');
    setIsNewConversationReady(true);
    setHasAutoCreatedConversation(false);
    autoCreateAttemptedRef.current = null;
  };

  const handleCancelNewConversation = () => {
    setShowTranscriptionDialog(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, conversationId: number) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedConversationId(conversationId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedConversationId(null);
  };

  const handleRenameClick = () => {
    const conversation = conversations.find(c => c.id === selectedConversationId);
    if (conversation) {
      setRenameValue(conversation.title);
      setShowRenameDialog(true);
      setMenuAnchorEl(null); // Fecha o menu mas mantém o selectedConversationId
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedConversationId) return;
    
    try {
      // Fechar menu imediatamente
      handleMenuClose();
      
      // Se a conversa deletada estiver aberta, fechar ela
      if (currentConversation?.id === selectedConversationId) {
        setCurrentConversation(null);
        setIsNewConversationReady(false);
        setSelectedAudioFileId(null);
        setMessage('');
      }
      
      // Deletar conversa (o hook já remove da lista)
      await deleteConversation(selectedConversationId);
      
      // Recarregar lista de conversas para garantir sincronização
      await loadConversations();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      // Em caso de erro, recarregar conversas para garantir estado correto
      await loadConversations();
    }
  };

  const handleRenameSubmit = async () => {
    if (selectedConversationId && renameValue.trim()) {
      try {
        await updateConversation(selectedConversationId, renameValue.trim());
        if (currentConversation?.id === selectedConversationId) {
          const updated = await getConversation(selectedConversationId);
          setCurrentConversation(updated);
        }
        setShowRenameDialog(false);
        setRenameValue('');
        setSelectedConversationId(null);
      } catch (error) {
        console.error('Error renaming conversation:', error);
      }
    }
  };

  const handleRenameCancel = () => {
    setShowRenameDialog(false);
    setRenameValue('');
    setSelectedConversationId(null);
  };

  if (authLoading) {
    return (
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
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <>
      <NoIndex />
      <DashboardLayout>
      <Box 
        sx={{ 
          width: '100%',
          px: { xs: 1, md: 0 },
        }}
      >
        <Box 
          sx={{ 
            maxWidth: { xs: '100%', md: '1400px' },
            width: '100%',
            height: { xs: 'calc(100vh - 100px)', md: 'calc(100vh - 64px)' },
            maxHeight: { xs: 'calc(100vh - 100px)', md: 'calc(100vh - 64px)' },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            mx: 'auto',
            mb: { xs: 2, md: 4 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
        {/* Sidebar */}
        <Paper
          elevation={0}
          sx={{
            width: { xs: '100%', sm: '280px', md: 320 },
            maxWidth: { xs: '100%', sm: '280px', md: 320 },
            display: { xs: currentConversation || isNewConversationReady ? 'none' : 'flex', md: 'flex' },
            flexDirection: 'column',
            borderRight: { xs: 0, md: 1 },
            borderBottom: { xs: 1, md: 0 },
            borderColor: 'divider',
            borderTopRightRadius: 0,
            borderBottomRightRadius: { xs: 0, md: 0 },
            borderBottomLeftRadius: { xs: 0, md: 0 },
            height: { xs: 'auto', md: '100%' },
            maxHeight: { xs: '40vh', md: 'none' },
            mx: { xs: 'auto', md: 0 }
          }}
        >
          <Box sx={{ p: { xs: 1.5, md: 3 }, pt: { xs: 1.5, md: 4 }, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8, gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', md: '1.25rem' } }}>
                Conversas
              </Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Plus size={16} />}
                onClick={startNewConversation}
                sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' }, px: { xs: 1, md: 2 } }}
              >
                Nova
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 0.5, md: 1 } }}>
            {conversations.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'action.disabledBackground' }}>
                  <MessageCircle size={32} />
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  Nenhuma conversa ainda
                </Typography>
              </Box>
            ) : (
              <List>
                {conversations.map((conversation) => (
                  <ListItem 
                    key={conversation.id} 
                    disablePadding
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => handleMenuOpen(e, conversation.id)}
                        sx={{ mr: 0.5 }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      selected={currentConversation?.id === conversation.id}
                      onClick={() => selectConversation(conversation.id)}
                      sx={{
                        borderRadius: 1,
                        '&.Mui-selected': {
                          bgcolor: (theme) => alpha(theme.palette.primary.light, 0.3),
                          '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.primary.light, 0.3)
                          }
                        }
                      }}
                    >
                      <ListItemText
                        primary={conversation.title}
                        primaryTypographyProps={{
                          sx: { fontSize: { xs: '0.875rem', md: '1rem' } }
                        }}
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                              {conversation.message_count} mensagem(s)
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                              {new Date(conversation.updated_at).toLocaleDateString('pt-BR')} {new Date(conversation.updated_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Paper>

        {/* Main Chat */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          minWidth: 0, 
          maxWidth: { xs: '100%', sm: 'calc(100% - 280px)', md: 'none' }, 
          mx: { xs: 'auto', md: 0 },
          height: { xs: '100%', md: '100%' },
          minHeight: { xs: 0, md: 0 },
          maxHeight: { xs: '100%', md: '100%' },
          overflow: 'hidden'
        }}>
          {/* Header */}
          <Paper elevation={0} sx={{ p: { xs: 1.5, md: 3 }, borderBottom: 1, borderColor: 'divider', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, flexShrink: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, flex: 1, minWidth: 0 }}>
                {(currentConversation || isNewConversationReady) && (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ArrowLeft size={16} />}
                      onClick={() => {
                        setCurrentConversation(null);
                        setIsNewConversationReady(false);
                        setSelectedAudioFileId(null);
                        setMessage('');
                        setHasAutoCreatedConversation(false);
                        autoCreateAttemptedRef.current = null;
                      }}
                      sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, minWidth: { xs: 'auto', md: '64px' } }}
                    >
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Voltar</Box>
                    </Button>
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                  </>
                )}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', md: '1.25rem' }, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentConversation ? currentConversation.title : (isNewConversationReady ? 'Nova Conversa' : 'Chat com IA')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentConversation 
                      ? `${currentConversation.message_count} mensagem(s)`
                      : isNewConversationReady 
                        ? 'Comece uma nova conversa com a IA'
                        : 'Clique em "Nova" para começar uma conversa'
                    }
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Messages */}
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto',
            overflowX: 'hidden',
            p: { xs: 1.5, md: 3 },
            minHeight: 0,
            height: 0,
            WebkitOverflowScrolling: 'touch',
            '-webkit-overflow-scrolling': 'touch',
            position: 'relative',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '3px',
            },
          }}>
            <Stack spacing={{ xs: 1.5, md: 2 }}>
              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}

              {isCreatingAutoConversation && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                    Criando conversa...
                  </Typography>
                </Box>
              )}

              {!currentConversation && !isNewConversationReady && !isCreatingAutoConversation ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ mx: 'auto', mb: 2, width: 80, height: 80, bgcolor: 'action.disabledBackground' }}>
                      <Bot size={40} />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Bem-vindo ao Chat com IA
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                      Faça perguntas sobre seus áudios ou converse sobre qualquer tópico
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Clique em "Nova" para começar uma conversa
                    </Typography>
                  </Box>
                </Box>
              ) : currentConversation || pendingUserMessage ? (
                <>
                  {/* Mensagens da conversa */}
                  {currentConversation?.messages.map((msg: any) => (
                    <Box
                      key={msg.id}
                      sx={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          maxWidth: { xs: '90%', sm: '85%', md: '60%' },
                          px: { xs: 1.25, md: 2 },
                          py: { xs: 1, md: 1.5 },
                          borderRadius: 1,
                          ...(msg.role === 'user' && { borderBottomRightRadius: 0 }),
                          ...(msg.role === 'assistant' && { borderBottomLeftRadius: 0 }),
                          bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                          border: msg.role === 'assistant' ? 1 : 0,
                          borderColor: 'divider',
                          position: 'relative',
                          '&:hover .copy-button': {
                            opacity: 1
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                          {msg.role === 'assistant' && (
                            <Avatar sx={{ width: 20, height: 20, bgcolor: 'action.disabledBackground' }}>
                              <Bot size={12} />
                            </Avatar>
                          )}
                          {msg.role === 'user' && (
                            <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.light' }}>
                              <User size={12} />
                            </Avatar>
                          )}
                          <Box sx={{ flex: 1 }}>
                            {msg.role === 'assistant' ? (
                              <Box
                                sx={{
                                  color: 'text.primary',
                                  fontSize: '0.875rem',
                                  lineHeight: 1.6,
                                  '& p': {
                                    margin: 0,
                                    marginBottom: 1,
                                    '&:last-child': {
                                      marginBottom: 0
                                    }
                                  },
                                  '& ul, & ol': {
                                    margin: 0,
                                    paddingLeft: 2,
                                    marginBottom: 1
                                  },
                                  '& li': {
                                    marginBottom: 0.5
                                  },
                                  '& code': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                    padding: '2px 4px',
                                    borderRadius: '4px',
                                    fontSize: '0.875em',
                                    fontFamily: 'monospace'
                                  },
                                  '& pre': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                    padding: 1,
                                    borderRadius: '4px',
                                    overflow: 'auto',
                                    marginBottom: 1,
                                    '& code': {
                                      backgroundColor: 'transparent',
                                      padding: 0
                                    }
                                  },
                                  '& strong': {
                                    fontWeight: 600
                                  },
                                  '& em': {
                                    fontStyle: 'italic'
                                  },
                                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                                    marginTop: 1,
                                    marginBottom: 0.5,
                                    fontWeight: 600
                                  },
                                  '& blockquote': {
                                    borderLeft: '3px solid',
                                    borderColor: 'divider',
                                    paddingLeft: 1,
                                    marginLeft: 0,
                                    marginBottom: 1,
                                    fontStyle: 'italic'
                                  }
                                }}
                              >
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                              </Box>
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'white',
                                  whiteSpace: 'pre-wrap'
                                }}
                              >
                                {msg.content}
                              </Typography>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: msg.role === 'assistant' ? 'flex-start' : 'space-between', alignItems: 'center', mt: 1, gap: 1 }}>
                              {msg.role === 'assistant' && (
                                <IconButton
                                  size="small"
                                  className="copy-button"
                                  onClick={() => handleCopyMessage(msg.content, `msg-${msg.id}`)}
                                  sx={{
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                    p: 0.5,
                                    minWidth: 'auto',
                                    width: 24,
                                    height: 24,
                                    color: 'text.secondary',
                                    ml: -3.5,
                                    '&:hover': {
                                      bgcolor: 'action.hover',
                                      color: 'text.primary'
                                    }
                                  }}
                                >
                                  {copiedMessageId === `msg-${msg.id}` ? (
                                    <Check size={14} />
                                  ) : (
                                    <Copy size={14} />
                                  )}
                                </IconButton>
                              )}
                              <Typography
                                variant="caption"
                                sx={{
                                  color: msg.role === 'user' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                                  display: 'block',
                                  textAlign: msg.role === 'assistant' ? 'left' : 'right',
                                  ...(msg.role === 'assistant' && { ml: msg.role === 'assistant' ? 0.5 : -3.5 })
                                }}
                              >
                                {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                              {msg.role === 'user' && (
                                <IconButton
                                  size="small"
                                  className="copy-button"
                                  onClick={() => handleCopyMessage(msg.content, `msg-${msg.id}`)}
                                  sx={{
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                    p: 0.5,
                                    minWidth: 'auto',
                                    width: 24,
                                    height: 24,
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&:hover': {
                                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                                      color: 'white'
                                    }
                                  }}
                                >
                                  {copiedMessageId === `msg-${msg.id}` ? (
                                    <Check size={14} />
                                  ) : (
                                    <Copy size={14} />
                                  )}
                                </IconButton>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                  ))}
                  
                  {/* Mensagem do usuário pendente */}
                  {pendingUserMessage && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end'
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          maxWidth: { xs: '90%', sm: '85%', md: '60%' },
                          px: { xs: 1.25, md: 2 },
                          py: { xs: 1, md: 1.5 },
                          borderRadius: 1,
                          borderBottomRightRadius: 0,
                          bgcolor: 'primary.main',
                          position: 'relative',
                          '&:hover .copy-button': {
                            opacity: 1
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                          <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.light' }}>
                            <User size={12} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'white',
                                whiteSpace: 'pre-wrap'
                              }}
                            >
                              {pendingUserMessage}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  display: 'block'
                                }}
                              >
                                {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                              <IconButton
                                size="small"
                                className="copy-button"
                                onClick={() => handleCopyMessage(pendingUserMessage, 'pending-msg')}
                                sx={{
                                  opacity: 0,
                                  transition: 'opacity 0.2s',
                                  p: 0.5,
                                  minWidth: 'auto',
                                  width: 24,
                                  height: 24,
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white'
                                  }
                                }}
                              >
                                {copiedMessageId === 'pending-msg' ? (
                                  <Check size={14} />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                  )}
                  
                  {/* Indicador de "IA está digitando" */}
                  {isAiTyping && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-start'
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          maxWidth: { xs: '90%', sm: '85%', md: '60%' },
                          px: { xs: 1.25, md: 2 },
                          py: { xs: 1, md: 1.5 },
                          borderRadius: 1,
                          borderBottomLeftRadius: 0,
                          bgcolor: 'background.paper',
                          border: 1,
                          borderColor: 'divider'
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                          <Avatar sx={{ width: 20, height: 20, bgcolor: 'action.disabledBackground' }}>
                            <Bot size={12} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'text.secondary',
                                fontStyle: 'italic'
                              }}
                            >
                              Up IA está digitando...
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                  )}
                </>
              ) : null}
            </Stack>
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          {(currentConversation || isNewConversationReady) && (
            <Paper elevation={0} sx={{ p: { xs: 1, md: 2 }, borderTop: 1, borderColor: 'divider', borderBottomLeftRadius: 0, flexShrink: 0 }}>
              <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 }, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={isSending || isAiTyping}
                multiline
                maxRows={4}
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    px: { xs: 1, md: 1.5 }
                  }
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!message.trim() || isSending || isAiTyping}
                sx={{ alignSelf: 'flex-end', flexShrink: 0 }}
                size="small"
              >
                {isSending ? (
                  <CircularProgress size={20} />
                ) : (
                  <Send size={20} />
                )}
                </IconButton>
              </Box>
            </Paper>
          )}
        </Box>
        </Box>
      </Box>

      {/* Transcription Selection Dialog */}
      <Dialog 
        open={showTranscriptionDialog} 
        onClose={handleCancelNewConversation}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Selecione uma Transcrição</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Selecione uma transcrição para usar como contexto da conversa com a IA
          </Typography>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : audioFiles.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Nenhuma transcrição disponível
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => {
                  router.push('/upload');
                  handleCancelNewConversation();
                }}
              >
                Fazer Upload de Áudio
              </Button>
            </Box>
          ) : (
            <List>
              {audioFiles
                .filter(file => file.status === 'completed')
                .map((file) => (
                  <ListItem key={file.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleSelectTranscription(file.id)}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <FileAudio size={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary={file.file_name}
                        secondary={`${new Date(file.uploaded_at).toLocaleDateString('pt-BR')}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelNewConversation}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Conversation Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleRenameClick}>Renomear</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Deletar</MenuItem>
      </Menu>

      {/* Rename Dialog */}
      <Dialog 
        open={showRenameDialog} 
        onClose={handleRenameCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Renomear Conversa</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da conversa"
            fullWidth
            variant="outlined"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleRenameSubmit();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameCancel}>Cancelar</Button>
          <Button onClick={handleRenameSubmit} variant="contained" disabled={!renameValue.trim()}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
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
    }>
      <ChatPageContent />
    </Suspense>
  );
}
