/**
 * Theme Builder - Common Components Index
 * Central export point for reusable UI components
 * Part of Clean Architecture presentation layer
 */

// ============================================================================
// INPUT COMPONENTS
// ============================================================================
export {
  ColorInput,
  type ColorInputProps
} from './ColorInput';

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================
export {
  ExpandableSection,
  useExpandableSection,
  type ExpandableSectionProps
} from './ExpandableSection';

// ============================================================================
// FEEDBACK COMPONENTS
// ============================================================================
export {
  ValidationMessage,
  ErrorMessage,
  WarningMessage,
  SuccessMessage,
  InfoMessage,
  type ValidationMessageProps,
  type ValidationMessageType,
  type ValidationItem
} from './ValidationMessage';

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

/**
 * Common component prop types for consistency
 */
export interface CommonComponentProps {
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * Size variants used across components
 */
export type ComponentSize = 'sm' | 'md' | 'lg';

/**
 * Variant types used across components
 */
export type ComponentVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';