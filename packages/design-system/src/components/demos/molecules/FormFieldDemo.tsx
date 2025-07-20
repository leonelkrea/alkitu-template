import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import FormField from '../../molecules/FormField';

const FormFieldDemo: React.FC = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    message: '',
    country: '',
    service: '',
    priority: '',
    phone: '',
    phoneCountry: '+1' // Cambiado a USA por defecto
  });

  const countryOptions = [
    { value: 'es', label: 'España', flag: '🇪🇸' },
    { value: 'us', label: 'Estados Unidos', flag: '🇺🇸' },
    { value: 'fr', label: 'Francia', flag: '🇫🇷' },
    { value: 'de', label: 'Alemania', flag: '🇩🇪' },
    { value: 'it', label: 'Italia', flag: '🇮🇹' },
    { value: 'gb', label: 'Reino Unido', flag: '🇬🇧' },
  ];

  const serviceOptions = [
    { value: 'hvac', label: 'Mantenimiento HVAC', icon: 'Zap' },
    { value: 'it', label: 'Soporte Técnico IT', icon: 'Monitor' },
    { value: 'cleaning', label: 'Servicio de Limpieza', icon: 'Sparkles' },
    { value: 'security', label: 'Seguridad', icon: 'Shield' },
    { value: 'maintenance', label: 'Mantenimiento General', icon: 'Wrench' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baja', icon: 'ArrowDown' },
    { value: 'medium', label: 'Media', icon: 'Minus' },
    { value: 'high', label: 'Alta', icon: 'ArrowUp' },
    { value: 'urgent', label: 'Urgente', icon: 'AlertTriangle' },
  ];

  return (
    <div className="space-y-8">
      {/* Campos básicos alineados */}
      <div className="space-y-6">
        <Typography variant="h4">Campos básicos:</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 max-w-4xl">
          <FormField
            label="Nombre completo"
            type="text"
            value={formValues.name}
            onChange={(e) => setFormValues(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ingresa tu nombre"
            description="Tu nombre tal como aparece en documentos oficiales"
            required
          />
          
          <FormField
            label="Correo electrónico"
            type="email"
            value={formValues.email}
            onChange={(e) => setFormValues(prev => ({ ...prev, email: e.target.value }))}
            placeholder="correo@ejemplo.com"
            error={formValues.email && !formValues.email.includes('@') ? 'El formato del correo no es válido' : ''}
            required
          />
        </div>
      </div>

      {/* Campo de teléfono */}
      <div className="space-y-6">
        <Typography variant="h4">Campo de teléfono con código de país:</Typography>
        <div className="max-w-md">
          <FormField
            label="Número de teléfono"
            type="phone"
            value={formValues.phone}
            onChange={(e) => setFormValues(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Número de teléfono"
            description="Incluye el código de país seleccionado"
            phoneConfig={{
              countryCode: formValues.phoneCountry,
              onCountryChange: (code) => setFormValues(prev => ({ ...prev, phoneCountry: code }))
            }}
            required
          />
        </div>
      </div>

      {/* Dropdowns */}
      <div className="space-y-6">
        <Typography variant="h4">Campos de selección (Dropdowns):</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <FormField
            label="País de residencia"
            type="select"
            value={formValues.country}
            onChange={(e) => setFormValues(prev => ({ ...prev, country: e.target.value }))}
            placeholder="Selecciona tu país"
            options={countryOptions}
            description="País donde resides actualmente"
            required
          />
          
          <FormField
            label="Tipo de servicio"
            type="select"
            value={formValues.service}
            onChange={(e) => setFormValues(prev => ({ ...prev, service: e.target.value }))}
            placeholder="Selecciona un servicio"
            options={serviceOptions}
            description="Servicio que necesitas solicitar"
            required
          />
          
          <FormField
            label="Prioridad"
            type="select"
            value={formValues.priority}
            onChange={(e) => setFormValues(prev => ({ ...prev, priority: e.target.value }))}
            placeholder="Selecciona prioridad"
            options={priorityOptions}
            description="Nivel de urgencia del servicio"
          />
        </div>
      </div>

      {/* Textarea */}
      <div className="space-y-6">
        <Typography variant="h4">Campo de texto largo:</Typography>
        <div className="max-w-2xl">
          <FormField
            label="Descripción del problema"
            type="textarea"
            value={formValues.message}
            onChange={(e) => setFormValues(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Describe detalladamente el problema o servicio que necesitas..."
            description="Proporciona todos los detalles relevantes (máximo 500 caracteres)"
          />
        </div>
      </div>

      {/* Estado del formulario */}
      <div className="space-y-6">
        <Typography variant="h4">Estado actual del formulario:</Typography>
        <div className="bg-neutral-100 p-6 rounded-lg max-w-2xl">
          <Typography variant="p" size="sm" className="font-mono whitespace-pre-wrap">
            {JSON.stringify(formValues, null, 2)}
          </Typography>
        </div>
      </div>

      {/* Casos de uso */}
      <div className="space-y-6">
        <Typography variant="h4">Casos de uso recomendados:</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-blue-900 mb-2">
              Campo de teléfono
            </Typography>
            <Typography variant="p" size="sm" className="text-blue-800">
              • Formularios de contacto<br/>
              • Registro de usuarios<br/>
              • Solicitudes de servicios<br/>
              • Verificación de identidad
            </Typography>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-green-900 mb-2">
              Dropdowns con iconos
            </Typography>
            <Typography variant="p" size="sm" className="text-green-800">
              • Selección de servicios<br/>
              • Configuración de prioridades<br/>
              • Filtros de búsqueda<br/>
              • Categorización de contenido
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormFieldDemo;