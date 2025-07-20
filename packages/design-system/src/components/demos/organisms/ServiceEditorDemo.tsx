import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import Button from '../../atoms/Button';
import ServiceEditor, { ServiceData } from '../../organisms/ServiceEditor';

const ServiceEditorDemo: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceData | undefined>(undefined);
  const [editMode, setEditMode] = useState<'new' | 'edit' | 'view'>('view');

  // Datos de ejemplo
  const sampleService: ServiceData = {
    id: '1',
    name: 'Limpieza Profunda de Hogar',
    category: 'Limpieza',
    description: 'Servicio completo de limpieza profunda para tu hogar, incluyendo todas las habitaciones, baños y cocina.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300',
    price: {
      amount: 120,
      currency: '$',
      period: 'servicio'
    },
    questions: [
      {
        id: 'text-1',
        type: 'text',
        title: '¿Cuántas habitaciones tiene tu hogar?',
        description: 'Esto nos ayuda a estimar el tiempo necesario',
        required: true,
        config: {
          placeholder: 'Ej: 3 habitaciones, 2 baños, cocina...',
          maxLength: 200
        }
      },
      {
        id: 'photo-1',
        type: 'photo',
        title: 'Fotos del estado actual',
        description: 'Sube fotos de las áreas que requieren limpieza',
        required: false
      },
      {
        id: 'multiselect-1',
        type: 'multiselect',
        title: 'Servicios adicionales',
        description: 'Selecciona los servicios extra que deseas incluir',
        required: false,
        config: {
          options: [
            {
              id: 'windows',
              text: 'Limpieza de ventanas',
              image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=200&h=150'
            },
            {
              id: 'appliances',
              text: 'Limpieza de electrodomésticos',
              image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=150'
            },
            {
              id: 'deep-carpet',
              text: 'Limpieza profunda de alfombras',
              image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150'
            }
          ]
        }
      }
    ]
  };

  const availableCategories = [
    'Limpieza',
    'Hogar',
    'Mantenimiento',
    'Jardín',
    'Emergencias',
    'Artesanía',
    'Climatización',
    'Seguridad',
    'Logística',
    'Diseño',
    'Salud',
    'Medios'
  ];

  const handleSave = (data: ServiceData) => {
    console.log('Servicio guardado:', data);
    alert(`Servicio "${data.name}" guardado correctamente`);
    setEditMode('view');
  };

  const handleDelete = (id: string) => {
    console.log('Servicio eliminado:', id);
    alert('Servicio eliminado');
    setEditMode('view');
    setSelectedService(undefined);
  };

  const handleCancel = () => {
    setEditMode('view');
    setSelectedService(undefined);
  };

  const startNewService = () => {
    setSelectedService(undefined);
    setEditMode('new');
  };

  const startEditService = () => {
    setSelectedService(sampleService);
    setEditMode('edit');
  };

  const getFeatureDescription = (feature: string) => {
    switch (feature) {
      case 'thumbnail':
        return 'Upload de imágenes con preview, validación de formato y tamaño, opción de eliminar/reemplazar';
      case 'categories':
        return 'Sistema de etiquetas con categorías predefinidas y opción de crear nuevas';
      case 'questions':
        return 'Editor completo de preguntas: texto libre, upload de fotos, selector múltiple con imágenes';
      case 'multiselect':
        return 'Opciones con texto e imagen, distribución en tarjetas, gestión completa de opciones';
      case 'validation':
        return 'Preguntas obligatorias/opcionales, validación de campos, preview en tiempo real';
      default:
        return '';
    }
  };

  if (editMode !== 'view') {
    return (
      <div className="space-y-6 p-6">
        <ServiceEditor
          service={editMode === 'edit' ? selectedService : undefined}
          availableCategories={availableCategories}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-6">
        <Typography variant="h3">Service Editor Component</Typography>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <Typography variant="p" weight="medium" className="text-blue-900 mb-4">
            🚀 Editor de Servicios Mejorado
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Typography variant="p" size="sm" className="text-blue-800">
                <strong>✨ Nuevas características:</strong><br/>
                • Upload de thumbnail con preview<br/>
                • Sistema de categorías con etiquetas<br/>
                • Editor de preguntas personalizables<br/>
                • Selector múltiple con imágenes
              </Typography>
            </div>
            <div>
              <Typography variant="p" size="sm" className="text-blue-800">
                <strong>🎯 Tipos de preguntas:</strong><br/>
                • Texto libre con placeholder y límites<br/>
                • Upload de fotos múltiples<br/>
                • Selección múltiple con tarjetas visuales<br/>
                • Configuración obligatorio/opcional
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-neutral-100 rounded-lg">
        <div className="flex items-center space-x-2">
          <Typography variant="p" size="sm" weight="medium">
            Acciones:
          </Typography>
          <Button
            variant="primary"
            icon="Plus"
            onClick={startNewService}
          >
            Crear Nuevo Servicio
          </Button>
          <Button
            variant="secondary"
            icon="Edit"
            onClick={startEditService}
          >
            Editar Servicio Ejemplo
          </Button>
        </div>
      </div>

      {/* Service Preview */}
      {selectedService && (
        <div className="bg-card border border-border rounded-lg p-6">
          <Typography variant="h4" className="mb-4">Vista Previa del Servicio</Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <Typography variant="h3" weight="medium">{selectedService.name}</Typography>
                <Typography variant="p" color="muted" className="mt-1">
                  {selectedService.description}
                </Typography>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {selectedService.category}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedService.price?.currency}{selectedService.price?.amount}/{selectedService.price?.period}
                </div>
              </div>

              <div className="space-y-3">
                <Typography variant="h4">Preguntas del formulario:</Typography>
                {selectedService.questions.map((q, index) => (
                  <div key={q.id} className="bg-neutral-50 border border-border rounded-md p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="w-6 h-6 bg-primary text-white rounded-full text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <Typography variant="p" size="sm" weight="medium">{q.title}</Typography>
                      {q.required && (
                        <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded">Obligatorio</span>
                      )}
                    </div>
                    {q.description && (
                      <Typography variant="p" size="xs" color="muted" className="ml-8">
                        {q.description}
                      </Typography>
                    )}
                    {q.type === 'multiselect' && q.config?.options && (
                      <div className="ml-8 mt-2 grid grid-cols-3 gap-2">
                        {q.config.options.map(option => (
                          <div key={option.id} className="text-xs bg-card border border-border rounded p-2 text-center">
                            {option.image && (
                              <div className="w-8 h-8 bg-neutral-200 rounded mx-auto mb-1"></div>
                            )}
                            {option.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {selectedService.thumbnail && (
                <div className="aspect-video bg-neutral-200 border border-border rounded-lg overflow-hidden">
                  <img
                    src={typeof selectedService.thumbnail === 'string' ? selectedService.thumbnail : ''}
                    alt={selectedService.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Features Documentation */}
      <div className="space-y-6">
        <Typography variant="h3">Características Implementadas</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thumbnail Features */}
          <div className="space-y-4">
            <Typography variant="h4" className="flex items-center space-x-2">
              <span>📸</span>
              <span>Gestión de Thumbnail</span>
            </Typography>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-design-primary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">Upload con Drag & Drop</Typography>
                  <Typography variant="p" size="xs" color="muted">Interfaz intuitiva para subir imágenes del servicio</Typography>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-design-primary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">Preview Instantáneo</Typography>
                  <Typography variant="p" size="xs" color="muted">Vista previa inmediata con opción de reemplazar</Typography>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-design-primary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">Validación de Archivo</Typography>
                  <Typography variant="p" size="xs" color="muted">Soporte para JPG, PNG con límite de tamaño</Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Features */}
          <div className="space-y-4">
            <Typography variant="h4" className="flex items-center space-x-2">
              <span>🏷️</span>
              <span>Sistema de Categorías</span>
            </Typography>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">Etiquetas Predefinidas</Typography>
                  <Typography variant="p" size="xs" color="muted">Categorías comunes disponibles como chips clickeables</Typography>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">Crear Nuevas Categorías</Typography>
                  <Typography variant="p" size="xs" color="muted">Input dinámico para añadir categorías personalizadas</Typography>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">Selección Visual</Typography>
                  <Typography variant="p" size="xs" color="muted">Feedback visual claro para categoría seleccionada</Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Features */}
          <div className="space-y-4">
            <Typography variant="h4" className="flex items-center space-x-2">
              <span>❓</span>
              <span>Editor de Preguntas</span>
            </Typography>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-warning rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">Tipos Múltiples</Typography>
                  <Typography variant="p" size="xs" color="muted">Texto libre, upload de fotos, selección múltiple</Typography>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-warning rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">Configuración Avanzada</Typography>
                  <Typography variant="p" size="xs" color="muted">Placeholders, límites, validación, estados</Typography>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-warning rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">Gestión Completa</Typography>
                  <Typography variant="p" size="xs" color="muted">Añadir, editar, eliminar, reordenar preguntas</Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Multiselect Features */}
          <div className="space-y-4">
            <Typography variant="h4" className="flex items-center space-x-2">
              <span>🎯</span>
              <span>Selector Múltiple</span>
            </Typography>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-accent-light rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">Opciones con Imagen</Typography>
                  <Typography variant="p" size="xs" color="muted">Cada opción puede incluir texto e imagen</Typography>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-accent-light rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">Layout en Tarjetas</Typography>
                  <Typography variant="p" size="xs" color="muted">Distribución visual atractiva en grid</Typography>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-accent-light rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">Editor de Opciones</Typography>
                  <Typography variant="p" size="xs" color="muted">CRUD completo para opciones individuales</Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Options */}
      <div className="space-y-6">
        <Typography variant="h3">Opciones de Configuración</Typography>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Typography variant="h4" className="mb-3">Props Principales</Typography>
              <div className="space-y-2 text-sm">
                <div><code className="bg-neutral-200 px-1 rounded">service</code>: ServiceData | undefined</div>
                <div><code className="bg-neutral-200 px-1 rounded">availableCategories</code>: string[]</div>
                <div><code className="bg-neutral-200 px-1 rounded">onSave</code>: (data) =&gt; void</div>
                <div><code className="bg-neutral-200 px-1 rounded">onDelete</code>: (id) =&gt; void</div>
              </div>
            </div>
            
            <div>
              <Typography variant="h4" className="mb-3">Tipos de Pregunta</Typography>
              <div className="space-y-2 text-sm">
                <div><strong>text:</strong> Campo de texto libre</div>
                <div><strong>photo:</strong> Upload múltiple de fotos</div>
                <div><strong>multiselect:</strong> Opciones con imagen</div>
              </div>
            </div>
            
            <div>
              <Typography variant="h4" className="mb-3">Configuraciones</Typography>
              <div className="space-y-2 text-sm">
                <div><strong>Validación:</strong> Campos obligatorios/opcionales</div>
                <div><strong>Límites:</strong> Máximo caracteres, tamaño archivo</div>
                <div><strong>Personalización:</strong> Placeholders, descripciones</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceEditorDemo;