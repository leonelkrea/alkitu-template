import React from 'react';
import Typography from '../atoms/Typography';
import Input from '../atoms/Input';
import Icon from '../atoms/Icon';

export interface FormFieldMobileProps {
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  className?: string;
  style?: React.CSSProperties;
  value?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  inputSize?: 'sm' | 'md' | 'lg';
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  id?: string;
}

const FormFieldMobile: React.FC<FormFieldMobileProps> = ({
  label,
  description,
  required = false,
  error,
  className = '',
  id,
  ...inputProps
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

  // Only allow supported types for custom Input
  const allowedTypes = [
    'text',
    'email',
    'password',
    'number',
    'tel',
    'url',
    'search',
  ] as const;
  type AllowedType = (typeof allowedTypes)[number];
  function isAllowedType(t: any): t is AllowedType {
    return allowedTypes.includes(t);
  }
  const safeType = isAllowedType(inputProps.type) ? inputProps.type : undefined;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label - usando Typography del design system */}
      <div className="space-y-1">
        <Typography
          variant="p"
          size="md"
          weight="medium"
          className={`block ${error ? 'text-error' : 'text-foreground'}`}
        >
          {label}
          {required && (
            <Typography
              variant="p"
              className="text-error ml-1 inline"
              aria-label="required"
            >
              *
            </Typography>
          )}
        </Typography>

        {description && !error && (
          <Typography variant="p" size="sm" color="muted" className="block">
            {description}
          </Typography>
        )}
      </div>

      {/* Input - usando Input del design system con props móviles */}
      <Input
        id={fieldId}
        inputSize="lg"
        error={!!error}
        type={safeType}
        value={inputProps.value}
        placeholder={inputProps.placeholder}
        disabled={inputProps.disabled}
        readOnly={inputProps.readOnly}
        onChange={inputProps.onChange}
        onBlur={inputProps.onBlur}
        onFocus={inputProps.onFocus}
        className={`
          h-12 text-base
          ${error ? 'border-error bg-error/5' : ''}
        `}
        style={{
          fontSize: '16px', // Evita zoom en iOS
          ...(inputProps.style || {}),
        }}
      />

      {/* Error message - usando Typography e Icon del design system */}
      {error && (
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 mt-0.5">
            <Icon name="AlertCircle" size="sm" className="text-error" />
          </div>
          <Typography variant="p" size="sm" className="text-error">
            {error}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default FormFieldMobile;
