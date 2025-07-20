import React from 'react';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Typography from '../atoms/Typography';

export interface IconButtonMobileProps {
  icon: string;
  label?: string;
  tooltip?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  showLabel?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

const IconButtonMobile: React.FC<IconButtonMobileProps> = ({
  icon,
  label,
  tooltip,
  variant = 'ghost',
  size = 'md',
  iconOnly = true,
  showLabel = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  // Si showLabel es true, usar Button del design system con texto
  if (showLabel && label) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        loading={loading}
        onClick={onClick}
        icon={icon as any}
        iconPosition="left"
        className={`
          h-12 px-4 justify-start touch-manipulation
          ${className}
        `}
        {...props}
      >
        {label}
      </Button>
    );
  }

  // Versión icon-only usando Button del design system
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      className={`
        min-h-11 min-w-11 p-0
        touch-manipulation
        ${size === 'sm' ? 'h-11 w-11' : ''}
        ${size === 'md' ? 'h-12 w-12' : ''}
        ${size === 'lg' ? 'h-14 w-14' : ''}
        ${className}
      `}
      title={tooltip || label}
      aria-label={label || tooltip}
      {...props}
    >
      <Icon name={icon as any} size={size === 'lg' ? 'lg' : 'md'} />
    </Button>
  );
};

export default IconButtonMobile;