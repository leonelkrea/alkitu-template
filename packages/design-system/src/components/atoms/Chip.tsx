import React from 'react';
import Icon from './Icon';

export interface ChipProps {
  label?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  removable?: boolean;
  disabled?: boolean;
  icon?: string;
  clickable?: boolean;
  className?: string;
  children?: React.ReactNode;
  onRemove?: () => void;
  onClick?: () => void;
}

const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'default',
  size = 'md',
  removable = false,
  disabled = false,
  icon,
  clickable = false,
  className = '',
  children,
  onRemove,
  onClick,
  ...restProps
}) => {
  // Extraer props que no deben pasar al DOM
  const {
    label: _label,
    variant: _variant,
    size: _size,
    removable: _removable,
    disabled: _disabled,
    icon: _icon,
    clickable: _clickable,
    onRemove: _onRemove,
    onClick: _onClick,
    ...domProps
  } = { label, variant, size, removable, disabled, icon, clickable, onRemove, onClick, ...restProps };

  const variantClasses = {
    'default': 'bg-neutral-200 text-neutral-900 border-neutral-300 hover:bg-neutral-300',
    'primary': 'bg-design-primary/10 text-design-primary border-design-primary/20 hover:bg-design-primary/20',
    'secondary': 'bg-design-secondary/10 text-design-secondary border-design-secondary/20 hover:bg-design-secondary/20',
    'success': 'bg-success/10 text-success border-success/20 hover:bg-success/20',
    'warning': 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
    'error': 'bg-error/10 text-error border-error/20 hover:bg-error/20',
    'neutral': 'bg-neutral-300 text-neutral-800 border-neutral-400 hover:bg-neutral-400'
  }[variant];

  const sizeClasses = {
    'xs': 'h-5 px-2 text-xs',
    'sm': 'h-6 px-2 text-xs',
    'md': 'h-7 px-3 text-sm',
    'lg': 'h-8 px-4 text-base'
  }[size];

  const iconSize = {
    'xs': 'xs' as const,
    'sm': 'xs' as const,
    'md': 'sm' as const,
    'lg': 'md' as const
  }[size];

  const isInteractive = !disabled && (onClick || removable || clickable);
  const content = children || label;

  const classes = [
    'inline-flex items-center space-x-1 rounded-full border font-medium transition-all duration-200',
    sizeClasses,
    variantClasses,
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    isInteractive ? 'cursor-pointer' : '',
    clickable && !disabled ? 'hover:shadow-sm active:scale-95' : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onRemove) {
      onRemove();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (clickable && !disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick(e as any);
    }
  };

  // Solo pasar props válidas de HTML al elemento span
  const validDomProps = Object.fromEntries(
    Object.entries(domProps).filter(([key]) => 
      !['label', 'variant', 'size', 'removable', 'disabled', 'icon', 'clickable', 'onRemove', 'onClick'].includes(key)
    )
  );

  return (
    <span 
      className={classes} 
      onClick={isInteractive ? handleClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable && !disabled ? 0 : undefined}
      onKeyDown={clickable && !disabled ? handleKeyDown : undefined}
      aria-disabled={disabled}
      {...validDomProps}
    >
      {icon && (
        <Icon name={icon as any} size={iconSize} />
      )}
      
      <span className="truncate">{content}</span>
      
      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          disabled={disabled}
          className="flex-shrink-0 ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors duration-200 focus:outline-none focus:bg-black/10"
          aria-label="Remove"
        >
          <Icon name="X" size={iconSize} />
        </button>
      )}
    </span>
  );
};

export default Chip;