import React from 'react';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';

export interface IconButtonProps extends Omit<React.ComponentProps<typeof Button>, 'icon' | 'children'> {
  icon: string;
  tooltip?: string;
  iconOnly?: boolean;
  children?: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  tooltip,
  iconOnly = false,
  children,
  size = 'md',
  variant = 'outline',
  className = '',
  ...props
}, ref) => {
  if (iconOnly) {
    const sizeClasses = {
      'sm': 'w-8 h-8 min-w-8 min-h-8',
      'md': 'w-10 h-10 min-w-10 min-h-10',
      'lg': 'w-12 h-12 min-w-12 min-h-12'
    }[size];

    const iconSize = {
      'sm': 'sm' as const,
      'md': 'md' as const,
      'lg': 'lg' as const
    }[size];

    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-lg transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-design-primary/20
          flex-shrink-0
          ${sizeClasses}
          ${variant === 'primary' ? 'bg-design-primary text-primary-dark hover:bg-design-primary/90' : ''}
          ${variant === 'secondary' ? 'bg-design-secondary text-white hover:bg-design-secondary/90' : ''}
          ${variant === 'outline' ? 'bg-transparent border border-border hover:bg-accent' : ''}
          ${variant === 'ghost' ? 'bg-transparent hover:bg-accent' : ''}
          ${variant === 'destructive' ? 'bg-error text-white hover:bg-error/90' : ''}
          disabled:opacity-50 disabled:pointer-events-none
          ${className}
        `}
        title={tooltip}
        {...props}
      >
        <div className="flex items-center justify-center">
          <Icon name={icon as any} size={iconSize} />
        </div>
      </button>
    );
  }

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      icon={icon}
      iconPosition="left"
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;