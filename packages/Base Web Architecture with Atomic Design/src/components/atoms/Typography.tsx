import React from 'react';

export interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'caption' | 'overline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'regular' | 'medium' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'inherit';
  align?: 'left' | 'center' | 'right';
  className?: string;
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'p',
  size,
  weight,
  color = 'inherit',
  align = 'left',
  className = '',
  children,
  ...props
}) => {
  // Map variants to appropriate HTML elements
  const getElementType = (variant: string): keyof JSX.IntrinsicElements => {
    switch (variant) {
      case 'h1': return 'h1';
      case 'h2': return 'h2';
      case 'h3': return 'h3';
      case 'h4': return 'h4';
      case 'p': return 'p';
      case 'caption': return 'span'; // Use span instead of caption for proper DOM nesting
      case 'overline': return 'span'; // Use span instead of overline for proper DOM nesting
      default: return 'p';
    }
  };

  const elementType = getElementType(variant);

  const sizeClasses = size ? {
    'xs': 'text-xs',
    'sm': 'text-sm', 
    'md': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  }[size] : '';

  const weightClasses = weight ? {
    'regular': 'font-normal',
    'medium': 'font-medium',
    'bold': 'font-bold'
  }[weight] : '';

  const colorClasses = {
    'primary': 'text-design-primary',
    'secondary': 'text-design-secondary', 
    'muted': 'text-muted-foreground',
    'inherit': ''
  }[color];

  const alignClasses = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right'
  }[align];

  // Add variant-specific styling
  const variantClasses = {
    'h1': '',
    'h2': '',
    'h3': '',
    'h4': '',
    'p': '',
    'caption': 'text-xs opacity-75', // Small, subtle text for captions
    'overline': 'text-xs uppercase tracking-wide opacity-75' // Small, uppercase for overlines
  }[variant];

  const classes = [
    sizeClasses,
    weightClasses,
    colorClasses,
    alignClasses,
    variantClasses,
    className
  ].filter(Boolean).join(' ');

  return React.createElement(
    elementType,
    {
      className: classes,
      ...props
    },
    children
  );
};

export default Typography;