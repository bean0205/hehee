
---

### TÀI LIỆU THIẾT KẾ TRANG QUẢN TRỊ (ADMIN PANEL DESIGN SPECIFICATION)

**Dự án:** PinYourWorld (Admin)
**Nền tảng:** ReactJS
**Phiên bản:** 1.0 (Bản Toàn diện)

### 1. Nền tảng Công nghệ & Nguyên tắc Thiết kế

#### 1.1. Ngăn xếp Công nghệ (Tech Stack)

* **Framework:** **Vite + ReactJS**
    > *Lý do:* Chúng ta không cần SEO hay Server-Side Rendering (SSR) cho một trang quản trị nội bộ. Vite cung cấp tốc độ phát triển (dev server) và build nhanh hơn Next.js.
* **Ngôn ngữ:** **TypeScript** (Đồng bộ với toàn bộ dự án).
* **Thư viện UI (Then chốt):** **Ant Design (AntD)**
    > *Lý do:* Đây là lựa chọn quan trọng nhất. AntD được sinh ra để làm dashboard. Nó cung cấp các components cực kỳ mạnh mẽ và có sẵn: `Table` (với filter, sort, pagination), `Form` (với validation), `Modal`, `Drawer`, `Layout`, `Statistic`, `Charts`... Sẽ tiết kiệm 90% thời gian phát triển UI.
* **Quản lý Trạng thái:** **Redux Toolkit (RTK) + RTK Query**
    > *Lý do:* Tái sử dụng logic từ các ứng dụng kia. RTK Query hoàn hảo cho việc fetching, caching và làm mới dữ liệu cho các bảng quản lý.
* **Điều hướng (Routing):** **`react-router-dom`** (v6+).
* **Biểu đồ (Charts):** **`@ant-design/charts`** (Tích hợp hoàn hảo với AntD).

#### 1.2. Nguyên tắc & Bố cục Thiết kế (UI/UX)

* **Bố cục chính (Master Layout):** `Layout` (AntD)
    * **`Sider` (Thanh bên trái):** Một `Menu` (AntD) cố định chứa toàn bộ điều hướng chính.
    * **`Header` (Đầu trang):** Hiển thị tên Admin đang đăng nhập (ví dụ: `admin@pinyourworld.com`) và nút "Đăng xuất".
    * **`Content` (Nội dung chính):** Khu vực làm việc chính, nơi `react-router-dom` sẽ render các trang (`<Outlet />`).
* **Xác thực:** Trang Admin sẽ có một trang `/login` riêng, gọi đến API `/api/admin/v1/auth/login` và lưu một **JWT của Admin** (khác với JWT của người dùng).

---

### 2. Thiết kế Giao diện (UI/UX) chi tiết theo Chức năng

Dưới đây là các màn hình (Pages) tương ứng với các `Menu.Item` trong `Sider` bên trái.

#### 🚀 PHIÊN BẢN 1.0 (QUẢN TRỊ CỐT LÕI)

##### 2.1. `Page_AdminLogin` (`/login`)

* **Mục đích:** (F-ADMIN-02) Đăng nhập cho Admin và Moderator.
* **UI:** Một `Form` (AntD) đơn giản ở giữa màn hình.
    * `Input` (Email)
    * `Input.Password` (Mật khẩu)
    * `Button` "Đăng nhập".

##### 2.2. `Page_Dashboard` (`/admin/dashboard`) (F-ADMIN-01)

* **Mục đích:** Trang chủ. Cung cấp cái nhìn tổng quan về sức khỏe hệ thống.
* **UI:** Một lưới (Grid `Row`/`Col`) các `Card` (AntD).
    * `Statistic` (AntD): "Tổng Người dùng" (SELECT COUNT(*) FROM users).
    * `Statistic` (AntD): "Tổng số Ghim" (SELECT COUNT(*) FROM pins).
    * `Statistic` (AntD): "Người dùng Mới (24h)".
    * `Statistic` (AntD): "Ghim Mới (24h)".
    * `Line Chart` (`@ant-design/charts`): Biểu đồ "Người dùng mới" và "Ghim mới" trong 30 ngày qua.
    * `Statistic` (Cảnh báo): "API Google Places (Hôm nay)" (F-ADMIN-03) - Hiển thị số lượng API calls.

##### 2.3. `Page_UserManagement` (`/admin/users`) (F-ADMIN-02)

* **Mục đích:** Quản lý toàn bộ người dùng. Đây là trang phức tạp nhất.
* **UI:**
    * **Thanh công cụ (Toolbar):**
        * `Input.Search`: Tìm kiếm theo `email` hoặc `username`.
        * `Select` (Filter): Lọc theo `subscription_status` (All / Free / Premium) - (Sẵn sàng cho V2.0).
        * `Switch`: Lọc "Chỉ hiển thị tài khoản bị Ban".
    * **Nội dung chính:** `Table` (AntD) - Hiển thị danh sách người dùng.
        * **Các cột (Columns):** `Username`, `Email`, `Tên hiển thị`, `Tổng Ghim` (giải chuẩn hóa), `Trạng thái` (Active/Banned), `Gói` (Free/Premium - V2.0), `Ngày tham gia`.
        * **Cột "Hành động" (Actions):** Một `Dropdown` (AntD) cho mỗi hàng:
            1.  **"Xem Chi tiết"**: Mở `Drawer_UserDetails`.
            2.  **"Cấm Tài khoản (Ban)"**: (Gọi API `.../ban`). Bật `Modal` xác nhận: "Bạn có chắc muốn cấm người dùng này?".
            3.  **"Gửi Email Reset Mật khẩu"**: Hỗ trợ người dùng khi họ không tự làm được.

* **`Drawer_UserDetails` (Mở ra từ `Page_UserManagement`)**
    * *UX:* Một `Drawer` (AntD) trượt ra từ bên phải, rộng ~60%.
    * *UI:*
        * `Descriptions` (AntD): Hiển thị tất cả thông tin trong bảng `users` (UUID, email, v.v.).
        * `Tabs` (AntD) bên dưới:
            * **Tab 1: "Danh sách Ghim"**: Một `Table` (read-only) tất cả ghim của người dùng này.
            * **Tab 2: "Lịch sử Báo cáo"**: (V1.5) Lịch sử các lần người dùng này bị báo cáo.
            * **Tab 3: "Lịch sử Thanh toán"**: (V2.0) Lấy dữ liệu từ bảng `payment_history`.
            * **Tab 4: "Huy hiệu Đã đạt"**: (V2.0) Lấy dữ liệu từ bảng `user_badges`.

---

#### 🤝 PHIÊN BẢN 1.5 (QUẢN TRỊ XÃ HỘI)

##### 2.4. `Page_ModerationQueue` (`/admin/moderation`) (F-ADMIN-04)

* **Mục đích:** Dành cho vai trò "Moderator" xem xét các nội dung bị người dùng báo cáo.
* **UI:**
    * `Tabs` (AntD): "Đang chờ xử lý" (`status='pending'`) | "Đã xử lý" (`status != 'pending'`).
    * **`Table` (Hàng đợi chờ xử lý):**
        * **Các cột:** `Ngày báo cáo`, `Người báo cáo`, `Loại nội dung` (Pin, User, Media), `Lý do`, `Hành động`.
        * **Cột "Hành động":** Nút `Button` "Xem xét".
* **`Modal_ReviewReport` (Mở ra từ nút "Xem xét")**
    * *UX:* Một `Modal` lớn hiển thị chi tiết.
    * *UI:*
        * **Panel Trái:** Nhúng nội dung bị báo cáo (ví dụ: hiển thị `Image` của `pin_media`, hoặc `Text` của `pin.notes`).
        * **Panel Phải:**
            * `Descriptions`: Chi tiết báo cáo (Lý do, Người báo cáo).
            * **Các nút hành động:**
                1.  **`Button` (Danger): "Xóa Nội dung & Cảnh cáo"**: (Gọi API, xóa ghim/ảnh, set `status='reviewed_removed'`).
                2.  **`Button` (Default): "Bỏ qua (Báo cáo sai)"**: (Gọi API, set `status='reviewed_ignored'`).

---

#### 💎 PHIÊN BẢN 2.0+ (QUẢN TRỊ THƯƠNG MẠI HÓA & NÂNG CAO)

##### 2.5. `Page_MonetizationDashboard` (`/admin/monetization/overview`)

* **Mục đích:** (Ngụ ý từ F-MON) Cung cấp cái nhìn tổng quan về doanh thu.
* **UI:** Một dashboard (tương tự `Page_Dashboard`) nhưng tập trung vào tiền.
    * `Statistic`: "MRR (Doanh thu Định kỳ Hàng tháng)".
    * `Statistic`: "ARR (Doanh thu Định kỳ Hàng năm)".
    * `Statistic`: "Tổng số Người đăng ký (Active Subscribers)".
    * `Statistic`: "Tỷ lệ Chuyển đổi (%)".
    * `Line Chart`: "Doanh thu theo thời gian".
    * `Pie Chart`: "Tỷ lệ Gói Tháng vs. Gói Năm".

##### 2.6. `Page_PaymentHistory` (`/admin/monetization/payments`)

* **Mục đích:** (Ngụ ý từ F-MON) Tra cứu lịch sử thanh toán chi tiết.
* **UI:**
    * `Input.Search`: Tìm theo `email` người dùng hoặc `store_transaction_id`.
    * `Table` (AntD) hiển thị 100% dữ liệu từ bảng `payment_history`.
    * **Các cột:** `Ngày`, `User Email`, `SKU` (Gói), `Số tiền`, `Store` (Apple/Google), `Trạng thái` (Success/Refunded).
    * **Hành động:** "Hoàn tiền (Refund)" (nếu API thanh toán cho phép).

##### 2.7. `Page_BadgeManagement` (`/admin/settings/badges`)

* **Mục đích:** (Ngụ ý từ F-GAME) Quản lý định nghĩa các Huy hiệu.
* **UI:**
    * `Button` "Tạo Huy hiệu mới" (mở `Modal_BadgeEditor`).
    * `Table` (AntD) hiển thị dữ liệu từ bảng `badges`.
    * **Các cột:** `Icon` (hiển thị ảnh), `Badge Code`, `Tên Huy hiệu`, `Mô tả`, `Hành động`.
    * **Cột "Hành động":** "Sửa", "Xóa".
* **`Modal_BadgeEditor` (Form tạo/sửa Huy hiệu)**
    * `Input` (Name), `Input.TextArea` (Description), `Input` (Badge Code), `Upload` (cho Icon).

##### 2.8. `Page_APIMonitoring` (`/admin/settings/api`) (F-ADMIN-03)

* **Mục đích:** Quản lý chi phí API (đã có từ V1.0, nhưng có thể nâng cấp).
* **UI:**
    * `Statistic`: "Google Places API Calls (Hôm nay)".
    * `Statistic`: "Google Places API Cost (Tháng này)".
    * `Alert` (AntD) (type="warning"): "Quota API sắp hết!" (nếu logic backend hỗ trợ).
    * `Table`: Lịch sử sử dụng API theo ngày.

##### 2.9. `Page_AdminAccounts` (`/admin/settings/admins`)

* **Mục đích:** Quản lý tài khoản admin (vai trò `admin` vs `moderator`).
* **UI:**
    * `Button` "Mời Admin mới".
    * `Table` (AntD) hiển thị dữ liệu từ bảng `admin_users`.
    * **Các cột:** `Email`, `Vai trò` (Admin/Moderator), `Trạng thái` (Active/Inactive), `Hành động`.
    * **Cột "Hành động":** "Thay đổi vai trò", "Vô hiệu hóa".