import React from 'react';

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const variantClasses = {
    'primary': 'bg-design-primary text-primary-dark border-design-primary/20',
    'secondary': 'bg-design-secondary text-white border-design-secondary/20',
    'success': 'bg-success text-white border-success/20',
    'warning': 'bg-warning text-primary-dark border-warning/20',
    'error': 'bg-error text-white border-error/20',
    'neutral': 'bg-neutral-200 text-neutral-900 border-neutral-300'
  }[variant];

  const sizeClasses = {
    'sm': 'px-2 py-1 text-xs',
    'md': 'px-3 py-1 text-sm',
    'lg': 'px-4 py-2 text-base'
  }[size];

  const classes = [
    'inline-flex items-center justify-center rounded-full border font-medium transition-colors',
    variantClasses,
    sizeClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;