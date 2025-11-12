// Placeholder for API service layer
// In production, this will handle all API calls

import { API_BASE_URL } from '../config/constants';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Auth APIs
export const authAPI = {
  login: async (email: string, password: string) => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            token: 'mock_token',
            user: {
              id: '1',
              email,
              username: 'user123',
              displayName: 'Travel Lover',
            },
          },
        });
      }, 1000);
    });
  },

  register: async (email: string, password: string, username: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            token: 'mock_token',
            user: {
              id: '1',
              email,
              username,
              displayName: username,
            },
          },
        });
      }, 1000);
    });
  },

  socialLogin: async (provider: 'google' | 'apple', token: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            token: 'mock_token',
            user: {
              id: '1',
              email: 'user@example.com',
              username: `${provider}user`,
              displayName: `${provider} User`,
            },
          },
        });
      }, 1000);
    });
  },
};

// Pin APIs
export const pinAPI = {
  getPins: async () => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [],
        });
      }, 500);
    });
  },

  createPin: async (pinData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: { id: Date.now().toString(), ...pinData },
        });
      }, 500);
    });
  },

  updatePin: async (id: string, pinData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: { id, ...pinData },
        });
      }, 500);
    });
  },

  deletePin: async (id: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true } });
      }, 500);
    });
  },
};

// Upload APIs
export const uploadAPI = {
  uploadImage: async (uri: string) => {
    // Mock implementation
    // In production, use FormData to upload to cloud storage
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            url: uri, // Return the same URI for now
          },
        });
      }, 1000);
    });
  },
};

// Search APIs
export const searchAPI = {
  searchPlaces: async (query: string) => {
    // Mock implementation
    // In production, use Google Places API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            { id: '1', name: 'Hồ Hoàn Kiếm, Hà Nội', lat: 21.0285, lng: 105.8542 },
            { id: '2', name: 'Vịnh Hạ Long, Quảng Ninh', lat: 20.9101, lng: 107.1839 },
          ],
        });
      }, 500);
    });
  },
};
