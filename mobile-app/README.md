# PinYourWord Mobile App 📍

Ứng dụng di động React Native cho PinYourWord - Ghi lại mọi hành trình của bạn trên bản đồ.

## 🎯 Giới thiệu

PinYourWord là ứng dụng "cuốn nhật ký bản đồ" cá nhân giúp bạn:
- 📍 Đánh dấu những nơi đã đến
- ⭐ Đánh giá và ghi chú trải nghiệm
- 📸 Thêm ảnh vào từng địa điểm
- ✈️ Tạo danh sách nơi muốn đến (Bucket List)
- 🗺️ Xem tất cả hành trình trên bản đồ

## 🏗️ Kiến trúc

### Tech Stack
- **Framework**: React Native 0.72 với Expo SDK 49
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Maps**: react-native-maps
- **State Management**: Context API
- **Language**: TypeScript
- **UI**: Custom Design System

### Cấu trúc thư mục

```
mobile-app/
├── src/
│   ├── components/        # Reusable components
│   │   └── common/        # Button, Input, Avatar, PinCard
│   ├── contexts/          # Context providers
│   │   ├── AuthContext.tsx
│   │   └── PinContext.tsx
│   ├── navigation/        # Navigation configuration
│   │   └── RootNavigator.tsx
│   ├── screens/           # App screens
│   │   ├── auth/          # Authentication screens
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── WalkthroughScreen.tsx
│   │   │   ├── PermissionRequestScreen.tsx
│   │   │   ├── AuthHomeScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   └── main/          # Main app screens
│   │       ├── MapScreen.tsx
│   │       └── ProfileScreen.tsx
│   └── theme/             # Design system
│       ├── colors.ts
│       ├── typography.ts
│       ├── spacing.ts
│       └── index.ts
├── App.tsx
├── package.json
├── app.json
└── tsconfig.json
```

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Node.js >= 16
- npm hoặc yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio (cho Android) hoặc Xcode (cho iOS)

### Bước 1: Cài đặt dependencies

```powershell
cd mobile-app
npm install
```

### Bước 2: Chạy ứng dụng

#### Chạy trên Expo Go (Nhanh nhất)
```powershell
npm start
```
Sau đó quét QR code bằng app Expo Go trên điện thoại.

#### Chạy trên Android Emulator
```powershell
npm run android
```

#### Chạy trên iOS Simulator (chỉ trên Mac)
```powershell
npm run ios
```

## 📱 Tính năng hiện tại (V1.0 MVP)

### ✅ Đã hoàn thành

#### 1. Onboarding & Authentication
- ✅ Splash Screen
- ✅ Walkthrough (3 slides)
- ✅ Permission Request Screen
- ✅ Auth Home với Social Login buttons
- ✅ Email Login/Register

#### 2. Map Screen (Core Feature)
- ✅ MapView với Google Maps
- ✅ Hiển thị pins với màu khác nhau (visited/want to go)
- ✅ Search bar (UI)
- ✅ Search modal với autocomplete
- ✅ Floating Action Button để thêm pin
- ✅ Navigate đến pin details khi tap marker

#### 3. Profile Screen
- ✅ Profile header (avatar, cover, bio)
- ✅ Stats bar (countries, cities, total pins)
- ✅ Tab navigator (Map/List)
- ✅ Filter bar (All/Visited/Want to Go)
- ✅ Pin list với PinCard component
- ✅ Logout button

#### 4. Design System
- ✅ Colors (Primary, Accent, Neutrals, Status)
- ✅ Typography
- ✅ Spacing & Border Radius
- ✅ Reusable Components (Button, Input, Avatar, PinCard)

#### 5. State Management
- ✅ AuthContext (login, register, logout)
- ✅ PinContext (CRUD operations)
- ✅ Mock data

### 🚧 Đang phát triển

#### Add/Edit Pin Screen
- Bottom Sheet UI
- Status toggle (Visited/Want to Go)
- Date picker
- Star rating
- Notes input
- Image uploader (max 5 images)

#### Pin Details Screen
- Image gallery (swiper)
- Edit/Delete actions
- Full information display

## 🎨 Design System

### Colors
```typescript
Primary: #1E3A8A (Deep Blue)
Accent: #F59E0B (Orange/Yellow)
Visited: #10B981 (Green)
Want to Go: #F59E0B (Orange)
```

### Typography
- Font: System font (Roboto/SF Pro)
- Sizes: xs(12), sm(14), base(16), lg(18), xl(20), 2xl(24), 3xl(30), 4xl(36)

### Components
- **Button**: 4 variants (primary, secondary, outline, text), 3 sizes
- **Input**: Label, error state, multiline support
- **Avatar**: Circular image with placeholder
- **PinCard**: Card với image, name, status badge, rating

## 🔧 Cấu hình

### Google Maps API Key
1. Tạo API key tại [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps SDK cho Android/iOS
3. Cập nhật trong `app.json`:
```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_API_KEY_HERE"
    }
  }
}
```

## 📝 Mock Data

Ứng dụng hiện tại sử dụng mock data. Trong production, cần kết nối với API backend:

### API Endpoints cần implement:
- POST `/auth/login`
- POST `/auth/register`
- GET `/pins`
- POST `/pins`
- PUT `/pins/:id`
- DELETE `/pins/:id`
- GET `/user/profile`
- POST `/upload/image`

## 🛣️ Roadmap

### V1.5 - Social Features (Đã thiết kế)
- [ ] Feed screen
- [ ] Discover/Search users
- [ ] Follow/Followers
- [ ] Privacy settings

### V2.0 - Pro Features (Đã thiết kế)
- [ ] Trip planner
- [ ] Video upload
- [ ] Heatmap view
- [ ] Gamification (badges)
- [ ] In-app purchase

## 🤝 Đóng góp

Đây là project cá nhân. Mọi góp ý xin gửi qua Issues.

## 📄 License

MIT License

---

**Được xây dựng với ❤️ bởi React Native & Expo**
