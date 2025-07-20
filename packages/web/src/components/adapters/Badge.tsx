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
import { Badge as ShadcnBadge, type BadgeProps as ShadcnBadgeProps } from '@/components/ui/badge';
// Import DSBadge later when properly configured
// import { Badge as DSBadge } from '@alkitu/design-system';

// Re-export types for compatibility
export type BadgeProps = ShadcnBadgeProps & {
  migrated?: boolean;
  children: React.ReactNode;
};

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ migrated = false, ...props }, ref) => {
    if (migrated) {
      // TODO: Use Design System Badge when properly configured
      // For now, use shadcn badge with a visual indicator
      console.log('Using migrated badge (fallback to shadcn for now)');
    }
    
    // Use existing shadcn Badge
    return <ShadcnBadge ref={ref} {...props} />;
  }
);

Badge.displayName = 'Badge';

export default Badge;