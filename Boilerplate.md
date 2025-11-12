Đã hiểu. Bạn cần một **"Boilerplate" (Source Khởi tạo)** cho mỗi dự án. Đây là các "khung xương" (skeleton) đã được thiết lập sẵn về cấu trúc thư mục, công cụ và các file cấu hình cơ bản, nhưng chưa chứa logic nghiệp vụ (như `PinService` hay `TripController`).

Dưới đây là thiết kế template source khởi tạo cho cả 4 kho (repositories).

-----

### 1\. 🖥️ Backend: Java (Spring Boot) Boilerplate

Cách tốt nhất để tạo source này là dùng **[Spring Initializr](https://start.spring.io/)**.

  * **Cấu hình trên Spring Initializr:**

      * **Project:** Gradle (hoặc Maven)
      * **Language:** Java
      * **Spring Boot:** 3.x+
      * **Packaging:** Jar
      * **Java:** 17 (hoặc 21)
      * **Dependencies (Phụ thuộc CỐT LÕI):**
        1.  `Spring Web` (cho REST API)
        2.  `Spring Security` (cho khung JWT, OAuth2)
        3.  `Spring Data JPA` (cho CSDL)
        4.  `PostgreSQL Driver`
        5.  `Flyway Migration` (Rất quan trọng - để quản lý schema CSDL)
        6.  `Lombok` (Để giảm code boilerplate Java)
        7.  `Validation` (Để kiểm tra DTOs)

  * **Cấu trúc Thư mục (Sau khi tạo):**

<!-- end list -->

```
src/main/java/com/pinyourworld/
├── PinYourWorldApplication.java  # File chạy chính
│
├── config/                       # Thư mục cấu hình
│   ├── SecurityConfig.java       # (Cấu hình cơ bản: vô hiệu hóa CSRF, thiết lập CORS)
│   └── WebConfig.java
│
├── core/
│   ├── exception/
│   │   └── GlobalExceptionHandler.java # (Một handler trống để bắt lỗi)
│   └── security/
│       ├── JwtUtil.java          # (Các hàm rỗng để tạo/validate token)
│       └── (Các file setup security cơ bản...)
│
├── modules/                      # Thư mục chứa các module nghiệp vụ
│   └── health/                   # (Một module "Hello World" để kiểm tra)
│       └── HealthController.java   # (Chỉ chứa 1 API GET /health trả về "OK")
│
└── (Các thư mục user, pin... sẽ được tạo sau)

src/main/resources/
├── application.properties      # File cấu hình chính
│   # (Chứa các key trống cho CSDL, JWT Secret, AWS Keys...)
│   # spring.datasource.url=jdbc:postgresql://localhost:5432/pinyourworld
│   # spring.datasource.username=postgres
│   # spring.datasource.password=
│   # spring.jpa.hibernate.ddl-auto=none (Bắt buộc, vì dùng Flyway)
│   # spring.flyway.enabled=true
│
├── db/migration/               # Thư mục của FLYWAY
│   └── V1__Create_Users_Table.sql # (File SQL đầu tiên, tạo bảng users cơ bản)
│
build.gradle (hoặc pom.xml)     # (Chứa các dependencies đã chọn)
```

-----

### 2\. 📱 Mobile App: React Native Boilerplate

Tạo bằng lệnh: `npx react-native init PinYourWorldApp --template react-native-template-typescript`

  * **Các thư viện CỐT LÕI cần cài đặt ngay:**

      * `react-navigation` (stack, bottom-tabs)
      * `@reduxjs/toolkit` & `react-redux` (RTK)
      * `axios` (để gọi API)
      * `@gorhom/bottom-sheet` (Vì chúng ta biết sẽ dùng nó nhiều)
      * `react-native-config` (Để quản lý API\_URL)

  * **Cấu trúc Thư mục (Sau khi dọn dẹp):**

<!-- end list -->

```
src/
├── api/
│   └── client.ts             # (File cấu hình Axios instance, setup Base URL,
│                           #  và interceptor để tự động đính kèm JWT)
│
├── components/               # Các component TÁI SỬ DỤNG
│   ├── common/               # (Các component "ngu" như Button.tsx, Input.tsx)
│   └── layout/               # (Ví dụ: ScreenWrapper.tsx)
│
├── config/
│   └── index.ts              # (Export các biến môi trường từ react-native-config)
│
├── navigation/               # Logic điều hướng (React Navigation)
│   ├── AppNavigator.tsx      # (Logic chính: kiểm tra token để hiện AuthStack/MainStack)
│   ├── AuthStack.tsx         # (Navigator cho Login, Register)
│   ├── MainTabNavigator.tsx  # (Navigator Tab chính (Map, Profile...))
│   └── types.ts              # (Định nghĩa TypeScript cho các route)
│
├── screens/                  # Các MÀN HÌNH chính
│   ├── Auth/
│   │   └── LoginScreen.tsx     # (Một màn hình với UI form cơ bản)
│   └── Main/
│       ├── MapScreen.tsx       # (Một màn hình "Hello World" Map)
│       └── ProfileScreen.tsx   # (Một màn hình "Hello World" Profile)
│
├── store/                    # Cấu hình Redux Toolkit (RTK)
│   ├── index.ts              # (File configureStore, kết nối các slice và API)
│   ├── slices/               # Các state cục bộ (ví dụ: authSlice.ts)
│   │   └── authSlice.ts      # (Lưu user, token, trạng thái đăng nhập)
│   └── api/                  # Các slice API của RTK Query (chưa có)
│
├── styles/
│   └── theme.ts              # (Định nghĩa màu sắc, fonts, spacing...)
│
└── App.tsx                   # (File gốc, chứa <NavigationContainer>, <ReduxProvider>)
```

-----

### 3\. 🌐 Web App (User): ReactJS (Next.js) Boilerplate

Tạo bằng lệnh: `npx create-next-app@latest --typescript --tailwind --eslint` (Chọn App Router)

  * **Các thư viện CỐT LÕI cần cài đặt ngay:**

      * `@reduxjs/toolkit` & `react-redux`
      * `antd` (hoặc MUI, cho UI)
      * `axios`
      * `react-map-gl` (hoặc `@react-google-maps/api`)

  * **Cấu trúc Thư mục (App Router):**

<!-- end list -->

```
app/
├── (auth)/                 # Nhóm route cho các trang Auth
│   ├── login/
│   │   └── page.tsx        # (Trang login, UI form cơ bản)
│   └── layout.tsx            # (Layout riêng cho auth, ví dụ: căn giữa)
│
├── (main)/                 # Nhóm route chính (cần đăng nhập)
│   ├── app/
│   │   └── page.tsx        # (Trang chính '/app', UI placeholder)
│   └── layout.tsx            # (Bố cục Split-Screen: Sider + Content)
│
├── components/
│   ├── layout/
│   │   ├── TopNavbar.tsx
│   │   └── SplitScreenLayout.tsx # (Khung sườn cho (main) layout)
│   ├── map/
│   │   └── MapView.tsx         # (Placeholder cho react-map-gl)
│   └── ui/                   # (Các component UI nhỏ, tái sử dụng)
│
├── lib/ (hoặc store/)
│   ├── store.ts              # (Cấu hình Redux Store)
│   ├── hooks.ts              # (Custom hooks: useAppDispatch, useAppSelector)
│   ├── api/                  # (Cấu hình client Axios, RTK Query - rỗng)
│   └── providers.tsx         # (Component Provider cho Redux, AntD)
│
├── layout.tsx                # Layout GỐC (chứa <Providers>)
└── globals.css               # (Cấu hình Tailwind CSS)
```

-----

### 4\. 🔒 Web App (Admin): ReactJS (Vite) Boilerplate

Tạo bằng lệnh: `npm create vite@latest pinyourworld-admin -- --template react-ts`

  * **Các thư viện CỐT LÕI cần cài đặt ngay:**

      * `antd` (Bắt buộc - đây là thư viện UI chính cho admin)
      * `react-router-dom`
      * `@reduxjs/toolkit` & `react-redux`
      * `axios`
      * `@ant-design/charts` (cho biểu đồ)

  * **Cấu trúc Thư mục (Sau khi dọn dẹp):**

<!-- end list -->

```
src/
├── api/
│   ├── client.ts             # (Axios instance cho Admin API, Base URL)
│   └── (thư mục rtk/ rỗng)
│
├── app/
│   └── store.ts              # (Cấu hình Redux Store)
│
├── assets/                   # (Logo, icons)
│
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx      # (Khung AntD: Sider + Header + Content)
│   │   └── RouteGuard.tsx      # (Component bảo vệ route admin, kiểm tra JWT)
│   └── (thư mục rỗng...)
│
├── pages/                    # Các MÀN HÌNH chính
│   ├── DashboardPage.tsx     # (Trang /admin/dashboard, "Welcome to Admin")
│   └── LoginPage.tsx         # (Trang /login, dùng Form AntD cơ bản)
│
├── router/
│   └── index.tsx             # (Cấu hình react-router-dom, các route /login
│                           #  và /admin/* được bọc bởi RouteGuard)
│
├── styles/
│   └── (file tuỳ chỉnh theme AntD)
│
├── App.tsx                   # (File App chính, chứa <RouterProvider>)
└── main.tsx                  # (Entry point, chứa <ReduxProvider>, <ConfigProvider AntD>)
```

-----
