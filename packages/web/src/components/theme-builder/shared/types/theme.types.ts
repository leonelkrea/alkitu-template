/**
 * Theme Builder - Theme Related Types
 * Extracted from ThemeEditor.tsx as part of Clean Architecture refactor
 */

import { ReactNode } from 'react';

// ============================================================================
// THEME CORE TYPES
// ============================================================================

/**
 * Configuration for individual colors in theme
 */
export interface ColorConfig {
  name: string;
  displayName: string;
  value: string;
  description: string;
  linkedTo?: string; // Optional: name of color this is linked to
  isLinked?: boolean; // Whether this color is currently linked
  defaultLinkTarget?: string; // Default color to link to (e.g., 'primary' for 'primary-foreground')
}

/**
 * Section grouping related colors together
 */
export interface ColorSection {
  title: string;
  colors: ColorConfig[];
  expanded?: boolean;
}

/**
 * Theme mode - light or dark
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Active tab in theme editor
 */
export type ThemeEditorTab = 'colors' | 'typography' | 'brand' | 'shadow' | 'border' | 'spacing';

/**
 * Color sub-tab options
 */
export type ColorSubTab = 'shadcn-current' | 'material-design' | 'code';

/**
 * Export format options
 */
export type ExportFormat = 'json' | 'css';

// ============================================================================
// COLOR MANAGEMENT TYPES
// ============================================================================

/**
 * Color linking state for individual colors
 */
export interface ColorLinkState {
  linkedTo?: string;
  isLinked: boolean;
}

/**
 * Complete color linking state for all colors
 */
export type ColorLinksState = Record<string, ColorLinkState>;

/**
 * Color values for light/dark modes
 */
export type ColorValues = Record<string, string>;

// ============================================================================
// BRAND TYPES
// ============================================================================

/**
 * Brand configuration interface
 */
export interface BrandConfig {
  // Text Configuration
  primaryText: string;
  secondaryText: string;
  
  // Text Colors
  primaryTextColor: string;
  primaryTextColorLinked: boolean;
  primaryTextColorLinkedTo?: string;
  
  secondaryTextColor: string;
  secondaryTextColorLinked: boolean;
  secondaryTextColorLinkedTo?: string;
  
  // Icon Configuration
  iconBackgroundColor: string;
  iconBackgroundColorLinked: boolean;
  iconBackgroundColorLinkedTo?: string;
  
  iconColor: string;
  iconColorLinked: boolean;
  iconColorLinkedTo?: string;
  
  // SVG Configuration
  customSvg?: string;
  monochromeMode: 'none' | 'white' | 'black';
}

/**
 * SVG upload status
 */
export type SVGUploadStatus = 'idle' | 'success' | 'error' | 'editing';

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

/**
 * Props for collapsible control sections
 */
export interface ControlSectionProps {
  title: string;
  children: ReactNode;
  expanded?: boolean;
  className?: string;
}

/**
 * Props for enhanced color picker component
 */
export interface EnhancedColorPickerProps {
  name: string;
  color: string;
  onChange: (value: string) => void;
  label: string;
  description?: string;
}

/**
 * Props for color linking controls
 */
export interface ColorLinkingControlsProps {
  colorName: string;
  isLinked: boolean;
  linkedTo?: string;
  onLinkTo: (targetColor: string) => void;
  onUnlink: () => void;
  availableColors: string[];
  defaultLinkTarget?: string;
}

/**
 * Props for brand editor component
 */
export interface BrandEditorProps {
  isDarkMode: boolean;
  darkColors: ColorValues;
  lightColors: ColorValues;
  getAllColorNames: () => string[];
}

/**
 * Props for SVG cropper component
 */
export interface SVGCropperProps {
  svgContent: string;
  onSave: (croppedSvg: string) => void;
  onCancel: () => void;
}

// ============================================================================
// THEME DATA TYPES
// ============================================================================

/**
 * Complete theme data structure
 */
export interface ThemeData {
  id?: string;
  name?: string;
  lightColors?: ColorValues;
  darkColors?: ColorValues;
  typography?: any;
  brandConfig?: BrandConfig;
  companyId?: string;
  createdById?: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
  
  // Legacy support
  lightModeConfig?: ColorValues;
  darkModeConfig?: ColorValues;
}

/**
 * Theme export data
 */
export interface ThemeExportData {
  name: string;
  lightModeConfig: ColorValues;
  darkModeConfig: ColorValues;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Crop area for image cropping
 */
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * File upload result
 */
export interface FileUploadResult {
  success: boolean;
  content?: string;
  error?: string;
}