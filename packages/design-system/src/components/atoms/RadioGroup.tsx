import React from 'react';
import Typography from './Typography';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  options: RadioOption[];
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  options,
  orientation = 'vertical',
  size = 'md',
  disabled = false,
  className = '',
  onChange,
  ...props
}) => {
  const sizeClasses = {
    'sm': 'w-4 h-4',
    'md': 'w-5 h-5',
    'lg': 'w-6 h-6'
  }[size];

  const spacing = {
    'sm': orientation === 'horizontal' ? 'space-x-4' : 'space-y-2',
    'md': orientation === 'horizontal' ? 'space-x-6' : 'space-y-3',
    'lg': orientation === 'horizontal' ? 'space-x-8' : 'space-y-4'
  }[size];

  const containerClasses = [
    'flex',
    orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
    spacing,
    className
  ].filter(Boolean).join(' ');

  const handleChange = (optionValue: string) => {
    if (onChange && !disabled) {
      onChange(optionValue);
    }
  };

  return (
    <div className={containerClasses} role="radiogroup" {...props}>
      {options.map((option) => {
        const isSelected = value === option.value;
        const isDisabled = disabled || option.disabled;
        const radioId = `${name}-${option.value}`;

        const radioClasses = [
          sizeClasses,
          'relative flex items-center justify-center rounded-full border-2 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-design-primary/20',
          isSelected
            ? 'bg-design-primary border-design-primary'
            : 'bg-background border-border hover:border-design-primary/50',
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ].filter(Boolean).join(' ');

        return (
          <div key={option.value} className="flex items-start space-x-3">
            <div className="relative">
              <input
                type="radio"
                id={radioId}
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => handleChange(option.value)}
                className="sr-only"
              />
              <label
                htmlFor={radioId}
                className={radioClasses}
              >
                {isSelected && (
                  <div className="w-2 h-2 bg-primary-dark rounded-full" />
                )}
              </label>
            </div>
            
            <div className="flex-1 space-y-1">
              <label htmlFor={radioId}>
                <Typography 
                  variant="p" 
                  size={size === 'lg' ? 'md' : 'sm'} 
                  weight="medium"
                  color={isDisabled ? 'muted' : 'inherit'}
                  className="cursor-pointer"
                >
                  {option.label}
                </Typography>
              </label>
              {option.description && (
                <Typography 
                  variant="p" 
                  size={size === 'lg' ? 'sm' : 'xs'} 
                  color="muted"
                >
                  {option.description}
                </Typography>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RadioGroup;