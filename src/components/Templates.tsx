'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import { ArrowLeft, Plus, FileText, Edit, Trash2, Copy, Eye, Save, X } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

interface TemplatesProps {
  onBack: () => void;
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Relatório de Reunião',
    description: 'Template para documentar reuniões com participantes, decisões e próximos passos',
    category: 'Reuniões',
    content: `# RELATÓRIO DE REUNIÃO

**Data:** {{data}}
**Participantes:** {{participantes}}
**Duração:** {{duracao}}

## RESUMO EXECUTIVO
{{resumo}}

## PONTOS DISCUTIDOS
{{pontos_discutidos}}

## DECISÕES TOMADAS
{{decisoes}}

## PRÓXIMOS PASSOS
{{proximos_passos}}

## OBSERVAÇÕES
{{observacoes}}`,
    variables: ['data', 'participantes', 'duracao', 'resumo', 'pontos_discutidos', 'decisoes', 'proximos_passos', 'observacoes'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Ata de Entrevista',
    description: 'Template para documentar entrevistas com candidatos ou clientes',
    category: 'Recursos Humanos',
    content: `# ATA DE ENTREVISTA

**Candidato:** {{candidato}}
**Cargo:** {{cargo}}
**Data:** {{data}}
**Entrevistador:** {{entrevistador}}

## INFORMAÇÕES PESSOAIS
{{informacoes_pessoais}}

## EXPERIÊNCIA PROFISSIONAL
{{experiencia_profissional}}

## COMPETÊNCIAS TÉCNICAS
{{competencias_tecnicas}}

## COMPETÊNCIAS COMPORTAMENTAIS
{{competencias_comportamentais}}

## PERGUNTAS E RESPOSTAS
{{perguntas_respostas}}

## AVALIAÇÃO GERAL
{{avaliacao_geral}}

## RECOMENDAÇÃO
{{recomendacao}}`,
    variables: ['candidato', 'cargo', 'data', 'entrevistador', 'informacoes_pessoais', 'experiencia_profissional', 'competencias_tecnicas', 'competencias_comportamentais', 'perguntas_respostas', 'avaliacao_geral', 'recomendacao'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  }
];

const categories = ['Todos', 'Reuniões', 'Recursos Humanos', 'Atendimento', 'Jurídico', 'Acadêmico', 'Outros'];

export const Templates = ({ onBack }: TemplatesProps) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: '',
    description: '',
    category: '',
    content: '',
    variables: []
  });

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'Todos' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.description || !newTemplate.category || !newTemplate.content) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    // Mock create - in real app would save to backend
    alert(`Template "${newTemplate.name}" foi criado com sucesso.`);

    setNewTemplate({
      name: '',
      description: '',
      category: '',
      content: '',
      variables: []
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditDialogOpen(true);
  };

  const handleViewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsViewDialogOpen(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    // Mock delete - in real app would delete from backend
    alert('Template foi excluído com sucesso.');
  };

  const handleCopyTemplate = (template: Template) => {
    navigator.clipboard.writeText(template.content);
    alert('Conteúdo do template foi copiado para a área de transferência.');
  };

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{([^}]+)\}\}/g);
    return matches ? matches.map(match => match.replace(/\{\{|\}\}/g, '')) : [];
  };

  const handleContentChange = (content: string) => {
    const variables = extractVariables(content);
    setNewTemplate(prev => ({ ...prev, content, variables }));
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onBack}>
            <ArrowLeft size={20} />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Templates de Documentos
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Gerencie templates para formatar suas transcrições
            </Typography>
          </Box>
        </Box>
        
        <Button
          variant="contained"
          onClick={() => setIsCreateDialogOpen(true)}
          startIcon={<Plus size={20} />}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: 'white',
            fontWeight: 600
          }}
        >
          Novo Template
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => setSelectedCategory(category)}
                    color={selectedCategory === category ? 'primary' : 'default'}
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <Grid container spacing={2}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card sx={{ 
              height: '100%', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s',
              '&:hover': { boxShadow: '0 6px 30px rgba(0, 0, 0, 0.12)' }
            }}>
              <CardHeader
                title={template.name}
                subheader={
                  <Box>
                    <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                      {template.description}
                    </Typography>
                    <Badge badgeContent={template.category} color="primary" />
                  </Box>
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {template.variables.slice(0, 3).map((variable, index) => (
                    <Chip key={index} label={variable} size="small" variant="outlined" />
                  ))}
                  {template.variables.length > 3 && (
                    <Chip label={`+${template.variables.length - 3}`} size="small" variant="outlined" />
                  )}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {template.variables.length} variáveis
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {new Date(template.updatedAt).toLocaleDateString('pt-BR')}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => handleViewTemplate(template)}
                    startIcon={<Eye size={16} />}
                  >
                    Ver
                  </Button>
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditTemplate(template)}
                  >
                    <Edit size={16} />
                  </IconButton>
                  <IconButton 
                    size="small"
                    onClick={() => handleCopyTemplate(template)}
                  >
                    <Copy size={16} />
                  </IconButton>
                  <IconButton 
                    size="small"
                    onClick={() => handleDeleteTemplate(template.id)}
                    color="error"
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTemplates.length === 0 && (
        <Card sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <FileText size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Nenhum template encontrado
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {searchTerm || selectedCategory !== 'Todos' 
                ? 'Tente ajustar os filtros de busca'
                : 'Crie seu primeiro template para começar'
              }
            </Typography>
            <Button
              variant="contained"
              onClick={() => setIsCreateDialogOpen(true)}
              startIcon={<Plus size={20} />}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: 600
              }}
            >
              Criar Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog 
        open={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Criar Novo Template</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nome do Template"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Relatório de Reunião"
            />
            <TextField
              label="Categoria"
              value={newTemplate.category}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Ex: Reuniões"
            />
            <TextField
              label="Descrição"
              value={newTemplate.description}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o propósito deste template"
            />
            <TextField
              label="Conteúdo do Template"
              value={newTemplate.content}
              onChange={(e) => handleContentChange(e.target.value)}
              multiline
              rows={10}
              placeholder="Digite o conteúdo do template. Use {{variavel}} para variáveis."
            />
            {newTemplate.variables && newTemplate.variables.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                  Variáveis Detectadas:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {newTemplate.variables.map((variable, index) => (
                    <Chip key={index} label={variable} size="small" />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleCreateTemplate} 
            variant="contained"
            startIcon={<Save size={16} />}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
            }}
          >
            Criar Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog 
        open={isViewDialogOpen} 
        onClose={() => setIsViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedTemplate?.name}</DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2">{selectedTemplate.description}</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={selectedTemplate.category} size="small" />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {selectedTemplate.variables.length} variáveis
                </Typography>
              </Box>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  {selectedTemplate.content}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

