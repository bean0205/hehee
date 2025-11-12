# ✅ Development Checklist

## 🎯 Phase 1: Setup & Installation

### Initial Setup
- [ ] Node.js đã cài đặt (v16+)
- [ ] npm hoặc yarn đã có
- [ ] VS Code hoặc editor đã setup
- [ ] Git đã cài đặt

### Project Setup
- [ ] Clone/Download project
- [ ] `cd mobile-app`
- [ ] `npm install` chạy thành công
- [ ] Không có error trong console

### Google Maps Configuration
- [ ] Đã tạo Google Cloud project
- [ ] Enable Maps SDK for Android
- [ ] Enable Maps SDK for iOS  
- [ ] Enable Places API
- [ ] Lấy được API key
- [ ] Cập nhật API key vào `app.json`
- [ ] Enable billing trong Google Cloud (required!)

### First Run
- [ ] `npm start` chạy thành công
- [ ] QR code hiển thị
- [ ] Expo Go app đã cài trên điện thoại
- [ ] Quét QR code thành công
- [ ] App mở được trên điện thoại

---

## 🧪 Phase 2: Testing Features

### Onboarding Flow
- [ ] Splash screen hiển thị đúng
- [ ] Walkthrough 3 slides hoạt động
- [ ] Có thể swipe qua các slides
- [ ] Permission screen hiển thị
- [ ] Buttons hoạt động

### Authentication
- [ ] Auth home screen hiển thị
- [ ] Social login buttons có UI đẹp
- [ ] Click "Đăng nhập với Google" hoạt động (mock)
- [ ] Navigate đến Login screen
- [ ] Form validation hoạt động
- [ ] Submit login thành công
- [ ] Navigate đến Register screen
- [ ] Register form hoạt động
- [ ] Sau login/register → vào main app

### Map Screen
- [ ] Map hiển thị (cần API key!)
- [ ] Pins hiển thị trên map
- [ ] Màu pins đúng (green/orange)
- [ ] Search bar hiển thị
- [ ] Click search → modal mở
- [ ] FAB button (+) hiển thị
- [ ] Click marker → navigate (placeholder)
- [ ] Zoom in/out hoạt động
- [ ] User location hiển thị (nếu có permission)

### Profile Screen
- [ ] Profile header hiển thị
- [ ] Avatar, cover image load được
- [ ] Stats bar hiển thị đúng số liệu
- [ ] Tab "Bản đồ" / "Danh sách" hoạt động
- [ ] Filter buttons hoạt động
- [ ] Pin list hiển thị
- [ ] Click pin → navigate (placeholder)
- [ ] Empty state hiển thị khi không có pins
- [ ] Logout button hoạt động

### Navigation
- [ ] Bottom tab bar hiển thị
- [ ] Switch giữa Map và Profile tab
- [ ] Navigation mượt, không lag
- [ ] Back button hoạt động
- [ ] Modal screens hoạt động

---

## 🎨 Phase 3: UI/UX Polish

### Design Consistency
- [ ] Colors đúng với design system
- [ ] Font sizes nhất quán
- [ ] Spacing đồng nhất
- [ ] Border radius consistent
- [ ] Shadows áp dụng đúng

### Responsive
- [ ] Hoạt động trên iPhone nhỏ (SE)
- [ ] Hoạt động trên iPhone lớn (Pro Max)
- [ ] Hoạt động trên Android nhỏ
- [ ] Hoạt động trên Android lớn
- [ ] Landscape mode OK (optional)

### Loading States
- [ ] Login loading spinner
- [ ] Map loading state
- [ ] Image loading placeholder
- [ ] Skeleton screens (optional)

### Error Handling
- [ ] Form validation errors hiển thị
- [ ] Network error handling
- [ ] Empty states có message rõ ràng
- [ ] User-friendly error messages

---

## 🔧 Phase 4: Development Features

### Add Pin Screen (To Do)
- [ ] Tạo file AddPinScreen.tsx
- [ ] Implement Bottom Sheet
- [ ] Status toggle (Visited/Want to Go)
- [ ] Date picker component
- [ ] Star rating component
- [ ] Notes multiline input
- [ ] Image picker integration
- [ ] Max 5 images validation
- [ ] Save button hoạt động
- [ ] Add vào PinContext
- [ ] Navigation back after save

### Pin Details Screen (To Do)
- [ ] Tạo file PinDetailsScreen.tsx
- [ ] Image swiper/gallery
- [ ] Display all pin info
- [ ] Edit button
- [ ] Delete button với confirmation
- [ ] Navigate to edit mode
- [ ] Delete removes from context
- [ ] Share button (optional)

### Real API Integration (To Do)
- [ ] Setup backend API
- [ ] Install axios
- [ ] Create API client
- [ ] Implement auth endpoints
- [ ] Implement pins CRUD endpoints
- [ ] Token storage
- [ ] Auto-refresh tokens
- [ ] Error handling
- [ ] Loading states
- [ ] Success/Error toasts

---

## 🚀 Phase 5: Advanced Features

### Image Upload
- [ ] Setup cloud storage (Firebase/S3)
- [ ] Implement upload function
- [ ] Image compression
- [ ] Upload progress indicator
- [ ] Multiple images support
- [ ] Delete images
- [ ] Error handling

### Offline Mode
- [ ] Save pins to AsyncStorage
- [ ] Sync when online
- [ ] Queue offline actions
- [ ] Offline indicator
- [ ] Conflict resolution

### Permissions
- [ ] Request location permission
- [ ] Request photo library permission
- [ ] Request camera permission
- [ ] Handle permission denied
- [ ] Link to settings
- [ ] Test trên thiết bị thật

### Search & Autocomplete
- [ ] Integrate Google Places API
- [ ] Real-time search
- [ ] Debounce input
- [ ] Show search results
- [ ] Navigate to place on map
- [ ] Add from search results

---

## 📱 Phase 6: App Assets

### Icons
- [ ] Tạo app icon (1024x1024)
- [ ] Generate all sizes
- [ ] Android adaptive icon
- [ ] iOS app icon
- [ ] Update app.json

### Splash Screen
- [ ] Design splash screen
- [ ] Export multiple sizes
- [ ] Update app.json
- [ ] Test trên devices

### Other Assets
- [ ] Placeholder images
- [ ] Default avatar
- [ ] Empty state illustrations
- [ ] Error state icons

---

## 🧪 Phase 7: Testing

### Manual Testing
- [ ] Test all screens
- [ ] Test all user flows
- [ ] Test on iOS device
- [ ] Test on Android device
- [ ] Test on slow network
- [ ] Test offline mode
- [ ] Test with many pins (100+)
- [ ] Test edge cases

### User Testing
- [ ] 5+ beta testers
- [ ] Gather feedback
- [ ] Fix critical bugs
- [ ] Improve UX based on feedback

### Performance Testing
- [ ] App size < 50MB
- [ ] Launch time < 3s
- [ ] Map loads < 2s
- [ ] No memory leaks
- [ ] Smooth 60fps

---

## 📝 Phase 8: Documentation

### User Documentation
- [ ] How to use guide
- [ ] FAQ section
- [ ] Privacy policy
- [ ] Terms of service

### Developer Documentation
- [ ] API documentation
- [ ] Code comments
- [ ] README updated
- [ ] Architecture diagram

---

## 🏪 Phase 9: Deployment

### Pre-deployment
- [ ] Remove all console.logs
- [ ] Remove debug code
- [ ] Update version number
- [ ] Test production build
- [ ] Create release notes

### Android
- [ ] Build APK/AAB
- [ ] Sign with release key
- [ ] Test signed build
- [ ] Create Play Console account
- [ ] Prepare store listing
- [ ] Upload to Play Console
- [ ] Internal testing
- [ ] Closed beta
- [ ] Open beta
- [ ] Production release

### iOS
- [ ] Apple Developer account ($99/year)
- [ ] Certificates & provisioning
- [ ] Build IPA
- [ ] Test signed build
- [ ] Create App Store Connect listing
- [ ] Upload to TestFlight
- [ ] Internal testing
- [ ] External testing
- [ ] Submit for review
- [ ] Production release

---

## 🎉 Phase 10: Launch

### Pre-launch
- [ ] Final testing
- [ ] Marketing materials ready
- [ ] Social media posts prepared
- [ ] Press kit ready
- [ ] Support email setup
- [ ] Analytics setup

### Launch Day
- [ ] Release app on stores
- [ ] Announce on social media
- [ ] Send to press
- [ ] Monitor analytics
- [ ] Respond to reviews
- [ ] Fix critical bugs ASAP

### Post-launch
- [ ] Monitor crash reports
- [ ] Gather user feedback
- [ ] Plan v1.1 updates
- [ ] Marketing campaigns
- [ ] User growth tracking

---

## 📊 Success Metrics

### Week 1
- [ ] 100+ downloads
- [ ] 4.0+ star rating
- [ ] < 1% crash rate
- [ ] 50% retention

### Month 1
- [ ] 1000+ downloads
- [ ] 4.5+ star rating
- [ ] Active user growth
- [ ] Positive reviews

### Month 3
- [ ] 10,000+ downloads
- [ ] Featured users
- [ ] Media coverage
- [ ] V1.5 features planned

---

## 🔄 Continuous Improvement

### Regular Tasks
- [ ] Monitor analytics weekly
- [ ] Read user reviews daily
- [ ] Fix bugs within 48h
- [ ] Update dependencies monthly
- [ ] Security updates ASAP

### Feature Updates
- [ ] V1.5 - Social features
- [ ] V2.0 - Pro features
- [ ] V3.0 - AI recommendations

---

**Use this checklist to track your progress! ✅**

**Current Status**: Setup Complete (85% done)
**Next Priority**: Add Pin Screen + Pin Details Screen
**Est. Time to MVP**: 40-50 hours
