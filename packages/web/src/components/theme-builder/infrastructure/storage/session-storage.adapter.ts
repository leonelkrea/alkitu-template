/**
 * Theme Builder - SessionStorage Adapter
 * Implementation of IStorage interface using browser's sessionStorage
 * Part of Clean Architecture infrastructure layer
 */

import type { IStorage, StorageConfig, StorageEvent, IStorageEventListener } from './storage.interface';

/**
 * SessionStorage implementation of the storage interface
 * Similar to LocalStorageAdapter but uses sessionStorage (per-session only)
 */
export class SessionStorageAdapter<T = any> implements IStorage<T> {
  private prefix: string;
  private maxSize: number;
  private listeners: IStorageEventListener[] = [];

  constructor(config: StorageConfig = {}) {
    this.prefix = config.prefix || 'theme-builder-session-';
    this.maxSize = config.maxSize || 5 * 1024 * 1024; // 5MB default
  }

  /**
   * Gets a value by key
   */
  async get(key: string): Promise<T | null> {
    try {
      this.emitEvent({ type: 'GET', key });

      const fullKey = this.getFullKey(key);
      const rawData = sessionStorage.getItem(fullKey);

      if (rawData === null) {
        return null;
      }

      const parsed = this.parseStoredData<T>(rawData);
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

      sessionStorage.setItem(fullKey, serializedData);
      
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
      sessionStorage.removeItem(fullKey);
      
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
        sessionStorage.removeItem(fullKey);
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
      const allKeys = Object.keys(sessionStorage);
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
      return sessionStorage.getItem(fullKey) !== null;
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
        const data = sessionStorage.getItem(fullKey);
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
      
      // SessionStorage typically has similar quota to localStorage
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
  namespace(namespace: string): SessionStorageAdapter<T> {
    return new SessionStorageAdapter<T>({
      prefix: `${this.prefix}${namespace}-`,
      maxSize: this.maxSize
    });
  }

  /**
   * Gets session information
   */
  getSessionInfo(): {
    isNewSession: boolean;
    sessionId: string;
    startedAt: number;
  } {
    const sessionKey = this.getFullKey('__session_info__');
    let sessionInfo = sessionStorage.getItem(sessionKey);
    
    if (!sessionInfo) {
      // Create new session info
      const newSessionInfo = {
        isNewSession: true,
        sessionId: this.generateSessionId(),
        startedAt: Date.now()
      };
      
      sessionStorage.setItem(sessionKey, JSON.stringify(newSessionInfo));
      return newSessionInfo;
    }
    
    try {
      const parsed = JSON.parse(sessionInfo);
      return {
        ...parsed,
        isNewSession: false
      };
    } catch {
      // Corrupted session info, create new
      const newSessionInfo = {
        isNewSession: true,
        sessionId: this.generateSessionId(),
        startedAt: Date.now()
      };
      
      sessionStorage.setItem(sessionKey, JSON.stringify(newSessionInfo));
      return newSessionInfo;
    }
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
          version: '1.0.0',
          sessionId: this.getSessionInfo().sessionId
        }
      };

      return JSON.stringify(wrapped);
    } catch (error) {
      throw new Error(`Failed to serialize data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parses stored data
   */
  private parseStoredData<U>(rawData: string): { data: U; metadata?: any } {
    try {
      const parsed = JSON.parse(rawData);
      
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
   * Generates a unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}