import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Input from '../atoms/Input';
import Icon from '../atoms/Icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  flag?: string;
}

export interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  id?: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'phone';
  value?: string;
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { value: string } },
  ) => void;
  placeholder?: string;
  className?: string;
  options?: SelectOption[];
  phoneConfig?: {
    countryCode: string;
    onCountryChange: (code: string) => void;
  };
}

// Lista de códigos de país con banderas - USA primero
const COUNTRY_CODES: SelectOption[] = [
  { value: '+1', label: 'Estados Unidos', flag: '🇺🇸' },
  { value: '+34', label: 'España', flag: '🇪🇸' },
  { value: '+33', label: 'Francia', flag: '🇫🇷' },
  { value: '+49', label: 'Alemania', flag: '🇩🇪' },
  { value: '+39', label: 'Italia', flag: '🇮🇹' },
  { value: '+44', label: 'Reino Unido', flag: '🇬🇧' },
  { value: '+351', label: 'Portugal', flag: '🇵🇹' },
  { value: '+31', label: 'Países Bajos', flag: '🇳🇱' },
  { value: '+32', label: 'Bélgica', flag: '🇧🇪' },
  { value: '+41', label: 'Suiza', flag: '🇨🇭' },
  { value: '+43', label: 'Austria', flag: '🇦🇹' },
  { value: '+45', label: 'Dinamarca', flag: '🇩🇰' },
  { value: '+46', label: 'Suecia', flag: '🇸🇪' },
  { value: '+47', label: 'Noruega', flag: '🇳🇴' },
  { value: '+358', label: 'Finlandia', flag: '🇫🇮' },
  { value: '+52', label: 'México', flag: '🇲🇽' },
  { value: '+54', label: 'Argentina', flag: '🇦🇷' },
  { value: '+55', label: 'Brasil', flag: '🇧🇷' },
  { value: '+56', label: 'Chile', flag: '🇨🇱' },
  { value: '+57', label: 'Colombia', flag: '🇨🇴' },
];

const FormField: React.FC<FormFieldProps> = ({
  label,
  description,
  error,
  required = false,
  id,
  type = 'text',
  value = '',
  onChange,
  placeholder,
  className = '',
  options = [],
  phoneConfig,
  ...props
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    phoneConfig?.countryCode || '+1',
  ); // Cambiado a USA por defecto

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (onChange) {
      onChange(e);
    }
  };

  // Filter out props that shouldn't be passed to input elements
  const validInputProps = Object.fromEntries(
    Object.entries(props).filter(
      ([key]) =>
        ![
          'label',
          'description',
          'error',
          'required',
          'type',
          'options',
          'phoneConfig',
        ].includes(key),
    ),
  );

  const handleSelectChange = (newValue: string) => {
    if (onChange) {
      onChange({ target: { value: newValue } } as any);
    }
  };

  const handleCountryCodeChange = (newCode: string) => {
    setSelectedCountryCode(newCode);
    if (phoneConfig?.onCountryChange) {
      phoneConfig.onCountryChange(newCode);
    }
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`
              w-full px-3 py-2 border rounded-md transition-colors duration-200 resize-none
              bg-input-background border-border text-foreground
              placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-design-primary/20 focus:border-design-primary
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-error' : ''}
            `}
            rows={4}
            {...validInputProps}
          />
        );

      case 'select':
        return (
          <Select value={value} onValueChange={handleSelectChange}>
            <SelectTrigger
              className={`
                w-full border-border bg-input-background
                focus:ring-2 focus:ring-design-primary/20 focus:border-design-primary
                ${error ? 'border-error' : ''}
              `}
            >
              <SelectValue
                placeholder={placeholder || 'Selecciona una opción'}
              />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center space-x-2">
                    {option.icon && (
                      <Icon name={option.icon as any} size="sm" />
                    )}
                    {option.flag && (
                      <span className="text-sm">{option.flag}</span>
                    )}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'phone':
        return (
          <div className="flex space-x-2">
            <Select
              value={selectedCountryCode}
              onValueChange={handleCountryCodeChange}
            >
              <SelectTrigger className="w-32 border-border bg-input-background focus:ring-2 focus:ring-design-primary/20 focus:border-design-primary">
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      {COUNTRY_CODES.find(
                        (c) => c.value === selectedCountryCode,
                      )?.flag || '🌍'}
                    </span>
                    <span className="text-sm">{selectedCountryCode}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {COUNTRY_CODES.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{country.flag}</span>
                      <span className="text-sm">{country.value}</span>
                      <span className="text-sm text-muted-foreground">
                        {country.label}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id={fieldId}
              type="tel"
              value={value}
              onChange={handleChange}
              placeholder={placeholder || 'Número de teléfono'}
              error={!!error}
              className="flex-1"
              {...validInputProps}
            />
          </div>
        );

      default:
        return (
          <Input
            id={fieldId}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            error={!!error}
            {...validInputProps}
          />
        );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={fieldId}>
        <Typography variant="p" size="sm" weight="medium" className="block">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </Typography>
      </label>

      {description && (
        <Typography variant="p" size="xs" color="muted">
          {description}
        </Typography>
      )}

      {renderInput()}

      {error && (
        <Typography variant="p" size="xs" className="text-error">
          {error}
        </Typography>
      )}
    </div>
  );
};

export default FormField;
