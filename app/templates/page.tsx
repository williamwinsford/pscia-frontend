'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTemplates } from '@/hooks/useTemplates';
import { NoIndex } from '@/components/NoIndex';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  FileText,
  Plus,
  Trash2,
  Copy,
  Eye,
  Save,
  Search,
  MoreVertical
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

const categories = [
  { value: '', label: 'Todos' },
  { value: 'meetings', label: 'Reuniões' },
  { value: 'interviews', label: 'Entrevistas' },
  { value: 'support', label: 'Atendimento' },
  { value: 'legal', label: 'Jurídico' },
  { value: 'academic', label: 'Acadêmico' },
  { value: 'other', label: 'Outros' }
];

export default function TemplatesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const {
    templates,
    isLoading,
    loadTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    extractVariables,
    loadTemplate
  } = useTemplates();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuTemplate, setMenuTemplate] = useState<any>(null);

  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    category: 'meetings',
    content: '',
    is_public: false
  });

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login';
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) {
      loadTemplates({ category: selectedCategory || undefined, search: searchTerm || undefined });
    }
  }, [user, selectedCategory, searchTerm]);

  if (authLoading || isLoading) {
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
    return null;
  }

  const handleCreateTemplate = async () => {
    if (!templateForm.name || !templateForm.description || !templateForm.content) {
      return;
    }

    try {
      await createTemplate(templateForm);
      setIsCreateDialogOpen(false);
      setTemplateForm({ name: '', description: '', category: 'meetings', content: '', is_public: false });
      loadTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleUpdateTemplate = async (template: any) => {
    try {
      await updateTemplate(template.id, template);
      loadTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    try {
      await deleteTemplate(id);
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const handleDuplicateTemplate = async (id: number) => {
    try {
      await duplicateTemplate(id);
      loadTemplates();
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, template: any) => {
    setMenuAnchor(event.currentTarget);
    setMenuTemplate(template);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuTemplate(null);
  };

  const handleViewTemplate = async (template: any) => {
    try {
      // Carregar template completo do backend para garantir que temos todos os dados
      const fullTemplate = await loadTemplate(template.id);
      setSelectedTemplate(fullTemplate);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error('Error loading template:', error);
      // Em caso de erro, usar o template da lista mesmo
      setSelectedTemplate(template);
      setIsViewDialogOpen(true);
    }
  };

  const handleExtractVariables = (content: string) => {
    const variables = extractVariables(content);
    return variables;
  };

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
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
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Templates de Documentos
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Gerencie templates para formatar suas transcrições
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<Plus size={20} />}
              onClick={() => setIsCreateDialogOpen(true)}
              sx={{ fontWeight: 600 }}
            >
              Novo Template
            </Button>
          </Box>

          {/* Filters */}
          <Card sx={{ mb: 4, p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Buscar templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search size={20} style={{ marginRight: 8, color: '#9ca3af' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Categoria"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  select
                  SelectProps={{ native: true }}
                  InputLabelProps={{ shrink: true }}
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Card>

          {/* Templates Grid */}
          {filteredTemplates.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <FileText size={48} color="#9ca3af" />
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  Nenhum template encontrado
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  {searchTerm || selectedCategory
                    ? 'Tente ajustar os filtros de busca'
                    : 'Crie seu primeiro template para começar'}
                </Typography>
                {!searchTerm && !selectedCategory && (
                  <Button
                    variant="contained"
                    onClick={() => setIsCreateDialogOpen(true)}
                    startIcon={<Plus size={20} />}
                  >
                    Criar Template
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {filteredTemplates.map((template) => (
                <Grid item xs={12} sm={6} md={4} key={template.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {template.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                            {template.description}
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={(e) => handleOpenMenu(e, template)}>
                          <MoreVertical size={18} />
                        </IconButton>
                      </Box>
                      <Chip label={template.category_display} size="small" sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {(template.variables || []).slice(0, 3).map((variable: string, index: number) => (
                          <Chip key={index} label={variable} size="small" variant="outlined" />
                        ))}
                        {(template.variables || []).length > 3 && (
                          <Chip label={`+${(template.variables || []).length - 3}`} size="small" variant="outlined" />
                        )}
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {(template.variables || []).length} variáveis • {new Date(template.updated_at).toLocaleDateString('pt-BR')}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 1.5, pt: 0 }}>
                      <Button
                        size="small"
                        fullWidth
                        startIcon={<Eye size={18} />}
                        onClick={() => handleViewTemplate(template)}
                      >
                        Visualizar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
      </Box>

        {/* Create Template Dialog */}
        <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Criar Novo Template</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome do Template"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  placeholder="Ex: Relatório de Reunião"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Categoria"
                  value={templateForm.category}
                  onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                  select
                  SelectProps={{ native: true }}
                  required
                >
                  {categories.slice(1).map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  label="Conteúdo do Template"
                  value={templateForm.content}
                  onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                  placeholder="Use {{variavel}} para criar variáveis"
                  required
                />
                {templateForm.content && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Variáveis detectadas:{' '}
                      {handleExtractVariables(templateForm.content).map((v) => (
                        <Chip key={v} label={v} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleCreateTemplate} startIcon={<Save size={18} />}>
              Criar Template
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Template Dialog */}
        <Dialog open={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)} maxWidth="md" fullWidth>
          {selectedTemplate && (
            <>
              <DialogTitle>{selectedTemplate.name}</DialogTitle>
              <DialogContent>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  {selectedTemplate.description}
                </Typography>
                <Chip label={selectedTemplate.category_display} sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Variáveis:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(selectedTemplate.variables || []).map((variable: string) => (
                      <Chip key={variable} label={variable} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={12}
                  value={selectedTemplate.content}
                  InputProps={{ readOnly: true }}
                  sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedTemplate.content);
                  }}
                >
                  Copiar Conteúdo
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Menu */}
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu}>
          <MenuItem onClick={() => { handleViewTemplate(menuTemplate); handleCloseMenu(); }}>
            <Eye size={18} style={{ marginRight: 8 }} />
            Visualizar
          </MenuItem>
          <MenuItem onClick={() => { handleDuplicateTemplate(menuTemplate.id); handleCloseMenu(); }}>
            <Copy size={18} style={{ marginRight: 8 }} />
            Duplicar
          </MenuItem>
          <MenuItem onClick={() => { handleDeleteTemplate(menuTemplate.id); handleCloseMenu(); }} sx={{ color: 'error.main' }}>
            <Trash2 size={18} style={{ marginRight: 8 }} />
            Excluir
          </MenuItem>
      </Menu>
    </DashboardLayout>
    </>
  );
}
