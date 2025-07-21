import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import IconButton from '../molecules/IconButton';

interface WizardStep {
  id: string;
  title: string;
  description: string;
}

export interface NewRequestWizardProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  className?: string;
}

const NewRequestWizard: React.FC<NewRequestWizardProps> = ({
  onSubmit,
  onCancel,
  className = '',
  ...props
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: '',
    description: '',
    requestType: '',
    priority: 'medium',

    // Step 2: Details
    department: '',
    location: '',
    estimatedDate: '',

    // Step 3: Additional
    notes: '',
    attachments: [],
  });

  const steps: WizardStep[] = [
    {
      id: 'basic',
      title: 'Información Básica',
      description: 'Detalles principales de la solicitud',
    },
    {
      id: 'details',
      title: 'Detalles Específicos',
      description: 'Información adicional requerida',
    },
    {
      id: 'additional',
      title: 'Información Adicional',
      description: 'Notas y archivos adjuntos',
    },
    {
      id: 'review',
      title: 'Revisar',
      description: 'Confirmar información antes de enviar',
    },
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <FormField
              label="Título de la solicitud"
              required
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              placeholder="Ej: Reparación de aire acondicionado"
            />

            <FormField
              label="Descripción"
              description="Describe detalladamente lo que necesitas"
              required
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Describe el problema o servicio que necesitas..."
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Tipo de solicitud"
                required
                value={formData.requestType}
                onChange={(e) => updateFormData('requestType', e.target.value)}
                placeholder="Seleccionar tipo"
              />

              <FormField
                label="Prioridad"
                required
                value={formData.priority}
                onChange={(e) => updateFormData('priority', e.target.value)}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Departamento"
                value={formData.department}
                onChange={(e) => updateFormData('department', e.target.value)}
                placeholder="Tu departamento"
              />

              <FormField
                label="Ubicación"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                placeholder="Ubicación específica"
              />
            </div>

            <FormField
              label="Fecha estimada de necesidad"
              description="Cuándo necesitas que se complete esta solicitud"
              type="text"
              value={formData.estimatedDate}
              onChange={(e) => updateFormData('estimatedDate', e.target.value)}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <FormField
              label="Notas adicionales"
              description="Cualquier información adicional que pueda ser útil"
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              placeholder="Información adicional..."
            />

            <div>
              <Typography
                variant="p"
                size="sm"
                weight="medium"
                className="mb-2"
              >
                Archivos adjuntos
              </Typography>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Typography variant="p" color="muted">
                  Arrastra archivos aquí o haz clic para seleccionar
                </Typography>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Typography variant="h3" weight="medium" className="mb-4">
              Resumen de la solicitud
            </Typography>

            <div className="bg-accent/50 p-6 rounded-lg space-y-4">
              <div>
                <Typography variant="p" size="sm" color="muted">
                  Título:
                </Typography>
                <Typography variant="p" weight="medium">
                  {formData.title}
                </Typography>
              </div>

              <div>
                <Typography variant="p" size="sm" color="muted">
                  Descripción:
                </Typography>
                <Typography variant="p">{formData.description}</Typography>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="p" size="sm" color="muted">
                    Tipo:
                  </Typography>
                  <Typography variant="p">{formData.requestType}</Typography>
                </div>
                <div>
                  <Typography variant="p" size="sm" color="muted">
                    Prioridad:
                  </Typography>
                  <Typography variant="p">{formData.priority}</Typography>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${className}`} {...props}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h2" weight="medium">
            Nueva Solicitud
          </Typography>
          <IconButton
            icon="X"
            iconOnly
            variant="ghost"
            tooltip="Cerrar"
            onClick={onCancel}
          />
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${
                  index <= currentStep
                    ? 'bg-design-primary text-primary-dark'
                    : 'bg-neutral-300 text-muted-foreground'
                }
              `}
              >
                {index + 1}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                  w-12 h-0.5 mx-2
                  ${index < currentStep ? 'bg-design-primary' : 'bg-neutral-300'}
                `}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Typography variant="h3" weight="medium">
            {steps[currentStep].title}
          </Typography>
          <Typography variant="p" size="sm" color="muted">
            {steps[currentStep].description}
          </Typography>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-card border border-border rounded-lg p-8 mb-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {currentStep > 0 && (
            <IconButton icon="ArrowLeft" onClick={prevStep} variant="outline">
              Anterior
            </IconButton>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>

          {currentStep < steps.length - 1 ? (
            <IconButton
              icon="ArrowRight"
              iconPosition="right"
              onClick={nextStep}
              variant="primary"
            >
              Siguiente
            </IconButton>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              Enviar Solicitud
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewRequestWizard;
