/**
 * Theme Builder - Editor Components Index
 * Central export point for editor components
 * Part of Clean Architecture presentation layer
 */

// ============================================================================
// COLOR EDITOR
// ============================================================================
export {
  ColorEditor,
  type ColorEditorProps
} from './ColorEditor';

// ============================================================================
// BRAND EDITOR
// ============================================================================
export {
  BrandEditor,
  type BrandEditorProps
} from './BrandEditor';

// ============================================================================
// EDITOR UTILITIES
// ============================================================================

/**
 * Common editor props interface
 */
export interface BaseEditorProps {
  className?: string;
  onSave?: () => void | Promise<void>;
  onChange?: (data: any) => void;
  onExport?: (format: string) => void;
  disabled?: boolean;
}

/**
 * Editor modes
 */
export type EditorMode = 'edit' | 'preview' | 'code';

/**
 * Editor validation state
 */
export interface EditorValidationState {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}