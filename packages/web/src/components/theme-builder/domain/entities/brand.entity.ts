/**
 * Theme Builder - Brand Entity
 * Represents brand configuration for a theme
 * Pure domain logic with no framework dependencies
 */

/**
 * Brand entity - Manages brand assets and configuration
 */
export class BrandEntity {
  private primaryText: string;
  private secondaryText: string;
  private logoSvg?: string;
  private iconSvg?: string;
  private primaryTextColor: string;
  private secondaryTextColor: string;
  private iconBackgroundColor: string;
  private iconColor: string;
  private colorLinks: Map<string, string>;
  private monochromeMode: 'none' | 'light' | 'dark';
  
  constructor(config?: Partial<BrandConfiguration>) {
    this.primaryText = config?.primaryText || 'Alkitu';
    this.secondaryText = config?.secondaryText || 'Design System';
    this.logoSvg = config?.logoSvg;
    this.iconSvg = config?.iconSvg;
    
    // Color configuration
    this.primaryTextColor = config?.primaryTextColor || '#000000';
    this.secondaryTextColor = config?.secondaryTextColor || '#666666';
    this.iconBackgroundColor = config?.iconBackgroundColor || '#3b82f6';
    this.iconColor = config?.iconColor || '#ffffff';
    
    // Initialize color links
    this.colorLinks = new Map();
    if (config?.colorLinks) {
      Object.entries(config.colorLinks).forEach(([key, value]) => {
        this.colorLinks.set(key, value);
      });
    }
    
    this.monochromeMode = config?.monochromeMode || 'none';
  }

  // ============================================================================
  // GETTERS
  // ============================================================================

  getPrimaryText(): string {
    return this.primaryText;
  }

  getSecondaryText(): string {
    return this.secondaryText;
  }

  getLogoSvg(): string | undefined {
    return this.logoSvg;
  }

  getIconSvg(): string | undefined {
    return this.iconSvg;
  }

  getPrimaryTextColor(): string {
    return this.primaryTextColor;
  }

  getSecondaryTextColor(): string {
    return this.secondaryTextColor;
  }

  getIconBackgroundColor(): string {
    return this.iconBackgroundColor;
  }

  getIconColor(): string {
    return this.iconColor;
  }

  getColorLinks(): Record<string, string> {
    return Object.fromEntries(this.colorLinks);
  }

  getMonochromeMode(): 'none' | 'light' | 'dark' {
    return this.monochromeMode;
  }

  isColorLinked(colorProperty: string): boolean {
    return this.colorLinks.has(colorProperty);
  }

  getColorLinkTarget(colorProperty: string): string | undefined {
    return this.colorLinks.get(colorProperty);
  }

  // ============================================================================
  // BUSINESS METHODS
  // ============================================================================

  /**
   * Updates the primary text
   */
  setPrimaryText(text: string): void {
    if (!text || text.trim().length === 0) {
      throw new Error('Primary text cannot be empty');
    }
    this.primaryText = text.trim();
  }

  /**
   * Updates the secondary text
   */
  setSecondaryText(text: string): void {
    if (!text || text.trim().length === 0) {
      throw new Error('Secondary text cannot be empty');
    }
    this.secondaryText = text.trim();
  }

  /**
   * Updates the logo SVG
   */
  setLogoSvg(svg: string | undefined): void {
    if (svg && !this.isValidSVG(svg)) {
      throw new Error('Invalid SVG content for logo');
    }
    this.logoSvg = svg;
  }

  /**
   * Updates the icon SVG
   */
  setIconSvg(svg: string | undefined): void {
    if (svg && !this.isValidSVG(svg)) {
      throw new Error('Invalid SVG content for icon');
    }
    this.iconSvg = svg;
  }

  /**
   * Updates a color property
   */
  setColor(property: ColorProperty, value: string): void {
    if (!this.isValidColor(value)) {
      throw new Error(`Invalid color value: ${value}`);
    }

    switch (property) {
      case 'primaryText':
        this.primaryTextColor = value;
        break;
      case 'secondaryText':
        this.secondaryTextColor = value;
        break;
      case 'iconBackground':
        this.iconBackgroundColor = value;
        break;
      case 'icon':
        this.iconColor = value;
        break;
      default:
        throw new Error(`Unknown color property: ${property}`);
    }

    // Remove link if color is manually set
    this.colorLinks.delete(property);
  }

  /**
   * Links a color property to a theme color
   */
  linkColor(property: ColorProperty, themeColor: string): void {
    if (!themeColor || themeColor.trim().length === 0) {
      throw new Error('Theme color name cannot be empty');
    }
    this.colorLinks.set(property, themeColor);
  }

  /**
   * Unlinks a color property
   */
  unlinkColor(property: ColorProperty): void {
    this.colorLinks.delete(property);
  }

  /**
   * Sets the monochrome mode for SVG icons
   */
  setMonochromeMode(mode: 'none' | 'light' | 'dark'): void {
    this.monochromeMode = mode;
  }

  /**
   * Resolves color values with theme colors
   */
  resolveColors(themeColors: Record<string, string>): ResolvedBrandColors {
    const resolveColor = (property: ColorProperty, defaultValue: string): string => {
      const linkTarget = this.colorLinks.get(property);
      if (linkTarget && themeColors[linkTarget]) {
        return themeColors[linkTarget];
      }
      return defaultValue;
    };

    return {
      primaryText: resolveColor('primaryText', this.primaryTextColor),
      secondaryText: resolveColor('secondaryText', this.secondaryTextColor),
      iconBackground: resolveColor('iconBackground', this.iconBackgroundColor),
      icon: resolveColor('icon', this.iconColor),
    };
  }

  /**
   * Processes SVG content with current configuration
   */
  processIconSvg(themeColors: Record<string, string>): string | undefined {
    if (!this.iconSvg) return undefined;

    let processedSvg = this.iconSvg;
    const resolvedColors = this.resolveColors(themeColors);

    // Apply monochrome mode
    if (this.monochromeMode !== 'none') {
      processedSvg = this.applyMonochromeMode(processedSvg);
    }

    // Replace color placeholders if any
    processedSvg = processedSvg.replace(/{{iconColor}}/g, resolvedColors.icon);
    processedSvg = processedSvg.replace(/{{iconBackground}}/g, resolvedColors.iconBackground);

    return processedSvg;
  }

  /**
   * Validates the brand configuration
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate text content
    if (!this.primaryText || this.primaryText.trim().length === 0) {
      errors.push('Primary text is required');
    }

    if (!this.secondaryText || this.secondaryText.trim().length === 0) {
      errors.push('Secondary text is required');
    }

    // Validate colors
    if (!this.isValidColor(this.primaryTextColor)) {
      errors.push('Invalid primary text color');
    }

    if (!this.isValidColor(this.secondaryTextColor)) {
      errors.push('Invalid secondary text color');
    }

    if (!this.isValidColor(this.iconBackgroundColor)) {
      errors.push('Invalid icon background color');
    }

    if (!this.isValidColor(this.iconColor)) {
      errors.push('Invalid icon color');
    }

    // Validate SVG content
    if (this.logoSvg && !this.isValidSVG(this.logoSvg)) {
      errors.push('Invalid logo SVG content');
    }

    if (this.iconSvg && !this.isValidSVG(this.iconSvg)) {
      errors.push('Invalid icon SVG content');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Exports brand configuration to a plain object
   */
  toJSON(): BrandConfiguration {
    return {
      primaryText: this.primaryText,
      secondaryText: this.secondaryText,
      logoSvg: this.logoSvg,
      iconSvg: this.iconSvg,
      primaryTextColor: this.primaryTextColor,
      secondaryTextColor: this.secondaryTextColor,
      iconBackgroundColor: this.iconBackgroundColor,
      iconColor: this.iconColor,
      colorLinks: Object.fromEntries(this.colorLinks),
      monochromeMode: this.monochromeMode,
    };
  }

  /**
   * Creates a copy of this brand configuration
   */
  clone(): BrandEntity {
    return new BrandEntity(this.toJSON());
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Validates color values
   */
  private isValidColor(color: string): boolean {
    // Basic color validation - could be expanded
    const patterns = [
      /^#[0-9A-Fa-f]{6}$/, // Hex
      /^#[0-9A-Fa-f]{8}$/, // Hex with alpha
      /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/, // RGB
      /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[01]?\.?\d*\s*\)$/, // RGBA
      /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/, // HSL
      /^oklch\(.+\)$/, // OKLCH
    ];

    return patterns.some(pattern => pattern.test(color));
  }

  /**
   * Validates SVG content
   */
  private isValidSVG(svg: string): boolean {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');
      return svgElement !== null;
    } catch {
      return false;
    }
  }

  /**
   * Applies monochrome mode to SVG content
   */
  private applyMonochromeMode(svg: string): string {
    // This is a simplified implementation
    // In practice, you might want more sophisticated SVG processing
    if (this.monochromeMode === 'light') {
      return svg.replace(/fill="[^"]*"/g, 'fill="white"');
    } else if (this.monochromeMode === 'dark') {
      return svg.replace(/fill="[^"]*"/g, 'fill="black"');
    }
    return svg;
  }
}

// ============================================================================
// TYPES
// ============================================================================

export type ColorProperty = 'primaryText' | 'secondaryText' | 'iconBackground' | 'icon';

export interface BrandConfiguration {
  primaryText: string;
  secondaryText: string;
  logoSvg?: string;
  iconSvg?: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  iconBackgroundColor: string;
  iconColor: string;
  colorLinks: Record<string, string>;
  monochromeMode: 'none' | 'light' | 'dark';
}

export interface ResolvedBrandColors {
  primaryText: string;
  secondaryText: string;
  iconBackground: string;
  icon: string;
}