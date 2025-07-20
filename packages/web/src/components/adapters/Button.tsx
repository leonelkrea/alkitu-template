/**
 * Button Adapter Component
 * 
 * Transition component that allows gradual migration from shadcn/ui Button
 * to Alkitu Design System Button while maintaining compatibility.
 * 
 * Usage:
 * - Set migrated={true} to use Design System Button
 * - Set migrated={false} or omit to use existing shadcn Button
 * - Gradually migrate components by changing this flag
 */

import React from 'react';
import { Button as ShadcnButton, type ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { Button as DSButton, type ButtonProps as DSButtonProps } from '@alkitu/design-system/components/atoms/Button';

// Re-export types for compatibility
export type ButtonProps = (ShadcnButtonProps | DSButtonProps) & {
  migrated?: boolean;
  children?: React.ReactNode;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ migrated = false, ...props }, ref) => {
    if (migrated) {
      // Use Design System Button
      console.log('Using migrated Design System Button');
      return <DSButton ref={ref} {...(props as DSButtonProps)} />;
    }
    
    // Use existing shadcn Button
    return <ShadcnButton ref={ref} {...(props as ShadcnButtonProps)} />;
  }
);

Button.displayName = 'Button';

export default Button;