import React, { useState, useRef } from 'react';
import Typography from '../atoms/Typography';
import FormField from '../molecules/FormField';
import IconButton from '../molecules/IconButton';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Chip from '../atoms/Chip';
import PreviewImage from '../atoms/PreviewImage';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// Tipos para las preguntas del formulario
export interface FormQuestion {
  id: string;
  type: 'text' | 'photo' | 'multiselect';
  title: string;
  description?: string;
  required: boolean;
  config?: {
    // Para texto
    placeholder?: string;
    maxLength?: number;
    // Para multiselect
    options?: {
      id: string;
      text: string;
      image?: string;
    }[];
  };
}

export interface ServiceData {
  id?: string;
  name: string;
  category: string;
  description: string;
  thumbnail?: File | string;
  price?: {
    amount: number;
    currency: string;
    period?: string;
  };
  questions: FormQuestion[];
}

export interface ServiceEditorProps {
  service?: ServiceData;
  availableCategories?: string[];
  onSave?: (data: ServiceData) => void;
  onDelete?: (id: string) => void;
  onCancel?: () => void;
  className?: string;
}

const ServiceEditor: React.FC<ServiceEditorProps> = ({
  service,
  availableCategories = [
    'Hogar',
    'Limpieza',
    'Mantenimiento',
    'Jardín',
    'Emergencias',
  ],
  onSave,
  onDelete,
  onCancel,
  className = '',
  ...props
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ServiceData>(() => ({
    name: '',
    category: '',
    description: '',
    thumbnail: undefined,
    price: {
      amount: 0,
      currency: '$',
      period: 'servicio',
    },
    questions: [
      {
        id: 'text-response',
        type: 'text',
        title: 'Descripción detallada',
        description: 'Describe con detalle lo que necesitas',
        required: true,
        config: {
          placeholder: 'Escribe aquí los detalles...',
          maxLength: 500,
        },
      },
      {
        id: 'photo-upload',
        type: 'photo',
        title: 'Fotos del área',
        description: 'Sube fotos para ayudarnos a entender mejor',
        required: false,
      },
    ],
    ...service,
  }));

  const [categories, setCategories] = useState<string[]>(availableCategories);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    typeof formData.thumbnail === 'string' ? formData.thumbnail : null,
  );

  // Manejar upload de thumbnail
  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setFormData((prev) => ({ ...prev, thumbnail: file }));
    }
  };

  const removeThumbnail = () => {
    setThumbnailPreview(null);
    setFormData((prev) => ({ ...prev, thumbnail: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Manejar categorías
  const addNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      setFormData((prev) => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
      setShowNewCategoryInput(false);
    }
  };

  const selectCategory = (category: string) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  // Manejar preguntas
  const addQuestion = (type: FormQuestion['type']) => {
    const newQuestion: FormQuestion = {
      id: `question-${Date.now()}`,
      type,
      title:
        type === 'text'
          ? 'Nueva pregunta de texto'
          : type === 'photo'
            ? 'Nueva pregunta de fotos'
            : 'Selección múltiple',
      required: false,
      config: type === 'multiselect' ? { options: [] } : {},
    };

    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (
    questionId: string,
    updates: Partial<FormQuestion>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q,
      ),
    }));
  };

  const removeQuestion = (questionId: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  // Manejar opciones de multiselect
  const addMultiselectOption = (questionId: string) => {
    const newOption = {
      id: `option-${Date.now()}`,
      text: 'Nueva opción',
      image: '',
    };

    updateQuestion(questionId, {
      config: {
        ...formData.questions.find((q) => q.id === questionId)?.config,
        options: [
          ...(formData.questions.find((q) => q.id === questionId)?.config
            ?.options || []),
          newOption,
        ],
      },
    });
  };

  const updateMultiselectOption = (
    questionId: string,
    optionId: string,
    updates: { text?: string; image?: string },
  ) => {
    const question = formData.questions.find((q) => q.id === questionId);
    if (question?.config?.options) {
      updateQuestion(questionId, {
        config: {
          ...question.config,
          options: question.config.options.map((opt) =>
            opt.id === optionId ? { ...opt, ...updates } : opt,
          ),
        },
      });
    }
  };

  const removeMultiselectOption = (questionId: string, optionId: string) => {
    const question = formData.questions.find((q) => q.id === questionId);
    if (question?.config?.options) {
      updateQuestion(questionId, {
        config: {
          ...question.config,
          options: question.config.options.filter((opt) => opt.id !== optionId),
        },
      });
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  const handleDelete = () => {
    if (onDelete && service?.id) {
      onDelete(service.id);
    }
  };

  const renderQuestion = (question: FormQuestion) => (
    <div
      key={question.id}
      className="bg-neutral-50 border border-border rounded-lg p-4 space-y-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-2">
            <Icon
              name={
                question.type === 'text'
                  ? 'Type'
                  : question.type === 'photo'
                    ? 'Camera'
                    : 'CheckSquare'
              }
              size="sm"
              color="muted"
            />
            <Typography
              variant="p"
              size="sm"
              weight="medium"
              className="capitalize"
            >
              {question.type === 'text'
                ? 'Texto'
                : question.type === 'photo'
                  ? 'Fotos'
                  : 'Selección múltiple'}
            </Typography>
            <Chip
              label={question.required ? 'Obligatorio' : 'Opcional'}
              variant={question.required ? 'warning' : 'neutral'}
              size="xs"
            />
          </div>

          <FormField
            label="Título de la pregunta"
            value={question.title}
            onChange={(e) =>
              updateQuestion(question.id, { title: e.target.value })
            }
            placeholder="Escribe el título de la pregunta"
          />

          <FormField
            label="Descripción (opcional)"
            value={question.description || ''}
            onChange={(e) =>
              updateQuestion(question.id, { description: e.target.value })
            }
            placeholder="Descripción adicional para la pregunta"
          />

          {question.type === 'text' && (
            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Placeholder"
                value={question.config?.placeholder || ''}
                onChange={(e) =>
                  updateQuestion(question.id, {
                    config: {
                      ...question.config,
                      placeholder: e.target.value,
                    },
                  })
                }
                placeholder="Texto de ejemplo..."
              />
              <FormField
                label="Máximo caracteres"
                value={question.config?.maxLength?.toString() || ''}
                onChange={(e) =>
                  updateQuestion(question.id, {
                    config: {
                      ...question.config,
                      maxLength: parseInt(e.target.value),
                    },
                  })
                }
                placeholder="500"
              />
            </div>
          )}

          {question.type === 'multiselect' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Typography variant="p" size="sm" weight="medium">
                  Opciones disponibles
                </Typography>
                <Button
                  variant="outline"
                  size="sm"
                  icon="Plus"
                  onClick={() => addMultiselectOption(question.id)}
                >
                  Añadir opción
                </Button>
              </div>

              {question.config?.options?.map((option) => (
                <div
                  key={option.id}
                  className="grid grid-cols-2 gap-3 items-end p-3 bg-card border border-border rounded-md"
                >
                  <FormField
                    label="Texto de la opción"
                    value={option.text}
                    onChange={(e) =>
                      updateMultiselectOption(question.id, option.id, {
                        text: e.target.value,
                      })
                    }
                    placeholder="Nombre de la opción"
                  />
                  <FormField
                    label="URL de imagen (opcional)"
                    value={option.image || ''}
                    onChange={(e) =>
                      updateMultiselectOption(question.id, option.id, {
                        image: e.target.value,
                      })
                    }
                    placeholder="https://..."
                  />
                  <div className="col-span-2 flex items-center justify-between">
                    {option.image && (
                      <div className="w-16 h-16 border border-border rounded-md overflow-hidden">
                        <ImageWithFallback
                          src={option.image}
                          alt={option.text}
                          width="64"
                          height="64"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() =>
                        removeMultiselectOption(question.id, option.id)
                      }
                      className="text-error hover:text-error"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <IconButton
            icon={question.required ? 'ToggleRight' : 'ToggleLeft'}
            iconOnly
            variant={question.required ? 'primary' : 'outline'}
            size="sm"
            tooltip={
              question.required
                ? 'Marcar como opcional'
                : 'Marcar como obligatorio'
            }
            onClick={() =>
              updateQuestion(question.id, { required: !question.required })
            }
          />
          <IconButton
            icon="Trash2"
            iconOnly
            variant="destructive"
            size="sm"
            tooltip="Eliminar pregunta"
            onClick={() => removeQuestion(question.id)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2" weight="medium">
            {service ? 'Editar Servicio' : 'Nuevo Servicio'}
          </Typography>
          <Typography variant="p" size="sm" color="muted">
            Configura todos los aspectos de tu servicio
          </Typography>
        </div>
        <div className="flex space-x-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          {service && (
            <Button variant="destructive" icon="Trash2" onClick={handleDelete}>
              Eliminar
            </Button>
          )}
          <Button variant="primary" icon="Save" onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información básica */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="flex items-center space-x-2 pb-4 border-b border-border">
              <Icon name="Info" size="sm" color="primary" />
              <Typography variant="h3" weight="medium">
                Información básica
              </Typography>
            </div>

            <FormField
              label="Nombre del servicio"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Ej: Limpieza profunda de hogar"
            />

            <FormField
              label="Descripción"
              description="Describe brevemente en qué consiste el servicio"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Descripción del servicio..."
            />

            {/* Precio */}
            <div className="grid grid-cols-3 gap-3">
              <FormField
                label="Precio"
                type="text"
                value={formData.price?.amount.toString() || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: {
                      ...prev.price!,
                      amount: parseFloat(e.target.value) || 0,
                    },
                  }))
                }
                placeholder="0"
              />
              <FormField
                label="Moneda"
                value={formData.price?.currency || '$'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: { ...prev.price!, currency: e.target.value },
                  }))
                }
                placeholder="$"
              />
              <FormField
                label="Periodo"
                value={formData.price?.period || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: { ...prev.price!, period: e.target.value },
                  }))
                }
                placeholder="hora, día, proyecto..."
              />
            </div>
          </div>

          {/* Preguntas del formulario */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <Icon name="HelpCircle" size="sm" color="primary" />
                <Typography variant="h3" weight="medium">
                  Preguntas del formulario
                </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon="Type"
                  onClick={() => addQuestion('text')}
                >
                  Texto
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="Camera"
                  onClick={() => addQuestion('photo')}
                >
                  Fotos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="CheckSquare"
                  onClick={() => addQuestion('multiselect')}
                >
                  Múltiple
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {formData.questions.map(renderQuestion)}

              {formData.questions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="HelpCircle" size="lg" className="mx-auto mb-3" />
                  <Typography variant="p" size="sm">
                    No hay preguntas configuradas. Añade preguntas para
                    personalizar el formulario.
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar con imagen y categoría */}
        <div className="space-y-6">
          {/* Thumbnail */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2 pb-4 border-b border-border">
              <Icon name="Image" size="sm" color="primary" />
              <Typography variant="h4" weight="medium">
                Imagen del servicio
              </Typography>
            </div>

            <div className="space-y-4">
              {thumbnailPreview ? (
                <div className="relative">
                  <div className="aspect-video bg-neutral-100 border border-border rounded-lg overflow-hidden">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    icon="X"
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2"
                  >
                    Eliminar
                  </Button>
                </div>
              ) : (
                <div
                  className="aspect-video bg-neutral-100 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icon
                    name="Upload"
                    size="lg"
                    color="muted"
                    className="mb-2"
                  />
                  <Typography
                    variant="p"
                    size="sm"
                    color="muted"
                    className="text-center"
                  >
                    Haz clic para subir una imagen
                    <br />
                    <span className="text-xs">JPG, PNG hasta 5MB</span>
                  </Typography>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
              />

              <Button
                variant="outline"
                size="sm"
                icon="Upload"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                {thumbnailPreview ? 'Cambiar imagen' : 'Subir imagen'}
              </Button>
            </div>
          </div>

          {/* Categorías */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2 pb-4 border-b border-border">
              <Icon name="Tag" size="sm" color="primary" />
              <Typography variant="h4" weight="medium">
                Categoría
              </Typography>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    variant={
                      formData.category === category ? 'primary' : 'neutral'
                    }
                    clickable={true}
                    onClick={() => selectCategory(category)}
                  />
                ))}
              </div>

              {showNewCategoryInput ? (
                <div className="flex space-x-2">
                  <FormField
                    label="Nueva categoría"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nueva categoría"
                    className="flex-1"
                  />
                  <IconButton
                    icon="Check"
                    variant="primary"
                    size="sm"
                    onClick={addNewCategory}
                  />
                  <IconButton
                    icon="X"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategory('');
                    }}
                  />
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  icon="Plus"
                  onClick={() => setShowNewCategoryInput(true)}
                  className="w-full"
                >
                  Nueva categoría
                </Button>
              )}

              {formData.category && (
                <div className="pt-2 border-t border-border">
                  <Typography variant="p" size="sm" color="muted">
                    Categoría seleccionada:
                  </Typography>
                  <Typography variant="p" size="sm" weight="medium">
                    {formData.category}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceEditor;
