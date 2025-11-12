# PinYourWord Mobile App - Hướng dẫn Cài đặt

## 📋 Danh sách kiểm tra trước khi bắt đầu

- [ ] Node.js đã cài đặt (phiên bản 16 hoặc cao hơn)
- [ ] npm hoặc yarn đã sẵn sàng
- [ ] (Tùy chọn) Android Studio cho Android development
- [ ] (Tùy chọn) Xcode cho iOS development (chỉ trên Mac)

## 🚀 Hướng dẫn chi tiết

### Bước 1: Di chuyển vào thư mục dự án

```powershell
cd c:\Working\Project\PinYourWord\mobile-app
```

### Bước 2: Cài đặt dependencies

```powershell
npm install
```

Lệnh này sẽ cài đặt tất cả các package cần thiết bao gồm:
- React Native 0.72.6
- Expo SDK 49
- React Navigation
- React Native Maps
- Và nhiều thư viện khác...

**Lưu ý**: Quá trình cài đặt có thể mất 5-10 phút tùy vào tốc độ internet.

### Bước 3: Khởi động ứng dụng

#### Option A: Sử dụng Expo Go (Đơn giản nhất - Khuyến nghị)

1. Cài đặt ứng dụng "Expo Go" trên điện thoại của bạn:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Chạy lệnh:
```powershell
npm start
```

3. Quét QR code xuất hiện trên terminal bằng:
   - iOS: Sử dụng app Camera
   - Android: Sử dụng app Expo Go

#### Option B: Chạy trên Android Emulator

1. Đảm bảo Android Studio đã cài đặt và emulator đã chạy
2. Chạy lệnh:
```powershell
npm run android
```

#### Option C: Chạy trên iOS Simulator (chỉ trên Mac)

```powershell
npm run ios
```

## 🔑 Cấu hình Google Maps (Quan trọng!)

Để bản đồ hoạt động, bạn cần Google Maps API key:

### 1. Tạo API Key

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Enable các APIs sau:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API (cho tìm kiếm)
4. Tạo API key tại "Credentials"

### 2. Cập nhật API Key

Mở file `app.json` và thay thế `YOUR_GOOGLE_MAPS_API_KEY`:

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "AIzaSy..."  // <-- Thay bằng API key của bạn
    }
  }
}
```

## ✅ Kiểm tra ứng dụng

Sau khi chạy thành công, bạn sẽ thấy:

1. **Splash Screen**: Logo PinYourWord 📍
2. **Walkthrough**: 3 slides giới thiệu ứng dụng
3. **Permission Request**: Yêu cầu quyền truy cập
4. **Auth Screen**: Màn hình đăng nhập/đăng ký

### Đăng nhập thử nghiệm

Bạn có thể:
- Nhấn nút "Đăng nhập với Google" (mock - sẽ tự động login)
- Hoặc nhập email/password bất kỳ và đăng nhập (mock data)

## 🐛 Xử lý sự cố

### Lỗi: "Cannot find module"
```powershell
# Xóa node_modules và cài lại
Remove-Item -Recurse -Force node_modules
npm install
```

### Lỗi: "Metro bundler error"
```powershell
# Clear cache và restart
npm start -- --clear
```

### Lỗi: "Google Maps không hiển thị"
- Kiểm tra API key đã được cấu hình đúng chưa
- Đảm bảo đã enable Maps SDK trong Google Cloud Console
- Check billing account đã được thiết lập (Google yêu cầu)

### Lỗi build Android
```powershell
# Clear build cache
cd android
.\gradlew clean
cd ..
npm run android
```

## 📱 Test trên thiết bị thật

### Android
1. Bật "Developer mode" trên điện thoại
2. Bật "USB Debugging"
3. Kết nối điện thoại qua USB
4. Chạy: `npm run android`

### iOS (cần Mac & Developer Account)
1. Mở `ios/PinYourWord.xcworkspace` trong Xcode
2. Chọn team development
3. Chọn thiết bị
4. Nhấn Run

## 💡 Tips

1. **Hot Reload**: Shake điện thoại và chọn "Enable Fast Refresh"
2. **Debug Menu**: Shake điện thoại để mở menu debug
3. **Console Logs**: Check terminal để xem logs
4. **React DevTools**: Cài extension cho Chrome để debug

## 📚 Tài liệu tham khảo

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)

## 🆘 Cần trợ giúp?

Nếu gặp vấn đề, hãy:
1. Check file README.md
2. Search trong [Expo Forums](https://forums.expo.dev/)
3. Tạo issue trên GitHub repository

---

**Chúc bạn code vui vẻ! 🚀**
