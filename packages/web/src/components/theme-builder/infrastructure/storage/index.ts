/**
 * Theme Builder - Storage Index
 * Central export point for all storage adapters and interfaces
 */

// ============================================================================
// INTERFACES
// ============================================================================
export type {
  IStorage,
  IThemeStorage,
  ICacheStorage,
  IStorageFactory,
  StorageConfig,
  StorageResult,
  StorageEvent,
  IStorageEventListener,
  ThemeMetadata
} from './storage.interface';

// ============================================================================
// ADAPTERS
// ============================================================================
export { LocalStorageAdapter } from './local-storage.adapter';
export { SessionStorageAdapter } from './session-storage.adapter';
export { ThemeStorageAdapter } from './theme-storage.adapter';

// ============================================================================
// FACTORY
// ============================================================================
export { StorageFactory, storageFactory } from './storage.factory';