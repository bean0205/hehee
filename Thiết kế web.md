
---

# TÀI LIỆU THIẾT KẾ ỨNG DỤNG (WEB APP DESIGN SPECIFICATION)

**Dự án:** PinYourWorld (Web)
**Nền tảng:** ReactJS
**Phiên bản:** 1.0 (Bản Toàn diện)

## 1. Nền tảng Công nghệ & Nguyên tắc Thiết kế

### 1.1. Ngăn xếp Công nghệ (Tech Stack)

Đây là ngăn xếp công nghệ tương đương với bản mobile, được tối ưu hóa cho web.

* **📱 Frontend (Web App - ReactJS)**
    * **Framework:** **Next.js** (hoặc Vite + ReactJS)
        > *Lý do:* Next.js cung cấp khả năng Server-Side Rendering (SSR) và Static Site Generation (SSG), rất tốt cho SEO trang hồ sơ công khai (V1.5).
    * **Ngôn ngữ:** **TypeScript** (Bắt buộc, đồng bộ với Backend & Mobile).
    * **Điều hướng (Routing):** **Next.js Router** (hoặc `react-router-dom`).
    * **Bản đồ (F-MAP):** **`react-map-gl`** (của Mapbox) hoặc **`@react-google-maps/api`**.
        > *Lý do:* Đây là các thư viện web-native, hiệu suất cao để render bản đồ.
    * **Quản lý Trạng thái:** **Redux Toolkit (RTK) + RTK Query**
        > *Lý do:* Tương tự bản mobile, giúp đồng bộ logic fetching và caching API.
    * **Component Library (Thư viện UI):** **Ant Design** (hoặc Material-UI (MUI)).
        > *Lý do:* Cung cấp một bộ components (Modals, Drawers, Forms, Layout) mạnh mẽ, giúp xây dựng giao diện dashboard phức tạp một cách nhanh chóng.
    * **Styling:** **Tailwind CSS** (hoặc `styled-components`).

* **🖥️ Backend, 🗃️ Database, ☁️ Infrastructure:**
    > *Lý do:* **Giữ nguyên 100%** như thiết kế của bản React Native. Ứng dụng web ReactJS này sẽ gọi đến **cùng một bộ API (V1.0, V1.5...)** mà chúng ta đã thiết kế.

### 1.2. Nguyên tắc & Bố cục Thiết kế (UI/UX)

* **Bố cục chính (Master Layout): Split-Screen**
    * Đây là thay đổi lớn nhất so với mobile. Giao diện chính của ứng dụng sẽ được chia làm 2 phần luôn hiển thị:
        * **Panel Trái (Left Panel) (rộng ~30-40%):** Một thanh `Sidebar` chứa nội dung (danh sách ghim, chi tiết ghim, feed, hồ sơ...).
        * **Panel Phải (Right Panel) (rộng ~60-70%):** `MapView` (Bản đồ tương tác).
* **Điều hướng:**
    * Sẽ có một **`TopNavbar`** (thanh điều hướng trên cùng) cố định chứa: Logo, `SearchBar`, và `Avatar` người dùng (với menu dropdown).
    * `Left Panel` sẽ thay đổi nội dung dựa trên URL (React Router).
* **Tương tác:**
    * Thay vì `BottomSheet` (mobile), chúng ta sẽ dùng **`Modal`** (Cửa sổ pop-up) hoặc **`Drawer`** (Ngăn kéo trượt ra) của Ant Design cho các form (như Thêm/Sửa Ghim).

---

## 2. Thiết kế Giao diện (UI/UX) chi tiết theo Phiên bản

### 🚀 PHIÊN BÁN 1.0 (MVP - LÕI TRẢI NGHIỆM CÁ NHÂN)

*Mục tiêu: Xây dựng một công cụ lập bản đồ cá nhân mạnh mẽ trên nền tảng web.*

#### 2.1. Luồng Auth (F-AUTH)

* *UX: Đây là các trang riêng biệt, không nằm trong bố cục Split-Screen chính.*
* **`Page_Login` (`/login`) (F-AUTH-01, 02)**:
    * Một form đơn giản ở giữa màn hình.
    * Ưu tiên các nút `Button_SocialLogin` (Google, Apple).
    * Form `Input` (Ant Design) cho Email/Mật khẩu.
* **`Page_Register` (`/register`) (F-AUTH-01)**:
    * Tương tự, form đăng ký (`Input` cho Email, Username, Mật khẩu).

#### 2.2. Giao diện Chính (Main App Layout)

* **`Route: /app`**:
    * **`Component_TopNavbar`**:
        * Logo (bên trái).
        * **`Component_SearchBar` (F-MAP-02)**: Một `AutoComplete` (Ant Design) ở giữa, gọi API `.../search/places`.
        * **`Component_UserMenu`** (bên phải): `Avatar` người dùng, khi nhấn vào hiển thị `Dropdown` (Ant Design) với các link: "Hồ sơ của tôi", "Cài đặt", "Đăng xuất".
    * **`Layout_SplitScreen`**:
        * **`View_LeftPanel`**: Ban đầu (ở `/app`), nó hiển thị `Component_PinList` (danh sách tất cả ghim của bạn).
        * **`View_RightPanel`**: Hiển thị `Component_MapView` (F-MAP-01) với các ghim đã được gom cụm (F-MAP-03).

#### 2.3. Luồng Tạo & Xem Ghim (F-MAP-04, 05, 06)

* **Tương tác (Rất quan trọng):**
    1.  Người dùng tìm kiếm địa điểm trên `Component_SearchBar`.
    2.  Chọn một địa điểm từ `AutoComplete`.
    3.  `Component_MapView` (bên phải) bay (pan/zoom) đến vị trí đó.
    4.  Một `Pop-over` (Ant Design) nhỏ xuất hiện trên bản đồ hỏi: "Thêm ghim tại [Tên địa điểm]?"
    5.  Nhấn "Thêm".
* **`Modal_PinEditor` (F-MAP-04, 05)**:
    * *UX: Một `Modal` (Ant Design) bật lên, che mờ toàn bộ ứng dụng để người dùng tập trung.*
    * *UI: Một `Form` (Ant Design) chứa:*
        * `Radio.Group` (hoặc `SegmentedControl`): **[ Đã đến ]** | **[ Muốn đến ]** (F-MAP-04).
        * `Form.Item` (chứa `DatePicker`, `Rate` (sao)) - (F-MAP-05).
        * `Input.TextArea` cho Ghi chú/Nhật ký (F-MAP-05).
        * **`Upload.Dragger` (F-MAP-05)**: Một component kéo-thả file mạnh mẽ của Ant Design để upload ảnh (Giới hạn 5 ảnh V1.0).
        * `Button` "Lưu Ghim".
* **Xem/Sửa Ghim (F-MAP-06)**:
    1.  Người dùng nhấn vào một ghim (Marker) trên `Component_MapView`.
    2.  `Component_MapView` bay đến ghim đó.
    3.  `View_LeftPanel` (bên trái) **tự động cập nhật** (qua React State/Router) để hiển thị...
    4.  **`Component_PinDetails`**:
        * *UI:* Hiển thị (Read-only): Tên, Sao, Ngày đi, Ghi chú.
        * Một `Carousel` (Ant Design) để xem các ảnh đã upload.
        * Header của Panel có nút "Sửa" (mở `Modal_PinEditor` ở chế độ Edit) và "Xóa".

#### 2.4. Màn hình Hồ sơ (F-STAT)

* *UX: Người dùng nhấn `Avatar` -> "Hồ sơ của tôi".*
* **`Route: /app/profile/[username]` (F-STAT-01)**:
    * **`View_LeftPanel` (Cập nhật)**:
        * Hiển thị **`Component_ProfileHeader`** (Ảnh bìa, Avatar, Tên, @username, Bio).
        * Hiển thị **`Component_StatsBar`** (chia 3 cột: Quốc gia, Thành phố, Ghim) (F-STAT-02).
        * Một `Tabs` (Ant Design) bên dưới:
            * **Tab A: Danh sách (F-STAT-04)**: Một `List` (Ant Design) các `Component_PinCard`.
    * **`View_RightPanel` (Cập nhật)**:
        * `Component_MapView` (F-STAT-03) chỉ render các ghim của người dùng này.

---

### 🤝 PHIÊN BẢN 1.5 (XÃ HỘI & TIỆN ÍCH)

*Mục tiêu: Tích hợp các tính năng cộng đồng vào bố cục Split-Screen.*

#### 2.5. Cấu trúc Điều hướng Chính (Thay đổi)

* **`Component_TopNavbar`**: Giữ nguyên.
* *UX: Chúng ta cần một cách để chuyển đổi nội dung của `Left Panel`. Chúng ta sẽ thêm một **`Sidebar_Navigation`** (một thanh icon hẹp) bên cạnh `Left Panel`.*
* **Bố cục mới:**
    * `TopNavbar`
    * `Layout_Main` (Full-screen bên dưới TopNavbar)
        * **`Sidebar_Navigation` (Icon Bar)**:
            * Icon 1: Bản đồ của tôi (V1.0) -> `/app`
            * Icon 2: Bảng tin (MỚI) -> `/app/feed` (F-SOC-03)
            * Icon 3: Khám phá (MỚI) -> `/app/discover` (F-SOC-02)
        * **`View_LeftPanel` (Panel nội dung)**: Hiển thị nội dung dựa trên icon được chọn.
        * **`View_RightPanel` (Map)**: Luôn hiển thị.

#### 2.6. Các trang Xã hội (F-SOC)

* **`Route: /app/feed` (F-SOC-03)**:
    * `View_LeftPanel` hiển thị **`Component_FeedList`**: Một `List` (Ant Design) cuộn vô hạn các `Component_ActivityCard`.
    * *Tương tác:* Nhấn vào một "Activity" (ví dụ: "[Tên] ghim [Địa điểm]"), `View_RightPanel` (bản đồ) sẽ bay đến ghim đó và mở `Pop-over` của ghim.
* **`Route: /app/profile/[username]` (F-SOC-02)**:
    * *UX: Khi xem hồ sơ người khác (từ Feed hoặc Discover).*
    * `View_LeftPanel` hiển thị `Component_ProfileHeader` của họ. Nút "Sửa" được thay bằng **`Button_Follow` / `Button_Unfollow`**.
    * `View_RightPanel` hiển thị bản đồ ghim CÔNG KHAI của họ (đã lọc theo F-SOC-04).
* **`Route: /app/settings` (F-SOC-04, F-DATA-01)**:
    * *UX: Nhấn `Avatar` -> "Cài đặt". Đây là một trang riêng, không cần Split-Screen.*
    * Sử dụng `Layout` và `Menu` của Ant Design.
    * `Menu.Item` "Quyền riêng tư" (F-SOC-04): Hiển thị các `Switch` (cho "Hồ sơ Riêng tư") và `Radio.Group` (cho "Ai có thể xem...").
    * `Menu.Item` "Tài khoản": Hiển thị nút "Xuất dữ liệu" (F-DATA-01).

---

### 💎 PHIÊN BẢN 2.0+ (NÂNG CAO & THƯƠNG MẠI HÓA)

*Mục tiêu: Tích hợp các tính năng "Pro" cao cấp vào giao diện web.*

#### 2.7. Luồng Thanh toán (F-MON)

* **`Modal_Paywall` (F-MON-01, 02)**:
    * *UX: Một `Modal` (Ant Design) bật lên khi người dùng nhấn vào một tính năng bị khóa (ví dụ: "Bản đồ nhiệt").*
    * *UI:* Thiết kế thuyết phục, liệt kê tính năng Pro, chọn gói (Năm/Tháng).
    * *Tích hợp:* Vì đây là web, chúng ta sẽ tích hợp với **Stripe** (thay vì RevenueCat). Nhấn "Nâng cấp" sẽ chuyển hướng đến trang thanh toán Stripe.

#### 2.8. Tính năng Pro: Lập Kế hoạch Chuyến đi (F-UTIL-02)

* **`Sidebar_Navigation` (Nâng cấp)**:
    * Thêm Icon 4: Chuyến đi (Trips) -> `/app/trips`.
* **`Route: /app/trips`**:
    * `View_LeftPanel` hiển thị **`Component_TripList`**: `List` các chuyến đi đã tạo, và `Button` "Tạo chuyến đi mới".
* **`Route: /app/trips/[uuid]` (Màn hình Chi tiết Chuyến đi)**:
    * Đây là một trong những UI phức tạp nhất.
    * **`View_LeftPanel`**: Hiển thị **`Component_ItineraryList` (F-UTIL-02)**.
        * Sử dụng `Collapse` (Ant Design) cho "Ngày 1", "Ngày 2"...
        * Bên trong mỗi "Ngày" là một danh sách kéo-thả (dùng `dnd-kit`) các `Component_PinCard`.
    * **`View_RightPanel`**:
        * `Component_MapView` chỉ hiển thị các ghim thuộc chuyến đi này.
        * (V3.0+) Hiển thị các đường nối (`Polyline`) tối ưu lộ trình (F-UTIL-04).

#### 2.9. Tính năng Pro: Gamification & Stats (F-GAME, F-STAT)

* **`Route: /app/profile/[username]` (Nâng cấp)**:
    * `Tabs` (Ant Design) trong `Left Panel` được thêm:
        * Tab C: **"Huy hiệu" (Badges)** (F-GAME-02).
        * *UI (Tab C):* Một `Grid` (Ant Design `Row`/`Col`) các `Component_BadgeIcon`.
* **`Component_MapView` (Nâng cấp)**:
    * Thêm một `Dropdown` ("Layers") trên bản đồ.
    * `Menu.Item`: "Bản đồ nhiệt" (F-STAT-05). Nhấn vào (nếu Pro) sẽ gọi API và render một `HeatmapLayer` (từ `react-map-gl`).

#### 2.10. V3.0+ (Khám phá Thông minh)

* **`Route: /app/discover` (Nâng cấp từ V1.5)**:
    * `View_LeftPanel` không chỉ là tìm kiếm, mà là một dashboard khám phá:
        * Carousel "Gợi ý cho bạn (AI)" (F-DISC-02).
        * Carousel "Xu hướng" (F-DISC-01).
        * Link đến `Route: /app/leaderboard` (F-GAME-03).
    * *Tương tác:* Di chuột (hover) qua một gợi ý trong `Left Panel`, bản đồ (`Right Panel`) sẽ tự động bay (pan) đến và đánh dấu ghim đó.