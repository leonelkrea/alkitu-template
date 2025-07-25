/**
 * Theme Builder - Common Types
 * Shared types used across the theme builder system
 */

import { ReactNode } from 'react';

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Generic callback function type
 */
export type Callback<T = void> = () => T;

/**
 * Generic event handler type
 */
export type EventHandler<T = any> = (event: T) => void;

/**
 * Generic change handler type
 */
export type ChangeHandler<T = any> = (value: T) => void;

/**
 * Async callback function type
 */
export type AsyncCallback<T = void> = () => Promise<T>;

// ============================================================================
// COMPONENT TYPES
// ============================================================================

/**
 * Base component props
 */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

/**
 * Component with loading state
 */
export interface LoadableComponent {
  isLoading?: boolean;
  loadingText?: string;
}

/**
 * Component with error state
 */
export interface ErrorableComponent {
  error?: string | null;
  onErrorClear?: Callback;
}

/**
 * Component with disabled state
 */
export interface DisableableComponent {
  disabled?: boolean;
  disabledReason?: string;
}

/**
 * Complete component state interface
 */
export interface ComponentState extends LoadableComponent, ErrorableComponent, DisableableComponent {
  isDirty?: boolean;
  isValid?: boolean;
}

// ============================================================================
// DATA HANDLING TYPES
// ============================================================================

/**
 * Generic API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Sort information
 */
export interface SortInfo {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Filter information
 */
export interface FilterInfo {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
  value: any;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Validation rule
 */
export interface ValidationRule<T = any> {
  name: string;
  validator: (value: T) => boolean | string;
  message?: string;
  isRequired?: boolean;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Field validation state
 */
export interface FieldValidation {
  value: any;
  isValid: boolean;
  errors: string[];
  isDirty: boolean;
  isTouched: boolean;
}

// ============================================================================
// RESPONSIVE DESIGN TYPES
// ============================================================================

/**
 * Breakpoint definitions
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'tv';

/**
 * Responsive value type
 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Media query information
 */
export interface MediaQuery {
  breakpoint: Breakpoint;
  minWidth: number;
  maxWidth?: number;
  isActive: boolean;
}

// ============================================================================
// FILE HANDLING TYPES
// ============================================================================

/**
 * File upload status
 */
export type FileUploadStatus = 'idle' | 'uploading' | 'success' | 'error';

/**
 * File information
 */
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  content?: string;
}

/**
 * File upload result
 */
export interface FileUploadResult {
  success: boolean;
  file: FileInfo;
  error?: string;
  progress?: number;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * Feature flags
 */
export interface FeatureFlags {
  enableMaterialDesign?: boolean;
  enableAdvancedColors?: boolean;
  enableBrandConfiguration?: boolean;
  enableThemeExport?: boolean;
  enableResponsivePreview?: boolean;
}

/**
 * Performance settings
 */
export interface PerformanceSettings {
  debounceDelay?: number;
  throttleDelay?: number;
  maxHistoryEntries?: number;
  enableVirtualization?: boolean;
}

/**
 * Accessibility settings
 */
export interface AccessibilitySettings {
  highContrast?: boolean;
  reducedMotion?: boolean;
  screenReaderOptimized?: boolean;
  keyboardNavigationEnabled?: boolean;
}

/**
 * Application configuration
 */
export interface AppConfig {
  features: FeatureFlags;
  performance: PerformanceSettings;
  accessibility: AccessibilitySettings;
  debug?: boolean;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

/**
 * Custom event data
 */
export interface CustomEventData<T = any> {
  type: string;
  data: T;
  timestamp: number;
  source?: string;
}

/**
 * Theme builder events
 */
export type ThemeBuilderEvent = 
  | { type: 'THEME_CHANGED'; data: { themeId: string } }
  | { type: 'COLOR_CHANGED'; data: { colorName: string; value: string } }
  | { type: 'MODE_TOGGLED'; data: { mode: 'light' | 'dark' } }
  | { type: 'EXPORT_STARTED'; data: { format: string } }
  | { type: 'EXPORT_COMPLETED'; data: { format: string; success: boolean } }
  | { type: 'IMPORT_STARTED'; data: { fileName: string } }
  | { type: 'IMPORT_COMPLETED'; data: { fileName: string; success: boolean } };

// ============================================================================
// TYPOGRAPHY TYPES
// ============================================================================

/**
 * Typography style properties
 */
export interface TypographyStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle?: string;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing?: number;
  textTransform?: string;
  textDecoration?: string;
}

/**
 * Typography configuration for different text elements
 */
export interface TypographyConfig {
  h1: TypographyStyle;
  h2: TypographyStyle;
  h3: TypographyStyle;
  h4: TypographyStyle;
  h5: TypographyStyle;
  base: TypographyStyle;
  accent: TypographyStyle;
  quote: TypographyStyle;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

/**
 * Usage analytics data
 */
export interface UsageAnalytics {
  action: string;
  category: 'theme' | 'color' | 'brand' | 'export' | 'import';
  label?: string;
  value?: number;
  timestamp: Date;
  sessionId?: string;
  userId?: string;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
  timestamp: Date;
}