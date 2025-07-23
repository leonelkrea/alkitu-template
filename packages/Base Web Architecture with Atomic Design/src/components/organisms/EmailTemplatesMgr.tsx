import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Card from '../molecules/Card';
import FormField from '../molecules/FormField';
import IconButton from '../molecules/IconButton';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  isActive: boolean;
  lastModified: string;
}

export interface EmailTemplatesMgrProps {
  templates: EmailTemplate[];
  onCreateTemplate?: () => void;
  onEditTemplate?: (templateId: string) => void;
  onDeleteTemplate?: (templateId: string) => void;
  onToggleActive?: (templateId: string, isActive: boolean) => void;
  className?: string;
}

const EmailTemplatesMgr: React.FC<EmailTemplatesMgrProps> = ({
  templates,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onToggleActive,
  className = '',
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ subject: '', body: '' });

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditStart = (template: EmailTemplate) => {
    setEditingTemplate(template.id);
    setEditForm({
      subject: template.subject,
      body: template.body
    });
  };

  const handleEditSave = () => {
    // Here you would typically call an API to save the changes
    console.log('Saving template:', editingTemplate, editForm);
    setEditingTemplate(null);
  };

  const handleEditCancel = () => {
    setEditingTemplate(null);
    setEditForm({ subject: '', body: '' });
  };

  return (
    <div className={`space-y-6 ${className}`} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography variant="h2" weight="medium">
          Plantillas de Email
        </Typography>
        <IconButton
          icon="Plus"
          variant="primary"
          onClick={onCreateTemplate}
        >
          Nueva Plantilla
        </IconButton>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <FormField
            label=""
            inputProps={{
              placeholder: "Buscar plantillas...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value)
            }}
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-input-background"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'Todas las categorías' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            variant="vertical"
            title=""
            className="hover:shadow-md transition-shadow"
          >
            <div className="p-6 space-y-4">
              {/* Template Header */}
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h4" weight="medium">
                    {template.name}
                  </Typography>
                  <Typography variant="p" size="xs" color="muted">
                    {template.category} • {new Date(template.lastModified).toLocaleDateString('es-ES')}
                  </Typography>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={template.isActive}
                      onChange={(e) => onToggleActive?.(template.id, e.target.checked)}
                      className="rounded border-border"
                    />
                    <Typography variant="p" size="xs">Activa</Typography>
                  </label>
                  
                  <IconButton
                    icon="Edit"
                    iconOnly
                    size="sm"
                    variant="ghost"
                    tooltip="Editar"
                    onClick={() => handleEditStart(template)}
                  />
                  
                  <IconButton
                    icon="Trash2"
                    iconOnly
                    size="sm"
                    variant="ghost"
                    tooltip="Eliminar"
                    onClick={() => onDeleteTemplate?.(template.id)}
                  />
                </div>
              </div>

              {/* Template Content */}
              {editingTemplate === template.id ? (
                <div className="space-y-4">
                  <FormField
                    label="Asunto"
                    inputProps={{
                      value: editForm.subject,
                      onChange: (e) => setEditForm(prev => ({ ...prev, subject: e.target.value }))
                    }}
                  />
                  
                  <div>
                    <Typography variant="p" size="sm" weight="medium" className="mb-2 block">
                      Cuerpo del mensaje
                    </Typography>
                    <textarea
                      value={editForm.body}
                      onChange={(e) => setEditForm(prev => ({ ...prev, body: e.target.value }))}
                      className="w-full h-32 p-3 border border-border rounded-lg bg-input-background resize-none focus:outline-none focus:ring-2 focus:ring-design-primary/20 focus:border-design-primary"
                      placeholder="Contenido del email..."
                    />
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={handleEditCancel}
                      className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleEditSave}
                      className="px-3 py-1 text-sm bg-design-primary text-primary-dark rounded hover:bg-design-primary/90"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Typography variant="p" size="sm" color="muted" className="mb-1">
                      Asunto:
                    </Typography>
                    <Typography variant="p" size="sm" weight="medium">
                      {template.subject}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="p" size="sm" color="muted" className="mb-1">
                      Contenido:
                    </Typography>
                    <div className="bg-accent/30 p-3 rounded text-sm max-h-24 overflow-y-auto">
                      <Typography variant="p" size="sm">
                        {template.body.substring(0, 150)}
                        {template.body.length > 150 && '...'}
                      </Typography>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Typography variant="h4" weight="medium" className="mb-2">
            No se encontraron plantillas
          </Typography>
          <Typography variant="p" color="muted">
            Crea una nueva plantilla para comenzar
          </Typography>
        </div>
      )}
    </div>
  );
};

export default EmailTemplatesMgr;