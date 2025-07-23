import React from 'react';
import * as LucideIcons from 'lucide-react';

export interface IconProps {
  name: keyof typeof LucideIcons;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error' | 'inherit';
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'inherit',
  className = '',
  ...props
}) => {
  const IconComponent = LucideIcons[name] as React.ComponentType<any>;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide React`);
    // Fallback a un icono genérico si no se encuentra
    const FallbackIcon = LucideIcons.Circle as React.ComponentType<any>;
    return (
      <FallbackIcon 
        size={typeof size === 'number' ? size : { 'xs': 12, 'sm': 16, 'md': 20, 'lg': 24, 'xl': 32 }[size]}
        className={[color !== 'inherit' ? { 'primary': 'text-design-primary', 'secondary': 'text-design-secondary', 'success': 'text-success', 'warning': 'text-warning', 'error': 'text-error', 'muted': 'text-muted-foreground' }[color] : '', className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  }

  const sizeValue = typeof size === 'number' ? size : {
    'xs': 12,
    'sm': 16,
    'md': 20,
    'lg': 24,
    'xl': 32
  }[size];

  const colorClasses = {
    'primary': 'text-design-primary',
    'secondary': 'text-design-secondary',
    'success': 'text-success',
    'warning': 'text-warning',
    'error': 'text-error',
    'muted': 'text-muted-foreground',
    'inherit': ''
  }[color];

  const classes = [colorClasses, className].filter(Boolean).join(' ');

  return (
    <IconComponent 
      size={sizeValue}
      className={classes}
      {...props}
    />
  );
};

export default Icon;