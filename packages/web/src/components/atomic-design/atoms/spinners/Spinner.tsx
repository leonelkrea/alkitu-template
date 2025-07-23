import { cn } from '@/lib/utils';
import React from 'react';
import type { SpinnerProps, SpinnerSize, SpinnerVariant } from './Spinner.types';

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const variantClasses: Record<SpinnerVariant, string> = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary',
};

const baseClasses = 'animate-spin';

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  themeOverride,
  useSystemColors = true,
  ...props
}) => {
  const sizeClass = sizeClasses[size];
  const variantClass = useSystemColors ? variantClasses[variant] : '';

  return (
    <svg
      className={cn(baseClasses, sizeClass, variantClass, className)}
      style={themeOverride}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export default Spinner;