/**
 * Theme Builder - File Utilities
 * Pure functions for file handling and processing
 * Extracted from ThemeEditor.tsx as part of Clean Architecture refactor
 */

import type { 
  FileInfo, 
  FileUploadResult, 
  ThemeData,
  ValidationResult 
} from '../types';

// ============================================================================
// FILE VALIDATION
// ============================================================================

/**
 * Validates if file is a supported theme file
 */
export function isValidThemeFile(file: File): ValidationResult {
  const errors: string[] = [];

  // Check file extension
  const allowedExtensions = ['.json', '.css'];
  const fileExtension = getFileExtension(file.name);
  
  if (!allowedExtensions.includes(fileExtension)) {
    errors.push(`Unsupported file type. Allowed: ${allowedExtensions.join(', ')}`);
  }

  // Check file size (max 5MB for theme files)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    errors.push(`File too large. Maximum size: ${formatFileSize(maxSize)}`);
  }

  // Check if file is empty
  if (file.size === 0) {
    errors.push('File is empty');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates if file is a supported SVG file
 */
export function isValidSVGFile(file: File): ValidationResult {
  const errors: string[] = [];

  // Check MIME type
  if (!file.type.includes('svg')) {
    errors.push('File must be an SVG image');
  }

  // Check file extension
  const fileExtension = getFileExtension(file.name);
  if (fileExtension !== '.svg') {
    errors.push('File must have .svg extension');
  }

  // Check file size (max 1MB for SVG files)
  const maxSize = 1024 * 1024; // 1MB
  if (file.size > maxSize) {
    errors.push(`SVG file too large. Maximum size: ${formatFileSize(maxSize)}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// ============================================================================
// FILE PROCESSING
// ============================================================================

/**
 * Reads file content as text
 */
export async function readFileAsText(file: File): Promise<FileUploadResult> {
  try {
    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to read file as text'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });

    const fileInfo: FileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      content
    };

    return {
      success: true,
      file: fileInfo
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error reading file'
    };
  }
}

/**
 * Processes SVG file content
 */
export async function processSVGFile(file: File): Promise<FileUploadResult> {
  const validation = isValidSVGFile(file);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errors.join(', ')
    };
  }

  try {
    const fileResult = await readFileAsText(file);
    if (!fileResult.success || !fileResult.file?.content) {
      return fileResult;
    }

    // Parse and validate SVG content
    const parser = new DOMParser();
    const doc = parser.parseFromString(fileResult.file.content, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) {
      return {
        success: false,
        error: 'Invalid SVG file: No SVG element found'
      };
    }

    // Extract SVG content (inner HTML)
    svgElement.setAttribute('viewBox', '0 0 48 48');
    const processedContent = svgElement.innerHTML;

    return {
      success: true,
      file: {
        ...fileResult.file,
        content: processedContent
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process SVG file'
    };
  }
}

/**
 * Parses theme file content (JSON or CSS)
 */
export async function parseThemeFile(file: File): Promise<{
  success: boolean;
  theme?: ThemeData;
  error?: string;
}> {
  const validation = isValidThemeFile(file);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errors.join(', ')
    };
  }

  try {
    const fileResult = await readFileAsText(file);
    if (!fileResult.success || !fileResult.file?.content) {
      return {
        success: false,
        error: fileResult.error || 'Failed to read file'
      };
    }

    const fileExtension = getFileExtension(file.name);
    let themeData: ThemeData;

    if (fileExtension === '.json') {
      themeData = parseJSONTheme(fileResult.file.content);
    } else if (fileExtension === '.css') {
      themeData = parseCSSTheme(fileResult.file.content);
    } else {
      return {
        success: false,
        error: 'Unsupported file format'
      };
    }

    return {
      success: true,
      theme: themeData
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse theme file'
    };
  }
}

// ============================================================================
// FILE CREATION
// ============================================================================

/**
 * Creates a downloadable file from content
 */
export function createDownloadableFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up URL
  URL.revokeObjectURL(url);
}

/**
 * Generates JSON theme file content
 */
export function generateJSONThemeFile(theme: ThemeData): string {
  const exportData = {
    name: theme.name,
    version: '1.0.0',
    lightModeConfig: theme.lightModeConfig,
    darkModeConfig: theme.darkModeConfig,
    metadata: {
      createdAt: new Date().toISOString(),
      generator: 'Alkitu Theme Builder'
    }
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Generates CSS theme file content
 */
export function generateCSSThemeFile(theme: ThemeData): string {
  const { name, lightModeConfig, darkModeConfig } = theme;
  
  let css = `/* ${name} Theme */\n`;
  css += `/* Generated by Alkitu Theme Builder */\n\n`;

  // Light mode variables
  css += ':root {\n';
  Object.entries(lightModeConfig).forEach(([key, value]) => {
    css += `  --${key}: ${value};\n`;
  });
  css += '}\n\n';

  // Dark mode variables
  css += '[data-theme="dark"] {\n';
  Object.entries(darkModeConfig).forEach(([key, value]) => {
    css += `  --${key}: ${value};\n`;
  });
  css += '}\n\n';

  // Media query for system preference
  css += '@media (prefers-color-scheme: dark) {\n';
  css += '  :root {\n';
  Object.entries(darkModeConfig).forEach(([key, value]) => {
    css += `    --${key}: ${value};\n`;
  });
  css += '  }\n';
  css += '}\n';

  return css;
}

// ============================================================================
// FILE PARSING HELPERS
// ============================================================================

/**
 * Parses JSON theme file content
 */
function parseJSONTheme(content: string): ThemeData {
  try {
    const parsed = JSON.parse(content);
    
    // Validate structure
    if (!parsed.lightModeConfig || !parsed.darkModeConfig) {
      throw new Error('Invalid theme structure: missing lightModeConfig or darkModeConfig');
    }

    return {
      name: parsed.name || 'Imported Theme',
      lightModeConfig: parsed.lightModeConfig,
      darkModeConfig: parsed.darkModeConfig,
    };
  } catch (error) {
    throw new Error(`Failed to parse JSON theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Parses CSS theme file content
 */
function parseCSSTheme(content: string): ThemeData {
  const lightColors: Record<string, string> = {};
  const darkColors: Record<string, string> = {};

  // Extract CSS variables from :root
  const rootMatch = content.match(/:root\s*{([^}]*)}/);
  if (rootMatch) {
    const rootContent = rootMatch[1];
    const variables = extractCSSVariables(rootContent);
    Object.assign(lightColors, variables);
  }

  // Extract CSS variables from dark theme selector
  const darkMatch = content.match(/\[data-theme="dark"\]\s*{([^}]*)}/) || 
                   content.match(/@media\s*\(prefers-color-scheme:\s*dark\)\s*{\s*:root\s*{([^}]*)}/);
  if (darkMatch) {
    const darkContent = darkMatch[1];
    const variables = extractCSSVariables(darkContent);
    Object.assign(darkColors, variables);
  }

  // If no dark colors found, use light colors as fallback
  if (Object.keys(darkColors).length === 0) {
    Object.assign(darkColors, lightColors);
  }

  return {
    name: 'Imported CSS Theme',
    lightModeConfig: lightColors,
    darkModeConfig: darkColors,
  };
}

/**
 * Extracts CSS variables from CSS content
 */
function extractCSSVariables(cssContent: string): Record<string, string> {
  const variables: Record<string, string> = {};
  const variableRegex = /--([^:]+):\s*([^;]+);/g;
  
  let match;
  while ((match = variableRegex.exec(cssContent)) !== null) {
    const [, name, value] = match;
    variables[name.trim()] = value.trim();
  }
  
  return variables;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice(filename.lastIndexOf('.')).toLowerCase();
}

/**
 * Formats file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generates safe filename from theme name
 */
export function generateSafeFilename(themeName: string, extension: string): string {
  const safeName = themeName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `${safeName}-theme${extension}`;
}

/**
 * Checks if filename is safe for download
 */
export function isSafeFilename(filename: string): boolean {
  // Check for dangerous characters or patterns
  const dangerousPatterns = [
    /[<>:"/\\|?*]/, // Windows forbidden characters
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i, // Windows reserved names
    /^\./,  // Hidden files
    /\.\./, // Directory traversal
  ];

  return !dangerousPatterns.some(pattern => pattern.test(filename));
}