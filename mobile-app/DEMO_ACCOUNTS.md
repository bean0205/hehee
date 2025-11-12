# 🎭 DEMO ACCOUNTS & MOCKUP DATA

## 📧 Tài khoản Demo

### Tài khoản chính (Main Demo Account)
```
Email: demo@pinyourword.com
Password: demo123
Username: @traveler_demo
Display Name: Nguyễn Văn Demo
```

### Tài khoản phụ (Alternative Accounts)
```
Email: user@example.com
Password: 123456
Username: @explorer
Display Name: Travel Explorer
```

```
Email: test@test.com
Password: test123
Username: @testuser
Display Name: Test User
```

## 🔑 Quick Login

**Bất kỳ email/password nào cũng sẽ đăng nhập thành công** (mock mode)

Hệ thống sẽ tự động tạo user với:
- ID: unique
- Email: email bạn nhập
- Username: tự động từ email (phần trước @)
- Display Name: tên từ email hoặc username

## 🌟 Social Login (Mock)

### Google Login
- Tự động tạo user: `Google User (@googleuser)`
- Email: `user@gmail.com`

### Apple Login
- Tự động tạo user: `Apple User (@appleuser)`
- Email: `user@icloud.com`

## 📍 Dữ liệu Ghim Mockup

Khi đăng nhập, bạn sẽ có sẵn **15+ ghim mẫu** bao gồm:

### Việt Nam (10 pins)
1. **Hồ Hoàn Kiếm** (Hà Nội) - ✓ Đã đến - ⭐⭐⭐⭐⭐
2. **Vịnh Hạ Long** (Quảng Ninh) - ⭐ Muốn đến
3. **Phố Cổ Hội An** (Quảng Nam) - ✓ Đã đến - ⭐⭐⭐⭐⭐
4. **Chùa Một Cột** (Hà Nội) - ✓ Đã đến - ⭐⭐⭐⭐
5. **Bãi Biển Nha Trang** (Khánh Hòa) - ✓ Đã đến - ⭐⭐⭐⭐⭐
6. **Đà Lạt** (Lâm Đồng) - ⭐ Muốn đến
7. **Phú Quốc** (Kiên Giang) - ⭐ Muốn đến
8. **Sapa** (Lào Cai) - ✓ Đã đến - ⭐⭐⭐⭐
9. **Động Phong Nha** (Quảng Bình) - ⭐ Muốn đến
10. **Cù Lao Chàm** (Quảng Nam) - ✓ Đã đến - ⭐⭐⭐⭐

### Quốc tế (5 pins)
11. **Tháp Eiffel** (Paris, Pháp) - ⭐ Muốn đến
12. **Tượng Nữ Thần Tự Do** (New York, Mỹ) - ⭐ Muốn đến
13. **Tokyo Tower** (Tokyo, Nhật Bản) - ✓ Đã đến - ⭐⭐⭐⭐⭐
14. **Vạn Lý Trường Thành** (Bắc Kinh, Trung Quốc) - ⭐ Muốn đến
15. **Colosseum** (Rome, Italy) - ⭐ Muốn đến

## 📊 Thống kê Mock

```
Quốc gia đã đến: 3
Thành phố đã đến: 8
Tổng số ghim: 15
Đã đến: 6
Muốn đến: 9
```

## 🎨 Ảnh Mock

Tất cả ảnh sử dụng **Picsum Photos** (https://picsum.photos) với:
- Ảnh ngẫu nhiên chất lượng cao
- Kích thước: 400x300 (thumbnail), 800x600 (full)
- Mỗi ghim có 1-3 ảnh

## 🧪 Test Cases

### Test đăng nhập
```
1. Email hợp lệ + Password bất kỳ → ✓ Success
2. Social login (Google/Apple) → ✓ Success
3. Đăng ký tài khoản mới → ✓ Success
```

### Test thêm ghim
```
1. Thêm ghim "Đã đến" với ảnh → ✓ Success
2. Thêm ghim "Muốn đến" → ✓ Success
3. Giới hạn 5 ảnh/ghim → ✓ Enforced
4. Đánh giá sao (1-5) → ✓ Success
```

### Test chỉnh sửa
```
1. Sửa thông tin ghim → ✓ Success
2. Thêm/xóa ảnh → ✓ Success
3. Chuyển đổi "Muốn đến" → "Đã đến" → ✓ Success
4. Xóa ghim → ✓ Success (với confirmation)
```

### Test tìm kiếm
```
1. Tìm địa điểm trên bản đồ → Mock results
2. Lọc ghim (Tất cả/Đã đến/Muốn đến) → ✓ Success
```

## 🚀 Quick Start Demo Flow

1. **Mở app** → Splash Screen (2s)
2. **Walkthrough** (lướt 3 slide) → Nhấn "Bắt đầu"
3. **Permission** → Nhấn "Cho phép truy cập"
4. **Login** → Nhập `demo@pinyourword.com` / `demo123` hoặc nhấn Google/Apple
5. **Map Screen** → Xem 15 ghim trên bản đồ
6. **Thêm ghim** → Nhấn FAB (+) → Điền form → Lưu
7. **Chi tiết ghim** → Nhấn vào marker → Xem ảnh/thông tin
8. **Profile** → Xem thống kê và danh sách ghim

## 📝 Notes

- **Không cần backend**: Tất cả data lưu trong memory (state)
- **Reload = mất data**: Dữ liệu mock sẽ reset về mặc định
- **Production**: Cần thay thế bằng API thật và AsyncStorage persistence
- **Images**: URLs từ Picsum sẽ thay đổi mỗi lần reload (thêm `?random=X` để fix)

## 🔧 Customize Mockup

Để thêm/sửa dữ liệu mock, chỉnh sửa:
- **Auth**: `src/contexts/AuthContext.tsx`
- **Pins**: `src/contexts/PinContext.tsx`
- **API**: `src/services/api.ts`
