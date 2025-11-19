/**
 * Pin Repository
 * Abstraction layer for pin data access (API + Offline Storage)
 */

import { Pin } from '../components/common/PinCard';
import { pinService } from '../services/pinService';
import { offlineStorage } from '../services/offlineStorage';
import { errorHandler } from '../services/errorHandler';

export interface PinRepository {
  getPins(): Promise<Pin[]>;
  getPinById(id: string): Promise<Pin | null>;
  createPin(pin: Pin): Promise<Pin>;
  updatePin(id: string, updates: Partial<Pin>): Promise<Pin>;
  deletePin(id: string): Promise<void>;
  syncPendingChanges(): Promise<void>;
}

export class PinRepositoryImpl implements PinRepository {
  private isOnline: boolean = true;

  constructor(private enableOffline: boolean = true) {}

  /**
   * Check if device is online
   */
  private async checkOnlineStatus(): Promise<boolean> {
    // In a real app, use NetInfo from @react-native-community/netinfo
    // For now, assume always online unless explicitly set
    return this.isOnline;
  }

  /**
   * Get all pins
   */
  async getPins(): Promise<Pin[]> {
    const isOnline = await this.checkOnlineStatus();

    if (isOnline) {
      try {
        // Try to fetch from API
        const response = await pinService.handlegetPinByUser();
        const pins = response.data || [];

        // Cache to offline storage
        if (this.enableOffline) {
          await offlineStorage.saveOfflinePins(pins);
        }

        return pins;
      } catch (error) {
        errorHandler.handle(error, 'PinRepository.getPins');

        // Fallback to offline storage
        if (this.enableOffline) {
          return await offlineStorage.getOfflinePins();
        }

        throw error;
      }
    } else {
      // Return cached pins
      if (this.enableOffline) {
        return await offlineStorage.getOfflinePins();
      }

      throw errorHandler.handle(
        new Error('No internet connection and offline mode disabled'),
        'PinRepository.getPins'
      );
    }
  }

  /**
   * Get pin by ID
   */
  async getPinById(id: string): Promise<Pin | null> {
    const pins = await this.getPins();
    return pins.find(p => p.id === id) || null;
  }

  /**
   * Create a new pin
   */
  async createPin(pin: Pin): Promise<Pin> {
    const isOnline = await this.checkOnlineStatus();

    if (isOnline) {
      try {
        const response = await pinService.handlegetCreatePinByUser(pin as any);
        const createdPin = response.data;

        // Update offline cache
        if (this.enableOffline) {
          await offlineStorage.addOfflinePin(createdPin);
        }

        return createdPin;
      } catch (error) {
        errorHandler.handle(error, 'PinRepository.createPin');

        // Queue for later sync
        if (this.enableOffline) {
          await offlineStorage.addOfflinePin(pin);
          await offlineStorage.addPendingUpload(pin, 'create');
        }

        throw error;
      }
    } else {
      // Save to offline cache and queue
      if (this.enableOffline) {
        await offlineStorage.addOfflinePin(pin);
        await offlineStorage.addPendingUpload(pin, 'create');
        return pin;
      }

      throw errorHandler.handle(
        new Error('Cannot create pin offline'),
        'PinRepository.createPin'
      );
    }
  }

  /**
   * Update a pin
   */
  async updatePin(id: string, updates: Partial<Pin>): Promise<Pin> {
    const isOnline = await this.checkOnlineStatus();

    // Get current pin
    const currentPin = await this.getPinById(id);
    if (!currentPin) {
      throw errorHandler.handle(
        new Error(`Pin with id ${id} not found`),
        'PinRepository.updatePin'
      );
    }

    const updatedPin = { ...currentPin, ...updates };

    if (isOnline) {
      try {
        // Update via API (implement updatePin API method)
        // const response = await pinService.updatePin(id, updates);

        // For now, just update locally
        if (this.enableOffline) {
          await offlineStorage.updateOfflinePin(id, updates);
        }

        return updatedPin;
      } catch (error) {
        errorHandler.handle(error, 'PinRepository.updatePin');

        // Queue for later sync
        if (this.enableOffline) {
          await offlineStorage.updateOfflinePin(id, updates);
          await offlineStorage.addPendingUpload(updatedPin, 'update');
        }

        throw error;
      }
    } else {
      // Update offline and queue
      if (this.enableOffline) {
        await offlineStorage.updateOfflinePin(id, updates);
        await offlineStorage.addPendingUpload(updatedPin, 'update');
        return updatedPin;
      }

      throw errorHandler.handle(
        new Error('Cannot update pin offline'),
        'PinRepository.updatePin'
      );
    }
  }

  /**
   * Delete a pin
   */
  async deletePin(id: string): Promise<void> {
    const isOnline = await this.checkOnlineStatus();

    const pin = await this.getPinById(id);
    if (!pin) {
      throw errorHandler.handle(
        new Error(`Pin with id ${id} not found`),
        'PinRepository.deletePin'
      );
    }

    if (isOnline) {
      try {
        // Delete via API (implement deletePin API method)
        // await pinService.deletePin(id);

        // Delete from offline cache
        if (this.enableOffline) {
          await offlineStorage.deleteOfflinePin(id);
        }
      } catch (error) {
        errorHandler.handle(error, 'PinRepository.deletePin');

        // Queue for later sync
        if (this.enableOffline) {
          await offlineStorage.deleteOfflinePin(id);
          await offlineStorage.addPendingUpload(pin, 'delete');
        }

        throw error;
      }
    } else {
      // Delete offline and queue
      if (this.enableOffline) {
        await offlineStorage.deleteOfflinePin(id);
        await offlineStorage.addPendingUpload(pin, 'delete');
      } else {
        throw errorHandler.handle(
          new Error('Cannot delete pin offline'),
          'PinRepository.deletePin'
        );
      }
    }
  }

  /**
   * Sync pending changes with server
   */
  async syncPendingChanges(): Promise<void> {
    if (!this.enableOffline) return;

    const isOnline = await this.checkOnlineStatus();
    if (!isOnline) {
      throw errorHandler.handle(
        new Error('Cannot sync while offline'),
        'PinRepository.syncPendingChanges'
      );
    }

    const pendingUploads = await offlineStorage.getPendingUploads();
    const maxRetries = 3;

    for (const upload of pendingUploads) {
      // Skip if too many retries
      if (upload.retryCount >= maxRetries) {
        console.warn(`Upload ${upload.id} exceeded max retries, skipping`);
        continue;
      }

      try {
        switch (upload.action) {
          case 'create':
            await pinService.handlegetCreatePinByUser(upload.pin as any);
            break;
          case 'update':
            // await pinService.updatePin(upload.pin.id, upload.pin);
            console.warn('Update not implemented yet');
            break;
          case 'delete':
            // await pinService.deletePin(upload.pin.id);
            console.warn('Delete not implemented yet');
            break;
        }

        // Remove from queue on success
        await offlineStorage.removePendingUpload(upload.id);
      } catch (error) {
        errorHandler.handle(error, `PinRepository.syncPendingChanges.${upload.action}`);

        // Increment retry count
        await offlineStorage.incrementRetryCount(upload.id);
      }
    }

    // Update last sync timestamp
    await offlineStorage.updateLastSync();
  }

  /**
   * Set online status (for testing)
   */
  setOnlineStatus(isOnline: boolean): void {
    this.isOnline = isOnline;
  }
}

// Export singleton
export const pinRepository = new PinRepositoryImpl(true);
