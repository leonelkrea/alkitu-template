import React from 'react';
import Typography from '../atoms/Typography';
import Input from '../atoms/Input';
import Icon from '../atoms/Icon';

export interface FormFieldMobileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  className?: string;
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

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label - usando Typography del design system */}
      <div className="space-y-1">
        <Typography
          variant="p"
          size="base"
          weight="medium"
          className={`block ${error ? 'text-error' : 'text-foreground'}`}
        >
          {label}
          {required && (
            <Typography variant="p" className="text-error ml-1 inline" aria-label="required">
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
        size="lg"
        error={!!error}
        {...inputProps}
        className={`
          h-12 text-base
          ${error ? 'border-error bg-error/5' : ''}
          ${inputProps.className || ''}
        `}
        style={{
          fontSize: '16px', // Evita zoom en iOS
          ...(inputProps.style || {})
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