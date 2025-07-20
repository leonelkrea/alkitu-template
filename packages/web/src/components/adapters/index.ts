/**
 * Adapter Components Export
 * 
 * These adapters allow gradual migration from existing components
 * to the Alkitu Design System while maintaining compatibility.
 * 
 * Each adapter accepts a 'migrated' prop to switch between
 * old and new implementations.
 */

export { Button } from './Button';
export { Typography } from './Typography';
export { Input } from './Input';
export { Badge } from './Badge';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';
export { Icon } from './Icon';

// Re-export types
export type { ButtonProps } from './Button';
export type { TypographyProps } from './Typography';
export type { InputProps } from './Input';
export type { BadgeProps } from './Badge';
export type { CardProps } from './Card';
export type { IconProps } from './Icon';