/**
 * Badge Adapter Component
 *
 * Transition component that allows gradual migration from shadcn/ui Badge
 * to Alkitu Design System Badge while maintaining compatibility.
 *
 * Usage:
 * - Set migrated={true} to use Design System Badge
 * - Set migrated={false} or omit to use existing shadcn Badge
 * - Gradually migrate components by changing this flag
 */

import React from 'react';
import { Badge as ShadcnBadge, badgeVariants } from '@/components/ui/badge';
import type { VariantProps } from 'class-variance-authority';
import DSBadge, {
  type BadgeProps as DSBadgeProps,
} from '@/components/atoms/Badge';

type ShadcnBadgeProps = React.ComponentProps<'span'> & 
  VariantProps<typeof badgeVariants> & { 
    asChild?: boolean; 
  };

// Re-export types for compatibility
export type BadgeProps = (ShadcnBadgeProps | DSBadgeProps) & {
  migrated?: boolean;
  children: React.ReactNode;
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ migrated = false, ...props }, ref) => {
    if (migrated) {
      // Use Design System Badge (note: DSBadge doesn't support ref)
      console.log('Using migrated Design System Badge');
      const { ref: _, ...dsProps } = props as any;
      return <DSBadge {...(dsProps as DSBadgeProps)} />;
    }

    // Use existing shadcn Badge
    return <ShadcnBadge ref={ref as any} {...(props as ShadcnBadgeProps)} />;
  },
);

Badge.displayName = 'Badge';

export default Badge;
