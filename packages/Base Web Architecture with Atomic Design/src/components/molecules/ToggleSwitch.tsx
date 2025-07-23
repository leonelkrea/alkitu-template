import React from 'react';
import Checkbox from '../atoms/Checkbox';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';

export interface ToggleSwitchProps {
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: {
    checked: string;
    unchecked: string;
  };
  className?: string;
  onChange?: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  checked = false,
  disabled = false,
  label,
  description,
  size = 'md',
  icon,
  className = '',
  onChange,
  ...props
}) => {
  const switchId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  const sizeClasses = {
    'sm': 'w-8 h-4',
    'md': 'w-10 h-5',
    'lg': 'w-12 h-6'
  }[size];

  const thumbSize = {
    'sm': 'w-3 h-3',
    'md': 'w-4 h-4',
    'lg': 'w-5 h-5'
  }[size];

  const iconSize = {
    'sm': 'xs' as const,
    'md': 'sm' as const,
    'lg': 'md' as const
  }[size];

  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-start space-x-3 ${className}`} {...props}>
      {/* Toggle Switch */}
      <div className="relative">
        <input
          type="checkbox"
          id={switchId}
          checked={checked}
          disabled={disabled}
          onChange={handleToggle}
          className="sr-only"
        />
        <label
          htmlFor={switchId}
          className={`
            relative inline-block ${sizeClasses} cursor-pointer transition-all duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {/* Background */}
          <div 
            className={`
              w-full h-full rounded-full transition-all duration-200
              ${checked 
                ? 'bg-design-primary shadow-inner' 
                : 'bg-switch-background shadow-inner'
              }
            `}
          />
          
          {/* Thumb */}
          <div 
            className={`
              absolute top-0.5 ${thumbSize}
              bg-white rounded-full shadow-sm transition-all duration-200 flex items-center justify-center
              ${checked 
                ? size === 'sm' ? 'translate-x-4' : size === 'md' ? 'translate-x-5' : 'translate-x-6'
                : 'translate-x-0.5'
              }
            `}
          >
            {icon && (
              <Icon 
                name={(checked ? icon.checked : icon.unchecked) as any}
                size={iconSize}
                color={checked ? 'primary' : 'muted'}
              />
            )}
          </div>
        </label>
      </div>

      {/* Label and Description */}
      {(label || description) && (
        <div className="flex-1 space-y-1">
          {label && (
            <label htmlFor={switchId}>
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

export default ToggleSwitch;