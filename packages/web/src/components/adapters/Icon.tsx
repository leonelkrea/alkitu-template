/**
 * Icon Adapter Component
 *
 * Transition component that allows gradual migration from direct Lucide imports
 * to Alkitu Design System Icon while maintaining compatibility.
 *
 * Usage:
 * - Set migrated={true} to use Design System Icon
 * - Set migrated={false} or omit to use direct Lucide imports
 * - Gradually migrate components by changing this flag
 */

import React from 'react';
import * as LucideIcons from 'lucide-react';
import DSIcon, { type IconProps as DSIconProps } from '../atoms/Icon';

// Re-export types for compatibility
export type IconProps = React.SVGProps<SVGSVGElement> & {
  migrated?: boolean;
  // DS Icon specific props (when migrated=true)
  name?: keyof typeof LucideIcons;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?:
    | 'primary'
    | 'secondary'
    | 'muted'
    | 'success'
    | 'warning'
    | 'error'
    | 'inherit';
};

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ migrated = false, name, size, color, className, ...props }, ref) => {
    if (migrated && name) {
      // Use Design System Icon (note: DSIcon doesn't support ref)
      console.log(`Using migrated Design System Icon: ${name}`);
      return (
        <DSIcon
          name={name}
          size={size}
          color={color}
          className={className}
          {...props}
        />
      );
    }

    // For backward compatibility when migrated=false or when used directly with Lucide
    // This allows existing usage like <CheckCircle className="h-4 w-4" /> to work
    if (name) {
      const IconComponent = LucideIcons[name] as React.ComponentType<any>;
      if (IconComponent) {
        return <IconComponent ref={ref} className={className} {...props} />;
      }
    }

    // Return null if no valid icon name provided
    return null;
  },
);

Icon.displayName = 'Icon';

export default Icon;
