/**
 * Offline Storage Service
 * Manages offline pin storage, queue, and sync
 */

import { getStorageItem, setStorageItem, removeStorageItem } from './storage';
import { Pin } from '../components/common/PinCard';

const STORAGE_KEYS = {
  OFFLINE_PINS: '@pinyourword:offline_pins',
  PENDING_UPLOADS: '@pinyourword:pending_uploads',
  LAST_SYNC: '@pinyourword:last_sync',
};

export interface PendingUpload {
  id: string;
  pin: Pin;
  action: 'create' | 'update' | 'delete';
  timestamp: number;
  retryCount: number;
}

export class OfflineStorageService {
  private static instance: OfflineStorageService;

  private constructor() {}

  static getInstance(): OfflineStorageService {
    if (!OfflineStorageService.instance) {
      OfflineStorageService.instance = new OfflineStorageService();
    }
    return OfflineStorageService.instance;
  }

  // ========================================================================
  // OFFLINE PINS (Local Cache)
  // ========================================================================

  /**
   * Get all offline pins
   */
  async getOfflinePins(): Promise<Pin[]> {
    const pins = await getStorageItem(STORAGE_KEYS.OFFLINE_PINS);
    return pins ? JSON.parse(pins) : [];
  }

  /**
   * Save pins to offline cache
   */
  async saveOfflinePins(pins: Pin[]): Promise<void> {
    await setStorageItem(STORAGE_KEYS.OFFLINE_PINS, JSON.stringify(pins));
  }

  /**
   * Add a pin to offline cache
   */
  async addOfflinePin(pin: Pin): Promise<void> {
    const pins = await this.getOfflinePins();
    pins.push(pin);
    await this.saveOfflinePins(pins);
  }

  /**
   * Update a pin in offline cache
   */
  async updateOfflinePin(pinId: string, updates: Partial<Pin>): Promise<void> {
    const pins = await this.getOfflinePins();
    const index = pins.findIndex(p => p.id === pinId);
    if (index !== -1) {
      pins[index] = { ...pins[index], ...updates };
      await this.saveOfflinePins(pins);
    }
  }

  /**
   * Delete a pin from offline cache
   */
  async deleteOfflinePin(pinId: string): Promise<void> {
    const pins = await this.getOfflinePins();
    const filtered = pins.filter(p => p.id !== pinId);
    await this.saveOfflinePins(filtered);
  }

  /**
   * Clear all offline pins
   */
  async clearOfflinePins(): Promise<void> {
    await removeStorageItem(STORAGE_KEYS.OFFLINE_PINS);
  }

  // ========================================================================
  // PENDING UPLOADS (Sync Queue)
  // ========================================================================

  /**
   * Get pending uploads
   */
  async getPendingUploads(): Promise<PendingUpload[]> {
    const uploads = await getStorageItem(STORAGE_KEYS.PENDING_UPLOADS);
    return uploads ? JSON.parse(uploads) : [];
  }

  /**
   * Add upload to pending queue
   */
  async addPendingUpload(pin: Pin, action: 'create' | 'update' | 'delete'): Promise<void> {
    const uploads = await this.getPendingUploads();

    const upload: PendingUpload = {
      id: `${action}_${pin.id}_${Date.now()}`,
      pin,
      action,
      timestamp: Date.now(),
      retryCount: 0,
    };

    uploads.push(upload);
    await setStorageItem(STORAGE_KEYS.PENDING_UPLOADS, JSON.stringify(uploads));
  }

  /**
   * Remove upload from pending queue
   */
  async removePendingUpload(uploadId: string): Promise<void> {
    const uploads = await this.getPendingUploads();
    const filtered = uploads.filter(u => u.id !== uploadId);
    await setStorageItem(STORAGE_KEYS.PENDING_UPLOADS, JSON.stringify(filtered));
  }

  /**
   * Increment retry count for upload
   */
  async incrementRetryCount(uploadId: string): Promise<void> {
    const uploads = await this.getPendingUploads();
    const upload = uploads.find(u => u.id === uploadId);
    if (upload) {
      upload.retryCount++;
      await setStorageItem(STORAGE_KEYS.PENDING_UPLOADS, JSON.stringify(uploads));
    }
  }

  /**
   * Clear all pending uploads
   */
  async clearPendingUploads(): Promise<void> {
    await removeStorageItem(STORAGE_KEYS.PENDING_UPLOADS);
  }

  /**
   * Get pending uploads count
   */
  async getPendingUploadsCount(): Promise<number> {
    const uploads = await this.getPendingUploads();
    return uploads.length;
  }

  // ========================================================================
  // SYNC STATUS
  // ========================================================================

  /**
   * Get last sync timestamp
   */
  async getLastSync(): Promise<number | null> {
    const timestamp = await getStorageItem(STORAGE_KEYS.LAST_SYNC);
    return timestamp ? parseInt(timestamp, 10) : null;
  }

  /**
   * Update last sync timestamp
   */
  async updateLastSync(): Promise<void> {
    await setStorageItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  /**
   * Check if offline mode is needed
   */
  async needsSync(): Promise<boolean> {
    const count = await this.getPendingUploadsCount();
    return count > 0;
  }

  /**
   * Get sync stats
   */
  async getSyncStats(): Promise<{
    lastSync: number | null;
    pendingCount: number;
    offlinePinsCount: number;
  }> {
    const [lastSync, pendingCount, offlinePins] = await Promise.all([
      this.getLastSync(),
      this.getPendingUploadsCount(),
      this.getOfflinePins(),
    ]);

    return {
      lastSync,
      pendingCount,
      offlinePinsCount: offlinePins.length,
    };
  }
}

// Export singleton
export const offlineStorage = OfflineStorageService.getInstance();
