/**
 * Card Adapter Component
 *
 * Transition component that allows gradual migration from shadcn/ui Card
 * to Alkitu Design System Card while maintaining compatibility.
 *
 * Usage:
 * - Set migrated={true} to use Design System Card
 * - Set migrated={false} or omit to use existing shadcn Card
 * - Gradually migrate components by changing this flag
 */

import React from 'react';
import {
  Card as ShadcnCard,
  CardContent as ShadcnCardContent,
  CardDescription as ShadcnCardDescription,
  CardFooter as ShadcnCardFooter,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
} from '@/components/ui/card';
import DSCard, { type CardProps as DSCardProps, } from '../molecules/Card';

// Re-export types for compatibility
export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  migrated?: boolean;
  children?: React.ReactNode;
  // DS Card specific props (when migrated=true)
  variant?: 'square' | 'vertical' | 'horizontal';
  title?: string;
  subtitle?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
  icon?: {
    name: string;
    color?: 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error';
  };
  location?: {
    icon: string;
    text: string;
  };
  metadata?: {
    label: string;
    value: string;
  }[];
  onClick?: () => void;
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ migrated = false, children, title, ...props }, ref) => {
    if (migrated && title) {
      // Use Design System Card with structured props (note: DSCard doesn't support ref)
      console.log('Using migrated Design System Card');
      const { title: titleProp, ...dsProps } = props as any;
      return <DSCard {...(dsProps as DSCardProps)} />;
    }

    // Use existing shadcn Card (default behavior)
    return (
      <ShadcnCard ref={ref} {...props}>
        {children}
      </ShadcnCard>
    );
  },
);

Card.displayName = 'Card';

// Re-export shadcn Card sub-components for compatibility
export const CardContent = ShadcnCardContent;
export const CardDescription = ShadcnCardDescription;
export const CardFooter = ShadcnCardFooter;
export const CardHeader = ShadcnCardHeader;
export const CardTitle = ShadcnCardTitle;

export default Card;
