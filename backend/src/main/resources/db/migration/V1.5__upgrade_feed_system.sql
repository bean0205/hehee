-- ==========================================
-- NÂNG CẤP HỆ THỐNG FEED CHO MOBILE APP V1.5
-- ==========================================
-- Mục tiêu: Hỗ trợ đầy đủ các loại bài viết trong màn Feed
-- Bao gồm: Pin posts, Achievement posts, Follow activities, Reactions, Comments
-- ==========================================

-- 1. XÓA BẢNG CŨ VÀ TẠO LẠI ENUM
DROP TABLE IF EXISTS activities CASCADE;
DROP TYPE IF EXISTS activity_type CASCADE;

-- Mở rộng activity_type để hỗ trợ nhiều loại hoạt động hơn
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

-- 2. TẠO LẠI BẢNG ACTIVITIES VỚI CẤU TRÚC MỚI
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

-- Indexes cho performance
CREATE INDEX idx_activities_actor_type ON activities (actor_id, activity_type);
CREATE INDEX idx_activities_created_at ON activities (created_at DESC);
CREATE INDEX idx_activities_object ON activities (object_id, object_type);
CREATE INDEX idx_activities_metadata ON activities USING gin (metadata);

-- Trigger tự động cập nhật updated_at
CREATE TRIGGER set_activities_updated_at 
BEFORE UPDATE ON activities 
FOR EACH ROW 
EXECUTE FUNCTION trigger_set_timestamp();

-- 3. BẢNG FEED (Feed cá nhân hóa của mỗi user - Fan-out on write pattern)
-- Bảng này lưu trữ các activities xuất hiện trong feed của mỗi user
-- Khi user A follow user B, các activities của B sẽ được fan-out vào feed của A
CREATE TABLE user_feeds (
    id BIGSERIAL PRIMARY KEY,
    
    -- User sở hữu feed này
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Activity xuất hiện trong feed
    activity_id BIGINT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    
    -- Thời gian activity xuất hiện trong feed (có thể khác created_at của activity)
    feed_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Đánh dấu đã xem chưa (cho badge thông báo)
    is_seen BOOLEAN DEFAULT FALSE,
    
    -- Constraint: Mỗi activity chỉ xuất hiện 1 lần trong feed của 1 user
    UNIQUE (user_id, activity_id)
);

-- Indexes tối ưu cho việc query feed
CREATE INDEX idx_user_feeds_user_timestamp ON user_feeds (user_id, feed_timestamp DESC);
CREATE INDEX idx_user_feeds_user_seen ON user_feeds (user_id, is_seen, feed_timestamp DESC);
CREATE INDEX idx_user_feeds_activity ON user_feeds (activity_id);

-- 4. BẢNG LIKES (Reactions)
CREATE TABLE activity_likes (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Mỗi user chỉ like 1 lần
    UNIQUE (activity_id, user_id)
);

CREATE INDEX idx_activity_likes_activity ON activity_likes (activity_id);
CREATE INDEX idx_activity_likes_user ON activity_likes (user_id);

-- 5. BẢNG COMMENTS
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

CREATE INDEX idx_activity_comments_activity ON activity_comments (activity_id, created_at DESC);
CREATE INDEX idx_activity_comments_user ON activity_comments (user_id);
CREATE INDEX idx_activity_comments_parent ON activity_comments (parent_comment_id);

CREATE TRIGGER set_activity_comments_updated_at 
BEFORE UPDATE ON activity_comments 
FOR EACH ROW 
EXECUTE FUNCTION trigger_set_timestamp();

-- 6. FUNCTIONS TỰ ĐỘNG CẬP NHẬT COUNTERS

-- Function cập nhật likes_count
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

-- Function cập nhật comments_count
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

-- 7. FUNCTION FAN-OUT ACTIVITY VÀO FEEDS CỦA FOLLOWERS

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

-- 8. FUNCTION TỰ ĐỘNG BACKFILL FEED KHI FOLLOW USER MỚI

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

-- 9. FUNCTION TỰ ĐỘNG XÓA FEED KHI UNFOLLOW

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

-- 10. VIEWS HỖ TRỢ QUERY DỄ DÀNG HỚN

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

-- 11. INDEXES BỔ SUNG CHO PERFORMANCE & SCALE

-- ============================================
-- INDEXES CHO BẢNG USERS (PHẦN 3)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_username_lower ON users (LOWER(username));
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users (subscription_status, subscription_expires_at);

-- ============================================
-- INDEXES CHO BẢNG PINS (PHẦN 3)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_pins_user_created ON pins (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pins_status_created ON pins (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pins_favorite ON pins (user_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_pins_rating ON pins (rating) WHERE rating IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pins_visited_date ON pins (visited_date DESC) WHERE visited_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pins_city_country ON pins (address_city, address_country);

-- ============================================
-- INDEXES CHO BẢNG PIN_MEDIA (PHẦN 3)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_pin_media_pin_order ON pin_media (pin_id, upload_order);
CREATE INDEX IF NOT EXISTS idx_pin_media_user_created ON pin_media (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pin_media_type ON pin_media (media_type);

-- ============================================
-- INDEXES CHO BẢNG FOLLOW_RELATIONSHIPS (PHẦN 4)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_follow_relationships_follower ON follow_relationships (follower_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_follow_relationships_created ON follow_relationships (created_at DESC);

-- ============================================
-- INDEXES CHO BẢNG ACTIVITY_LIKES (PHẦN 4)
-- ============================================
-- Đã có: idx_activity_likes_activity, idx_activity_likes_user
-- Nâng cấp index cho user để bao gồm created_at
DROP INDEX IF EXISTS idx_activity_likes_user;
CREATE INDEX idx_activity_likes_user ON activity_likes (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_likes_activity_created ON activity_likes (activity_id, created_at DESC);

-- ============================================
-- INDEXES CHO BẢNG ACTIVITY_COMMENTS (PHẦN 4)
-- ============================================
-- Đã có indexes cơ bản, nâng cấp thành partial indexes
DROP INDEX IF EXISTS idx_activity_comments_activity;
DROP INDEX IF EXISTS idx_activity_comments_user;
DROP INDEX IF EXISTS idx_activity_comments_parent;

CREATE INDEX idx_activity_comments_activity ON activity_comments (activity_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_activity_comments_user ON activity_comments (user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_activity_comments_parent ON activity_comments (parent_comment_id, created_at ASC) WHERE deleted_at IS NULL;
CREATE INDEX idx_activity_comments_deleted ON activity_comments (deleted_at) WHERE deleted_at IS NOT NULL;

-- 12. COMMENTS VÀ GHI CHÚ

COMMENT ON TABLE activities IS 'Bảng lưu trữ tất cả các hoạt động (activities) của users';
COMMENT ON TABLE user_feeds IS 'Bảng lưu feed cá nhân hóa của mỗi user (fan-out pattern)';
COMMENT ON TABLE activity_likes IS 'Bảng lưu trữ likes/reactions cho activities';
COMMENT ON TABLE activity_comments IS 'Bảng lưu trữ comments cho activities';

COMMENT ON COLUMN activities.metadata IS 'JSON metadata linh hoạt: {pin_status, rating, photo_count, achievement_type, count, milestone, badge_code}';
COMMENT ON COLUMN user_feeds.feed_timestamp IS 'Thời gian activity xuất hiện trong feed, có thể khác created_at của activity';
COMMENT ON COLUMN user_feeds.is_seen IS 'Đánh dấu user đã xem activity này trong feed chưa';

-- ==========================================
-- MIGRATION HOÀN TẤT
-- ==========================================
-- Các API endpoints cần implement:
-- 1. GET /api/feed - Lấy feed của user (với pagination)
-- 2. POST /api/activities/:id/like - Like/Unlike activity
-- 3. POST /api/activities/:id/comments - Tạo comment
-- 4. GET /api/activities/:id/comments - Lấy comments của activity
-- 5. GET /api/activities/:id - Lấy chi tiết một activity
-- 6. POST /api/pins/:id/share - Tạo activity từ pin (manual share)
-- ==========================================
