-- ==================================================
-- PinYourWord Database Schema - PostgreSQL + PostGIS
-- ==================================================
-- Version: 1.0
-- Description: Complete database schema for PinYourWord application
-- ==================================================

-- PHẦN 1: CÀI ĐẶT BAN ĐẦU
-- ==================================================

-- Kích hoạt PostGIS để lưu trữ và truy vấn dữ liệu địa lý
CREATE EXTENSION IF NOT EXISTS postgis;

-- Kích hoạt tiện ích để tạo UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TẠO FUNCTION TỰ ĐỘNG CẬP NHẬT 'updated_at'
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PHẦN 2: ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU (ENUMs)
-- ==================================================

-- F-AUTH: User visibility and subscription
CREATE TYPE user_profile_visibility AS ENUM ('public', 'private');
CREATE TYPE user_notes_visibility AS ENUM ('private', 'followers', 'public');
CREATE TYPE user_bucketlist_visibility AS ENUM ('private', 'followers', 'public');
CREATE TYPE user_subscription_status AS ENUM ('free', 'premium');

-- F-MAP: Pin and media types
CREATE TYPE pin_status AS ENUM ('visited', 'want_to_go');
CREATE TYPE pin_media_type AS ENUM ('image', 'video');

-- PHẦN 3: TẠO BẢNG USERS
-- ==================================================

-- Xóa bảng nếu tồn tại (chỉ dùng cho development)
-- DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    apple_id VARCHAR(255) UNIQUE,
    
    -- Profile information
    username VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(512),
    cover_url VARCHAR(512),
    
    -- Denormalized statistics
    visited_countries_count INT DEFAULT 0,
    visited_cities_count INT DEFAULT 0,
    total_pins_count INT DEFAULT 0,

    -- Privacy settings
    profile_visibility user_profile_visibility DEFAULT 'public',
    notes_visibility user_notes_visibility DEFAULT 'private',
    bucketlist_visibility user_bucketlist_visibility DEFAULT 'public',
    
    -- Subscription
    subscription_status user_subscription_status DEFAULT 'free',
    subscription_expires_at TIMESTAMPTZ NULL,
    
    -- Soft delete
    deleted_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Thêm COMMENT mô tả cho từng cột
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
COMMENT ON COLUMN users.deleted_at IS 'NULL = active, có giá trị = đã xóa (cho phép khôi phục)';

-- Tạo trigger tự động cập nhật updated_at
CREATE TRIGGER set_users_updated_at 
BEFORE UPDATE ON users 
FOR EACH ROW 
EXECUTE FUNCTION trigger_set_timestamp();

-- Tạo indexes để tối ưu performance
CREATE INDEX IF NOT EXISTS idx_users_username_lower ON users (LOWER(username));
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users (subscription_status, subscription_expires_at);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users (google_id) WHERE google_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_apple_id ON users (apple_id) WHERE apple_id IS NOT NULL;

-- ==================================================
-- DEMO DATA (Optional - Comment out in production)
-- ==================================================

-- Tạo một số user mẫu cho testing
-- Password: Test@123 (đã hash bằng BCrypt)
INSERT INTO users (email, username, display_name, hashed_password, bio) 
VALUES 
    ('john@example.com', 'john_doe', 'John Doe', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Travel enthusiast and photographer'),
    ('jane@example.com', 'jane_smith', 'Jane Smith', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'World explorer')
ON CONFLICT (email) DO NOTHING;

-- ==================================================
-- VERIFICATION QUERIES
-- ==================================================

-- Kiểm tra users đã tạo
-- SELECT * FROM users WHERE deleted_at IS NULL;

-- Kiểm tra extensions
-- SELECT * FROM pg_extension WHERE extname IN ('postgis', 'uuid-ossp');
