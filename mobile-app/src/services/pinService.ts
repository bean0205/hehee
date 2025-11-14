import { pinApi } from './api/pinApi';

export const pinService = {
  handlegetPinByUser: async () => {
    try {
      const response = await pinApi.getPinsByUser();
      return response;
    } catch (error: any) {
      throw error;
    }
  },


};