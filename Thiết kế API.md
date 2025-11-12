

-----

### Nguyên tắc Thiết kế Chung

1.  **Base URL (Tiền tố):** Tất cả API sẽ bắt đầu bằng `/api`.
2.  **Versioning (Phiên bản):** Chúng ta sẽ dùng versioning trên URL (ví dụ `/api/v1/...`). Hầu hết các tính năng mới (V1.5, V2.0) có thể được *thêm vào* `/api/v1/` mà không cần tạo `/api/v2/`, trừ khi có một thay đổi lớn gây phá vỡ (breaking change).
3.  **Authentication (Xác thực):** Sử dụng **JWT (Bearer Token)**. Các endpoint yêu cầu xác thực sẽ được đánh dấu `[BẢO MẬT: JWT]`.
4.  **Định danh (Identifiers):** Luôn sử dụng `uuid` (đã có trong CSDL) cho các tài nguyên trong URL, không bao giờ dùng `id` (serial).
5.  **Định dạng:** Tất cả Request/Response body đều là `application/json` (trừ khi là upload file).
6.  **Pagination (Phân trang):** Mọi API trả về danh sách (list) đều phải hỗ trợ phân trang qua query params: `?limit=20&offset=0`.

-----

## 🚀 PHIÊN BẢN V1.0 (MVP)

*Mục tiêu: API cho trải nghiệm cá nhân cốt lõi.*

### Module 1: Auth (F-AUTH)

  * **`POST /api/v1/auth/register` (F-AUTH-01)**

      * **Mục đích:** Đăng ký tài khoản mới bằng Email.
      * **Bảo mật:** `[PUBLIC]`
      * **Request Body:** `{ "email": "...", "password": "...", "username": "...", "display_name": "..." }`
      * **Response (201 Created):** `{ "user": { ...user_object... }, "access_token": "..." }`
      * **Ghi chú:** `username` và `email` phải là duy nhất (unique).

  * **`POST /api/v1/auth/login/email` (F-AUTH-01)**

      * **Mục đích:** Đăng nhập bằng Email, trả về JWT.
      * **Bảo mật:** `[PUBLIC]`
      * **Request Body:** `{ "email": "...", "password": "..." }`
      * **Response (200 OK):** `{ "user": { ...user_object... }, "access_token": "..." }`

  * **`POST /api/v1/auth/login/social` (F-AUTH-02)**

      * **Mục đích:** Đăng nhập/Đăng ký qua Google, Apple.
      * **Bảo mật:** `[PUBLIC]`
      * **Request Body:** `{ "provider": "google" | "apple", "social_token": "..." }`
      * **Response (200 OK):** `{ "user": { ...user_object... }, "access_token": "..." }`
      * **Ghi chú:** Backend phải xác thực `social_token` với Apple/Google, sau đó tìm (hoặc tạo mới) user trong CSDL.

  * **`POST /api/v1/auth/password/request-reset` (F-AUTH-01)**

      * **Mục đích:** Gửi email yêu cầu reset mật khẩu.
      * **Bảo mật:** `[PUBLIC]`
      * **Request Body:** `{ "email": "..." }`
      * **Response (200 OK):** `{ "message": "Password reset email sent." }`

  * **`POST /api/v1/auth/password/submit-reset` (F-AUTH-01)**

      * **Mục đích:** Gửi mật khẩu mới cùng token reset.
      * **Bảo mật:** `[PUBLIC]`
      * **Request Body:** `{ "reset_token": "...", "new_password": "..." }`
      * **Response (200 OK):** `{ "message": "Password updated successfully." }`

-----

### Module 2: Users & Profiles (F-AUTH, F-STAT)

  * **`GET /api/v1/users/me` (F-AUTH-03, F-STAT-01, 02)**

      * **Mục đích:** Lấy thông tin hồ sơ của CHÍNH NGƯỜI DÙNG đang đăng nhập.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (200 OK):** (Bao gồm các thống kê đã giải chuẩn hóa từ CSDL)
        ```json
        {
          "uuid": "...", "username": "...", "display_name": "...",
          "bio": "...", "avatar_url": "...", "cover_url": "...",
          "email": "user@example.com",
          "stats": {
            "visited_countries_count": 0,
            "visited_cities_count": 0,
            "total_pins_count": 0
          }
        }
        ```

  * **`PATCH /api/v1/users/me` (F-AUTH-03)**

      * **Mục đích:** Cập nhật hồ sơ (Tên, Bio...).
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Request Body:** `{ "display_name": "New Name", "bio": "New Bio" }` (Chỉ gửi trường cần cập nhật).
      * **Response (200 OK):** `{ ...updated_user_object... }`

  * **`POST /api/v1/users/me/avatar` (F-AUTH-03)**

      * **Mục đích:** Upload ảnh đại diện mới.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Request Body:** `multipart/form-data` (File ảnh).
      * **Response (200 OK):** `{ "avatar_url": "https://s3.../new_avatar.jpg" }`
      * **Ghi chú:** Tương tự cho `POST /api/v1/users/me/cover`.

  * **`DELETE /api/v1/users/me` (F-AUTH-04)**

      * **Mục đích:** Xóa tài khoản (xóa mềm).
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (204 No Content):**

-----

### Module 3: Pins - Ghim (F-MAP)

  * **`POST /api/v1/pins` (F-MAP-04, 05)**

      * **Mục đích:** Tạo một Ghim mới.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Request Body:** (Backend sẽ dùng `latitude` và `longitude` để tạo `location` PostGIS)
        ```json
        {
          "place_name": "Hồ Gươm", "place_id_google": "ChIJ...",
          "latitude": 21.0288, "longitude": 105.8522,
          "address_formatted": "Hà Nội, Việt Nam", "address_country_code": "VN",
          "status": "visited", "notes": "...", "visited_date": "2024-10-20", "rating": 5
        }
        ```
      * **Response (201 Created):** `{ ...new_pin_object... }`

  * **`GET /api/v1/users/me/pins` (F-MAP-01, F-STAT-03, 04)**

      * **Mục đích:** Lấy TẤT CẢ ghim của người dùng hiện tại (cho bản đồ cá nhân, danh sách).
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Query Params:** `?status=visited` (lọc), `?limit=50&offset=0` (phân trang).
      * **Response (200 OK):** `[ { ...pin_object_1... }, { ...pin_object_2... } ]`

  * **`GET /api/v1/pins/{uuid}` (F-MAP-05)**

      * **Mục đích:** Lấy chi tiết một ghim cụ thể.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (200 OK):** `{ ...full_pin_object_with_notes_and_media... }`
      * **Ghi chú Logic:** Backend phải kiểm tra `pin.user_id` có trùng với `user_id` trong JWT không.

  * **`PATCH /api/v1/pins/{uuid}` (F-MAP-06)**

      * **Mục đích:** Chỉnh sửa một ghim.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Request Body:** `{ "notes": "...", "rating": 4 }` (Chỉ gửi trường cần sửa).
      * **Response (200 OK):** `{ ...updated_pin_object... }`
      * **Ghi chú Logic:** Phải kiểm tra quyền sở hữu ghim.

  * **`DELETE /api/v1/pins/{uuid}` (F-MAP-06)**

      * **Mục đích:** Xóa một ghim.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (204 No Content):**
      * **Ghi chú Logic:** Phải kiểm tra quyền sở hữu ghim.

-----

### Module 4: Media - Ảnh (F-MAP)

  * **`POST /api/v1/pins/{uuid}/media` (F-MAP-05)**

      * **Mục đích:** Upload ảnh cho ghim (giới hạn 5 ảnh V1.0).
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Request Body:** `multipart/form-data` (File ảnh).
      * **Response (201 Created):** `{ "uuid": "...", "media_type": "image", "storage_url": "..." }`
      * **Ghi chú Logic:** Phải kiểm tra quyền sở hữu ghim. Backend đếm số lượng media, nếu \>= 5 thì trả về lỗi 403 Forbidden.

  * **`DELETE /api/v1/media/{uuid}` (F-MAP-06)**

      * **Mục đích:** Xóa một ảnh đã upload (dùng `uuid` của `pin_media`).
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (204 No Content):**
      * **Ghi chú Logic:** Phải kiểm tra quyền sở hữu media (qua `user_id` trong `pin_media`). Xóa file trên S3 trước, sau đó xóa record trong CSDL.

-----

### Module 5: Utilities (F-MAP)

  * **`GET /api/v1/search/places` (F-MAP-02)**
      * **Mục đích:** Proxy tìm kiếm địa điểm, bảo vệ API Key của Google Places.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Query Params:** `?query=Hanoi`
      * **Response (200 OK):** (Danh sách gợi ý chuẩn hóa từ Google)
        ```json
        [
          { "place_name": "Hanoi", "address_formatted": "...", "place_id_google": "..." },
          ...
        ]
        ```

-----

-----

## 🤝 PHIÊN BẢN V1.5 (Xã hội & Tiện ích)

*Mục tiêu: Thêm API cho tính năng xã hội và tiện ích cơ bản. Các API V1.0 vẫn giữ nguyên.*

### Module 1: Social (F-SOC)

  * **`POST /api/v1/users/{username}/follow` (F-SOC-01)**

      * **Mục đích:** Theo dõi một người dùng (theo `@username` của họ).
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (200 OK):** `{ "following": true, "is_pending": false }`
      * **Ghi chú Logic:** Thêm record vào `follow_relationships`. (Nếu hồ sơ private, có thể set `is_pending=true` - tuy FSD không yêu cầu).

  * **`DELETE /api/v1/users/{username}/follow` (F-SOC-01)**

      * **Mục đích:** Bỏ theo dõi một người dùng.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (204 No Content):**

  * **`GET /api/v1/users/{username}` (F-SOC-02)**

      * **Mục đích:** Xem hồ sơ CÔNG KHAI của người khác.
      * **Bảo mật:** `[BẢO MẬT: JWT]` (Cần JWT để biết bạn là ai và có được xem hồ sơ private không).
      * **Response (200 OK):** `{ ...user_object... }`
      * **Ghi chú Logic:** Backend kiểm tra `profile_visibility` của `{username}`. Nếu là "private", kiểm tra xem `jwt.user_id` có phải là follower không. Nếu không, trả về 403 Forbidden.

  * **`GET /api/v1/users/{username}/pins` (F-SOC-02)**

      * **Mục đích:** Xem danh sách ghim CÔNG KHAI của người khác.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (200 OK):** `[ ...pin_objects... ]`
      * **Ghi chú Logic:** Rất quan trọng. Backend phải lọc dựa trên `bucketlist_visibility` (F-SOC-04). Ví dụ, nếu `bucketlist_visibility = 'private'`, API này CHỈ trả về các ghim có `status = 'visited'`.

  * **`GET /api/v1/feed` (F-SOC-03)**

      * **Mục đích:** Lấy bảng tin (feed) từ những người mình theo dõi.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Query Params:** `?limit=20&offset=0`
      * **Response (200 OK):** (Danh sách từ bảng `activities`)
        ```json
        [
          { "type": "new_pin", "actor": { ...user... }, "object": { ...pin... }, "created_at": "..." },
          ...
        ]
        ```

  * **`PATCH /api/v1/users/me/settings` (F-SOC-04)**

      * **Mục đích:** Cập nhật cài đặt quyền riêng tư.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Request Body:** `{ "profile_visibility": "private", "notes_visibility": "followers" }`
      * **Response (200 OK):** `{ "settings": { ...updated_settings... } }`

### Module 2: Pins (Nâng cấp V1.5)

  * **`POST /api/v1/pins/{uuid}/favorite` (F-MAP-07)**

      * **Mục đích:** Đánh dấu ghim là "Yêu thích".
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (200 OK):** `{ "is_favorite": true }`
      * **Ghi chú Logic:** Phải kiểm tra quyền sở hữu ghim.

  * **`DELETE /api/v1/pins/{uuid}/favorite` (F-MAP-07)**

      * **Mục đích:** Bỏ "Yêu thích".
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (204 No Content):**

### Module 3: Data & Utilities (F-DATA, F-UTIL)

  * **`GET /api/v1/users/me/data/export` (F-DATA-01)**

      * **Mục đích:** Yêu cầu xuất dữ liệu (CSV/JSON).
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (202 Accepted):** `{ "job_id": "...", "status": "pending" }`
      * **Ghi chú:** Đây là tác vụ bất đồng bộ. Server sẽ tạo 1 job, không trả file ngay.

  * **`GET /api/v1/users/me/data/export/{job_id}`**

      * **Mục đích:** Kiểm tra trạng thái job xuất file.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (200 OK):** `{ "status": "completed", "download_url": "..." }` (hoặc `status: "pending"`).

  * **`GET /api/v1/users/me/data/offline` (F-UTIL-01)**

      * **Mục đích:** Tải toàn bộ dữ liệu (pins, user profile) về máy để xem offline.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (200 OK):** `{ "user": { ... }, "pins": [ ...all_pins... ] }`

-----

-----

## 💎 PHIÊN BẢN V2.0 (Nâng cao & Thương mại hóa)

*Mục tiêu: Thêm API cho các tính năng "Pro".*

### Module 1: Trips - Lập kế hoạch (F-UTIL-02)

*Đây là một tài nguyên (resource) CRUD mới.*

  * **`POST /api/v1/trips`**

      * **Mục đích:** Tạo một "Chuyến đi" mới.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Request Body:** `{ "name": "Hè 2026: Châu Âu", "start_date": "2026-06-01" }`
      * **Response (201 Created):** `{ ...new_trip_object... }`
      * **Ghi chú Logic:** Backend phải kiểm tra `subscription_status == 'premium'`. Nếu không, trả về 403 Forbidden.

  * **`GET /api/v1/users/me/trips`**

      * **Mục đích:** Lấy danh sách các chuyến đi của tôi.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (200 OK):** `[ { ...trip_object_1... }, ... ]`

  * **`GET /api/v1/trips/{uuid}`**

      * **Mục đích:** Lấy chi tiết 1 chuyến đi (bao gồm các `trip_items`).
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (200 OK):** `{ "uuid": "...", "name": "...", "items": [ { ...trip_item_1... }, ... ] }`
      * **Ghi chú Logic:** Phải kiểm tra quyền sở hữu chuyến đi.

  * **`PATCH /api/v1/trips/{uuid}`** (Cập nhật tên, ngày đi...)

  * **`DELETE /api/v1/trips/{uuid}`** (Xóa chuyến đi)

  * **`POST /api/v1/trips/{trip_uuid}/items`**

      * **Mục đích:** Thêm một ghim (pin) vào chuyến đi.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Request Body:** `{ "pin_uuid": "...", "day_number": 1, "item_order": 0 }`
      * **Response (201 Created):** `{ ...new_trip_item_object... }`
      * **Ghi chú Logic:** Phải kiểm tra quyền sở hữu chuyến đi.

  * **`PATCH /api/v1/trips/{trip_uuid}/items/{item_id}`** (Sửa `day_number`, `item_order`)

  * **`DELETE /api/v1/trips/{trip_uuid}/items/{item_id}`** (Xóa ghim khỏi chuyến đi)

### Module 2: Gamification (F-GAME)

  * **`GET /api/v1/badges` (F-GAME-01)**

      * **Mục đích:** Lấy danh sách TẤT CẢ các huy hiệu có thể đạt được.
      * **Bảo mật:** `[PUBLIC]`
      * **Response (200 OK):** `[ { "badge_code": "EXPLORER", "name": "...", "description": "...", "icon_url": "..." }, ... ]`

  * **`GET /api/v1/users/me/badges` (F-GAME-02)**

      * **Mục đích:** Lấy danh sách huy hiệu người dùng ĐÃ ĐẠT ĐƯỢC.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (200 OK):** `[ { ...badge_object_1... }, ... ]`

  * **`GET /api/v1/users/{username}/badges` (F-GAME-02)**

      * **Mục đích:** Xem huy hiệu công khai của người khác.
      * **Bảo mật:** `[BẢO MẬT: JWT]` (Kiểm tra quyền riêng tư).
      * **Response (200 OK):** `[ ... ]`

### Module 3: Media (Nâng cấp V2.0)

  * **`POST /api/v1/pins/{uuid}/media` (F-MAP-08)**
      * **Mục đích:** Upload Video.
      * **Ghi chú Logic:** Endpoint y hệt V1.0. Nhưng backend sẽ kiểm tra `subscription_status == 'premium'`. Nếu là 'free', chỉ cho phép `media_type = 'image'` và giữ giới hạn 5 ảnh. Nếu là 'premium', cho phép `media_type = 'video'` và gỡ bỏ giới hạn số lượng.

### Module 4: Monetization (F-MON)

  * **`GET /api/v1/monetization/products` (F-MON-01)**

      * **Mục đích:** Lấy danh sách các gói Premium (Tháng, Năm) để hiển thị.
      * **Bảo mật:** `[PUBLIC]`
      * **Response (200 OK):** `{ "products": [ { "sku": "premium_yearly", "price": 49.99, "currency": "USD" }, ... ] }`

  * **`POST /api/v1/monetization/verify/apple` (F-MON-02)**

      * **Mục đích:** Xác thực giao dịch (IAP) từ Apple.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Request Body:** `{ "receipt_data": "..." }`
      * **Response (200 OK):** `{ "subscription": { "status": "premium", "expires_at": "..." } }`
      * **Ghi chú Logic:** Server gọi API của Apple, nếu OK, cập nhật `users.subscription_status`.

  * **`POST /api/v1/monetization/verify/google` (F-MON-02)**

      * **Mục đích:** Xác thực giao dịch (IAP) từ Google Play.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Request Body:** `{ "purchase_token": "...", "sku": "..." }`
      * **Response (200 OK):** `{ "subscription": { ... } }`

-----

-----

## 🧠 PHIÊN BẢN V3.0+ (Thông minh & Tăng trưởng)

*Mục tiêu: API cho các tính năng AI, Big Data.*

  * **`GET /api/v1/discover/recommendations` (F-DISC-01, 02)**

      * **Mục đích:** Lấy các gợi ý khám phá (AI cá nhân hóa).
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (200 OK):** `{ "for_you": [ ...pin_object... ], "trending": [ ...pin_object... ] }`
      * **Ghi chú:** Đây là một endpoint phức tạp, backend sẽ gọi một hệ thống AI/ML.

  * **`POST /api/v1/pins/suggestions/photos` (F-MAP-09)**

      * **Mục đích:** Gửi metadata ảnh (Exif) để nhận gợi ý ghim.
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Request Body:** `{ "photos": [ { "latitude": 48.85, "longitude": 2.29, "date": "..." }, ... ] }`
      * **Response (200 OK):** `{ "suggestions": [ { "place_name": "Eiffel Tower", ... }, ... ] }`

  * **`GET /api/v1/leaderboard` (F-GAME-03)**

      * **Mục đích:** Lấy Bảng xếp hạng.
      * **Bảo mật:** `[PUBLIC]`
      * **Query Params:** `?by=countries` (hoặc `by=pins`), `?limit=50`.
      * **Response (200 OK):** `[ { "user": { ...user_object... }, "rank": 1, "value": 50 }, ... ]`

  * **`GET /api/v1/pins/{uuid}/affiliate` (F-MON-03)**

      * **Mục đích:** Lấy link affiliate cho ghim (khách sạn, nhà hàng).
      * **Bảo mật:** `[BẢO MẬT: JWT]`
      * **Response (200 OK):** `{ "links": [ { "provider": "booking.com", "url": "..." }, ... ] }`

-----

-----

## 🔒 PHIÊN BẢN ADMIN (Nội bộ - All Versions)

*Mục tiêu: API riêng biệt cho trang Admin (F-ADMIN), bảo mật bằng cơ chế riêng (bảng `admin_users`).*

  * **Tiền tố:** `/api/admin/v1/`
  * `POST /api/admin/v1/auth/login` (Đăng nhập cho Admin)
  * `GET /api/admin/v1/stats` (F-ADMIN-01: Lấy dashboard)
  * `GET /api/admin/v1/users` (F-ADMIN-02: Danh sách người dùng)
  * `POST /api/admin/v1/users/{uuid}/ban` (F-ADMIN-02: Khóa tài khoản)
  * `GET /api/admin/v1/reports` (F-ADMIN-04: Xem báo cáo vi phạm)
  * `POST /api/admin/v1/reports/{id}/review` (F-ADMIN-04: Xử lý báo cáo)