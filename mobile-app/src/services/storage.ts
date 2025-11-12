import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';

export const storage = {
  // Save data
  save: async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },

  // Get data
  get: async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading data:', error);
      return null;
    }
  },

  // Remove data
  remove: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  },

  // Clear all data
  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
};

// User-specific storage helpers
export const userStorage = {
  saveToken: (token: string) => storage.save(STORAGE_KEYS.USER_TOKEN, token),
  getToken: () => storage.get(STORAGE_KEYS.USER_TOKEN),
  removeToken: () => storage.remove(STORAGE_KEYS.USER_TOKEN),

  saveUserData: (userData: any) => storage.save(STORAGE_KEYS.USER_DATA, userData),
  getUserData: () => storage.get(STORAGE_KEYS.USER_DATA),
  removeUserData: () => storage.remove(STORAGE_KEYS.USER_DATA),
};

// Onboarding storage
export const onboardingStorage = {
  setWalkthroughSeen: () => storage.save(STORAGE_KEYS.HAS_SEEN_WALKTHROUGH, true),
  hasSeenWalkthrough: () => storage.get(STORAGE_KEYS.HAS_SEEN_WALKTHROUGH),
};

// Offline pins storage
export const pinStorage = {
  saveOfflinePins: (pins: any[]) => storage.save(STORAGE_KEYS.OFFLINE_PINS, pins),
  getOfflinePins: () => storage.get(STORAGE_KEYS.OFFLINE_PINS),
  clearOfflinePins: () => storage.remove(STORAGE_KEYS.OFFLINE_PINS),
};
