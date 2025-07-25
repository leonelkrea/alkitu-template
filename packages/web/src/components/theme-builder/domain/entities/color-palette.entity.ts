/**
 * Theme Builder - Color Palette Entity
 * Represents a collection of colors for a specific mode (light/dark)
 * Pure domain logic with no framework dependencies
 */

import type { ColorValues } from '../../shared/types';

/**
 * Represents a color link relationship
 */
interface ColorLink {
  source: string;
  target: string;
}

/**
 * Color Palette entity - Manages a collection of theme colors
 */
export class ColorPalette {
  private colors: Map<string, string>;
  private links: Map<string, string>;
  private mode: 'light' | 'dark';
  
  // Required colors that every palette must have
  private static REQUIRED_COLORS = [
    'primary', 'primary-foreground',
    'secondary', 'secondary-foreground',
    'background', 'foreground',
    'card', 'card-foreground',
    'popover', 'popover-foreground',
    'muted', 'muted-foreground',
    'accent', 'accent-foreground',
    'destructive', 'destructive-foreground',
    'border', 'input', 'ring'
  ];

  constructor(colors: ColorValues, mode: 'light' | 'dark') {
    // Handle null/undefined colors gracefully
    const safeColors = colors || {};
    this.colors = new Map(Object.entries(safeColors));
    this.links = new Map();
    this.mode = mode;
    this.detectLinks();
  }

  // ============================================================================
  // GETTERS
  // ============================================================================

  /**
   * Gets a color value by name
   */
  getColor(name: string): string | undefined {
    // If color is linked, return the target color value
    if (this.links.has(name)) {
      const targetColor = this.links.get(name)!;
      return this.colors.get(targetColor);
    }
    return this.colors.get(name);
  }

  /**
   * Gets all colors as a plain object
   */
  toColorValues(): ColorValues {
    const result: ColorValues = {};
    
    this.colors.forEach((value, key) => {
      // Use resolved value for linked colors
      result[key] = this.getColor(key) || value;
    });
    
    return result;
  }

  /**
   * Gets all color names
   */
  getColorNames(): string[] {
    return Array.from(this.colors.keys());
  }

  /**
   * Checks if a color is linked
   */
  isLinked(colorName: string): boolean {
    return this.links.has(colorName);
  }

  /**
   * Gets the link target for a color
   */
  getLinkTarget(colorName: string): string | undefined {
    return this.links.get(colorName);
  }

  /**
   * Gets all color links
   */
  getLinks(): ColorLink[] {
    return Array.from(this.links.entries()).map(([source, target]) => ({
      source,
      target
    }));
  }

  // ============================================================================
  // BUSINESS METHODS
  // ============================================================================

  /**
   * Updates a color value
   */
  updateColor(name: string, value: string): void {
    if (!name || !value) {
      throw new Error('Color name and value are required');
    }

    // If color is linked, unlink it first
    if (this.links.has(name)) {
      this.links.delete(name);
    }

    this.colors.set(name, value);
  }

  /**
   * Adds a new color to the palette
   */
  addColor(name: string, value: string): void {
    if (this.colors.has(name)) {
      throw new Error(`Color ${name} already exists`);
    }
    this.updateColor(name, value);
  }

  /**
   * Removes a color from the palette
   */
  removeColor(name: string): void {
    // Don't allow removing required colors
    if (ColorPalette.REQUIRED_COLORS.includes(name)) {
      throw new Error(`Cannot remove required color: ${name}`);
    }

    this.colors.delete(name);
    this.links.delete(name);

    // Remove any links pointing to this color
    this.links.forEach((target, source) => {
      if (target === name) {
        this.links.delete(source);
      }
    });
  }

  /**
   * Links a color to another color
   */
  linkColor(source: string, target: string): void {
    if (!this.colors.has(source)) {
      throw new Error(`Source color ${source} does not exist`);
    }
    
    if (!this.colors.has(target)) {
      throw new Error(`Target color ${target} does not exist`);
    }

    if (source === target) {
      throw new Error('Cannot link a color to itself');
    }

    // Check for circular dependencies
    if (this.wouldCreateCircularLink(source, target)) {
      throw new Error('This link would create a circular dependency');
    }

    this.links.set(source, target);
  }

  /**
   * Unlinks a color
   */
  unlinkColor(colorName: string): void {
    this.links.delete(colorName);
  }

  /**
   * Validates the color palette
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for required colors
    ColorPalette.REQUIRED_COLORS.forEach(requiredColor => {
      if (!this.colors.has(requiredColor)) {
        errors.push(`Missing required color: ${requiredColor}`);
      }
    });

    // Validate color values
    this.colors.forEach((value, name) => {
      if (!value || value.trim().length === 0) {
        errors.push(`Color ${name} has an empty value`);
      }
    });

    // Validate links
    this.links.forEach((target, source) => {
      if (!this.colors.has(target)) {
        errors.push(`Color ${source} is linked to non-existent color ${target}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Checks if this palette equals another palette
   */
  equals(other: ColorPalette): boolean {
    // Check if same number of colors
    if (this.colors.size !== other.colors.size) {
      return false;
    }

    // Check if all colors match
    for (const [name, value] of this.colors) {
      if (other.getColor(name) !== this.getColor(name)) {
        return false;
      }
    }

    // Check if links match
    if (this.links.size !== other.links.size) {
      return false;
    }

    for (const [source, target] of this.links) {
      if (other.links.get(source) !== target) {
        return false;
      }
    }

    return true;
  }

  /**
   * Creates a copy of this palette
   */
  clone(): ColorPalette {
    const palette = new ColorPalette(this.toColorValues(), this.mode);
    
    // Copy links
    this.links.forEach((target, source) => {
      palette.links.set(source, target);
    });
    
    return palette;
  }

  /**
   * Merges another palette into this one
   */
  merge(other: ColorPalette, overwrite: boolean = false): void {
    other.colors.forEach((value, name) => {
      if (overwrite || !this.colors.has(name)) {
        this.colors.set(name, value);
      }
    });

    if (overwrite) {
      other.links.forEach((target, source) => {
        this.links.set(source, target);
      });
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Detects existing links based on color values
   */
  private detectLinks(): void {
    // Look for colors that have the same value as other colors
    const colorMap = new Map<string, string[]>();
    
    this.colors.forEach((value, name) => {
      if (!colorMap.has(value)) {
        colorMap.set(value, []);
      }
      colorMap.get(value)!.push(name);
    });

    // Detect foreground colors linked to their base colors
    this.colors.forEach((value, name) => {
      if (name.endsWith('-foreground')) {
        const baseName = name.replace('-foreground', '');
        if (this.colors.has(baseName)) {
          // Don't auto-link, just prepare for potential linking
          // This is where we could add smart link detection
        }
      }
    });
  }

  /**
   * Checks if creating a link would result in a circular dependency
   */
  private wouldCreateCircularLink(source: string, target: string): boolean {
    // Follow the chain of links from target
    let current = target;
    const visited = new Set<string>();

    while (current) {
      if (current === source) {
        return true; // Found circular dependency
      }
      
      if (visited.has(current)) {
        break; // Already visited, no need to continue
      }
      
      visited.add(current);
      current = this.links.get(current) || '';
    }

    return false;
  }
}