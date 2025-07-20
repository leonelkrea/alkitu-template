import React from 'react';
import Icon from './Icon';
import Spinner from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  onClick,
  ...props
}, ref) => {
  const variantClasses = {
    'primary': 'bg-design-primary text-primary-dark border-design-primary hover:bg-design-primary/90 focus:ring-design-primary/20 rounded-full',
    'secondary': 'bg-design-secondary text-white border-design-secondary hover:bg-design-secondary/90 focus:ring-design-secondary/20',
    'outline': 'bg-transparent text-foreground border-border hover:bg-accent hover:text-accent-foreground focus:ring-ring/20',
    'ghost': 'bg-transparent text-foreground border-transparent hover:bg-accent hover:text-accent-foreground focus:ring-ring/20',
    'destructive': 'bg-error text-white border-error hover:bg-error/90 focus:ring-error/20'
  }[variant];

  const sizeClasses = {
    'sm': 'h-8 px-3 text-xs',
    'md': 'h-10 px-4 text-sm',
    'lg': 'h-12 px-6 text-base'
  }[size];

  const iconSize = {
    'sm': 'sm' as const,
    'md': 'sm' as const,
    'lg': 'md' as const
  }[size];

  const isDisabled = disabled || loading;

  const classes = [
    'inline-flex items-center justify-center rounded-lg border font-medium transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-1',
    'disabled:opacity-50 disabled:pointer-events-none',
    variantClasses,
    sizeClasses,
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <Spinner size="sm" color="currentColor" className="mr-2" />
          {children}
        </>
      );
    }

    if (icon) {
      const iconElement = <Icon name={icon as any} size={iconSize} />;
      
      return iconPosition === 'left' ? (
        <>
          {iconElement}
          <span className="ml-2">{children}</span>
        </>
      ) : (
        <>
          <span className="mr-2">{children}</span>
          {iconElement}
        </>
      );
    }

    return children;
  };

  return (
    <button
      ref={ref}
      className={classes}
      disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      {renderContent()}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;