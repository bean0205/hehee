
-----

### Sơ đồ Thiết kế Cơ sở dữ liệu PostgreSQL (với PostGIS)

#### PHẦN 1: CÀI ĐẶT BAN ĐẦU (Bắt buộc)

Bạn phải chạy các lệnh này trước để kích hoạt các tiện ích mở rộng cần thiết.

```sql
-- Kích hoạt PostGIS để lưu trữ và truy vấn dữ liệu địa lý
CREATE EXTENSION IF NOT EXISTS postgis;

-- Kích hoạt tiện ích để tạo UUID (nếu chưa có)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TẠO FUNCTION TỰ ĐỘNG CẬP NHẬT 'updated_at'
-- (PostgreSQL không có 'ON UPDATE CURRENT_TIMESTAMP' như MySQL)
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### PHẦN 2: ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU (ENUMs)

Sử dụng ENUMs của PostgreSQL giúp dữ liệu sạch và nhất quán.

```sql
-- F-AUTH
CREATE TYPE user_profile_visibility AS ENUM ('public', 'private');
CREATE TYPE user_notes_visibility AS ENUM ('private', 'followers', 'public');
CREATE TYPE user_bucketlist_visibility AS ENUM ('private', 'followers', 'public');
CREATE TYPE user_subscription_status AS ENUM ('free', 'premium');

-- F-MAP
CREATE TYPE pin_status AS ENUM ('visited', 'want_to_go');
CREATE TYPE pin_media_type AS ENUM ('image', 'video');

-- F-SOC
CREATE TYPE activity_type AS ENUM ('new_pin', 'new_follow');

-- F-MON
CREATE TYPE payment_store AS ENUM ('apple_app_store', 'google_play_store', 'stripe');
CREATE TYPE payment_status AS ENUM ('success', 'failed', 'refunded');

-- F-ADMIN
CREATE TYPE admin_role AS ENUM ('admin', 'moderator');
CREATE TYPE report_object_type AS ENUM ('pin', 'pin_media', 'user');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed_removed', 'reviewed_ignored');
```

-----

#### PHẦN 3: BẢNG CỐT LÕI (CORE TABLES - V1.0)

```sql
-- MODULE 2: QUẢN LÝ TÀI KHOẢN (F-AUTH)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    apple_id VARCHAR(255) UNIQUE,
    
    -- F-AUTH-03: Hồ sơ
    username VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(512),
    cover_url VARCHAR(512),
    
    -- F-STAT-02: Dữ liệu được giải chuẩn hóa
    visited_countries_count INT DEFAULT 0,
    visited_cities_count INT DEFAULT 0,
    total_pins_count INT DEFAULT 0,

    -- V1.5 F-SOC-04: Cài đặt Quyền riêng tư
    profile_visibility user_profile_visibility DEFAULT 'public',
    notes_visibility user_notes_visibility DEFAULT 'private',
    bucketlist_visibility user_bucketlist_visibility DEFAULT 'public',
    
    -- V2.0 F-MON-01: Trạng thái Thương mại hóa
    subscription_status user_subscription_status DEFAULT 'free',
    subscription_expires_at TIMESTAMPTZ NULL,
    
    -- F-AUTH-04: Xóa mềm
    deleted_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- MODULE 3: BẢN ĐỒ & GHIM (F-MAP)
CREATE TABLE pins (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Dữ liệu vị trí
    place_name VARCHAR(255) NOT NULL,
    place_id_google VARCHAR(255) NULL,
    
    -- THAY ĐỔI QUAN TRỌNG: Sử dụng PostGIS
    -- GEOGRAPHY lưu trữ (lat, lon) và tính toán trên hình cầu (tính bằng mét)
    -- SRID 4326 là chuẩn GPS/Google Maps
    location GEOGRAPHY(Point, 4326) NOT NULL,
    
    address_formatted VARCHAR(512),
    address_city VARCHAR(100),
    address_country VARCHAR(100),
    address_country_code CHAR(2),

    -- F-MAP-04: Trạng thái Ghim
    status pin_status NOT NULL DEFAULT 'visited',
    
    -- F-MAP-05: Nội dung chi tiết
    notes TEXT,
    visited_date DATE NULL,
    rating SMALLINT NULL, -- 1-5 sao
    
    -- V1.5 F-MAP-07: Yêu thích
    is_favorite BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_pins_updated_at BEFORE UPDATE ON pins FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- TẠO CHỈ MỤC KHÔNG GIAN (RẤT QUAN TRỌNG CHO TỐC ĐỘ)
CREATE INDEX idx_pins_location ON pins USING GIST (location);
-- Các chỉ mục khác
CREATE INDEX idx_pins_user_id ON pins (user_id);
CREATE INDEX idx_pins_user_status ON pins (user_id, status);
CREATE INDEX idx_pins_country_code ON pins (address_country_code);

-- F-MAP-05: Ảnh (và Video) của Ghim
CREATE TABLE pin_media (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    pin_id BIGINT NOT NULL REFERENCES pins(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    media_type pin_media_type NOT NULL DEFAULT 'image',
    storage_url VARCHAR(512) NOT NULL,
    thumbnail_url VARCHAR(512) NULL,
    upload_order SMALLINT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_pin_media_pin_id ON pin_media (pin_id);
```

-----

#### PHẦN 4: BẢNG XÃ HỘI (SOCIAL TABLES - V1.5)

```sql
-- F-SOC-01: Hệ thống Follow
CREATE TABLE follow_relationships (
    follower_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (follower_id, following_id)
);
CREATE INDEX idx_follow_relationships_following ON follow_relationships (following_id);

-- F-SOC-03: Bảng tin (Feed)
CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type activity_type NOT NULL,
    
    object_id BIGINT NOT NULL, 
    object_type VARCHAR(50) NOT NULL, -- 'pin', 'user'
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_activities_user_feed ON activities (user_id, created_at DESC);
```

-----

#### PHẦN 5: BẢNG NÂNG CAO & PRO (ADVANCED & PRO TABLES - V2.0)

```sql
-- F-GAME-01: Bảng định nghĩa các Huy hiệu
CREATE TABLE badges (
    id SERIAL PRIMARY KEY, -- Không cần BIGSERIAL cho bảng định nghĩa ít thay đổi
    badge_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(512),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- F-GAME-02: Bảng ghi nhận Huy hiệu của Người dùng (N-N)
CREATE TABLE user_badges (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id INT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, badge_id)
);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

-- F-UTIL-02: Bảng Chuyến đi
CREATE TABLE trips (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NULL,
    end_date DATE NULL,
    cover_image_url VARCHAR(512),
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE INDEX idx_trips_user_id ON trips (user_id);

-- F-UTIL-02: Bảng các địa điểm trong Chuyến đi (N-N giữa Trips và Pins)
CREATE TABLE trip_items (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    pin_id BIGINT NOT NULL REFERENCES pins(id) ON DELETE CASCADE,
    
    day_number INT NULL DEFAULT 1,
    item_order INT DEFAULT 0,
    notes TEXT NULL,
    
    UNIQUE (trip_id, pin_id)
);
CREATE INDEX idx_trip_items_trip_id ON trip_items (trip_id);

-- F-MON-02: Lịch sử Thanh toán
CREATE TABLE payment_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    store payment_store NOT NULL,
    store_transaction_id VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    
    amount DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) NOT NULL,
    status payment_status DEFAULT 'success',
    
    transaction_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_payment_history_user_id ON payment_history (user_id);
CREATE INDEX idx_payment_history_store_tx_id ON payment_history (store_transaction_id);
```

-----

#### PHẦN 6: BẢNG QUẢN TRỊ (ADMIN TABLES - V1.0 & V1.5)

```sql
-- F-ADMIN-02: Tài khoản Quản trị viên
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role admin_role NOT NULL DEFAULT 'moderator',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- F-ADMIN-04 (V1.5): Bảng Báo cáo (Report) từ người dùng
CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    reporter_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    object_id BIGINT NOT NULL,
    object_type report_object_type NOT NULL,
    
    reason TEXT,
    status report_status DEFAULT 'pending',
    
    reviewer_admin_id INT NULL REFERENCES admin_users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMT_ATZ NULL,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_reports_queue ON reports (status, created_at);
```