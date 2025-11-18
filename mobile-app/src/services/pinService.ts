import { pinApi } from "./api/pinApi";
import { Pin } from "../components/common/PinCard";

export const pinService = {
  handlegetPinByUser: async () => {
    try {
      const response = await pinApi.getPinsByUser();
      return response;
    } catch (error: any) {
      throw error;
    }
  },
  handlegetCreatePinByUser: async (formData : FormData) => {
    try {
      const response = await pinApi.createPinsByUser(formData);
      return response;
    } catch (error: any) {
      throw error;
    }
  },
};
