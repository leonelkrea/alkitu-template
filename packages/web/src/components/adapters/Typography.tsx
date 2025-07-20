/**
 * Typography Adapter Component
 * 
 * Transition component that allows gradual migration to
 * Alkitu Design System Typography while maintaining compatibility.
 * 
 * Usage:
 * - Set migrated={true} to use Design System Typography
 * - Set migrated={false} or omit to use standard HTML elements
 * - Gradually migrate components by changing this flag
 */

import React from 'react';
// Import DSTypography later when properly configured
// import { Typography as DSTypography } from '@alkitu/design-system';
import { cn } from '@/lib/utils';

export type TypographyProps = {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
  children: React.ReactNode;
  migrated?: boolean;
} & React.HTMLAttributes<HTMLElement>;

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ migrated = false, variant = 'p', className, children, ...props }, ref) => {
    if (migrated) {
      // TODO: Use Design System Typography when properly configured
      console.log('Using migrated typography (fallback to HTML for now)');
    }
    
    // Use standard HTML elements with basic styling
    const baseStyles = {
      h1: 'text-4xl font-bold',
      h2: 'text-3xl font-bold',
      h3: 'text-2xl font-semibold',
      h4: 'text-xl font-semibold',
      h5: 'text-lg font-medium',
      h6: 'text-base font-medium',
      p: 'text-base',
      span: 'text-base'
    };
    
    const Tag = variant as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
    
    return React.createElement(
      Tag,
      {
        ref: ref as any,
        className: cn(baseStyles[variant], className),
        ...props
      },
      children
    );
  }
);

Typography.displayName = 'Typography';

export default Typography;