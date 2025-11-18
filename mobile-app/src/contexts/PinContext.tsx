import React, { createContext, useState, useContext, ReactNode } from "react";
import { Pin } from "../components/common/PinCard";
import { pinService } from "../services/pinService";
interface PinContextType {
  pins: Pin[];
  addPin: (pin: Pin) => Promise<any>;
  updatePin: (id: string, pin: Partial<Pin>) => void;
  deletePin: (id: string) => void;
  getPinById: (id: string) => Pin | undefined;
  getPinByUser: () => Promise<any>;
}

const PinContext = createContext<PinContextType | undefined>(undefined);

export const PinProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pins, setPins] = useState<Pin[]>([
    // Việt Nam - Đã đến
    // {
    //   id: '1',
    //   name: 'Hồ Hoàn Kiếm, Hà Nội',
    //   latitude: 21.0285,
    //   longitude: 105.8542,
    //   status: 'visited',
    //   rating: 5,
    //   visitDate: '2024-01-15',
    //   notes: 'Nơi rất đẹp và yên bình, phù hợp để đi dạo buổi sáng. Tháp Rùa giữa hồ rất đẹp về đêm khi có đèn.',
    //   images: [
    //     'https://picsum.photos/seed/hoankiem1/800/600',
    //     'https://picsum.photos/seed/hoankiem2/800/600',
    //   ],
    // },
  ]);

  const addPin = async (pin: Pin) => {
    try {
      debugger
      const formData = new FormData();

      // Gộp toàn bộ dữ liệu thành 1 object
      const data = {
        name: pin.placeName,
        notes: pin.notes || "",
        rating: pin.rating ? String(pin.rating) : "",
        status: pin.status,
        visitDate: pin.visitedDate || "",
        location: pin.location,
      };

      // In React Native, FormData.append accepts objects with type and name
      // @ts-ignore - React Native FormData accepts this format
      formData.append("data", {
        string: JSON.stringify(data),
        type: 'application/json'
      });

      // Only append images if they exist (backend expects List<MultipartFile> or nothing)
      // Don't append empty string for images

      // Send the FormData to the backend
      const rs = await pinService.handlegetCreatePinByUser(formData);
      return rs;
    } catch (error) {
      console.error("Error adding pin:", error);
      throw error;
    }
  };

  const updatePin = (id: string, updates: Partial<Pin>) => {
    setPins(pins.map((pin) => (pin.id === id ? { ...pin, ...updates } : pin)));
  };

  const deletePin = (id: string) => {
    setPins(pins.filter((pin) => pin.id !== id));
  };

  const getPinById = (id: string) => {
    return pins.find((pin) => pin.id === id);
  };

  const getPinByUser = async () => {
    const rs = await pinService.handlegetPinByUser();
    setPins(rs.data);
    return rs;
  };

  return (
    <PinContext.Provider
      value={{ pins, addPin, updatePin, deletePin, getPinById, getPinByUser }}
    >
      {children}
    </PinContext.Provider>
  );
};

export const usePin = () => {
  const context = useContext(PinContext);

  if (!context) {
    throw new Error("usePin must be used within PinProvider");
  }
  return context;
};
