import React from 'react';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'neutral' | 'white' | 'currentColor';
  thickness?: 'thin' | 'medium' | 'thick';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  thickness = 'medium',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    'xs': 'w-3 h-3',
    'sm': 'w-4 h-4',
    'md': 'w-6 h-6',
    'lg': 'w-8 h-8',
    'xl': 'w-12 h-12'
  }[size];

  const colorClasses = color === 'currentColor' ? 'text-current' : {
    'primary': 'text-design-primary',
    'secondary': 'text-design-secondary',
    'neutral': 'text-neutral-600',
    'white': 'text-white'
  }[color];

  const thicknessClasses = {
    'thin': 'border',
    'medium': 'border-2',
    'thick': 'border-4'
  }[thickness];

  const classes = [
    sizeClasses,
    colorClasses,
    thicknessClasses,
    'inline-block animate-spin rounded-full border-solid border-current border-r-transparent',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;