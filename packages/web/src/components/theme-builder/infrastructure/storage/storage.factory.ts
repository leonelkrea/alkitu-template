/**
 * Theme Builder - Storage Factory
 * Factory for creating different types of storage adapters
 * Part of Clean Architecture infrastructure layer
 */

import type { 
  IStorage, 
  IThemeStorage, 
  ICacheStorage, 
  IStorageFactory, 
  StorageConfig 
} from './storage.interface';
import { LocalStorageAdapter } from './local-storage.adapter';
import { SessionStorageAdapter } from './session-storage.adapter';
import { ThemeStorageAdapter } from './theme-storage.adapter';

/**
 * Factory implementation for creating storage adapters
 */
export class StorageFactory implements IStorageFactory {
  
  /**
   * Creates a localStorage-based storage adapter
   */
  createLocalStorage<T>(config?: StorageConfig): IStorage<T> {
    return new LocalStorageAdapter<T>(config);
  }

  /**
   * Creates a sessionStorage-based storage adapter
   */
  createSessionStorage<T>(config?: StorageConfig): IStorage<T> {
    return new SessionStorageAdapter<T>(config);
  }

  /**
   * Creates an in-memory storage adapter
   */
  createMemoryStorage<T>(config?: StorageConfig): IStorage<T> {
    return new MemoryStorageAdapter<T>(config);
  }

  /**
   * Creates an IndexedDB-based storage adapter
   */
  createIndexedDBStorage<T>(config?: StorageConfig): IStorage<T> {
    return new IndexedDBStorageAdapter<T>(config);
  }

  /**
   * Creates a theme-specific storage adapter
   */
  createThemeStorage(baseStorage: IStorage, config?: StorageConfig): IThemeStorage {
    return new ThemeStorageAdapter(baseStorage, config);
  }

  /**
   * Creates a cache storage adapter with TTL support
   */
  createCacheStorage(baseStorage: IStorage, config?: StorageConfig): ICacheStorage {
    return new CacheStorageAdapter(baseStorage, config);
  }

  /**
   * Creates the best available storage adapter based on environment
   */
  createBestAvailableStorage<T>(config?: StorageConfig): IStorage<T> {
    // Try localStorage first
    if (this.isLocalStorageAvailable()) {
      return this.createLocalStorage<T>(config);
    }
    
    // Fall back to sessionStorage
    if (this.isSessionStorageAvailable()) {
      return this.createSessionStorage<T>(config);
    }
    
    // Fall back to in-memory storage
    console.warn('Browser storage not available, using in-memory storage');
    return this.createMemoryStorage<T>(config);
  }

  /**
   * Creates a fallback storage chain
   */
  createFallbackStorage<T>(
    primaryStorage: IStorage<T>, 
    fallbackStorage: IStorage<T>
  ): IStorage<T> {
    return new FallbackStorageAdapter<T>(primaryStorage, fallbackStorage);
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Checks if localStorage is available
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if sessionStorage is available
   */
  private isSessionStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * In-memory storage implementation for testing or fallback
 */
class MemoryStorageAdapter<T = any> implements IStorage<T> {
  private data: Map<string, { value: T; metadata: any }> = new Map();
  private prefix: string;
  private maxSize: number;

  constructor(config: StorageConfig = {}) {
    this.prefix = config.prefix || 'theme-builder-memory-';
    this.maxSize = config.maxSize || 50 * 1024 * 1024; // 50MB in memory
  }

  async get(key: string): Promise<T | null> {
    const fullKey = this.getFullKey(key);
    const entry = this.data.get(fullKey);
    return entry ? entry.value : null;
  }

  async set(key: string, value: T): Promise<void> {
    const fullKey = this.getFullKey(key);
    const metadata = { timestamp: Date.now() };
    this.data.set(fullKey, { value, metadata });
  }

  async remove(key: string): Promise<void> {
    const fullKey = this.getFullKey(key);
    this.data.delete(fullKey);
  }

  async clear(): Promise<void> {
    const keysToDelete = Array.from(this.data.keys())
      .filter(key => key.startsWith(this.prefix));
    
    keysToDelete.forEach(key => this.data.delete(key));
  }

  async keys(): Promise<string[]> {
    return Array.from(this.data.keys())
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.slice(this.prefix.length));
  }

  async has(key: string): Promise<boolean> {
    const fullKey = this.getFullKey(key);
    return this.data.has(fullKey);
  }

  async size(): Promise<number> {
    let totalSize = 0;
    for (const [key, entry] of this.data) {
      if (key.startsWith(this.prefix)) {
        totalSize += JSON.stringify(entry).length;
      }
    }
    return totalSize;
  }

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}

/**
 * IndexedDB storage implementation (simplified)
 */
class IndexedDBStorageAdapter<T = any> implements IStorage<T> {
  private dbName: string;
  private storeName: string;
  private version: number;

  constructor(config: StorageConfig = {}) {
    this.dbName = 'ThemeBuilderDB';
    this.storeName = 'themes';
    this.version = 1;
  }

  async get(key: string): Promise<T | null> {
    // Simplified implementation - in practice would use IndexedDB API
    return null;
  }

  async set(key: string, value: T): Promise<void> {
    // Simplified implementation - in practice would use IndexedDB API
  }

  async remove(key: string): Promise<void> {
    // Simplified implementation - in practice would use IndexedDB API
  }

  async clear(): Promise<void> {
    // Simplified implementation - in practice would use IndexedDB API
  }

  async keys(): Promise<string[]> {
    // Simplified implementation - in practice would use IndexedDB API
    return [];
  }

  async has(key: string): Promise<boolean> {
    // Simplified implementation - in practice would use IndexedDB API
    return false;
  }

  async size(): Promise<number> {
    // Simplified implementation - in practice would use IndexedDB API
    return 0;
  }
}

/**
 * Cache storage with TTL support
 */
class CacheStorageAdapter implements ICacheStorage {
  private baseStorage: IStorage;
  private config: StorageConfig;

  constructor(baseStorage: IStorage, config: StorageConfig = {}) {
    this.baseStorage = baseStorage;
    this.config = config;
  }

  async get(key: string): Promise<any> {
    return this.baseStorage.get(key);
  }

  async set(key: string, value: any): Promise<void> {
    return this.baseStorage.set(key, value);
  }

  async setWithTTL(key: string, value: any, ttlMs: number): Promise<void> {
    const expiresAt = Date.now() + ttlMs;
    const wrappedValue = {
      data: value,
      expiresAt,
      ttl: ttlMs
    };
    return this.baseStorage.set(key, wrappedValue);
  }

  async getTTL(key: string): Promise<number> {
    const value = await this.baseStorage.get(key);
    if (value && value.expiresAt) {
      return Math.max(0, value.expiresAt - Date.now());
    }
    return 0;
  }

  async extendTTL(key: string, additionalMs: number): Promise<void> {
    const value = await this.baseStorage.get(key);
    if (value && value.expiresAt) {
      value.expiresAt += additionalMs;
      value.ttl += additionalMs;
      await this.baseStorage.set(key, value);
    }
  }

  async clearExpired(): Promise<void> {
    const keys = await this.baseStorage.keys();
    const now = Date.now();
    
    for (const key of keys) {
      const value = await this.baseStorage.get(key);
      if (value && value.expiresAt && now > value.expiresAt) {
        await this.baseStorage.remove(key);
      }
    }
  }

  async remove(key: string): Promise<void> {
    return this.baseStorage.remove(key);
  }

  async clear(): Promise<void> {
    return this.baseStorage.clear();
  }

  async keys(): Promise<string[]> {
    return this.baseStorage.keys();
  }

  async has(key: string): Promise<boolean> {
    return this.baseStorage.has(key);
  }

  async size(): Promise<number> {
    return this.baseStorage.size();
  }
}

/**
 * Fallback storage that tries primary first, then fallback
 */
class FallbackStorageAdapter<T = any> implements IStorage<T> {
  private primary: IStorage<T>;
  private fallback: IStorage<T>;

  constructor(primary: IStorage<T>, fallback: IStorage<T>) {
    this.primary = primary;
    this.fallback = fallback;
  }

  async get(key: string): Promise<T | null> {
    try {
      return await this.primary.get(key);
    } catch {
      return await this.fallback.get(key);
    }
  }

  async set(key: string, value: T): Promise<void> {
    try {
      await this.primary.set(key, value);
      // Also set in fallback for redundancy
      try {
        await this.fallback.set(key, value);
      } catch {
        // Ignore fallback set errors
      }
    } catch {
      await this.fallback.set(key, value);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await this.primary.remove(key);
    } catch {
      // Continue to fallback even if primary fails
    }
    
    try {
      await this.fallback.remove(key);
    } catch {
      // Ignore fallback errors
    }
  }

  async clear(): Promise<void> {
    try {
      await this.primary.clear();
    } catch {
      // Continue to fallback even if primary fails
    }
    
    try {
      await this.fallback.clear();
    } catch {
      // Ignore fallback errors
    }
  }

  async keys(): Promise<string[]> {
    try {
      return await this.primary.keys();
    } catch {
      return await this.fallback.keys();
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      return await this.primary.has(key);
    } catch {
      return await this.fallback.has(key);
    }
  }

  async size(): Promise<number> {
    try {
      return await this.primary.size();
    } catch {
      return await this.fallback.size();
    }
  }
}

// Create and export a default factory instance
export const storageFactory = new StorageFactory();