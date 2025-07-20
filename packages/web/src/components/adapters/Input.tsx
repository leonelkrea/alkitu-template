/**
 * Input Adapter Component
 * 
 * Transition component that allows gradual migration from shadcn/ui Input
 * to Alkitu Design System Input while maintaining compatibility.
 * 
 * Usage:
 * - Set migrated={true} to use Design System Input
 * - Set migrated={false} or omit to use existing shadcn Input
 * - Gradually migrate components by changing this flag
 */

import React from 'react';
import { Input as ShadcnInput, type InputProps as ShadcnInputProps } from '@/components/ui/input';
import { Input as DSInput, type InputProps as DSInputProps } from '@alkitu/design-system/components/atoms/Input';

// Re-export types for compatibility
export type InputProps = (ShadcnInputProps | DSInputProps) & {
  migrated?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ migrated = false, ...props }, ref) => {
    if (migrated) {
      // Use Design System Input
      console.log('Using migrated Design System Input');
      return <DSInput ref={ref} {...(props as DSInputProps)} />;
    }
    
    // Use existing shadcn Input
    return <ShadcnInput ref={ref} {...(props as ShadcnInputProps)} />;
  }
);

Input.displayName = 'Input';

export default Input;