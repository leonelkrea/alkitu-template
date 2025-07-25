/**
 * Theme Builder - Theme Storage Adapter
 * Specialized storage adapter for theme data management
 * Part of Clean Architecture infrastructure layer
 */

import type { 
  IStorage, 
  IThemeStorage, 
  StorageConfig, 
  ThemeMetadata 
} from './storage.interface';
import { Theme } from '../../domain/entities/theme.entity';

/**
 * Theme-specific storage implementation
 * Provides high-level operations for theme persistence
 */
export class ThemeStorageAdapter implements IThemeStorage {
  private baseStorage: IStorage;
  private metadataStorage: IStorage<ThemeMetadata>;
  private config: StorageConfig;

  constructor(baseStorage: IStorage, config: StorageConfig = {}) {
    this.baseStorage = baseStorage;
    this.config = config;
    
    // Create separate storage for metadata
    this.metadataStorage = this.createNamespacedStorage<ThemeMetadata>('metadata');
  }

  /**
   * Saves theme data with metadata
   */
  async saveTheme(themeId: string, themeData: any): Promise<void> {
    try {
      // Validate theme data
      if (!themeData || !themeData.name) {
        throw new Error('Invalid theme data: missing required properties');
      }

      // Save theme data
      const themeKey = this.getThemeKey(themeId);
      await this.baseStorage.set(themeKey, themeData);

      // Save or update metadata
      const existingMetadata = await this.metadataStorage.get(themeId);
      const metadata: ThemeMetadata = {
        id: themeId,
        name: themeData.name,
        version: themeData.version || '1.0.0',
        createdAt: existingMetadata?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        size: this.calculateThemeSize(themeData),
        checksum: await this.calculateChecksum(themeData),
        tags: themeData.tags || existingMetadata?.tags || [],
        description: themeData.description || existingMetadata?.description,
        author: themeData.author || existingMetadata?.author
      };

      await this.metadataStorage.set(themeId, metadata);

      // Trigger cleanup if storage is getting full
      await this.performMaintenanceIfNeeded();

    } catch (error) {
      throw new Error(`Failed to save theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Loads theme data by ID
   */
  async loadTheme(themeId: string): Promise<any | null> {
    try {
      const themeKey = this.getThemeKey(themeId);
      const themeData = await this.baseStorage.get(themeKey);

      if (!themeData) {
        return null;
      }

      // Verify data integrity
      const metadata = await this.metadataStorage.get(themeId);
      if (metadata?.checksum) {
        const currentChecksum = await this.calculateChecksum(themeData);
        if (currentChecksum !== metadata.checksum) {
          console.warn(`Theme ${themeId} checksum mismatch. Data may be corrupted.`);
        }
      }

      return themeData;
    } catch (error) {
      throw new Error(`Failed to load theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Deletes theme and its metadata
   */
  async deleteTheme(themeId: string): Promise<void> {
    try {
      const themeKey = this.getThemeKey(themeId);
      
      // Remove theme data
      await this.baseStorage.remove(themeKey);
      
      // Remove metadata
      await this.metadataStorage.remove(themeId);

    } catch (error) {
      throw new Error(`Failed to delete theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Lists all theme IDs
   */
  async listThemes(): Promise<string[]> {
    try {
      const metadataKeys = await this.metadataStorage.keys();
      
      // Filter out invalid entries
      const validThemes: string[] = [];
      
      for (const themeId of metadataKeys) {
        const themeKey = this.getThemeKey(themeId);
        const hasThemeData = await this.baseStorage.has(themeKey);
        
        if (hasThemeData) {
          validThemes.push(themeId);
        } else {
          // Clean up orphaned metadata
          await this.metadataStorage.remove(themeId);
        }
      }

      return validThemes;
    } catch (error) {
      throw new Error(`Failed to list themes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Exports theme data as JSON string
   */
  async exportTheme(themeId: string): Promise<string | null> {
    try {
      const themeData = await this.loadTheme(themeId);
      if (!themeData) {
        return null;
      }

      const metadata = await this.metadataStorage.get(themeId);
      
      const exportData = {
        ...themeData,
        exportMetadata: {
          exportedAt: new Date().toISOString(),
          exportVersion: '1.0.0',
          originalMetadata: metadata
        }
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      throw new Error(`Failed to export theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Imports theme data from JSON string
   */
  async importTheme(themeId: string, backupData: string): Promise<void> {
    try {
      const importedData = JSON.parse(backupData);
      
      // Validate imported data structure
      if (!importedData.name || !importedData.lightModeConfig || !importedData.darkModeConfig) {
        throw new Error('Invalid theme backup data structure');
      }

      // Remove export metadata before saving
      const { exportMetadata, ...cleanThemeData } = importedData;
      
      // Save the theme
      await this.saveTheme(themeId, cleanThemeData);

    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON in backup data');
      }
      throw new Error(`Failed to import theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets theme metadata
   */
  async getThemeMetadata(themeId: string): Promise<ThemeMetadata | null> {
    try {
      return await this.metadataStorage.get(themeId);
    } catch (error) {
      throw new Error(`Failed to get theme metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Updates theme metadata
   */
  async updateThemeMetadata(themeId: string, metadata: Partial<ThemeMetadata>): Promise<void> {
    try {
      const existingMetadata = await this.metadataStorage.get(themeId);
      
      if (!existingMetadata) {
        throw new Error(`Theme metadata not found for ID: ${themeId}`);
      }

      const updatedMetadata: ThemeMetadata = {
        ...existingMetadata,
        ...metadata,
        id: themeId, // Ensure ID cannot be changed
        updatedAt: new Date().toISOString()
      };

      await this.metadataStorage.set(themeId, updatedMetadata);

    } catch (error) {
      throw new Error(`Failed to update theme metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets storage statistics
   */
  async getStorageStats(): Promise<{
    totalThemes: number;
    totalSize: number;
    averageThemeSize: number;
    oldestTheme?: ThemeMetadata;
    newestTheme?: ThemeMetadata;
    largestTheme?: ThemeMetadata;
  }> {
    try {
      const themeIds = await this.listThemes();
      const metadataList: ThemeMetadata[] = [];

      // Collect all metadata
      for (const themeId of themeIds) {
        const metadata = await this.metadataStorage.get(themeId);
        if (metadata) {
          metadataList.push(metadata);
        }
      }

      // Calculate statistics
      const totalSize = metadataList.reduce((sum, meta) => sum + meta.size, 0);
      const averageSize = metadataList.length > 0 ? totalSize / metadataList.length : 0;

      // Find extremes
      const oldestTheme = metadataList.reduce((oldest, current) => 
        !oldest || new Date(current.createdAt) < new Date(oldest.createdAt) ? current : oldest, 
        null as ThemeMetadata | null
      );

      const newestTheme = metadataList.reduce((newest, current) => 
        !newest || new Date(current.createdAt) > new Date(newest.createdAt) ? current : newest, 
        null as ThemeMetadata | null
      );

      const largestTheme = metadataList.reduce((largest, current) => 
        !largest || current.size > largest.size ? current : largest, 
        null as ThemeMetadata | null
      );

      return {
        totalThemes: themeIds.length,
        totalSize,
        averageThemeSize: averageSize,
        oldestTheme: oldestTheme || undefined,
        newestTheme: newestTheme || undefined,
        largestTheme: largestTheme || undefined
      };

    } catch (error) {
      throw new Error(`Failed to get storage stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Performs storage cleanup
   */
  async cleanup(): Promise<{
    deletedThemes: number;
    freedSpace: number;
    errors: string[];
  }> {
    const result = {
      deletedThemes: 0,
      freedSpace: 0,
      errors: [] as string[]
    };

    try {
      const themeIds = await this.listThemes();
      const stats = await this.getStorageStats();

      // Clean up orphaned data
      const allThemeKeys = await this.baseStorage.keys();
      const themePrefix = this.getThemeKeyPrefix();
      
      for (const key of allThemeKeys) {
        if (key.startsWith(themePrefix)) {
          const themeId = key.slice(themePrefix.length);
          const hasMetadata = await this.metadataStorage.has(themeId);
          
          if (!hasMetadata) {
            try {
              const themeData = await this.baseStorage.get(key);
              const size = this.calculateThemeSize(themeData);
              
              await this.baseStorage.remove(key);
              result.deletedThemes++;
              result.freedSpace += size;
            } catch (error) {
              result.errors.push(`Failed to clean up orphaned theme ${themeId}: ${error instanceof Error ? error.message : 'Unknown'}`);
            }
          }
        }
      }

      // Clean up orphaned metadata
      const metadataKeys = await this.metadataStorage.keys();
      for (const themeId of metadataKeys) {
        const themeKey = this.getThemeKey(themeId);
        const hasThemeData = await this.baseStorage.has(themeKey);
        
        if (!hasThemeData) {
          try {
            await this.metadataStorage.remove(themeId);
          } catch (error) {
            result.errors.push(`Failed to clean up orphaned metadata ${themeId}: ${error instanceof Error ? error.message : 'Unknown'}`);
          }
        }
      }

    } catch (error) {
      result.errors.push(`Cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Gets the storage key for a theme
   */
  private getThemeKey(themeId: string): string {
    return `theme-${themeId}`;
  }

  /**
   * Gets the theme key prefix
   */
  private getThemeKeyPrefix(): string {
    return 'theme-';
  }

  /**
   * Creates a namespaced storage instance
   */
  private createNamespacedStorage<T>(namespace: string): IStorage<T> {
    // This is a simplified implementation
    // In practice, you'd properly namespace the base storage
    return this.baseStorage as IStorage<T>;
  }

  /**
   * Calculates the approximate size of theme data
   */
  private calculateThemeSize(themeData: any): number {
    try {
      return new Blob([JSON.stringify(themeData)]).size;
    } catch {
      return 0;
    }
  }

  /**
   * Calculates a simple checksum for data integrity
   */
  private async calculateChecksum(data: any): Promise<string> {
    try {
      const jsonString = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(jsonString);
      
      // Simple hash function (in production, use crypto.subtle.digest)
      let hash = 0;
      for (let i = 0; i < dataBytes.length; i++) {
        const char = dataBytes[i];
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      
      return Math.abs(hash).toString(16);
    } catch {
      return 'unknown';
    }
  }

  /**
   * Performs maintenance if storage is getting full
   */
  private async performMaintenanceIfNeeded(): Promise<void> {
    try {
      // Check if we need to perform maintenance based on storage size
      const baseStorageSize = await this.baseStorage.size();
      const maxSize = this.config.maxSize || 5 * 1024 * 1024; // 5MB default
      
      if (baseStorageSize > maxSize * 0.8) { // 80% threshold
        console.log('Theme storage is getting full, performing maintenance...');
        await this.cleanup();
      }
    } catch (error) {
      console.warn('Failed to perform storage maintenance:', error);
    }
  }
}