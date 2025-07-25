/**
 * Theme Builder - Color Utilities
 * Pure functions for color manipulation and conversion
 * Extracted from ThemeEditor.tsx as part of Clean Architecture refactor
 */

import type { 
  ColorFormat, 
  ColorValidationResult, 
  OKLCHColor, 
  RGBColor, 
  HSLColor,
  ColorContrast 
} from '../types';

// ============================================================================
// COLOR VALIDATION
// ============================================================================

/**
 * Validates if a string is a valid color in any supported format
 */
export function isValidColor(color: string): ColorValidationResult {
  if (!color || typeof color !== 'string') {
    return { isValid: false, error: 'Color must be a non-empty string' };
  }

  const trimmedColor = color.trim();

  // Check HEX format
  if (isValidHex(trimmedColor)) {
    return { isValid: true, format: 'hex', normalizedValue: normalizeHex(trimmedColor) };
  }

  // Check RGB format
  if (isValidRgb(trimmedColor)) {
    return { isValid: true, format: 'rgb', normalizedValue: trimmedColor };
  }

  // Check HSL format
  if (isValidHsl(trimmedColor)) {
    return { isValid: true, format: 'hsl', normalizedValue: trimmedColor };
  }

  // Check OKLCH format
  if (isValidOklch(trimmedColor)) {
    return { isValid: true, format: 'oklch', normalizedValue: trimmedColor };
  }

  return { isValid: false, error: 'Invalid color format' };
}

/**
 * Validates HEX color format
 */
export function isValidHex(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
  return hexRegex.test(color);
}

/**
 * Validates RGB color format
 */
export function isValidRgb(color: string): boolean {
  const rgbRegex = /^rgb\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)$/;
  const rgbaRegex = /^rgba\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*([01](?:\.\d+)?)\s*\)$/;
  
  if (rgbRegex.test(color)) {
    const matches = color.match(rgbRegex);
    if (!matches) return false;
    const [, r, g, b] = matches;
    return [r, g, b].every(val => {
      const num = parseFloat(val);
      return num >= 0 && num <= 255;
    });
  }

  if (rgbaRegex.test(color)) {
    const matches = color.match(rgbaRegex);
    if (!matches) return false;
    const [, r, g, b, a] = matches;
    const rgbValid = [r, g, b].every(val => {
      const num = parseFloat(val);
      return num >= 0 && num <= 255;
    });
    const alphaValid = parseFloat(a) >= 0 && parseFloat(a) <= 1;
    return rgbValid && alphaValid;
  }

  return false;
}

/**
 * Validates HSL color format
 */
export function isValidHsl(color: string): boolean {
  const hslRegex = /^hsl\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*\)$/;
  const hslaRegex = /^hsla\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*([01](?:\.\d+)?)\s*\)$/;
  
  if (hslRegex.test(color)) {
    const matches = color.match(hslRegex);
    if (!matches) return false;
    const [, h, s, l] = matches;
    const hue = parseFloat(h);
    const saturation = parseFloat(s);
    const lightness = parseFloat(l);
    return hue >= 0 && hue <= 360 && saturation >= 0 && saturation <= 100 && lightness >= 0 && lightness <= 100;
  }

  if (hslaRegex.test(color)) {
    const matches = color.match(hslaRegex);
    if (!matches) return false;
    const [, h, s, l, a] = matches;
    const hue = parseFloat(h);
    const saturation = parseFloat(s);
    const lightness = parseFloat(l);
    const alpha = parseFloat(a);
    return hue >= 0 && hue <= 360 && saturation >= 0 && saturation <= 100 && 
           lightness >= 0 && lightness <= 100 && alpha >= 0 && alpha <= 1;
  }

  return false;
}

/**
 * Validates OKLCH color format
 */
export function isValidOklch(color: string): boolean {
  const oklchRegex = /^oklch\(\s*([01](?:\.\d+)?)\s+([01](?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*(?:\/\s*([01](?:\.\d+)?))?\s*\)$/;
  
  if (!oklchRegex.test(color)) return false;
  
  const matches = color.match(oklchRegex);
  if (!matches) return false;
  
  const [, l, c, h, a] = matches;
  const lightness = parseFloat(l);
  const chroma = parseFloat(c);
  const hue = parseFloat(h);
  const alpha = a ? parseFloat(a) : 1;
  
  return lightness >= 0 && lightness <= 1 &&
         chroma >= 0 && chroma <= 0.5 &&
         hue >= 0 && hue <= 360 &&
         alpha >= 0 && alpha <= 1;
}

// ============================================================================
// COLOR NORMALIZATION
// ============================================================================

/**
 * Normalizes HEX color to 6-digit format
 */
export function normalizeHex(hex: string): string {
  if (!isValidHex(hex)) return hex;
  
  let normalized = hex.toLowerCase();
  
  // Convert 3-digit to 6-digit
  if (normalized.length === 4) {
    normalized = '#' + normalized[1] + normalized[1] + normalized[2] + normalized[2] + normalized[3] + normalized[3];
  }
  
  return normalized;
}

/**
 * Ensures color has proper alpha channel
 */
export function ensureAlpha(color: string, alpha: number = 1): string {
  const validation = isValidColor(color);
  if (!validation.isValid) return color;

  switch (validation.format) {
    case 'hex':
      return hexToRgba(color, alpha);
    case 'rgb':
      return addAlphaToRgb(color, alpha);
    case 'hsl':
      return addAlphaToHsl(color, alpha);
    case 'oklch':
      return addAlphaToOklch(color, alpha);
    default:
      return color;
  }
}

// ============================================================================
// COLOR FORMAT CONVERSIONS
// ============================================================================

/**
 * Converts HEX to RGBA
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const normalizedHex = normalizeHex(hex);
  const r = parseInt(normalizedHex.slice(1, 3), 16);
  const g = parseInt(normalizedHex.slice(3, 5), 16);
  const b = parseInt(normalizedHex.slice(5, 7), 16);
  
  return alpha === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Converts RGB to HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts HEX to OKLCH (simplified conversion)
 */
export function hexToOklch(hex: string): string {
  // First convert to RGB
  const normalizedHex = normalizeHex(hex);
  const r = parseInt(normalizedHex.slice(1, 3), 16) / 255;
  const g = parseInt(normalizedHex.slice(3, 5), 16) / 255;
  const b = parseInt(normalizedHex.slice(5, 7), 16) / 255;

  // Convert to linear RGB
  const toLinear = (c: number) => {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);

  // Convert to OKLAB (simplified)
  const l = 0.4122214708 * rLinear + 0.5363325363 * gLinear + 0.0514459929 * bLinear;
  const m = 0.2119034982 * rLinear + 0.6806995451 * gLinear + 0.1073969566 * bLinear;
  const s = 0.0883024619 * rLinear + 0.2817188376 * gLinear + 0.6299787005 * bLinear;

  const lCube = Math.cbrt(l);
  const mCube = Math.cbrt(m);
  const sCube = Math.cbrt(s);

  const L = 0.2104542553 * lCube + 0.7936177850 * mCube - 0.0040720468 * sCube;
  const a = 1.9779984951 * lCube - 2.4285922050 * mCube + 0.4505937099 * sCube;
  const bValue = 0.0259040371 * lCube + 0.7827717662 * mCube - 0.8086757660 * sCube;

  // Convert to OKLCH
  const C = Math.sqrt(a * a + bValue * bValue);
  let H = Math.atan2(bValue, a) * 180 / Math.PI;
  if (H < 0) H += 360;

  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`;
}

/**
 * Adds alpha channel to RGB color
 */
function addAlphaToRgb(rgb: string, alpha: number): string {
  if (rgb.startsWith('rgba(')) {
    return rgb.replace(/,\s*[01](?:\.\d+)?\s*\)$/, `, ${alpha})`);
  }
  
  if (rgb.startsWith('rgb(')) {
    return rgb.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
  }
  
  return rgb;
}

/**
 * Adds alpha channel to HSL color
 */
function addAlphaToHsl(hsl: string, alpha: number): string {
  if (hsl.startsWith('hsla(')) {
    return hsl.replace(/,\s*[01](?:\.\d+)?\s*\)$/, `, ${alpha})`);
  }
  
  if (hsl.startsWith('hsl(')) {
    return hsl.replace('hsl(', 'hsla(').replace(')', `, ${alpha})`);
  }
  
  return hsl;
}

/**
 * Adds alpha channel to OKLCH color
 */
function addAlphaToOklch(oklch: string, alpha: number): string {
  if (oklch.includes('/')) {
    return oklch.replace(/\/\s*[01](?:\.\d+)?\s*\)$/, `/ ${alpha})`);
  }
  
  return oklch.replace(')', ` / ${alpha})`);
}

// ============================================================================
// COLOR ACCESSIBILITY
// ============================================================================

/**
 * Calculates relative luminance of a color
 */
export function getRelativeLuminance(color: string): number {
  const rgb = parseColorToRgb(color);
  if (!rgb) return 0;

  const { r, g, b } = rgb;
  
  const toLinear = (c: number) => {
    const normalized = c / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculates contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if color combination meets accessibility standards
 */
export function checkColorContrast(foreground: string, background: string): ColorContrast {
  const ratio = getContrastRatio(foreground, background);
  
  let level: 'AA' | 'AAA' | 'FAIL' = 'FAIL';
  let isAccessible = false;
  
  if (ratio >= 7) {
    level = 'AAA';
    isAccessible = true;
  } else if (ratio >= 4.5) {
    level = 'AA';
    isAccessible = true;
  }
  
  return { ratio, level, isAccessible };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Parses any color format to RGB components
 */
function parseColorToRgb(color: string): RGBColor | null {
  const validation = isValidColor(color);
  if (!validation.isValid) return null;

  switch (validation.format) {
    case 'hex':
      return hexToRgbComponents(color);
    case 'rgb':
      return parseRgbString(color);
    case 'hsl':
      return hslToRgbComponents(color);
    case 'oklch':
      return oklchToRgbComponents(color);
    default:
      return null;
  }
}

/**
 * Converts HEX to RGB components
 */
function hexToRgbComponents(hex: string): RGBColor {
  const normalizedHex = normalizeHex(hex);
  return {
    r: parseInt(normalizedHex.slice(1, 3), 16),
    g: parseInt(normalizedHex.slice(3, 5), 16),
    b: parseInt(normalizedHex.slice(5, 7), 16),
  };
}

/**
 * Parses RGB string to components
 */
function parseRgbString(rgb: string): RGBColor | null {
  const rgbMatch = rgb.match(/rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*(?:,\s*([01](?:\.\d+)?))?\s*\)/);
  if (!rgbMatch) return null;

  return {
    r: parseFloat(rgbMatch[1]),
    g: parseFloat(rgbMatch[2]),
    b: parseFloat(rgbMatch[3]),
    alpha: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1,
  };
}

/**
 * Converts HSL to RGB components (simplified)
 */
function hslToRgbComponents(hsl: string): RGBColor | null {
  const hslMatch = hsl.match(/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*(?:,\s*([01](?:\.\d+)?))?\s*\)/);
  if (!hslMatch) return null;

  const h = parseFloat(hslMatch[1]) / 360;
  const s = parseFloat(hslMatch[2]) / 100;
  const l = parseFloat(hslMatch[3]) / 100;
  const alpha = hslMatch[4] ? parseFloat(hslMatch[4]) : 1;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    alpha,
  };
}

/**
 * Converts OKLCH to RGB components (simplified)
 */
function oklchToRgbComponents(oklch: string): RGBColor | null {
  // This is a simplified conversion - for production use, consider a proper color science library
  const oklchMatch = oklch.match(/oklch\(\s*([01](?:\.\d+)?)\s+([01](?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*(?:\/\s*([01](?:\.\d+)?))?\s*\)/);
  if (!oklchMatch) return null;

  // For now, return a neutral gray based on lightness
  // In a real implementation, you'd do proper OKLCH to RGB conversion
  const lightness = parseFloat(oklchMatch[1]);
  const value = Math.round(lightness * 255);
  
  return {
    r: value,
    g: value,
    b: value,
    alpha: oklchMatch[4] ? parseFloat(oklchMatch[4]) : 1,
  };
}