/**
 * Theme Builder - Color Linking Hook
 * Custom hook for managing color relationships and linking
 * Part of Clean Architecture presentation layer
 */

import { useState, useCallback, useMemo } from 'react';

/**
 * Color link configuration
 */
export interface ColorLink {
  linkedTo?: string;
  isLinked: boolean;
  linkType?: 'automatic' | 'manual';
  lastUpdated?: Date;
}

/**
 * Color linking hook return type
 */
export interface UseColorLinkingReturn {
  // State
  colorLinks: Record<string, ColorLink>;
  
  // Actions
  linkColor: (colorName: string, linkedTo: string, linkType?: 'automatic' | 'manual') => void;
  unlinkColor: (colorName: string) => void;
  relinkColor: (colorName: string, newLinkedTo: string) => void;
  clearAllLinks: () => void;
  
  // Queries
  isColorLinked: (colorName: string) => boolean;
  getLinkedTo: (colorName: string) => string | undefined;
  getLinkedColors: (targetColor: string) => string[];
  getAllLinkedColors: () => string[];
  getUnlinkedColors: () => string[];
  
  // Link validation
  canLinkColor: (colorName: string, linkedTo: string) => boolean;
  validateLinkChain: (colorName: string, linkedTo: string) => { isValid: boolean; error?: string };
  
  // Bulk operations
  linkMultipleColors: (links: Array<{ colorName: string; linkedTo: string }>) => void;
  unlinkMultipleColors: (colorNames: string[]) => void;
  
  // Utilities
  getLinkSummary: () => {
    totalColors: number;
    linkedCount: number;
    unlinkedCount: number;
    automaticLinks: number;
    manualLinks: number;
  };
}

/**
 * Custom hook for color linking functionality
 */
export function useColorLinking(
  availableColors: string[] = []
): UseColorLinkingReturn {
  const [colorLinks, setColorLinks] = useState<Record<string, ColorLink>>({});

  /**
   * Links a color to another color
   */
  const linkColor = useCallback((
    colorName: string, 
    linkedTo: string,
    linkType: 'automatic' | 'manual' = 'manual'
  ): void => {
    // Validate the link
    const validation = validateLinkChain(colorName, linkedTo);
    if (!validation.isValid) {
      console.warn(`Cannot link ${colorName} to ${linkedTo}: ${validation.error}`);
      return;
    }

    setColorLinks(prev => ({
      ...prev,
      [colorName]: {
        linkedTo,
        isLinked: true,
        linkType,
        lastUpdated: new Date()
      }
    }));
  }, []);

  /**
   * Unlinks a color
   */
  const unlinkColor = useCallback((colorName: string): void => {
    setColorLinks(prev => {
      const newLinks = { ...prev };
      delete newLinks[colorName];
      return newLinks;
    });
  }, []);

  /**
   * Changes what a color is linked to
   */
  const relinkColor = useCallback((colorName: string, newLinkedTo: string): void => {
    const currentLink = colorLinks[colorName];
    if (!currentLink?.isLinked) {
      console.warn(`Color ${colorName} is not currently linked`);
      return;
    }

    linkColor(colorName, newLinkedTo, currentLink.linkType);
  }, [colorLinks, linkColor]);

  /**
   * Clears all color links
   */
  const clearAllLinks = useCallback((): void => {
    setColorLinks({});
  }, []);

  /**
   * Checks if a color is linked
   */
  const isColorLinked = useCallback((colorName: string): boolean => {
    return colorLinks[colorName]?.isLinked || false;
  }, [colorLinks]);

  /**
   * Gets what a color is linked to
   */
  const getLinkedTo = useCallback((colorName: string): string | undefined => {
    return colorLinks[colorName]?.linkedTo;
  }, [colorLinks]);

  /**
   * Gets all colors linked to a specific target color
   */
  const getLinkedColors = useCallback((targetColor: string): string[] => {
    return Object.entries(colorLinks)
      .filter(([, link]) => link.isLinked && link.linkedTo === targetColor)
      .map(([colorName]) => colorName);
  }, [colorLinks]);

  /**
   * Gets all linked colors
   */
  const getAllLinkedColors = useCallback((): string[] => {
    return Object.entries(colorLinks)
      .filter(([, link]) => link.isLinked)
      .map(([colorName]) => colorName);
  }, [colorLinks]);

  /**
   * Gets all unlinked colors
   */
  const getUnlinkedColors = useCallback((): string[] => {
    return availableColors.filter(colorName => !isColorLinked(colorName));
  }, [availableColors, isColorLinked]);

  /**
   * Validates if a color can be linked to another
   */
  const canLinkColor = useCallback((colorName: string, linkedTo: string): boolean => {
    // Cannot link to itself
    if (colorName === linkedTo) return false;
    
    // Target color must exist
    if (!availableColors.includes(linkedTo)) return false;
    
    // Check for circular dependencies
    const validation = validateLinkChain(colorName, linkedTo);
    return validation.isValid;
  }, [availableColors]);

  /**
   * Validates link chain to prevent circular dependencies
   */
  const validateLinkChain = useCallback((
    colorName: string, 
    linkedTo: string
  ): { isValid: boolean; error?: string } => {
    // Cannot link to itself
    if (colorName === linkedTo) {
      return { isValid: false, error: 'Cannot link color to itself' };
    }

    // Target must exist in available colors
    if (!availableColors.includes(linkedTo)) {
      return { isValid: false, error: `Target color '${linkedTo}' does not exist` };
    }

    // Check for circular dependencies
    const visited = new Set<string>();
    let current = linkedTo;
    
    while (current && colorLinks[current]?.isLinked) {
      if (visited.has(current)) {
        return { isValid: false, error: 'Circular dependency detected' };
      }
      
      if (current === colorName) {
        return { isValid: false, error: 'Would create circular dependency' };
      }
      
      visited.add(current);
      current = colorLinks[current]?.linkedTo;
      
      // Prevent infinite loops
      if (visited.size > availableColors.length) {
        return { isValid: false, error: 'Complex circular dependency detected' };
      }
    }

    return { isValid: true };
  }, [availableColors, colorLinks]);

  /**
   * Links multiple colors at once
   */
  const linkMultipleColors = useCallback((
    links: Array<{ colorName: string; linkedTo: string }>
  ): void => {
    const validLinks: Array<{ colorName: string; linkedTo: string }> = [];
    
    // Validate all links first
    for (const link of links) {
      if (canLinkColor(link.colorName, link.linkedTo)) {
        validLinks.push(link);
      } else {
        console.warn(`Invalid link: ${link.colorName} -> ${link.linkedTo}`);
      }
    }
    
    // Apply valid links
    setColorLinks(prev => {
      const newLinks = { ...prev };
      
      for (const link of validLinks) {
        newLinks[link.colorName] = {
          linkedTo: link.linkedTo,
          isLinked: true,
          linkType: 'manual',
          lastUpdated: new Date()
        };
      }
      
      return newLinks;
    });
  }, [canLinkColor]);

  /**
   * Unlinks multiple colors at once
   */
  const unlinkMultipleColors = useCallback((colorNames: string[]): void => {
    setColorLinks(prev => {
      const newLinks = { ...prev };
      
      for (const colorName of colorNames) {
        delete newLinks[colorName];
      }
      
      return newLinks;
    });
  }, []);

  /**
   * Gets summary statistics about color links
   */
  const getLinkSummary = useCallback(() => {
    const linkedColors = getAllLinkedColors();
    const automaticLinks = Object.values(colorLinks).filter(
      link => link.isLinked && link.linkType === 'automatic'
    ).length;
    const manualLinks = Object.values(colorLinks).filter(
      link => link.isLinked && link.linkType === 'manual'
    ).length;

    return {
      totalColors: availableColors.length,
      linkedCount: linkedColors.length,
      unlinkedCount: availableColors.length - linkedColors.length,
      automaticLinks,
      manualLinks
    };
  }, [availableColors.length, getAllLinkedColors, colorLinks]);

  return {
    // State
    colorLinks,
    
    // Actions
    linkColor,
    unlinkColor,
    relinkColor,
    clearAllLinks,
    
    // Queries
    isColorLinked,
    getLinkedTo,
    getLinkedColors,
    getAllLinkedColors,
    getUnlinkedColors,
    
    // Validation
    canLinkColor,
    validateLinkChain,
    
    // Bulk operations
    linkMultipleColors,
    unlinkMultipleColors,
    
    // Utilities
    getLinkSummary
  };
}