/**
 * Theme Builder - Sync Theme Use Case
 * Business logic for theme synchronization operations
 * Pure domain logic with no framework dependencies
 */

import { Theme } from '../../entities/theme.entity';
import type { ColorValues } from '../../../shared/types';

/**
 * Use case for synchronizing theme state and changes
 */
export class SyncThemeUseCase {

  /**
   * Synchronizes a theme with external color values
   */
  syncThemeColors(
    theme: Theme,
    lightColors: ColorValues,
    darkColors: ColorValues
  ): SyncResult {
    try {
      const changes: ChangeRecord[] = [];
      
      // Sync light palette
      const lightChanges = this.syncPaletteColors(
        theme.lightPalette.toColorValues(),
        lightColors,
        'light'
      );
      
      // Sync dark palette  
      const darkChanges = this.syncPaletteColors(
        theme.darkPalette.toColorValues(),
        darkColors,
        'dark'
      );

      // Apply light color changes
      lightChanges.forEach(change => {
        if (change.type === 'added' || change.type === 'modified') {
          theme.updatePaletteColor('light', change.colorName, change.newValue!);
        } else if (change.type === 'removed') {
          try {
            theme.lightPalette.removeColor(change.colorName);
          } catch {
            // Ignore errors for required colors that can't be removed
          }
        }
      });

      // Apply dark color changes
      darkChanges.forEach(change => {
        if (change.type === 'added' || change.type === 'modified') {
          theme.updatePaletteColor('dark', change.colorName, change.newValue!);
        } else if (change.type === 'removed') {
          try {
            theme.darkPalette.removeColor(change.colorName);
          } catch {
            // Ignore errors for required colors that can't be removed
          }
        }
      });

      changes.push(...lightChanges, ...darkChanges);

      return {
        success: true,
        changes,
        summary: {
          totalChanges: changes.length,
          lightChanges: lightChanges.length,
          darkChanges: darkChanges.length,
          addedColors: changes.filter(c => c.type === 'added').length,
          modifiedColors: changes.filter(c => c.type === 'modified').length,
          removedColors: changes.filter(c => c.type === 'removed').length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed'
      };
    }
  }

  /**
   * Merges two themes, with the second theme taking precedence
   */
  mergeThemes(baseTheme: Theme, overlayTheme: Theme): MergeResult {
    try {
      // Create a new theme based on the base theme
      const mergedTheme = baseTheme.clone();
      mergedTheme.setName(`${baseTheme.name} + ${overlayTheme.name}`);

      const changes: MergeChange[] = [];

      // Merge light palettes
      const overlayLightColors = overlayTheme.lightPalette.toColorValues();
      Object.entries(overlayLightColors).forEach(([colorName, colorValue]) => {
        const originalValue = mergedTheme.lightPalette.getColor(colorName);
        
        if (originalValue !== colorValue) {
          mergedTheme.updatePaletteColor('light', colorName, colorValue);
          changes.push({
            type: originalValue ? 'modified' : 'added',
            colorName,
            palette: 'light',
            originalValue,
            newValue: colorValue,
            source: 'overlay'
          });
        }
      });

      // Merge dark palettes
      const overlayDarkColors = overlayTheme.darkPalette.toColorValues();
      Object.entries(overlayDarkColors).forEach(([colorName, colorValue]) => {
        const originalValue = mergedTheme.darkPalette.getColor(colorName);
        
        if (originalValue !== colorValue) {
          mergedTheme.updatePaletteColor('dark', colorName, colorValue);
          changes.push({
            type: originalValue ? 'modified' : 'added',
            colorName,
            palette: 'dark',
            originalValue,
            newValue: colorValue,
            source: 'overlay'
          });
        }
      });

      // Merge typography if overlay has it
      if (overlayTheme.typography) {
        mergedTheme.updateTypography(overlayTheme.typography);
        changes.push({
          type: 'modified',
          colorName: 'typography',
          palette: 'both',
          originalValue: baseTheme.typography,
          newValue: overlayTheme.typography,
          source: 'overlay'
        });
      }

      // Merge brand config if overlay has it
      if (overlayTheme.brandConfig) {
        mergedTheme.updateBrandConfig(overlayTheme.brandConfig);
        changes.push({
          type: 'modified',
          colorName: 'brandConfig',
          palette: 'both',
          originalValue: baseTheme.brandConfig,
          newValue: overlayTheme.brandConfig,
          source: 'overlay'
        });
      }

      return {
        success: true,
        mergedTheme,
        changes,
        summary: {
          totalChanges: changes.length,
          lightChanges: changes.filter(c => c.palette === 'light').length,
          darkChanges: changes.filter(c => c.palette === 'dark').length,
          configChanges: changes.filter(c => c.palette === 'both').length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Merge failed'
      };
    }
  }

  /**
   * Creates a diff between two themes
   */
  createThemeDiff(originalTheme: Theme, modifiedTheme: Theme): DiffResult {
    try {
      const diff: ThemeDiff = {
        metadata: {
          originalName: originalTheme.name,
          modifiedName: modifiedTheme.name,
          createdAt: new Date().toISOString()
        },
        changes: []
      };

      // Compare light palettes
      const lightDiff = this.createPaletteDiff(
        originalTheme.lightPalette.toColorValues(),
        modifiedTheme.lightPalette.toColorValues(),
        'light'
      );
      diff.changes.push(...lightDiff);

      // Compare dark palettes
      const darkDiff = this.createPaletteDiff(
        originalTheme.darkPalette.toColorValues(),
        modifiedTheme.darkPalette.toColorValues(),
        'dark'
      );
      diff.changes.push(...darkDiff);

      // Compare typography
      if (JSON.stringify(originalTheme.typography) !== JSON.stringify(modifiedTheme.typography)) {
        diff.changes.push({
          type: 'modified',
          path: 'typography',
          originalValue: originalTheme.typography,
          newValue: modifiedTheme.typography
        });
      }

      // Compare brand config
      if (JSON.stringify(originalTheme.brandConfig) !== JSON.stringify(modifiedTheme.brandConfig)) {
        diff.changes.push({
          type: 'modified',
          path: 'brandConfig',
          originalValue: originalTheme.brandConfig,
          newValue: modifiedTheme.brandConfig
        });
      }

      return {
        success: true,
        diff,
        hasChanges: diff.changes.length > 0,
        summary: {
          totalChanges: diff.changes.length,
          addedColors: diff.changes.filter(c => c.type === 'added').length,
          modifiedColors: diff.changes.filter(c => c.type === 'modified').length,
          removedColors: diff.changes.filter(c => c.type === 'removed').length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Diff creation failed'
      };
    }
  }

  /**
   * Applies a diff to a theme
   */
  applyThemeDiff(theme: Theme, diff: ThemeDiff): ApplyDiffResult {
    try {
      const appliedChanges: string[] = [];
      const failedChanges: string[] = [];

      diff.changes.forEach(change => {
        try {
          switch (change.type) {
            case 'added':
            case 'modified':
              if (change.path.startsWith('light.')) {
                const colorName = change.path.replace('light.', '');
                theme.updatePaletteColor('light', colorName, change.newValue as string);
                appliedChanges.push(change.path);
              } else if (change.path.startsWith('dark.')) {
                const colorName = change.path.replace('dark.', '');
                theme.updatePaletteColor('dark', colorName, change.newValue as string);
                appliedChanges.push(change.path);
              } else if (change.path === 'typography') {
                theme.updateTypography(change.newValue as any);
                appliedChanges.push(change.path);
              } else if (change.path === 'brandConfig') {
                theme.updateBrandConfig(change.newValue as any);
                appliedChanges.push(change.path);
              }
              break;

            case 'removed':
              if (change.path.startsWith('light.')) {
                const colorName = change.path.replace('light.', '');
                theme.lightPalette.removeColor(colorName);
                appliedChanges.push(change.path);
              } else if (change.path.startsWith('dark.')) {
                const colorName = change.path.replace('dark.', '');
                theme.darkPalette.removeColor(colorName);
                appliedChanges.push(change.path);
              }
              break;
          }
        } catch (error) {
          failedChanges.push(`${change.path}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      });

      return {
        success: failedChanges.length === 0,
        appliedChanges,
        failedChanges,
        summary: {
          totalChanges: diff.changes.length,
          appliedCount: appliedChanges.length,
          failedCount: failedChanges.length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to apply diff'
      };
    }
  }

  /**
   * Tracks changes to a theme over time
   */
  trackThemeChanges(originalTheme: Theme, currentTheme: Theme): ChangeTrackingResult {
    const changeLog: ChangeLogEntry[] = [];
    
    // Track all changes
    const diff = this.createThemeDiff(originalTheme, currentTheme);
    
    if (!diff.success || !diff.diff) {
      return {
        success: false,
        error: diff.error || 'Failed to create diff'
      };
    }

    // Convert diff to change log
    diff.diff.changes.forEach(change => {
      changeLog.push({
        timestamp: new Date().toISOString(),
        type: change.type,
        path: change.path,
        originalValue: change.originalValue,
        newValue: change.newValue,
        impact: this.assessChangeImpact(change)
      });
    });

    return {
      success: true,
      changeLog,
      hasUnsavedChanges: changeLog.length > 0,
      riskLevel: this.assessOverallRisk(changeLog),
      summary: {
        totalChanges: changeLog.length,
        highImpactChanges: changeLog.filter(c => c.impact === 'high').length,
        mediumImpactChanges: changeLog.filter(c => c.impact === 'medium').length,
        lowImpactChanges: changeLog.filter(c => c.impact === 'low').length
      }
    };
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Synchronizes colors between two palettes
   */
  private syncPaletteColors(
    currentColors: ColorValues,
    newColors: ColorValues,
    mode: 'light' | 'dark'
  ): ChangeRecord[] {
    const changes: ChangeRecord[] = [];

    // Find added and modified colors
    Object.entries(newColors).forEach(([colorName, colorValue]) => {
      const currentValue = currentColors[colorName];
      
      if (!currentValue) {
        changes.push({
          type: 'added',
          colorName,
          mode,
          newValue: colorValue
        });
      } else if (currentValue !== colorValue) {
        changes.push({
          type: 'modified',
          colorName,
          mode,
          oldValue: currentValue,
          newValue: colorValue
        });
      }
    });

    // Find removed colors
    Object.keys(currentColors).forEach(colorName => {
      if (!(colorName in newColors)) {
        changes.push({
          type: 'removed',
          colorName,
          mode,
          oldValue: currentColors[colorName]
        });
      }
    });

    return changes;
  }

  /**
   * Creates a diff between two palettes
   */
  private createPaletteDiff(
    originalPalette: ColorValues,
    modifiedPalette: ColorValues,
    mode: 'light' | 'dark'
  ): DiffChange[] {
    const changes: DiffChange[] = [];

    // Find added and modified colors
    Object.entries(modifiedPalette).forEach(([colorName, colorValue]) => {
      const originalValue = originalPalette[colorName];
      
      if (!originalValue) {
        changes.push({
          type: 'added',
          path: `${mode}.${colorName}`,
          newValue: colorValue
        });
      } else if (originalValue !== colorValue) {
        changes.push({
          type: 'modified',
          path: `${mode}.${colorName}`,
          originalValue,
          newValue: colorValue
        });
      }
    });

    // Find removed colors
    Object.keys(originalPalette).forEach(colorName => {
      if (!(colorName in modifiedPalette)) {
        changes.push({
          type: 'removed',
          path: `${mode}.${colorName}`,
          originalValue: originalPalette[colorName]
        });
      }
    });

    return changes;
  }

  /**
   * Assesses the impact of a change
   */
  private assessChangeImpact(change: DiffChange): 'low' | 'medium' | 'high' {
    // High impact changes
    if (change.path.includes('primary') || 
        change.path.includes('background') || 
        change.path.includes('foreground')) {
      return 'high';
    }

    // Medium impact changes
    if (change.path.includes('secondary') || 
        change.path.includes('accent') || 
        change.path === 'typography' ||
        change.path === 'brandConfig') {
      return 'medium';
    }

    // Low impact changes
    return 'low';
  }

  /**
   * Assesses overall risk level
   */
  private assessOverallRisk(changeLog: ChangeLogEntry[]): 'low' | 'medium' | 'high' {
    const highImpactChanges = changeLog.filter(c => c.impact === 'high').length;
    const totalChanges = changeLog.length;

    if (highImpactChanges > 5 || totalChanges > 20) {
      return 'high';
    } else if (highImpactChanges > 2 || totalChanges > 10) {
      return 'medium';
    }

    return 'low';
  }
}

// ============================================================================
// TYPES
// ============================================================================

interface SyncResult {
  success: boolean;
  changes?: ChangeRecord[];
  error?: string;
  summary?: {
    totalChanges: number;
    lightChanges: number;
    darkChanges: number;
    addedColors: number;
    modifiedColors: number;
    removedColors: number;
  };
}

interface ChangeRecord {
  type: 'added' | 'modified' | 'removed';
  colorName: string;
  mode: 'light' | 'dark';
  oldValue?: string;
  newValue?: string;
}

interface MergeResult {
  success: boolean;
  mergedTheme?: Theme;
  changes?: MergeChange[];
  error?: string;
  summary?: {
    totalChanges: number;
    lightChanges: number;
    darkChanges: number;
    configChanges: number;
  };
}

interface MergeChange {
  type: 'added' | 'modified';
  colorName: string;
  palette: 'light' | 'dark' | 'both';
  originalValue: any;
  newValue: any;
  source: 'base' | 'overlay';
}

interface DiffResult {
  success: boolean;
  diff?: ThemeDiff;
  hasChanges?: boolean;
  error?: string;
  summary?: {
    totalChanges: number;
    addedColors: number;
    modifiedColors: number;
    removedColors: number;
  };
}

interface ThemeDiff {
  metadata: {
    originalName: string;
    modifiedName: string;
    createdAt: string;
  };
  changes: DiffChange[];
}

interface DiffChange {
  type: 'added' | 'modified' | 'removed';
  path: string;
  originalValue?: any;
  newValue?: any;
}

interface ApplyDiffResult {
  success: boolean;
  appliedChanges?: string[];
  failedChanges?: string[];
  error?: string;
  summary?: {
    totalChanges: number;
    appliedCount: number;
    failedCount: number;
  };
}

interface ChangeTrackingResult {
  success: boolean;
  changeLog?: ChangeLogEntry[];
  hasUnsavedChanges?: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
  error?: string;
  summary?: {
    totalChanges: number;
    highImpactChanges: number;
    mediumImpactChanges: number;
    lowImpactChanges: number;
  };
}

interface ChangeLogEntry {
  timestamp: string;
  type: 'added' | 'modified' | 'removed';
  path: string;
  originalValue: any;
  newValue: any;
  impact: 'low' | 'medium' | 'high';
}