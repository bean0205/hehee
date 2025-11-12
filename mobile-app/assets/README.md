# Assets Placeholder

Trong thư mục này, bạn cần thêm các file assets sau:

## Required Files:

1. **icon.png** (1024x1024px)
   - App icon chính
   - Màu primary (#1E3A8A) với icon 📍

2. **adaptive-icon.png** (1024x1024px)
   - Android adaptive icon
   - Phần foreground có thể cắt thành hình tròn

3. **splash.png** (1242x2436px cho iOS, 1080x1920px cho Android)
   - Logo + tên app
   - Background màu primary (#1E3A8A)

4. **favicon.png** (48x48px)
   - Cho web version

## Tạo Icons nhanh:

### Option 1: Sử dụng online tools
- [App Icon Generator](https://appicon.co/)
- [MakeAppIcon](https://makeappicon.com/)

### Option 2: Design thủ công
1. Mở Figma/Photoshop/Canva
2. Tạo canvas 1024x1024px
3. Background: #1E3A8A
4. Thêm icon 📍 (hoặc tự design)
5. Thêm text "PinYourWord"
6. Export PNG

### Option 3: Sử dụng AI
- DALL-E: "A modern app icon with a map pin, blue color scheme, minimalist design"
- Midjourney: "app icon, map location pin, blue gradient, modern, clean --ar 1:1"

## Expo Asset Generator

Sau khi có file icon.png gốc, chạy:
```bash
npx expo-app-icon-generator icon.png
```

Nó sẽ tự động tạo tất cả sizes cần thiết!
