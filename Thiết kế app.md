### 🎨 Nguyên tắc & Nền tảng Thiết kế (Áp dụng cho mọi phiên bản)

1.  **Map-Centric (Lấy Bản đồ làm Trung tâm):** Giao diện chính *là* bản đồ. Mọi thứ khác (thêm ghim, xem hồ sơ) nên là các lớp (layers) hoặc màn hình trượt (modal sheets) đè lên trên bản đồ để giữ ngữ cảnh.
2.  **Thành phần React Native:**
    * **Điều hướng:** `React Navigation` (Stack, Tab, và Native Stack).
    * **Bản đồ:** `react-native-maps` (sử dụng Google Maps/Apple Maps).
    * **Icons:** `react-native-vector-icons`.
    * **Cử chỉ:** `react-native-gesture-handler` (cho các tấm (sheets) trượt lên).
3.  **Hệ thống Design (Design System) cơ bản:**
    * **Màu sắc:** Primary (Xanh dương đậm cho du lịch), Accent (Vàng/Cam cho ghim "Want to Go"), Neutrals (Grays, White).
    * **Typography:** Một font chữ rõ ràng, dễ đọc (ví dụ: Roboto hoặc Open Sans).
    * **Components Tái sử dụng:** `Button`, `Input`, `Avatar`, `PinCard`.

---

### 🚀 PHIÊN BÁN 1.0 (MVP - LÕI TRẢI NGHIỆM CÁ NHÂN)

*Mục tiêu: Một "cuốn nhật ký bản đồ" cá nhân mượt mà, dễ sử dụng nhất.*

#### 1. Luồng Onboarding & Auth (F-ONBOARD, F-AUTH)

* **`Screen_Splash`**: Màn hình chờ (Logo).
* **`Screen_Walkthrough` (F-ONBOARD-01)**:
    * Một `Swiper` (lướt ngang) 3 màn hình: "Chào mừng!", "Ghi lại mọi hành trình", "Lên kế hoạch cho chuyến đi mơ ước".
* **`Screen_PermissionRequest` (F-ONBOARD-02)**:
    * Một màn hình thân thiện giải thích *tại sao* cần quyền Vị trí & Ảnh *trước khi* bật pop-up của HĐH.
* **`Screen_AuthHome` (F-AUTH-01, 02)**:
    * Giao diện sạch.
    * **Ưu tiên hàng đầu:** `Button_SocialLogin` (Google, Apple). Thiết kế phải thật nổi bật.
    * Phụ: Link "Đăng nhập/Đăng ký bằng Email".
* **`Screen_LoginEmail` / `Screen_RegisterEmail` (F-AUTH-01)**:
    * Các form `TextInput` tiêu chuẩn (Email, Mật khẩu, Username).

#### 2. Cấu trúc Điều hướng Chính (Main App Navigation)

Sử dụng `TabNavigator` của React Navigation.

* **Tab 1: Bản đồ (F-MAP)** - Màn hình chính.
* **Tab 2: Hồ sơ (F-STAT)**

#### 3. Tab 1: Màn hình Bản đồ (F-MAP) - [CỐT LÕI V1.0]

* **`Screen_MapHome`**:
    * **`Component_MapView` (F-MAP-01)**: `react-native-maps` chiếm 100% màn hình.
    * **`Component_PinCluster` (F-MAP-03)**: Các ghim được render dưới dạng `<Marker>`. Khi zoom-out, thư viện sẽ tự động gom cụm. UI của cụm là một vòng tròn với số đếm (ví dụ: "10+").
    * **`Component_MapSearchBar` (F-MAP-02)**: Một thanh tìm kiếm `TextInput` "nổi" ở phía trên. Khi nhấn vào...
    * **`Modal_SearchPlaces`**: ...sẽ mở một Modal toàn màn hình với `TextInput` (đã focus) và `FlatList` hiển thị kết quả từ API Google Places.
    * **`Component_AddPinFAB` (F-MAP-04)**: Một Nút hành động nổi (Floating Action Button - FAB) hình dấu `+` ở góc dưới. Nhấn vào đây cho phép người dùng "ghim tại vị trí hiện tại" hoặc "chọn trên bản đồ".

#### 4. Luồng Thêm/Sửa Ghim (F-MAP-04, 05, 06)

* **`BottomSheet_AddPin`**:
    * *UX:* Khi người dùng chọn một địa điểm (từ `Modal_SearchPlaces` hoặc `AddPinFAB`), một tấm (bottom sheet) sẽ trượt lên từ dưới, chỉ chiếm 80% màn hình (để người dùng vẫn thấy bản đồ bên dưới).
    * *UI (Đây là màn hình quan trọng nhất):*
        * Tên địa điểm (đã điền).
        * **`Component_StatusToggle` (F-MAP-04)**: Một `SegmentedControl` BẮT BUỘC: **[ Đã đến ]** | **[ Muốn đến ]**.
        * **`View_VisitedFields` (Hiện khi chọn "Đã đến")**:
            * `Component_DatePicker` (F-MAP-05): Chọn ngày đi.
            * `Component_StarRating` (F-MAP-05): 5 ngôi sao (1-5).
        * **`TextInput_Notes` (F-MAP-05)**: Một `TextInput` (multiline) lớn cho Ghi chú/Nhật ký.
        * **`Component_ImageUploader` (F-MAP-05)**:
            * Một `ScrollView` ngang.
            * Hiển thị các thumbnail ảnh đã upload.
            * Một Nút `+` để mở `react-native-image-picker`.
            * *Logic V1.0:* Vô hiệu hóa nút `+` khi đã đạt 5 ảnh.
        * **`Button_Save`**: Nút "Lưu Ghim".

* **`Screen_PinDetails` (F-MAP-05, 06)**:
    * *UX:* Khi nhấn vào một ghim trên bản đồ (từ `Component_PinCluster`), thay vì `BottomSheet_AddPin`, màn hình `PinDetails` sẽ mở ra (dạng Stack).
    * *UI:*
        * Header: Nút "Sửa" (mở `BottomSheet_AddPin` ở chế độ Edit) và "Xóa".
        * `Swiper` (thư viện): Hiển thị gallery ảnh/video.
        * `View_Content`: Hiển thị (Read-only): Tên, Đánh giá (sao), Ngày đi, Trạng thái (Visited/Want to Go).
        * `Text_Journal`: Hiển thị toàn bộ Ghi chú/Nhật ký.

#### 5. Tab 2: Màn hình Hồ sơ (F-STAT)

* **`Screen_Profile` (F-STAT-01)**:
    * **`Component_ProfileHeader` (F-AUTH-03)**: Ảnh bìa, `Avatar` (Ảnh đại diện), Tên hiển thị, @username, Bio.
    * **`Component_StatsBar` (F-STAT-02)**: Một thanh ngang chia 3 cột:
        * `{stats.visited_countries_count}` (Quốc gia)
        * `{stats.visited_cities_count}` (Thành phố)
        * `{stats.total_pins_count}` (Ghim)
    * **`TabNavigator_Profile` (Điều hướng phụ bên trong Hồ sơ)**:
        * **Tab A: Bản đồ (F-STAT-03)**: Một `MapView` (tương tự `Screen_MapHome`) nhưng chỉ hiển thị ghim của người dùng này.
        * **Tab B: Danh sách (F-STAT-04)**:
            * `Component_ListFilter`: Các nút lọc "Tất cả" | "Đã đến" | "Muốn đến".
            * `FlatList`: Danh sách các ghim.
            * `Component_PinCard`: Một thẻ (card) tái sử dụng hiển thị: Ảnh thumbnail, Tên địa điểm, Ngày đi.

---

### 🤝 PHIÊN BẢN 1.5 (XÃ HỘI & TIỆN ÍCH)

*Mục tiêu: Biến ứng dụng từ công cụ thành cộng đồng. Các UI V1.0 vẫn giữ nguyên và được nâng cấp.*

#### 1. Cấu trúc Điều hướng Chính (Thay đổi)

`TabNavigator` chính (ở dưới cùng) giờ sẽ có 5 tab:

1.  **Tab 1: Bản đồ** (Như V1.0)
2.  **Tab 2: Bảng tin (Feed)** (MỚI - F-SOC-03)
3.  **Tab 3: Thêm Ghim (+)** (Nút `+` FAB V1.0 giờ được đưa vào trung tâm Tab Bar cho nổi bật)
4.  **Tab 4: Khám phá (Discover)** (MỚI - F-SOC-02)
5.  **Tab 5: Hồ sơ** (Như V1.0, nhưng được nâng cấp)

#### 2. Tab 2: Bảng tin (F-SOC-03)

* **`Screen_Feed`**:
    * **Thiết kế giống Instagram/Facebook Feed** - Mạng xã hội đầy đủ tính năng.
    * Một `FlatList` (cuộn vô hạn) với Pull-to-refresh.
    * **Nhiều loại Post Card:**
        1. **Pin Post (Visited/Want to Go)**:
            * Header: Avatar, tên user, location (có thể click), timestamp
            * Badge trạng thái: "✓ Đã đến" (màu xanh) hoặc "⭐ Muốn đến" (màu cam)
            * Photo Gallery thông minh:
                - 1 ảnh: Full width, cao 400px
                - 2 ảnh: Grid 1:1
                - 3+ ảnh: Layout 2:1 với overlay "+N" nếu nhiều hơn 3
            * Rating (5 sao) và ngày đi (nếu Visited)
            * Caption với username in đậm
            * Actions bar: Like ❤️ (số lượt thích), Comment 💬 (số bình luận), Share 📤
        2. **Achievement Post**:
            * Header: Avatar, tên user
            * Content: Badge icon lớn (🌍), tiêu đề achievement, số đếm
            * Background màu primary nhẹ
            * Caption
            * Actions bar tương tự
    * **Tính năng tương tác:**
        * Click avatar/username → `Screen_UserProfile`
        * Click location → `Screen_PinDetails`
        * Like button với animation (🤍 ↔ ❤️), cập nhật số lượt thích real-time
        * Comment button (TODO: mở modal comments)
        * Share button (TODO: mở modal share)
    * **Header:** Tiêu đề "Bảng tin" + Nút thông báo 🔔 (góc phải)
    * **Empty State:** Icon 📰, "Chưa có bài viết nào", "Theo dõi bạn bè..."

#### 3. Tab 4: Khám phá (F-SOC-02)

* **`Screen_Discover`**:
    * Một `TextInput` (Search Bar) ở trên cùng.
    * Chức năng chính: Tìm kiếm người dùng (theo `@username`).
    * `FlatList` hiển thị kết quả tìm kiếm người dùng.

#### 4. Nâng cấp Màn hình Hồ sơ (F-SOC-01, 04)

* **`Screen_Profile` (Của chính mình)**:
    * `Component_StatsBar` (V1.0) giờ được bổ sung: `Followers` | `Following`.
* **`Screen_UserProfile` (Của người khác)**:
    * *UX:* Khi nhấn vào tên người dùng (từ Feed hoặc Discover), điều hướng đến màn hình này.
    * *UI:* Tái sử dụng 90% `Screen_Profile`.
    * **Thay đổi chính:** Nút "Sửa hồ sơ" được thay bằng nút **`Button_Follow` / `Button_Unfollow`** (F-SOC-01).
* **`Screen_Settings` (Nâng cấp)**:
    * Thêm một mục "Cài đặt Quyền riêng tư" (F-SOC-04).
    * **`Screen_PrivacySettings`**:
        * `Toggle`: "Hồ sơ Riêng tư" (Bật/Tắt).
        * `SegmentedControl`: "Ai có thể xem Ghi chú của tôi?": [Chỉ mình tôi], [Followers], [Mọi người].
        * `SegmentedControl`: "Ai có thể xem Bucket List của tôi?": (Tương tự).

#### 5. Tiện ích (F-UTIL-01, F-DATA-01)

* **`Component_OfflineBanner` (F-UTIL-01)**:
    * Một component toàn cục (global) được hiển thị ở đầu ứng dụng (dùng `NetInfo`) khi mất mạng: "Bạn đang offline. Dữ liệu có thể đã cũ."
* **`Screen_Settings` (Nâng cấp)**:
    * Thêm nút "Xuất dữ liệu" (F-DATA-01). Nhấn vào sẽ hiển thị `Alert`: "Chúng tôi sẽ gửi file CSV đến email của bạn."

---

### 💎 PHIÊN BẢN 2.0+ (NÂNG CAO & THƯƠNG MẠI HÓA)

*Mục tiêu: Thêm các tính năng "Pro" giá trị cao và triển khai luồng thanh toán.*

#### 1. Luồng Thanh toán (F-MON)

* **`Modal_Paywall` (F-MON-01, 02)**:
    * *UX:* Một Modal toàn màn hình trượt lên khi người dùng thực hiện một hành động "Pro":
        1.  Nhấn nút "Tải lên Video" (F-MAP-08).
        2.  Nhấn nút "Tạo Chuyến đi" (F-UTIL-02).
        3.  Cố gắng tạo ghim thứ 101.
    * *UI:*
        * Thiết kế đẹp, thuyết phục.
        * `FlatList` (dạng check-list) các tính năng Pro: "Ghim không giới hạn", "Tải lên Video", "Lập kế hoạch Chuyến đi", "Bản đồ nhiệt".
        * `Button`: "Bắt đầu 7 ngày Dùng thử Miễn phí".
        * `SegmentedControl` (hoặc 2 nút riêng): [Gói Năm (Tiết kiệm 30%)] | [Gói Tháng].
        * Link nhỏ: "Khôi phục Giao dịch" (Restore Purchase).

#### 2. Tính năng Pro: Lập Kế hoạch Chuyến đi (F-UTIL-02)

* **`TabNavigator_Profile` (Nâng cấp)**:
    * Thêm Tab C: **"Chuyến đi" (Trips)**.
* **`Screen_TripList` (Tab C)**:
    * `FlatList` các chuyến đi đã tạo (ví dụ: "Hè 2026: Châu Âu").
    * FAB `+` để mở `Screen_CreateTrip` (chỉ là 1 form nhập Tên, Ngày đi).
* **`Screen_TripDetails`**:
    * *UX:* Nhấn vào một chuyến đi.
    * *UI:*
        * Header: Tên chuyến đi, Nút "Thêm địa điểm" (mở `Modal_SearchPlaces` để tìm ghim "Want to Go" thêm vào).
        * **`Component_ItineraryList` (F-UTIL-02)**:
            * Một `SectionList` hoặc `DraggableFlatList` (từ `react-native-draggable-flatlist`).
            * Section Headers: "Ngày 1", "Ngày 2", "Chưa xếp lịch".
            * Các Item: `Component_PinCard` (tái sử dụng từ V1.0) - cho phép người dùng kéo-thả để sắp xếp lịch trình.

#### 3. Tính năng Pro: Gamification & Stats (F-GAME, F-STAT)

* **`TabNavigator_Profile` (Nâng cấp)**:
    * Thêm Tab D: **"Huy hiệu" (Badges)** (F-GAME-02).
* **`Screen_BadgeCollection` (Tab D)**:
    * Một `FlatList` với `numColumns={3}` (dạng lưới).
    * **`Component_BadgeIcon` (F-GAME-01)**:
        * Icon của huy hiệu.
        * Nếu chưa đạt được: Icon được làm mờ (grayscale) và khóa lại.
        * Nhấn vào icon (đã đạt được) sẽ mở `Modal` giải thích huy hiệu đó.
* **`Screen_MapHome` (Nâng cấp)**:
    * Thêm một nút `Icon` (ví dụ: hình "Layer") trên bản đồ.
    * Nhấn vào sẽ mở `ActionSheet`:
        * [Xem Ghim (Mặc định)]
        * **[Xem Bản đồ nhiệt (Pro)]** (F-STAT-05) - Nếu là 'free', hiển thị (Pro) và nhấn vào sẽ mở `Modal_Paywall`.

#### 4. V3.0+ (Khám phá Thông minh)

* **Tab 4: Khám phá (Discover)** (Nâng cấp từ V1.5)
    * `Screen_Discover` không chỉ là tìm kiếm người dùng nữa.
    * Giờ nó là một `ScrollView` phức tạp:
        * `Component_Carousel`: "Gợi ý cho bạn (AI)" (F-DISC-02) - `ScrollView` ngang các `PinCard`.
        * `Component_Carousel`: "Xu hướng gần đây" (F-DISC-01)
        * `Component_Carousel`: "Top 10 ở Paris" (F-DISC-01)
        * Link: "Xem Bảng xếp hạng" (F-GAME-03) -> `Screen_Leaderboard`.