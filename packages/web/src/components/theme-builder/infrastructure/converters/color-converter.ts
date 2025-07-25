/**
 * Theme Builder - Color Converter
 * Pure functions for color format conversions
 * Extracted from themeUtils.ts and other files as part of Clean Architecture refactor
 */

import type { ColorFormat } from '../../shared/types';

// ============================================================================
// TYPES
// ============================================================================

export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a?: number; // 0-1
}

export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  a?: number; // 0-1
}

export interface OKLCHColor {
  l: number; // 0-1 (lightness)
  c: number; // 0-0.4+ (chroma)
  h: number; // 0-360 (hue)
  a?: number; // 0-1
}

// ============================================================================
// HEX CONVERSIONS
// ============================================================================

/**
 * Converts a hexadecimal color string to an RGB object
 */
export function hexToRgb(hex: string): RGBColor {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Handle shorthand notation (#RGB -> #RRGGBB)
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  // Handle alpha channel (#RRGGBBAA)
  let alpha = 1;
  if (hex.length === 8) {
    alpha = parseInt(hex.slice(6, 8), 16) / 255;
    hex = hex.slice(0, 6);
  }
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: alpha
  } : { r: 0, g: 0, b: 0, a: 1 };
}

/**
 * Converts an RGB object to a hexadecimal color string
 */
export function rgbToHex(rgb: RGBColor): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  const hex = `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  
  // Add alpha channel if not fully opaque
  if (rgb.a !== undefined && rgb.a < 1) {
    const alphaHex = toHex(rgb.a * 255);
    return hex + alphaHex;
  }
  
  return hex;
}

// ============================================================================
// RGB CONVERSIONS
// ============================================================================

/**
 * Converts RGB to HSL color values
 */
export function rgbToHsl(rgb: RGBColor): HSLColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: rgb.a
  };
}

/**
 * Converts HSL to RGB color values
 */
export function hslToRgb(hsl: HSLColor): RGBColor {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
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
    a: hsl.a
  };
}

// ============================================================================
// OKLCH CONVERSIONS
// ============================================================================

/**
 * Converts RGB to OKLCH color values
 */
export function rgbToOklch(rgb: RGBColor): OKLCHColor {
  // Normalize RGB values
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;
  
  // Remove gamma correction (sRGB to linear RGB)
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  
  // Linear RGB to OKLab
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const b_lab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  
  // Convert to LCH
  const c = Math.sqrt(a * a + b_lab * b_lab);
  let h = Math.atan2(b_lab, a) * 180 / Math.PI;
  if (h < 0) h += 360;
  
  return { 
    l: L, 
    c, 
    h,
    a: rgb.a
  };
}

/**
 * Converts OKLCH color values to RGB
 */
export function oklchToRgb(oklch: OKLCHColor): RGBColor {
  const { l, c, h } = oklch;
  
  // Convert to OKLab
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  
  // OKLab to linear RGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;
  
  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;
  
  let r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let b_rgb = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;
  
  // Apply gamma correction (linear RGB to sRGB)
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1/2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1/2.4) - 0.055 : 12.92 * g;
  b_rgb = b_rgb > 0.0031308 ? 1.055 * Math.pow(b_rgb, 1/2.4) - 0.055 : 12.92 * b_rgb;
  
  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(b_rgb * 255))),
    a: oklch.a
  };
}

// ============================================================================
// STRING CONVERSIONS
// ============================================================================

/**
 * Converts hex string to OKLCH string
 */
export function hexToOklch(hex: string): string {
  const rgb = hexToRgb(hex);
  const oklch = rgbToOklch(rgb);
  
  const l = (oklch.l * 100).toFixed(1);
  const c = oklch.c.toFixed(3);
  const h = Math.round(oklch.h);
  
  return `${l}% ${c} ${h}`;
}

/**
 * Converts OKLCH string to hex
 */
export function oklchToHex(oklchString: string): string {
  // Parse OKLCH string
  const parts = oklchString.trim().split(/\s+/);
  if (parts.length < 3) return '#000000';
  
  let l = parseFloat(parts[0]);
  const c = parseFloat(parts[1]);
  const h = parseFloat(parts[2]);
  
  // Handle percentage notation for lightness
  if (parts[0].includes('%')) {
    l = l / 100;
  }
  
  const rgb = oklchToRgb({ l, c, h });
  return rgbToHex(rgb);
}

/**
 * Converts HSL string to OKLCH string
 */
export function hslToOklch(hslString: string): string {
  // Parse HSL string
  const match = hslString.match(/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*(?:,\s*([01](?:\.\d+)?))?\s*\)/);
  if (!match) return '0% 0 0';
  
  const hsl: HSLColor = {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
    a: match[4] ? parseFloat(match[4]) : 1
  };
  
  const rgb = hslToRgb(hsl);
  const oklch = rgbToOklch(rgb);
  
  const l = (oklch.l * 100).toFixed(1);
  const c = oklch.c.toFixed(3);
  const h = Math.round(oklch.h);
  
  return `${l}% ${c} ${h}`;
}

/**
 * Converts OKLCH string to HSL string
 */
export function oklchToHsl(oklchString: string): string {
  // Parse OKLCH string
  const parts = oklchString.trim().split(/\s+/);
  if (parts.length < 3) return 'hsl(0, 0%, 0%)';
  
  let l = parseFloat(parts[0]);
  const c = parseFloat(parts[1]);
  const h = parseFloat(parts[2]);
  
  // Handle percentage notation for lightness
  if (parts[0].includes('%')) {
    l = l / 100;
  }
  
  const rgb = oklchToRgb({ l, c, h });
  const hsl = rgbToHsl(rgb);
  
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

/**
 * Converts RGB string to OKLCH string
 */
export function rgbStringToOklch(rgbString: string): string {
  // Parse RGB string
  const match = rgbString.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([01](?:\.\d+)?))?\s*\)/);
  if (!match) return '0% 0 0';
  
  const rgb: RGBColor = {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3]),
    a: match[4] ? parseFloat(match[4]) : 1
  };
  
  const oklch = rgbToOklch(rgb);
  
  const l = (oklch.l * 100).toFixed(1);
  const c = oklch.c.toFixed(3);
  const h = Math.round(oklch.h);
  
  return `${l}% ${c} ${h}`;
}

/**
 * Converts OKLCH string to RGB string
 */
export function oklchToRgbString(oklchString: string): string {
  // Parse OKLCH string
  const parts = oklchString.trim().split(/\s+/);
  if (parts.length < 3) return 'rgb(0, 0, 0)';
  
  let l = parseFloat(parts[0]);
  const c = parseFloat(parts[1]);
  const h = parseFloat(parts[2]);
  
  // Handle percentage notation for lightness
  if (parts[0].includes('%')) {
    l = l / 100;
  }
  
  const rgb = oklchToRgb({ l, c, h });
  
  if (rgb.a !== undefined && rgb.a < 1) {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
  }
  
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

// ============================================================================
// UNIVERSAL CONVERTER
// ============================================================================

/**
 * Converts any color format to any other format
 */
export function convertColor(
  color: string, 
  fromFormat: ColorFormat, 
  toFormat: ColorFormat
): string {
  if (fromFormat === toFormat) return color;
  
  // Convert to OKLCH as intermediate format
  let oklchString: string;
  
  switch (fromFormat) {
    case 'hex':
      oklchString = hexToOklch(color);
      break;
    case 'rgb':
      oklchString = rgbStringToOklch(color);
      break;
    case 'hsl':
      oklchString = hslToOklch(color);
      break;
    case 'oklch':
      oklchString = color;
      break;
    default:
      return color;
  }
  
  // Convert from OKLCH to target format
  switch (toFormat) {
    case 'hex':
      return oklchToHex(oklchString);
    case 'rgb':
      return oklchToRgbString(oklchString);
    case 'hsl':
      return oklchToHsl(oklchString);
    case 'oklch':
      return oklchString;
    default:
      return color;
  }
}

// ============================================================================
// COLOR CONVERTER CLASS
// ============================================================================

/**
 * Color Converter class - provides both static and instance methods
 * for color conversion and transformation
 */
export class ColorConverter {
  // Static methods
  static hexToRgb = hexToRgb;
  static rgbToHex = rgbToHex;
  static hexToOklch = hexToOklch;
  static oklchToHex = oklchToHex;
  static rgbToOklch = rgbToOklch;
  static oklchToRgb = oklchToRgb;
  static hslToRgb = hslToRgb;
  static rgbToHsl = rgbToHsl;
  static hslToOklch = hslToOklch;
  static oklchToHsl = oklchToHsl;
  static oklchToRgbString = oklchToRgbString;
  static rgbStringToOklch = rgbStringToOklch;
  static convertColor = convertColor;

  // Instance methods
  hexToRgb = hexToRgb;
  rgbToHex = rgbToHex;
  hexToOklch = hexToOklch;
  oklchToHex = oklchToHex;
  rgbToOklch = rgbToOklch;
  oklchToRgb = oklchToRgb;
  hslToRgb = hslToRgb;
  rgbToHsl = rgbToHsl;
  hslToOklch = hslToOklch;
  oklchToHsl = oklchToHsl;
  oklchToRgbString = oklchToRgbString;
  rgbStringToOklch = rgbStringToOklch;
  convertColor = convertColor;
}