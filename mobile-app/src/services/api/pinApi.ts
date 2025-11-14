
import { httpClient, ApiResponse } from './httpClient';

// Re-export ApiResponse type for convenience
export type { ApiResponse };


// Auth APIs
export const pinApi = {
  
  /**
   * Get current user profile
   */
  getPinsByUser: async (): Promise<ApiResponse<any>> => {
    return httpClient.get<any>('/v1/pin/pins-by-user');
  },

};


