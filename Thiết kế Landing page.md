Chào bạn,

-----

### TÀI LIỆU THIẾT KẾ LANDING PAGE

**Dự án:** PinYourWorld (Trang chủ)
**Nền tảng:** ReactJS (Next.js)
**Phiên bản:** 1.0

### 1\. Nền tảng Công nghệ & Nguyên tắc Thiết kế

#### 1.1. Ngăn xếp Công nghệ (Tech Stack)

  * **Framework:** **Next.js** (Bắt buộc)
      * **Lý do:** Chúng ta cần khả năng **Server-Side Rendering (SSR)** hoặc **Static Site Generation (SSG)** để Google có thể "đọc" (index) nội dung trang, giúp tối ưu SEO.
  * **Ngôn ngữ:** **TypeScript** (Đồng bộ với toàn bộ dự án).
  * **Styling:** **Tailwind CSS**
      * **Lý do:** Hoàn hảo cho việc xây dựng giao diện Landing Page hiện đại, đáp ứng (responsive) một cách nhanh chóng.
  * **Animations (Hoạt ảnh):** **Framer Motion**
      * **Lý do:** Thêm các hiệu ứng tinh tế (fade-in, slide-in khi cuộn) để tăng trải nghiệm cao cấp.
  * **Hosting:** **Vercel**
      * **Lý do:** Nền tảng tối ưu nhất để triển khai và vận hành Next.js.

#### 1.2. Nguyên tắc & Bố cục Thiết kế (UI/UX)

  * **SEO-First (Ưu tiên SEO):** Cấu trúc HTML (H1, H2, H3) phải rõ ràng, chuẩn ngữ nghĩa. Tốc độ tải trang (Core Web Vitals) phải nhanh.
  * **CTA-Driven (Hướng đến Kêu gọi Hành động):** Mọi "Section" (Phần) trên trang đều phải dẫn dắt người dùng đến 2 mục tiêu: "Đăng ký" (cho web) hoặc "Tải Ứng dụng" (cho mobile).
  * **Responsive (Đáp ứng):** Phải đẹp trên cả Desktop (nơi người dùng khám phá) và Mobile (nơi người dùng có thể tải app ngay).
  * **Bố cục chung:** Một trang `index.tsx` (hoặc `page.tsx`) duy nhất, cuộn dọc, được chia thành các "Section" (Phần) logic.

-----

### 2\. Thiết kế Giao diện (UI/UX) chi tiết

Dưới đây là các "Section" (Phần) cấu thành trang chủ, từ trên xuống dưới.

#### 2.1. `Component: Navbar` (Thanh điều hướng)

  * **UI:** Cố định (sticky) trên cùng, nền mờ (blur background) khi cuộn.
  * **Components (Bên trái):**
      * `Logo`: Logo "PinYourWorld".
  * **Components (Bên phải):**
      * `Link`: "Tính năng" (Features) - (Cuộn xuống `Section_Features`).
      * `Link`: "Cộng đồng" (Community) - (V1.5+) (Cuộn xuống `Section_Social`).
      * `Link`: "Gói Pro" (Pricing) - (V2.0+) (Cuộn xuống `Section_ProFeatures`).
      * `Button` (Ghost/Secondary): "Đăng nhập" (Dẫn đến `/login`).
      * `Button` (Primary): "Đăng ký" (Dẫn đến `/register`).

#### 2.2. `Section: Hero` (Phần Mở đầu)

  * **Mục tiêu:** Gây ấn tượng trong 5 giây. Trả lời câu hỏi "Đây là gì?".
  * **UI:** Bố cục 2 cột trên Desktop (Text bên trái, Ảnh bên phải).
  * **Nội dung (Text):**
      * **`H1` (Tiêu đề chính):** **Bản đồ ký ức của bạn.**
      * **`Paragraph` (Mô tả):** "Ghim lại mọi nơi bạn đã đến. Lên kế hoạch cho mọi nơi bạn muốn đi. Biến thế giới thành cuốn hộ chiếu số (F-STAT) của riêng bạn."
      * **`CTA_Buttons` (Nút Kêu gọi Hành động):**
          * `Button` (Primary, Lớn): "Bắt đầu miễn phí" (Dẫn đến `/register`).
          * `Component_StoreBadges`:   (Link đến store).
  * **Nội dung (Visual):**
      * (Một ảnh mockup chất lượng cao, hiển thị `Screen_MapHome` và `Screen_Profile` của app React Native).

#### 2.3. `Section: Features` (Tính năng V1.0)

  * **Mục tiêu:** Giải thích các tính năng cốt lõi (F-MAP).
  * **UI:** Một lưới (Grid) 3 cột.
  * **Cột 1: "Nhật ký Bản đồ" (F-MAP-05)**
      * `Icon`: ✍️ (Cây bút / Nhật ký)
      * **`H3`:** Lưu giữ Kỷ niệm
      * **`Paragraph`:** "Không chỉ là một cái ghim. Thêm ghi chú, nhật ký cá nhân, đánh giá (1-5 sao), và thư viện ảnh (tối đa 5 ảnh/ghim) cho mỗi địa điểm."
  * **Cột 2: "Lên Kế hoạch" (F-MAP-04)**
      * `Icon`: 🚩 (Cờ / Bucket List)
      * **`H3`:** Lên Kế hoạch & Mơ ước
      * **`Paragraph`:** "Phân biệt rõ ràng giữa các ghim **'Đã đến' (Visited)** và **'Muốn đến' (Want to Go)**. Xây dựng bucket list của bạn chưa bao giờ dễ dàng hơn."
  * **Cột 3: "Hộ chiếu Số" (F-STAT-02)**
      * `Icon`: 📊 (Biểu đồ / Thống kê)
      * **`H3`:** Thống kê Hành trình
      * **`Paragraph`:** "Xem hồ sơ cá nhân của bạn tự động đếm số **Quốc gia**, **Thành phố**, và **% Thế giới** bạn đã khám phá."

#### 2.4. `Section: Social` (Tính năng V1.5)

  * **Mục tiêu:** Giới thiệu khía cạnh cộng đồng (F-SOC).
  * **UI:** Bố cục 2 cột (Ảnh bên trái, Text bên phải).
  * **Nội dung (Visual):**
      * (Mockup của `Screen_Feed` hoặc `Screen_UserProfile`).
  * **Nội dung (Text):**
      * **`H2`:** Khám phá thế giới qua lăng kính của bạn bè.
      * **`Paragraph`:** "Theo dõi (F-SOC-01) hành trình của bạn bè và các travel blogger. Lấy cảm hứng từ Bảng tin (Feed) (F-SOC-03) và xem bản đồ công khai của họ để tìm những địa điểm độc đáo mà bạn chưa từng biết đến."

#### 2.5. `Section: ProFeatures` (Tính năng V2.0)

  * **Mục tiêu:** "Chào hàng" các tính năng trả phí, tạo giá trị cho gói Pro.
  * **UI:** Bố cục 2 cột (Text bên trái, Ảnh bên phải).
  * **Nội dung (Text):**
      * `Badge`: `PRO` (Một tag nhỏ màu vàng)
      * **`H2`:** Từ ước mơ đến kế hoạch chi tiết.
      * **`Paragraph`:** "Nâng cấp lên Pro để mở khóa **Lập Kế hoạch Chuyến đi (Trip Planner)** (F-UTIL-02). Tổ chức các ghim 'Muốn đến' của bạn thành một lịch trình theo ngày (Ngày 1, Ngày 2...) và đồng bộ offline hoàn toàn."
      * **`Checklist` (Danh sách tính năng Pro):**
          * ✅ Upload Video cho Ghim (F-MAP-08)
          * ✅ Ghim không giới hạn (Vượt mốc 100 ghim)
          * ✅ Bản đồ nhiệt (Heatmap) cá nhân (F-STAT-05)
          * ✅ Huy hiệu (Badges) độc quyền (F-GAME)
  * **Nội dung (Visual):**
      * (Mockup của `Screen_TripDetails` hoặc `Component_ItineraryList` trên web).

#### 2.6. `Section: FinalCTA` (Kêu gọi Hành động Cuối cùng)

  * **Mục tiêu:** "Chốt" người dùng lần cuối.
  * **UI:** Đơn giản, tập trung ở giữa, nền màu nổi bật.
  * **Nội dung:**
      * **`H2`:** Hành trình của bạn bắt đầu từ đây.
      * **`Paragraph`:** "Tạo tài khoản miễn phí và bắt đầu ghim bản đồ thế giới của bạn ngay hôm nay."
      * **`CTA_Buttons`:**
          * `Button` (Primary, Lớn nhất): "Đăng ký miễn phí ngay" (Dẫn đến `/register`).
          * `Component_StoreBadges`: (Hiển thị lại các nút tải App Store / Google Play).

#### 2.7. `Component: Footer` (Chân trang)

  * **UI:** Bố cục 4 cột.
  * **Nội dung:**
      * **Cột 1:** Logo, Giới thiệu ngắn, Icon mạng xã hội.
      * **Cột 2 (Sản phẩm):** "Tính năng", "Gói Pro", "Tải ứng dụng".
      * **Cột 3 (Công ty):** "Về chúng tôi", "Blog", "Liên hệ".
      * **Cột 4 (Pháp lý):** "Điều khoản Dịch vụ", "Quyền riêng tư".
      * **Dòng cuối cùng:** `© 2025 PinYourWorld. All rights reserved.`

-----

### 3\. Cấu trúc Thư mục (Next.js App Router Boilerplate)

Đây là source khởi tạo, tập trung vào trang Landing Page.

```
src/
├── app/
│   │
│   ├── (landing)/                # NHÓM ROUTE CÔNG KHAI (SEO)
│   │   ├── page.tsx            # Trang chủ (Gọi các Section 1-7)
│   │   ├── layout.tsx            # Layout (Chứa Navbar & Footer)
│   │   └── (các trang SEO khác như /features, /pricing)
│   │
│   ├── (auth)/                   # NHÓM ROUTE XÁC THỰC
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx            # (Layout đơn giản, căn giữa)
│   │
│   ├── (main)/                   # NHÓM ROUTE ỨNG DỤNG WEB (ĐÃ ĐĂNG NHẬP)
│   │   ├── app/
│   │   │   └── page.tsx
│   │   └── layout.tsx            # (Layout Split-Screen)
│   │
│   └── global.css                # (Cấu hình Tailwind)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── landing/                  # Các section của trang chủ
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── SocialSection.tsx
│       ├── ProSection.tsx
│       └── FinalCTA.tsx
│
└── public/
    ├── images/
    │   ├── app-mockup-hero.png
    │   ├── trip-planner-mockup.png
    │   └── social-feed-mockup.png
    └── logo.svg
```