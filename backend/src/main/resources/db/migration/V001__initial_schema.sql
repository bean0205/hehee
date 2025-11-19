-- =====================================================
-- PinYourWord Database Schema
-- PostgreSQL 14+ with PostGIS 3.x
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    apple_id VARCHAR(255) UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(512),
    cover_url VARCHAR(512),

    -- Denormalized stats
    visited_countries_count INTEGER NOT NULL DEFAULT 0,
    visited_cities_count INTEGER NOT NULL DEFAULT 0,
    total_pins_count INTEGER NOT NULL DEFAULT 0,

    -- Privacy settings
    profile_visibility VARCHAR(20) NOT NULL DEFAULT 'public',
    notes_visibility VARCHAR(20) NOT NULL DEFAULT 'private',
    bucketlist_visibility VARCHAR(20) NOT NULL DEFAULT 'public',

    -- Subscription
    subscription_status VARCHAR(20) NOT NULL DEFAULT 'free',
    subscription_expires_at TIMESTAMP,

    -- Soft delete
    deleted_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT chk_profile_visibility CHECK (profile_visibility IN ('public', 'private')),
    CONSTRAINT chk_notes_visibility CHECK (notes_visibility IN ('private', 'followers', 'public')),
    CONSTRAINT chk_bucketlist_visibility CHECK (bucketlist_visibility IN ('private', 'followers', 'public')),
    CONSTRAINT chk_subscription_status CHECK (subscription_status IN ('free', 'premium', 'lifetime'))
);

-- Indexes for users
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL;
CREATE INDEX idx_users_apple_id ON users(apple_id) WHERE apple_id IS NOT NULL;
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NOT NULL;

-- =====================================================
-- PINS TABLE (with PostGIS geography)
-- =====================================================
CREATE TABLE pins (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    user_id BIGINT NOT NULL,

    -- Location data
    place_name VARCHAR(255) NOT NULL,
    place_id_google VARCHAR(255),
    location geography(Point, 4326) NOT NULL,
    address_formatted VARCHAR(512),
    address_city VARCHAR(100),
    address_country VARCHAR(100),
    address_country_code VARCHAR(2),

    -- Pin status
    status VARCHAR(20) NOT NULL DEFAULT 'visited',

    -- Content
    notes TEXT,
    visited_date DATE,
    rating SMALLINT,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign keys
    CONSTRAINT fk_pins_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,

    -- Constraints
    CONSTRAINT chk_pin_status CHECK (status IN ('visited', 'want_to_visit', 'draft')),
    CONSTRAINT chk_pin_rating CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
    CONSTRAINT chk_country_code_length CHECK (address_country_code IS NULL OR LENGTH(address_country_code) = 2)
);

-- B-tree indexes for pins
CREATE INDEX idx_pins_user_id ON pins(user_id);
CREATE INDEX idx_pins_user_status ON pins(user_id, status);
CREATE INDEX idx_pins_country_code ON pins(address_country_code);
CREATE INDEX idx_pins_user_created ON pins(user_id, created_at DESC);
CREATE INDEX idx_pins_status_created ON pins(status, created_at DESC);
CREATE INDEX idx_pins_city_country ON pins(address_city, address_country);
CREATE INDEX idx_pins_favorite ON pins(user_id, is_favorite) WHERE is_favorite = TRUE;

-- PostGIS spatial index (GIST) - CRITICAL for geospatial queries
CREATE INDEX idx_pins_location_gist ON pins USING GIST(location);

-- Partial index for active pins
CREATE INDEX idx_pins_active_location ON pins USING GIST(location)
    WHERE status = 'visited';

-- =====================================================
-- PIN_MEDIA TABLE (images for pins)
-- =====================================================
CREATE TABLE pin_media (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    pin_id BIGINT NOT NULL,
    media_url VARCHAR(512) NOT NULL,
    media_type VARCHAR(20) NOT NULL DEFAULT 'image',
    display_order SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pin_media_pin FOREIGN KEY (pin_id)
        REFERENCES pins(id) ON DELETE CASCADE,
    CONSTRAINT chk_media_type CHECK (media_type IN ('image', 'video'))
);

CREATE INDEX idx_pin_media_pin_id ON pin_media(pin_id);
CREATE INDEX idx_pin_media_pin_order ON pin_media(pin_id, display_order);

-- =====================================================
-- FOLLOW_RELATIONSHIPS TABLE
-- =====================================================
CREATE TABLE follow_relationships (
    id BIGSERIAL PRIMARY KEY,
    follower_id BIGINT NOT NULL,
    following_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_follow_follower FOREIGN KEY (follower_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_follow_following FOREIGN KEY (following_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_no_self_follow CHECK (follower_id != following_id),
    CONSTRAINT uk_follow_pair UNIQUE (follower_id, following_id)
);

CREATE INDEX idx_follow_follower ON follow_relationships(follower_id);
CREATE INDEX idx_follow_following ON follow_relationships(following_id);

-- =====================================================
-- ACTIVITIES TABLE (social feed)
-- =====================================================
CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    user_id BIGINT NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    pin_id BIGINT,
    content TEXT,
    media_urls TEXT[],
    visibility VARCHAR(20) NOT NULL DEFAULT 'public',
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activity_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_activity_pin FOREIGN KEY (pin_id)
        REFERENCES pins(id) ON DELETE CASCADE,
    CONSTRAINT chk_activity_type CHECK (activity_type IN ('pin_created', 'trip_shared', 'post')),
    CONSTRAINT chk_activity_visibility CHECK (visibility IN ('public', 'followers', 'private'))
);

CREATE INDEX idx_activities_user ON activities(user_id, created_at DESC);
CREATE INDEX idx_activities_type ON activities(activity_type, created_at DESC);
CREATE INDEX idx_activities_pin ON activities(pin_id) WHERE pin_id IS NOT NULL;

-- =====================================================
-- ACTIVITY_LIKES TABLE
-- =====================================================
CREATE TABLE activity_likes (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_like_activity FOREIGN KEY (activity_id)
        REFERENCES activities(id) ON DELETE CASCADE,
    CONSTRAINT fk_like_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_activity_like UNIQUE (activity_id, user_id)
);

CREATE INDEX idx_activity_likes_activity ON activity_likes(activity_id);
CREATE INDEX idx_activity_likes_user ON activity_likes(user_id);

-- =====================================================
-- ACTIVITY_COMMENTS TABLE
-- =====================================================
CREATE TABLE activity_comments (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    activity_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comment_activity FOREIGN KEY (activity_id)
        REFERENCES activities(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_parent FOREIGN KEY (parent_comment_id)
        REFERENCES activity_comments(id) ON DELETE CASCADE
);

CREATE INDEX idx_activity_comments_activity ON activity_comments(activity_id, created_at);
CREATE INDEX idx_activity_comments_user ON activity_comments(user_id);
CREATE INDEX idx_activity_comments_parent ON activity_comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;

-- =====================================================
-- USER_FEED TABLE (denormalized feed cache)
-- =====================================================
CREATE TABLE user_feed (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    activity_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_feed_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_feed_activity FOREIGN KEY (activity_id)
        REFERENCES activities(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_activity_feed UNIQUE (user_id, activity_id)
);

CREATE INDEX idx_user_feed_user_created ON user_feed(user_id, created_at DESC);

-- =====================================================
-- TRIGGERS for updated_at timestamps
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_pins_updated_at
    BEFORE UPDATE ON pins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_activity_comments_updated_at
    BEFORE UPDATE ON activity_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER for denormalized counts
-- =====================================================
CREATE OR REPLACE FUNCTION update_activity_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE activities SET likes_count = likes_count + 1 WHERE id = NEW.activity_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE activities SET likes_count = likes_count - 1 WHERE id = OLD.activity_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_activity_likes_count
    AFTER INSERT OR DELETE ON activity_likes
    FOR EACH ROW EXECUTE FUNCTION update_activity_likes_count();

CREATE OR REPLACE FUNCTION update_activity_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE activities SET comments_count = comments_count + 1 WHERE id = NEW.activity_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE activities SET comments_count = comments_count - 1 WHERE id = OLD.activity_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_activity_comments_count
    AFTER INSERT OR DELETE ON activity_comments
    FOR EACH ROW EXECUTE FUNCTION update_activity_comments_count();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE pins IS 'User pins with geospatial data (PostGIS)';
COMMENT ON COLUMN pins.location IS 'PostGIS geography point (SRID 4326 - WGS 84)';
COMMENT ON INDEX idx_pins_location_gist IS 'Spatial index for nearby queries (ST_DWithin)';
