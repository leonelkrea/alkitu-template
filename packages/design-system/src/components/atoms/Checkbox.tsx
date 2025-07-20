import React from 'react';
import Icon from './Icon';
import Typography from './Typography';

export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onChange?: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  description,
  size = 'md',
  className = '',
  onChange,
  ...props
}) => {
  // Generate unique id if not provided
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  const sizeClasses = {
    'sm': 'w-4 h-4',
    'md': 'w-5 h-5',
    'lg': 'w-6 h-6'
  }[size];

  const iconSize = {
    'sm': 'xs' as const,
    'md': 'sm' as const,
    'lg': 'md' as const
  }[size];

  const spacing = {
    'sm': 'space-y-1',
    'md': 'space-y-2',
    'lg': 'space-y-3'
  }[size];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange && !disabled) {
      onChange(e.target.checked);
    }
  };

  const checkboxClasses = [
    sizeClasses,
    'relative flex items-center justify-center rounded border-2 transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-design-primary/20',
    checked || indeterminate
      ? 'bg-design-primary border-design-primary text-primary-dark'
      : 'bg-background border-border hover:border-design-primary/50',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
  ].filter(Boolean).join(' ');

  return (
    <div className={`flex items-start space-x-3 ${className}`} {...props}>
      <div className="relative">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
        />
        <label
          htmlFor={checkboxId}
          className={checkboxClasses}
        >
          {checked && !indeterminate && (
            <Icon name="Check" size={iconSize} />
          )}
          {indeterminate && (
            <Icon name="Minus" size={iconSize} />
          )}
        </label>
      </div>
      
      {(label || description) && (
        <div className={`flex-1 ${spacing}`}>
          {label && (
            <label htmlFor={checkboxId}>
              <Typography 
                variant="p" 
                size={size === 'lg' ? 'md' : 'sm'} 
                weight="medium"
                color={disabled ? 'muted' : 'inherit'}
                className="cursor-pointer"
              >
                {label}
              </Typography>
            </label>
          )}
          {description && (
            <Typography 
              variant="p" 
              size={size === 'lg' ? 'sm' : 'xs'} 
              color="muted"
            >
              {description}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox;