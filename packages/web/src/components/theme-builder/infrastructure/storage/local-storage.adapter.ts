/**
 * Theme Builder - LocalStorage Adapter
 * Implementation of IStorage interface using browser's localStorage
 * Part of Clean Architecture infrastructure layer
 */

import type { IStorage, StorageConfig, StorageResult, StorageEvent, IStorageEventListener } from './storage.interface';

/**
 * LocalStorage implementation of the storage interface
 */
export class LocalStorageAdapter<T = any> implements IStorage<T> {
  private prefix: string;
  private maxSize: number;
  private compression: boolean;
  private encryption: boolean;
  private listeners: IStorageEventListener[] = [];

  constructor(config: StorageConfig = {}) {
    this.prefix = config.prefix || 'theme-builder-';
    this.maxSize = config.maxSize || 5 * 1024 * 1024; // 5MB default
    this.compression = config.compression || false;
    this.encryption = config.encryption || false;
  }

  /**
   * Gets a value by key
   */
  async get(key: string): Promise<T | null> {
    try {
      this.emitEvent({ type: 'GET', key });

      const fullKey = this.getFullKey(key);
      const rawData = localStorage.getItem(fullKey);

      if (rawData === null) {
        return null;
      }

      const parsed = this.parseStoredData<T>(rawData);
      
      // Check if data has expired (if TTL was set)
      if (parsed.metadata?.expiresAt && Date.now() > parsed.metadata.expiresAt) {
        await this.remove(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      this.emitEvent({ type: 'ERROR', error: error instanceof Error ? error.message : 'Unknown error' });
      return null;
    }
  }

  /**
   * Sets a value by key
   */
  async set(key: string, value: T): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      const serializedData = this.serializeData(value);

      // Check storage quota
      await this.checkStorageQuota(serializedData);

      localStorage.setItem(fullKey, serializedData);
      
      this.emitEvent({ type: 'SET', key, value });
    } catch (error) {
      this.emitEvent({ type: 'ERROR', error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  /**
   * Sets a value with TTL (Time To Live)
   */
  async setWithTTL(key: string, value: T, ttlMs: number): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      const expiresAt = Date.now() + ttlMs;
      const dataWithTTL = {
        data: value,
        metadata: {
          expiresAt,
          ttl: ttlMs,
          createdAt: Date.now()
        }
      };

      const serializedData = JSON.stringify(dataWithTTL);
      
      // Check storage quota
      await this.checkStorageQuota(serializedData);

      localStorage.setItem(fullKey, serializedData);
      
      this.emitEvent({ type: 'SET', key, value });
    } catch (error) {
      this.emitEvent({ type: 'ERROR', error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  /**
   * Removes a value by key
   */
  async remove(key: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.removeItem(fullKey);
      
      this.emitEvent({ type: 'REMOVE', key });
    } catch (error) {
      this.emitEvent({ type: 'ERROR', error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  /**
   * Clears all storage for this adapter
   */
  async clear(): Promise<void> {
    try {
      const keys = await this.keys();
      
      keys.forEach(key => {
        const fullKey = this.getFullKey(key);
        localStorage.removeItem(fullKey);
      });
      
      this.emitEvent({ type: 'CLEAR' });
    } catch (error) {
      this.emitEvent({ type: 'ERROR', error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  /**
   * Gets all keys managed by this adapter
   */
  async keys(): Promise<string[]> {
    try {
      const allKeys = Object.keys(localStorage);
      return allKeys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.slice(this.prefix.length));
    } catch (error) {
      this.emitEvent({ type: 'ERROR', error: error instanceof Error ? error.message : 'Unknown error' });
      return [];
    }
  }

  /**
   * Checks if key exists
   */
  async has(key: string): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(key);
      return localStorage.getItem(fullKey) !== null;
    } catch (error) {
      this.emitEvent({ type: 'ERROR', error: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  }

  /**
   * Gets approximate storage size in bytes
   */
  async size(): Promise<number> {
    try {
      const keys = await this.keys();
      let totalSize = 0;

      keys.forEach(key => {
        const fullKey = this.getFullKey(key);
        const data = localStorage.getItem(fullKey);
        if (data) {
          totalSize += new Blob([data]).size;
        }
      });

      return totalSize;
    } catch (error) {
      this.emitEvent({ type: 'ERROR', error: error instanceof Error ? error.message : 'Unknown error' });
      return 0;
    }
  }

  /**
   * Gets storage usage information
   */
  async getStorageInfo(): Promise<{
    used: number;
    available: number;
    quota: number;
    itemCount: number;
  }> {
    try {
      const used = await this.size();
      const keys = await this.keys();
      
      // Estimate available space (localStorage quota is usually ~5-10MB)
      const estimatedQuota = 10 * 1024 * 1024; // 10MB estimate
      const available = Math.max(0, estimatedQuota - used);

      return {
        used,
        available,
        quota: estimatedQuota,
        itemCount: keys.length
      };
    } catch (error) {
      return {
        used: 0,
        available: 0,
        quota: 0,
        itemCount: 0
      };
    }
  }

  /**
   * Cleans up expired items
   */
  async cleanup(): Promise<number> {
    try {
      const keys = await this.keys();
      let cleanedCount = 0;

      for (const key of keys) {
        const data = await this.get(key);
        if (data === null) {
          // Item was expired and removed by get()
          cleanedCount++;
        }
      }

      return cleanedCount;
    } catch (error) {
      this.emitEvent({ type: 'ERROR', error: error instanceof Error ? error.message : 'Unknown error' });
      return 0;
    }
  }

  /**
   * Adds storage event listener
   */
  addListener(listener: IStorageEventListener): void {
    this.listeners.push(listener);
  }

  /**
   * Removes storage event listener
   */
  removeListener(listener: IStorageEventListener): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Creates a namespaced storage adapter
   */
  namespace(namespace: string): LocalStorageAdapter<T> {
    return new LocalStorageAdapter<T>({
      prefix: `${this.prefix}${namespace}-`,
      maxSize: this.maxSize,
      compression: this.compression,
      encryption: this.encryption
    });
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Gets the full key with prefix
   */
  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Serializes data for storage
   */
  private serializeData(data: T): string {
    try {
      const wrapped = {
        data,
        metadata: {
          timestamp: Date.now(),
          version: '1.0.0'
        }
      };

      let serialized = JSON.stringify(wrapped);

      // Apply compression if enabled
      if (this.compression) {
        serialized = this.compress(serialized);
      }

      // Apply encryption if enabled
      if (this.encryption) {
        serialized = this.encrypt(serialized);
      }

      return serialized;
    } catch (error) {
      throw new Error(`Failed to serialize data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parses stored data
   */
  private parseStoredData<U>(rawData: string): { data: U; metadata?: any } {
    try {
      let processed = rawData;

      // Apply decryption if enabled
      if (this.encryption) {
        processed = this.decrypt(processed);
      }

      // Apply decompression if enabled
      if (this.compression) {
        processed = this.decompress(processed);
      }

      const parsed = JSON.parse(processed);
      
      // Handle legacy data without metadata wrapper
      if (parsed.data !== undefined && parsed.metadata !== undefined) {
        return parsed;
      } else {
        return { data: parsed as U };
      }
    } catch (error) {
      throw new Error(`Failed to parse stored data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Checks storage quota before writing
   */
  private async checkStorageQuota(data: string): Promise<void> {
    const dataSize = new Blob([data]).size;
    const currentSize = await this.size();
    
    if (currentSize + dataSize > this.maxSize) {
      throw new Error(`Storage quota exceeded. Current: ${currentSize}, Adding: ${dataSize}, Max: ${this.maxSize}`);
    }
  }

  /**
   * Emits storage event to listeners
   */
  private emitEvent(event: StorageEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener.onStorageEvent(event);
      } catch (error) {
        console.warn('Storage event listener error:', error);
      }
    });
  }

  /**
   * Compresses data (simplified implementation)
   */
  private compress(data: string): string {
    // In a real implementation, you'd use a compression library like pako
    // For now, this is a placeholder
    return data;
  }

  /**
   * Decompresses data (simplified implementation)
   */
  private decompress(data: string): string {
    // In a real implementation, you'd use a compression library like pako
    // For now, this is a placeholder
    return data;
  }

  /**
   * Encrypts data (simplified implementation)
   */
  private encrypt(data: string): string {
    // In a real implementation, you'd use proper encryption
    // For now, this is a placeholder that just base64 encodes
    return btoa(data);
  }

  /**
   * Decrypts data (simplified implementation)
   */
  private decrypt(data: string): string {
    // In a real implementation, you'd use proper decryption
    // For now, this is a placeholder that just base64 decodes
    try {
      return atob(data);
    } catch {
      // Fallback for non-encrypted data
      return data;
    }
  }
}