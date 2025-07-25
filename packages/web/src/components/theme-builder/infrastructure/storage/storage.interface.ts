/**
 * Theme Builder - Storage Interface
 * Defines contracts for storage adapters
 * Part of Clean Architecture infrastructure layer
 */

/**
 * Generic storage interface for theme builder data
 */
export interface IStorage<T = any> {
  /**
   * Gets a value by key
   */
  get(key: string): Promise<T | null>;

  /**
   * Sets a value by key
   */
  set(key: string, value: T): Promise<void>;

  /**
   * Removes a value by key
   */
  remove(key: string): Promise<void>;

  /**
   * Clears all storage
   */
  clear(): Promise<void>;

  /**
   * Gets all keys
   */
  keys(): Promise<string[]>;

  /**
   * Checks if key exists
   */
  has(key: string): Promise<boolean>;

  /**
   * Gets storage size (in bytes, if applicable)
   */
  size(): Promise<number>;
}

/**
 * Theme-specific storage interface
 */
export interface IThemeStorage {
  /**
   * Saves theme data
   */
  saveTheme(themeId: string, themeData: any): Promise<void>;

  /**
   * Loads theme data
   */
  loadTheme(themeId: string): Promise<any | null>;

  /**
   * Deletes theme data
   */
  deleteTheme(themeId: string): Promise<void>;

  /**
   * Lists all theme IDs
   */
  listThemes(): Promise<string[]>;

  /**
   * Exports theme data for backup
   */
  exportTheme(themeId: string): Promise<string | null>;

  /**
   * Imports theme data from backup
   */
  importTheme(themeId: string, backupData: string): Promise<void>;

  /**
   * Gets theme metadata
   */
  getThemeMetadata(themeId: string): Promise<ThemeMetadata | null>;

  /**
   * Updates theme metadata
   */
  updateThemeMetadata(themeId: string, metadata: Partial<ThemeMetadata>): Promise<void>;
}

/**
 * Cache-specific storage interface
 */
export interface ICacheStorage extends IStorage {
  /**
   * Sets a value with expiration time
   */
  setWithTTL(key: string, value: any, ttlMs: number): Promise<void>;

  /**
   * Gets remaining TTL for a key
   */
  getTTL(key: string): Promise<number>;

  /**
   * Extends TTL for a key
   */
  extendTTL(key: string, additionalMs: number): Promise<void>;

  /**
   * Clears expired items
   */
  clearExpired(): Promise<void>;
}

/**
 * Storage configuration options
 */
export interface StorageConfig {
  prefix?: string;
  maxSize?: number;
  compression?: boolean;
  encryption?: boolean;
  fallbackStorage?: IStorage;
}

/**
 * Storage operation result
 */
export interface StorageResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    timestamp: number;
    size: number;
    compressed?: boolean;
    encrypted?: boolean;
  };
}

/**
 * Theme metadata for storage
 */
export interface ThemeMetadata {
  id: string;
  name: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  size: number;
  checksum?: string;
  tags?: string[];
  description?: string;
  author?: string;
}

/**
 * Storage events
 */
export type StorageEvent = 
  | { type: 'SET'; key: string; value: any }
  | { type: 'GET'; key: string }
  | { type: 'REMOVE'; key: string }
  | { type: 'CLEAR' }
  | { type: 'ERROR'; error: string };

/**
 * Storage event listener
 */
export interface IStorageEventListener {
  onStorageEvent(event: StorageEvent): void;
}

/**
 * Storage adapter factory
 */
export interface IStorageFactory {
  createLocalStorage<T>(config?: StorageConfig): IStorage<T>;
  createSessionStorage<T>(config?: StorageConfig): IStorage<T>;
  createMemoryStorage<T>(config?: StorageConfig): IStorage<T>;
  createIndexedDBStorage<T>(config?: StorageConfig): IStorage<T>;
  createThemeStorage(baseStorage: IStorage, config?: StorageConfig): IThemeStorage;
  createCacheStorage(baseStorage: IStorage, config?: StorageConfig): ICacheStorage;
}