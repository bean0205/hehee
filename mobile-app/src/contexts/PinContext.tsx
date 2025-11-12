import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Pin } from '../components/common/PinCard';

interface PinContextType {
  pins: Pin[];
  addPin: (pin: Omit<Pin, 'id'>) => void;
  updatePin: (id: string, pin: Partial<Pin>) => void;
  deletePin: (id: string) => void;
  getPinById: (id: string) => Pin | undefined;
}

const PinContext = createContext<PinContextType | undefined>(undefined);

export const PinProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pins, setPins] = useState<Pin[]>([
    // Việt Nam - Đã đến
    {
      id: '1',
      name: 'Hồ Hoàn Kiếm, Hà Nội',
      latitude: 21.0285,
      longitude: 105.8542,
      status: 'visited',
      rating: 5,
      visitDate: '2024-01-15',
      notes: 'Nơi rất đẹp và yên bình, phù hợp để đi dạo buổi sáng. Tháp Rùa giữa hồ rất đẹp về đêm khi có đèn.',
      images: [
        'https://picsum.photos/seed/hoankiem1/800/600',
        'https://picsum.photos/seed/hoankiem2/800/600',
      ],
    },
    {
      id: '3',
      name: 'Phố Cổ Hội An, Quảng Nam',
      latitude: 15.8801,
      longitude: 108.3380,
      status: 'visited',
      rating: 5,
      visitDate: '2024-03-10',
      notes: 'Phố cổ tuyệt đẹp, đèn lồng rực rỡ về đêm. Ẩm thực ngon, người dân thân thiện. Nên đi vào tối thứ 7 để ngắm đèn lồng.',
      images: [
        'https://picsum.photos/seed/hoian1/800/600',
        'https://picsum.photos/seed/hoian2/800/600',
        'https://picsum.photos/seed/hoian3/800/600',
      ],
    },
    {
      id: '4',
      name: 'Chùa Một Cột, Hà Nội',
      latitude: 21.0368,
      longitude: 105.8335,
      status: 'visited',
      rating: 4,
      visitDate: '2024-01-16',
      notes: 'Kiến trúc độc đáo, giá trị lịch sử cao. Nên đi sáng sớm để tránh đông người.',
      images: ['https://picsum.photos/seed/chuamotcot/800/600'],
    },
    {
      id: '5',
      name: 'Bãi Biển Nha Trang, Khánh Hòa',
      latitude: 12.2388,
      longitude: 109.1967,
      status: 'visited',
      rating: 5,
      visitDate: '2024-05-20',
      notes: 'Biển đẹp, nước trong xanh. Hải sản tươi ngon. Tham quan đảo, lặn ngắm san hô rất thú vị!',
      images: [
        'https://picsum.photos/seed/nhatrang1/800/600',
        'https://picsum.photos/seed/nhatrang2/800/600',
      ],
    },
    {
      id: '8',
      name: 'Sapa, Lào Cai',
      latitude: 22.3364,
      longitude: 103.8438,
      status: 'visited',
      rating: 4,
      visitDate: '2024-02-28',
      notes: 'Ruộng bậc thang tuyệt đẹp, không khí mát mẻ. Trekking lên Fansipan rất thử thách nhưng đáng giá.',
      images: [
        'https://picsum.photos/seed/sapa1/800/600',
        'https://picsum.photos/seed/sapa2/800/600',
      ],
    },
    {
      id: '10',
      name: 'Cù Lao Chàm, Quảng Nam',
      latitude: 15.9500,
      longitude: 108.5167,
      status: 'visited',
      rating: 4,
      visitDate: '2024-03-12',
      notes: 'Đảo nhỏ xinh, nước biển trong vắt. Lặn biển ngắm san hô, ăn hải sản tươi sống. Rất yên bình!',
      images: ['https://picsum.photos/seed/culaocham/800/600'],
    },
    
    // Việt Nam - Muốn đến
    {
      id: '2',
      name: 'Vịnh Hạ Long, Quảng Ninh',
      latitude: 20.9101,
      longitude: 107.1839,
      status: 'wantToGo',
      notes: 'Muốn đi du thuyền qua đêm, ngắm cảnh vịnh và khám phá các hang động.',
    },
    {
      id: '6',
      name: 'Đà Lạt, Lâm Đồng',
      latitude: 11.9404,
      longitude: 108.4583,
      status: 'wantToGo',
      notes: 'Thành phố ngàn hoa, muốn đi vào mùa hoa dã quỳ nở (tháng 11-12).',
    },
    {
      id: '7',
      name: 'Phú Quốc, Kiên Giang',
      latitude: 10.2899,
      longitude: 103.9870,
      status: 'wantToGo',
      notes: 'Muốn trải nghiệm resort cao cấp, lặn biển và ăn hải sản tươi sống.',
    },
    {
      id: '9',
      name: 'Động Phong Nha, Quảng Bình',
      latitude: 17.5833,
      longitude: 106.2833,
      status: 'wantToGo',
      notes: 'Muốn khám phá hang động lớn nhất thế giới - Sơn Đoòng. Cần book tour trước 6 tháng!',
    },
    
    // Quốc tế - Đã đến
    {
      id: '13',
      name: 'Tokyo Tower, Tokyo, Nhật Bản',
      latitude: 35.6586,
      longitude: 139.7454,
      status: 'visited',
      rating: 5,
      visitDate: '2023-11-05',
      notes: 'Tháp đẹp lung linh về đêm. View từ trên cao nhìn xuống Tokyo tuyệt vời. Ăn sushi ở chân tháp rất ngon!',
      images: [
        'https://picsum.photos/seed/tokyo1/800/600',
        'https://picsum.photos/seed/tokyo2/800/600',
      ],
    },
    
    // Quốc tế - Muốn đến
    {
      id: '11',
      name: 'Tháp Eiffel, Paris, Pháp',
      latitude: 48.8584,
      longitude: 2.2945,
      status: 'wantToGo',
      notes: 'Muốn lên đến tầng cao nhất, picnic ở công viên Champ de Mars và ngắm cảnh về đêm khi tháp lấp lánh.',
    },
    {
      id: '12',
      name: 'Tượng Nữ Thần Tự Do, New York, Mỹ',
      latitude: 40.6892,
      longitude: -74.0445,
      status: 'wantToGo',
      notes: 'Biểu tượng của tự do, muốn lên đến vương miện. Kết hợp thăm thú Manhattan và Brooklyn Bridge.',
    },
    {
      id: '14',
      name: 'Vạn Lý Trường Thành, Bắc Kinh, Trung Quốc',
      latitude: 40.4319,
      longitude: 116.5704,
      status: 'wantToGo',
      notes: 'Kỳ quan thế giới, muốn đi bộ đoạn Badaling hoặc Mutianyu. Nên đi vào mùa thu để tránh nóng.',
    },
    {
      id: '15',
      name: 'Colosseum, Rome, Italy',
      latitude: 41.8902,
      longitude: 12.4922,
      status: 'wantToGo',
      notes: 'Đấu trường La Mã cổ đại. Muốn tham gia tour có hướng dẫn viên để hiểu rõ lịch sử.',
    },
  ]);

  const addPin = (pin: Omit<Pin, 'id'>) => {
    const newPin: Pin = {
      ...pin,
      id: Date.now().toString(),
    };
    setPins([...pins, newPin]);
  };

  const updatePin = (id: string, updates: Partial<Pin>) => {
    setPins(pins.map(pin => (pin.id === id ? { ...pin, ...updates } : pin)));
  };

  const deletePin = (id: string) => {
    setPins(pins.filter(pin => pin.id !== id));
  };

  const getPinById = (id: string) => {
    return pins.find(pin => pin.id === id);
  };

  return (
    <PinContext.Provider value={{ pins, addPin, updatePin, deletePin, getPinById }}>
      {children}
    </PinContext.Provider>
  );
};

export const usePin = () => {
  const context = useContext(PinContext);
  if (!context) {
    throw new Error('usePin must be used within PinProvider');
  }
  return context;
};
