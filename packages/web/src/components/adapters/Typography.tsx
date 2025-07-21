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
import DSTypography, {
  type TypographyProps as DSTypographyProps,
} from '@/components/atoms/Typography';
import { cn } from '@/lib/utils';

export type TypographyProps = {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'caption' | 'overline';
  size?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'light' | 'normal' | 'regular' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'inherit';
  align?: 'left' | 'center' | 'right';
  className?: string;
  children: React.ReactNode;
  migrated?: boolean;
} & React.HTMLAttributes<HTMLElement>;

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ migrated = false, variant = 'p', className, children, size, weight, color, align, ...props }, ref) => {
    if (migrated) {
      // Use Design System Typography (note: DSTypography doesn't support ref)
      console.log('Using migrated Design System Typography');
      return (
        <DSTypography
          variant={variant as DSTypographyProps['variant']}
          size={size as DSTypographyProps['size']}
          weight={weight as DSTypographyProps['weight']}
          color={color as DSTypographyProps['color']}
          align={align}
          className={className}
          {...props}
        >
          {children}
        </DSTypography>
      );
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
      span: 'text-base',
      caption: 'text-xs opacity-75',
      overline: 'text-xs uppercase tracking-wide opacity-75'
    };
    
    const Tag = variant as keyof typeof baseStyles;
    
    return React.createElement(
      Tag === 'caption' || Tag === 'overline' ? 'span' : Tag,
      {
        ref: ref as any,
        className: cn(baseStyles[variant as keyof typeof baseStyles], className),
        ...props
      },
      children
    );
  }
);

Typography.displayName = 'Typography';

export default Typography;