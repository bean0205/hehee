
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
CREATE TYPE activity_type AS ENUM (
    'new_pin_visited',      -- Người dùng tạo pin "Đã đến"
    'new_pin_want_to_go',   -- Người dùng tạo pin "Muốn đến"
    'new_follow',           -- Người dùng theo dõi ai đó
    'achievement_countries', -- Đạt milestone số quốc gia
    'achievement_cities',    -- Đạt milestone số thành phố
    'achievement_pins',      -- Đạt milestone số ghim
    'earned_badge',         -- Nhận được huy hiệu mới
    'update_pin'            -- Cập nhật pin (thêm ảnh, rating, notes)
);

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

-- Thêm COMMENT mô tả cho từng cột trong bảng users
COMMENT ON TABLE users IS 'Bảng quản lý tài khoản người dùng';
COMMENT ON COLUMN users.id IS 'ID tự tăng dùng cho quan hệ database';
COMMENT ON COLUMN users.uuid IS 'UUID công khai cho API/Mobile (ẩn ID số thực)';
COMMENT ON COLUMN users.email IS 'Email đăng ký (nullable vì có thể dùng social login)';
COMMENT ON COLUMN users.hashed_password IS 'Mật khẩu đã hash (bcrypt/argon2) - nullable nếu dùng social login';
COMMENT ON COLUMN users.google_id IS 'ID từ Google OAuth (login bằng Google)';
COMMENT ON COLUMN users.apple_id IS 'ID từ Apple Sign In (login bằng Apple)';
COMMENT ON COLUMN users.username IS 'Tên người dùng duy nhất (dùng cho @mention, URL profile)';
COMMENT ON COLUMN users.display_name IS 'Tên hiển thị (có thể trùng, cho phép ký tự đặc biệt)';
COMMENT ON COLUMN users.bio IS 'Tiểu sử/giới thiệu bản thân';
COMMENT ON COLUMN users.avatar_url IS 'URL ảnh đại diện (link đến S3/CloudFront)';
COMMENT ON COLUMN users.cover_url IS 'URL ảnh bìa profile (link đến S3/CloudFront)';
COMMENT ON COLUMN users.visited_countries_count IS 'Tổng số quốc gia đã ghim (status=visited) - denormalized cho performance';
COMMENT ON COLUMN users.visited_cities_count IS 'Tổng số thành phố đã ghim (status=visited) - denormalized cho performance';
COMMENT ON COLUMN users.total_pins_count IS 'Tổng số ghim (visited + want_to_go) - denormalized cho performance';
COMMENT ON COLUMN users.profile_visibility IS 'Ai có thể xem profile: public|private';
COMMENT ON COLUMN users.notes_visibility IS 'Ai có thể xem notes của pins: private|followers|public';
COMMENT ON COLUMN users.bucketlist_visibility IS 'Ai có thể xem bucket list (pins want_to_go): private|followers|public';
COMMENT ON COLUMN users.subscription_status IS 'Gói đăng ký: free hoặc premium';
COMMENT ON COLUMN users.subscription_expires_at IS 'Ngày hết hạn premium (NULL nếu free hoặc lifetime)';
COMMENT ON COLUMN users.deleted_at IS 'NULL = active, có giá trị = đã xóa (cho phép khôi phục)';
COMMENT ON COLUMN users.created_at IS 'Thời điểm tạo tài khoản';
COMMENT ON COLUMN users.updated_at IS 'Thời điểm cập nhật cuối cùng (auto-update bằng trigger)';

CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes cho users table (tối ưu cho scale lớn)
CREATE INDEX idx_users_username_lower ON users (LOWER(username)); -- Tìm kiếm username case-insensitive
CREATE INDEX idx_users_deleted_at ON users (deleted_at) WHERE deleted_at IS NULL; -- Partial index cho active users
CREATE INDEX idx_users_subscription ON users (subscription_status, subscription_expires_at); -- Query premium users

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

-- Thêm COMMENT mô tả cho từng cột trong bảng pins
COMMENT ON TABLE pins IS 'Bảng lưu trữ các địa điểm được ghim trên bản đồ';
COMMENT ON COLUMN pins.id IS 'ID tự tăng dùng cho quan hệ database';
COMMENT ON COLUMN pins.uuid IS 'UUID công khai cho API/Mobile';
COMMENT ON COLUMN pins.user_id IS 'Người tạo ghim (xóa user = xóa tất cả pins của user)';
COMMENT ON COLUMN pins.place_name IS 'Tên địa điểm (vd: Tháp Eiffel, Starbucks Reserve)';
COMMENT ON COLUMN pins.place_id_google IS 'Google Place ID (dùng để query chi tiết từ Google Places API)';
COMMENT ON COLUMN pins.location IS 'Tọa độ GPS (lat, lon) dùng PostGIS - GEOGRAPHY(Point, 4326) để tính khoảng cách trên hình cầu';
COMMENT ON COLUMN pins.address_formatted IS 'Địa chỉ đầy đủ (vd: 5 Avenue Anatole France, 75007 Paris, France)';
COMMENT ON COLUMN pins.address_city IS 'Thành phố (vd: Paris) - dùng cho thống kê';
COMMENT ON COLUMN pins.address_country IS 'Quốc gia (vd: France) - dùng cho thống kê';
COMMENT ON COLUMN pins.address_country_code IS 'Mã quốc gia ISO 3166-1 alpha-2 (vd: FR) - dùng cho filter/map';
COMMENT ON COLUMN pins.status IS 'Trạng thái: visited (đã đến) hoặc want_to_go (muốn đến/bucket list)';
COMMENT ON COLUMN pins.notes IS 'Ghi chú cá nhân (trải nghiệm, tips, memories)';
COMMENT ON COLUMN pins.visited_date IS 'Ngày ghé thăm (NULL nếu status=want_to_go)';
COMMENT ON COLUMN pins.rating IS 'Đánh giá 1-5 sao (NULL nếu chưa đánh giá hoặc status=want_to_go)';
COMMENT ON COLUMN pins.is_favorite IS 'Đánh dấu ghim quan trọng/yêu thích (để quick filter)';
COMMENT ON COLUMN pins.created_at IS 'Thời điểm tạo ghim';
COMMENT ON COLUMN pins.updated_at IS 'Thời điểm cập nhật cuối cùng (auto-update bằng trigger)';

CREATE TRIGGER set_pins_updated_at BEFORE UPDATE ON pins FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- TẠO CHỈ MỤC KHÔNG GIAN (RẤT QUAN TRỌNG CHO TỐC ĐỘ)
CREATE INDEX idx_pins_location ON pins USING GIST (location);

-- Indexes cơ bản
CREATE INDEX idx_pins_user_id ON pins (user_id);
CREATE INDEX idx_pins_user_status ON pins (user_id, status);
CREATE INDEX idx_pins_country_code ON pins (address_country_code);

-- Indexes bổ sung cho scale lớn
CREATE INDEX idx_pins_user_created ON pins (user_id, created_at DESC); -- Query pins mới nhất của user
CREATE INDEX idx_pins_status_created ON pins (status, created_at DESC); -- Query bucket list/visited global
CREATE INDEX idx_pins_favorite ON pins (user_id, is_favorite) WHERE is_favorite = true; -- Partial index cho favorites
CREATE INDEX idx_pins_rating ON pins (rating) WHERE rating IS NOT NULL; -- Query pins có rating
CREATE INDEX idx_pins_visited_date ON pins (visited_date DESC) WHERE visited_date IS NOT NULL; -- Timeline view
CREATE INDEX idx_pins_city_country ON pins (address_city, address_country); -- Statistics by location

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

-- Thêm COMMENT mô tả cho từng cột trong bảng pin_media
COMMENT ON TABLE pin_media IS 'Bảng lưu trữ ảnh và video của các ghim';
COMMENT ON COLUMN pin_media.id IS 'ID tự tăng dùng cho quan hệ database';
COMMENT ON COLUMN pin_media.uuid IS 'UUID công khai cho API/Mobile';
COMMENT ON COLUMN pin_media.pin_id IS 'Ghim chứa media này (xóa pin = xóa tất cả media)';
COMMENT ON COLUMN pin_media.user_id IS 'Người upload (để tracking, moderation)';
COMMENT ON COLUMN pin_media.media_type IS 'Loại file: image hoặc video';
COMMENT ON COLUMN pin_media.storage_url IS 'URL file gốc trên S3/CloudFront';
COMMENT ON COLUMN pin_media.thumbnail_url IS 'URL thumbnail (cho video hoặc ảnh tối ưu) - NULL nếu chưa generate';
COMMENT ON COLUMN pin_media.upload_order IS 'Thứ tự hiển thị (0 = ảnh đầu tiên/cover photo)';
COMMENT ON COLUMN pin_media.created_at IS 'Thời điểm upload';

CREATE INDEX idx_pin_media_pin_id ON pin_media (pin_id);
CREATE INDEX idx_pin_media_pin_order ON pin_media (pin_id, upload_order);
CREATE INDEX idx_pin_media_user_created ON pin_media (user_id, created_at DESC); -- Query media của user
CREATE INDEX idx_pin_media_type ON pin_media (media_type); -- Filter by image/video
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

-- Thêm COMMENT mô tả cho bảng follow_relationships
COMMENT ON TABLE follow_relationships IS 'Bảng quản lý quan hệ follow giữa các user (Many-to-Many)';
COMMENT ON COLUMN follow_relationships.follower_id IS 'User đang follow (người theo dõi)';
COMMENT ON COLUMN follow_relationships.following_id IS 'User được follow (người được theo dõi)';
COMMENT ON COLUMN follow_relationships.created_at IS 'Thời điểm bắt đầu follow';

CREATE INDEX idx_follow_relationships_following ON follow_relationships (following_id);
CREATE INDEX idx_follow_relationships_follower ON follow_relationships (follower_id, created_at DESC); -- Query following list
CREATE INDEX idx_follow_relationships_created ON follow_relationships (created_at DESC); -- Recent follows

-- F-SOC-03: Bảng tin (Feed) - NÂNG CẤP ĐẦY ĐỦ

-- Bảng Activities: Lưu trữ tất cả các hoạt động của users
CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    
    -- Người thực hiện hành động (actor)
    actor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Loại hoạt động
    activity_type activity_type NOT NULL,
    
    -- Đối tượng liên quan (nullable vì một số activity không có object)
    object_id BIGINT NULL,  -- pin_id, user_id, badge_id tùy theo loại
    object_type VARCHAR(50) NULL, -- 'pin', 'user', 'badge'
    
    -- Metadata bổ sung (JSON để linh hoạt)
    -- Ví dụ: {"pin_status": "visited", "rating": 5, "photo_count": 3}
    -- Hoặc: {"achievement_type": "countries", "count": 10, "milestone": 10}
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Caption/Caption do người dùng viết (cho pin posts)
    caption TEXT NULL,
    
    -- Thống kê tương tác (denormalized cho performance)
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Thêm COMMENT mô tả cho bảng activities
COMMENT ON TABLE activities IS 'Bảng lưu trữ tất cả các hoạt động của users (tạo pin, follow, achievement, etc.)';
COMMENT ON COLUMN activities.id IS 'ID hoạt động (dùng cho references từ feed, likes, comments)';
COMMENT ON COLUMN activities.actor_id IS 'User thực hiện hoạt động (xóa user = xóa activities)';
COMMENT ON COLUMN activities.activity_type IS 'Loại hoạt động: new_pin_visited, new_pin_want_to_go, new_follow, achievement_*, earned_badge, update_pin';
COMMENT ON COLUMN activities.object_id IS 'ID của đối tượng liên quan: pin_id, user_id, badge_id (tùy activity_type)';
COMMENT ON COLUMN activities.object_type IS 'Loại đối tượng: pin, user, badge (để query join đúng bảng)';
COMMENT ON COLUMN activities.metadata IS 'Dữ liệu bổ sung dạng JSON, vd: {"pin_status": "visited", "rating": 5, "photo_count": 3}';
COMMENT ON COLUMN activities.caption IS 'Chú thích do user viết khi tạo/update pin (như Instagram caption)';
COMMENT ON COLUMN activities.likes_count IS 'Số lượt like (denormalized, auto-update bằng trigger)';
COMMENT ON COLUMN activities.comments_count IS 'Số lượt comment (denormalized, auto-update bằng trigger)';
COMMENT ON COLUMN activities.created_at IS 'Thời điểm hoạt động xảy ra (dùng để sắp xếp feed)';
COMMENT ON COLUMN activities.updated_at IS 'Thời điểm cập nhật cuối (auto-update bằng trigger)';

CREATE TRIGGER set_activities_updated_at 
BEFORE UPDATE ON activities 
FOR EACH ROW 
EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes cho performance
CREATE INDEX idx_activities_actor_type ON activities (actor_id, activity_type);
CREATE INDEX idx_activities_created_at ON activities (created_at DESC);
CREATE INDEX idx_activities_object ON activities (object_id, object_type);
CREATE INDEX idx_activities_metadata ON activities USING gin (metadata);
CREATE INDEX idx_activities_actor_created ON activities (actor_id, created_at DESC);

-- Bảng Feed cá nhân hóa (Fan-out on write pattern)
CREATE TABLE user_feeds (
    id BIGSERIAL PRIMARY KEY,
    
    -- User sở hữu feed này
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Activity xuất hiện trong feed
    activity_id BIGINT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    
    -- Thời gian activity xuất hiện trong feed
    feed_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Đánh dấu đã xem chưa (cho badge thông báo)
    is_seen BOOLEAN DEFAULT FALSE,
    
    -- Constraint: Mỗi activity chỉ xuất hiện 1 lần trong feed của 1 user
    UNIQUE (user_id, activity_id)
);

-- Thêm COMMENT mô tả cho bảng user_feeds
COMMENT ON TABLE user_feeds IS 'Bảng feed cá nhân hóa cho mỗi user (Fan-out on write pattern)';
COMMENT ON COLUMN user_feeds.id IS 'ID feed item (dùng cho pagination)';
COMMENT ON COLUMN user_feeds.user_id IS 'User xem feed này (mỗi user có feed riêng)';
COMMENT ON COLUMN user_feeds.activity_id IS 'Hoạt động hiển thị trong feed (xóa activity = xóa khỏi feeds)';
COMMENT ON COLUMN user_feeds.feed_timestamp IS 'Thời điểm activity được thêm vào feed (có thể khác created_at của activity)';
COMMENT ON COLUMN user_feeds.is_seen IS 'TRUE = user đã xem, FALSE = chưa xem (dùng cho notification badge)';

-- Indexes tối ưu cho việc query feed
CREATE INDEX idx_user_feeds_user_timestamp ON user_feeds (user_id, feed_timestamp DESC);
CREATE INDEX idx_user_feeds_user_seen ON user_feeds (user_id, is_seen, feed_timestamp DESC);
CREATE INDEX idx_user_feeds_activity ON user_feeds (activity_id);

-- Bảng Likes (Reactions)
CREATE TABLE activity_likes (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Mỗi user chỉ like 1 lần
    UNIQUE (activity_id, user_id)
);

-- Thêm COMMENT mô tả cho bảng activity_likes
COMMENT ON TABLE activity_likes IS 'Bảng lưu trữ lượt like/reaction cho các hoạt động';
COMMENT ON COLUMN activity_likes.id IS 'ID like';
COMMENT ON COLUMN activity_likes.activity_id IS 'Hoạt động được like (xóa activity = xóa tất cả likes)';
COMMENT ON COLUMN activity_likes.user_id IS 'User thực hiện like (xóa user = xóa tất cả likes của user đó)';
COMMENT ON COLUMN activity_likes.created_at IS 'Thời điểm like';

CREATE INDEX idx_activity_likes_activity ON activity_likes (activity_id);
CREATE INDEX idx_activity_likes_user ON activity_likes (user_id, created_at DESC); -- Query likes của user
CREATE INDEX idx_activity_likes_activity_created ON activity_likes (activity_id, created_at DESC); -- Danh sách người like

-- Bảng Comments
CREATE TABLE activity_comments (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Nội dung comment
    content TEXT NOT NULL,
    
    -- Parent comment (cho nested comments - V2.0)
    parent_comment_id BIGINT NULL REFERENCES activity_comments(id) ON DELETE CASCADE,
    
    -- Soft delete
    deleted_at TIMESTAMPTZ NULL,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Thêm COMMENT mô tả cho bảng activity_comments
COMMENT ON TABLE activity_comments IS 'Bảng lưu trữ comment cho các hoạt động (hỗ trợ nested comments)';
COMMENT ON COLUMN activity_comments.id IS 'ID comment';
COMMENT ON COLUMN activity_comments.activity_id IS 'Hoạt động được comment (xóa activity = xóa tất cả comments)';
COMMENT ON COLUMN activity_comments.user_id IS 'User viết comment (xóa user = xóa tất cả comments của user đó)';
COMMENT ON COLUMN activity_comments.content IS 'Nội dung comment (text)';
COMMENT ON COLUMN activity_comments.parent_comment_id IS 'ID comment cha (NULL = comment gốc, có giá trị = reply comment) - cho nested comments V2.0';
COMMENT ON COLUMN activity_comments.deleted_at IS 'Thời điểm xóa comment (soft delete - NULL = chưa xóa, có giá trị = đã xóa)';
COMMENT ON COLUMN activity_comments.created_at IS 'Thời điểm tạo comment';
COMMENT ON COLUMN activity_comments.updated_at IS 'Thời điểm chỉnh sửa comment cuối cùng (auto-update bằng trigger)';

CREATE INDEX idx_activity_comments_activity ON activity_comments (activity_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_activity_comments_user ON activity_comments (user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_activity_comments_parent ON activity_comments (parent_comment_id, created_at ASC) WHERE deleted_at IS NULL;
CREATE INDEX idx_activity_comments_deleted ON activity_comments (deleted_at) WHERE deleted_at IS NOT NULL; -- Cleanup old soft-deleted comments

CREATE TRIGGER set_activity_comments_updated_at 
BEFORE UPDATE ON activity_comments 
FOR EACH ROW 
EXECUTE FUNCTION trigger_set_timestamp();

-- TRIGGERS TỰ ĐỘNG CẬP NHẬT COUNTERS

-- Trigger cập nhật likes_count
CREATE OR REPLACE FUNCTION update_activity_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE activities 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.activity_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE activities 
        SET likes_count = GREATEST(likes_count - 1, 0)
        WHERE id = OLD.activity_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_activity_likes_count
AFTER INSERT OR DELETE ON activity_likes
FOR EACH ROW
EXECUTE FUNCTION update_activity_likes_count();

-- Trigger cập nhật comments_count
CREATE OR REPLACE FUNCTION update_activity_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE activities 
        SET comments_count = comments_count + 1 
        WHERE id = NEW.activity_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE activities 
        SET comments_count = GREATEST(comments_count - 1, 0)
        WHERE id = OLD.activity_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_activity_comments_count
AFTER INSERT OR DELETE ON activity_comments
FOR EACH ROW
EXECUTE FUNCTION update_activity_comments_count();

-- Trigger Fan-out activity vào feeds của followers
CREATE OR REPLACE FUNCTION fanout_activity_to_followers()
RETURNS TRIGGER AS $$
BEGIN
    -- Chỉ fan-out các loại activity cần hiển thị trong feed
    IF NEW.activity_type IN (
        'new_pin_visited', 
        'new_pin_want_to_go', 
        'achievement_countries',
        'achievement_cities',
        'achievement_pins',
        'earned_badge'
    ) THEN
        -- Insert vào feed của tất cả followers
        INSERT INTO user_feeds (user_id, activity_id, feed_timestamp)
        SELECT 
            follower_id,
            NEW.id,
            NEW.created_at
        FROM follow_relationships
        WHERE following_id = NEW.actor_id;
        
        -- Insert vào feed của chính user (để user thấy hoạt động của mình)
        INSERT INTO user_feeds (user_id, activity_id, feed_timestamp)
        VALUES (NEW.actor_id, NEW.id, NEW.created_at)
        ON CONFLICT (user_id, activity_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_fanout_activity
AFTER INSERT ON activities
FOR EACH ROW
EXECUTE FUNCTION fanout_activity_to_followers();

-- Trigger Backfill feed khi follow user mới
CREATE OR REPLACE FUNCTION backfill_feed_on_new_follow()
RETURNS TRIGGER AS $$
BEGIN
    -- Khi user A follow user B, thêm 10 activities gần nhất của B vào feed của A
    INSERT INTO user_feeds (user_id, activity_id, feed_timestamp)
    SELECT 
        NEW.follower_id,
        a.id,
        a.created_at
    FROM activities a
    WHERE a.actor_id = NEW.following_id
        AND a.activity_type IN (
            'new_pin_visited', 
            'new_pin_want_to_go', 
            'achievement_countries',
            'achievement_cities',
            'achievement_pins',
            'earned_badge'
        )
    ORDER BY a.created_at DESC
    LIMIT 10
    ON CONFLICT (user_id, activity_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_backfill_feed_on_follow
AFTER INSERT ON follow_relationships
FOR EACH ROW
EXECUTE FUNCTION backfill_feed_on_new_follow();

-- Trigger Cleanup feed khi unfollow
CREATE OR REPLACE FUNCTION cleanup_feed_on_unfollow()
RETURNS TRIGGER AS $$
BEGIN
    -- Khi user A unfollow user B, xóa các activities của B khỏi feed của A
    DELETE FROM user_feeds
    WHERE user_id = OLD.follower_id
        AND activity_id IN (
            SELECT id FROM activities WHERE actor_id = OLD.following_id
        );
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleanup_feed_on_unfollow
AFTER DELETE ON follow_relationships
FOR EACH ROW
EXECUTE FUNCTION cleanup_feed_on_unfollow();

-- VIEWS HỖ TRỢ QUERY

-- View tổng hợp thông tin feed đầy đủ cho mobile app
CREATE OR REPLACE VIEW v_feed_posts AS
SELECT 
    a.id AS activity_id,
    a.activity_type,
    a.caption,
    a.likes_count,
    a.comments_count,
    a.metadata,
    a.created_at,
    
    -- Thông tin actor (người thực hiện)
    u.id AS actor_id,
    u.username AS actor_username,
    u.display_name AS actor_display_name,
    u.avatar_url AS actor_avatar_url,
    
    -- Thông tin object (pin, user, badge)
    a.object_id,
    a.object_type,
    
    -- Thông tin pin (nếu có)
    p.place_name,
    p.address_city,
    p.address_country,
    p.status AS pin_status,
    p.rating,
    p.visited_date,
    ST_Y(p.location::geometry) AS latitude,
    ST_X(p.location::geometry) AS longitude,
    
    -- Số lượng ảnh của pin
    (SELECT COUNT(*) FROM pin_media pm WHERE pm.pin_id = p.id) AS pin_photos_count,
    
    -- URL ảnh đầu tiên của pin (thumbnail)
    (SELECT storage_url FROM pin_media pm 
     WHERE pm.pin_id = p.id 
     ORDER BY upload_order ASC LIMIT 1) AS pin_first_photo_url
    
FROM activities a
JOIN users u ON a.actor_id = u.id
LEFT JOIN pins p ON a.object_type = 'pin' AND a.object_id = p.id
WHERE u.deleted_at IS NULL;

-- View để kiểm tra user đã like activity chưa
CREATE OR REPLACE VIEW v_activity_user_likes AS
SELECT 
    activity_id,
    user_id,
    created_at
FROM activity_likes;
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