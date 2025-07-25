/**
 * Theme Builder - Import/Export Theme Use Case
 * Business logic for theme import and export operations
 * Pure domain logic with no framework dependencies
 */

import type { ExportFormat, ThemeData } from '../../../shared/types';
import { Theme } from '../../entities/theme.entity';
import { 
  detectThemeFormat, 
  parseJSONTheme, 
  parseCSSThemeToData,
  prepareThemeForExport,
  validateImportedTheme,
  migrateThemeData
} from '../../../infrastructure/converters';

/**
 * Use case for importing and exporting themes
 */
export class ImportExportThemeUseCase {

  /**
   * Imports a theme from file content
   */
  async importTheme(
    content: string,
    filename?: string
  ): Promise<ImportThemeResult> {
    try {
      // Detect format
      const format = detectThemeFormat(content);
      if (format === 'unknown') {
        return {
          success: false,
          error: 'Unrecognized theme format. Supported formats: JSON, CSS'
        };
      }

      // Parse based on format
      let themeData: ThemeData;
      
      switch (format) {
        case 'json':
          themeData = parseJSONTheme(content);
          break;
        case 'css':
          themeData = parseCSSThemeToData(content);
          break;
        default:
          return {
            success: false,
            error: `Unsupported format: ${format}`
          };
      }

      // Validate imported data
      const validation = validateImportedTheme(themeData);
      if (!validation.valid) {
        return {
          success: false,
          error: `Invalid theme data: ${validation.errors.join(', ')}`,
          warnings: validation.warnings
        };
      }

      // Migrate to current format if needed
      const migratedData = migrateThemeData(themeData);

      // Set name from filename if not provided
      if (!migratedData.name && filename) {
        migratedData.name = this.extractThemeNameFromFilename(filename);
      }

      // Create theme entity
      const theme = Theme.fromJSON(migratedData);

      // Validate the created theme
      const themeValidation = theme.validate();
      if (!themeValidation.valid) {
        return {
          success: false,
          error: `Theme validation failed: ${themeValidation.errors.join(', ')}`,
          warnings: validation.warnings
        };
      }

      return {
        success: true,
        theme,
        warnings: validation.warnings,
        metadata: {
          originalFormat: format,
          filename,
          importedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown import error'
      };
    }
  }

  /**
   * Exports a theme to the specified format
   */
  exportTheme(
    theme: Theme,
    format: ExportFormat,
    options?: ExportOptions
  ): ExportThemeResult {
    try {
      // Validate theme before export
      const validation = theme.validate();
      if (!validation.valid && !options?.ignoreValidation) {
        return {
          success: false,
          error: `Cannot export invalid theme: ${validation.errors.join(', ')}`
        };
      }

      // Prepare theme data
      const themeData = theme.toJSON();
      
      // Apply export options
      if (options?.includeMetadata === false) {
        delete themeData.metadata;
      }

      if (options?.customName) {
        themeData.name = options.customName;
      }

      // Generate export content
      const exportResult = prepareThemeForExport(themeData, format);

      return {
        success: true,
        content: exportResult.content,
        filename: options?.customFilename || exportResult.filename,
        mimeType: exportResult.mimeType,
        metadata: {
          format,
          exportedAt: new Date().toISOString(),
          originalThemeId: theme.id,
          size: exportResult.content.length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown export error'
      };
    }
  }

  /**
   * Exports multiple themes as a collection
   */
  exportThemeCollection(
    themes: Theme[],
    format: ExportFormat = 'json',
    collectionName?: string
  ): ExportThemeResult {
    try {
      if (themes.length === 0) {
        return {
          success: false,
          error: 'No themes provided for export'
        };
      }

      // Validate all themes
      const invalidThemes = themes.filter(theme => !theme.validate().valid);
      if (invalidThemes.length > 0) {
        return {
          success: false,
          error: `${invalidThemes.length} themes have validation errors`
        };
      }

      // Create collection data
      const collection = {
        name: collectionName || 'Theme Collection',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        generator: 'Alkitu Theme Builder',
        themes: themes.map(theme => theme.toJSON())
      };

      const content = JSON.stringify(collection, null, 2);
      const timestamp = new Date().toISOString().split('T')[0];
      const safeName = (collectionName || 'theme-collection')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');

      return {
        success: true,
        content,
        filename: `${safeName}-${timestamp}.json`,
        mimeType: 'application/json',
        metadata: {
          format: 'json',
          exportedAt: new Date().toISOString(),
          themeCount: themes.length,
          size: content.length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown export error'
      };
    }
  }

  /**
   * Creates a backup of a theme
   */
  createThemeBackup(theme: Theme): BackupResult {
    try {
      const backupData = {
        ...theme.toJSON(),
        backup: {
          createdAt: new Date().toISOString(),
          originalId: theme.id,
          version: theme.version
        }
      };

      const content = JSON.stringify(backupData, null, 2);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const safeName = theme.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

      return {
        success: true,
        content,
        filename: `${safeName}-backup-${timestamp}.json`,
        metadata: {
          originalThemeId: theme.id,
          backupCreatedAt: new Date().toISOString(),
          size: content.length
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create backup'
      };
    }
  }

  /**
   * Restores a theme from backup
   */
  restoreFromBackup(backupContent: string): RestoreResult {
    try {
      const backupData = JSON.parse(backupContent);
      
      // Validate backup structure
      if (!backupData.backup || !backupData.backup.originalId) {
        return {
          success: false,
          error: 'Invalid backup file structure'
        };
      }

      // Remove backup metadata for restoration
      const { backup, ...themeData } = backupData;
      
      // Create theme from backup
      const theme = Theme.fromJSON(themeData);
      
      return {
        success: true,
        theme,
        metadata: {
          originalId: backup.originalId,
          backupCreatedAt: backup.createdAt,
          restoredAt: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to restore from backup'
      };
    }
  }

  /**
   * Compares two themes and returns differences
   */
  compareThemes(theme1: Theme, theme2: Theme): ThemeComparisonResult {
    const differences: ThemeDifference[] = [];

    // Compare basic properties
    if (theme1.name !== theme2.name) {
      differences.push({
        type: 'property',
        property: 'name',
        value1: theme1.name,
        value2: theme2.name
      });
    }

    // Compare light palettes
    const lightDiffs = this.comparePalettes(
      theme1.lightPalette.toColorValues(),
      theme2.lightPalette.toColorValues(),
      'light'
    );
    differences.push(...lightDiffs);

    // Compare dark palettes
    const darkDiffs = this.comparePalettes(
      theme1.darkPalette.toColorValues(),
      theme2.darkPalette.toColorValues(),
      'dark'
    );
    differences.push(...darkDiffs);

    // Compare typography
    if (JSON.stringify(theme1.typography) !== JSON.stringify(theme2.typography)) {
      differences.push({
        type: 'typography',
        property: 'typography',
        value1: theme1.typography,
        value2: theme2.typography
      });
    }

    // Compare brand config
    if (JSON.stringify(theme1.brandConfig) !== JSON.stringify(theme2.brandConfig)) {
      differences.push({
        type: 'brand',
        property: 'brandConfig',
        value1: theme1.brandConfig,
        value2: theme2.brandConfig
      });
    }

    return {
      areEqual: differences.length === 0,
      differences,
      summary: {
        totalDifferences: differences.length,
        colorDifferences: differences.filter(d => d.type === 'color').length,
        propertyDifferences: differences.filter(d => d.type === 'property').length,
        typographyDifferences: differences.filter(d => d.type === 'typography').length,
        brandDifferences: differences.filter(d => d.type === 'brand').length
      }
    };
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Extracts theme name from filename
   */
  private extractThemeNameFromFilename(filename: string): string {
    return filename
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
      .trim();
  }

  /**
   * Compares two color palettes
   */
  private comparePalettes(
    palette1: Record<string, string>,
    palette2: Record<string, string>,
    mode: 'light' | 'dark'
  ): ThemeDifference[] {
    const differences: ThemeDifference[] = [];
    
    // Find colors in palette1 but not in palette2
    Object.keys(palette1).forEach(colorName => {
      if (!(colorName in palette2)) {
        differences.push({
          type: 'color',
          property: `${mode}.${colorName}`,
          value1: palette1[colorName],
          value2: undefined
        });
      } else if (palette1[colorName] !== palette2[colorName]) {
        differences.push({
          type: 'color',
          property: `${mode}.${colorName}`,
          value1: palette1[colorName],
          value2: palette2[colorName]
        });
      }
    });

    // Find colors in palette2 but not in palette1
    Object.keys(palette2).forEach(colorName => {
      if (!(colorName in palette1)) {
        differences.push({
          type: 'color',
          property: `${mode}.${colorName}`,
          value1: undefined,
          value2: palette2[colorName]
        });
      }
    });

    return differences;
  }
}

// ============================================================================
// TYPES
// ============================================================================

interface ImportThemeResult {
  success: boolean;
  theme?: Theme;
  error?: string;
  warnings?: string[];
  metadata?: {
    originalFormat: string;
    filename?: string;
    importedAt: string;
  };
}

interface ExportThemeResult {
  success: boolean;
  content?: string;
  filename?: string;
  mimeType?: string;
  error?: string;
  metadata?: {
    format: ExportFormat;
    exportedAt: string;
    originalThemeId?: string;
    themeCount?: number;
    size: number;
  };
}

interface ExportOptions {
  customName?: string;
  customFilename?: string;
  includeMetadata?: boolean;
  ignoreValidation?: boolean;
}

interface BackupResult {
  success: boolean;
  content?: string;
  filename?: string;
  error?: string;
  metadata?: {
    originalThemeId: string;
    backupCreatedAt: string;
    size: number;
  };
}

interface RestoreResult {
  success: boolean;
  theme?: Theme;
  error?: string;
  metadata?: {
    originalId: string;
    backupCreatedAt: string;
    restoredAt: string;
  };
}

interface ThemeComparisonResult {
  areEqual: boolean;
  differences: ThemeDifference[];
  summary: {
    totalDifferences: number;
    colorDifferences: number;
    propertyDifferences: number;
    typographyDifferences: number;
    brandDifferences: number;
  };
}

interface ThemeDifference {
  type: 'color' | 'property' | 'typography' | 'brand';
  property: string;
  value1: any;
  value2: any;
}