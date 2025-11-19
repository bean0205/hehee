-- =====================================================
-- OPTIMIZED QUERIES FOR PINYOURWORD
-- PostGIS Spatial Queries & Performance Tips
-- =====================================================

-- =====================================================
-- 1. NEARBY PINS (Within radius)
-- =====================================================
-- Find pins within 5km of a location (Hanoi)
-- Uses GIST index on location column
SELECT
    p.id,
    p.uuid,
    p.place_name,
    p.address_formatted,
    ST_Distance(p.location, ST_SetSRID(ST_MakePoint(105.8542, 21.0285), 4326)) as distance_meters
FROM pins p
WHERE ST_DWithin(
    p.location,
    ST_SetSRID(ST_MakePoint(105.8542, 21.0285), 4326),  -- lon, lat (note: lon first!)
    5000  -- radius in meters
)
AND p.status = 'visited'
ORDER BY distance_meters
LIMIT 20;

-- =====================================================
-- 2. PINS WITHIN BOUNDING BOX (Viewport search)
-- =====================================================
-- More efficient than radius for map viewport queries
SELECT
    p.id,
    p.uuid,
    p.place_name,
    ST_X(p.location::geometry) as longitude,
    ST_Y(p.location::geometry) as latitude
FROM pins p
WHERE p.location && ST_MakeEnvelope(
    105.8, 21.0,  -- min lon, min lat
    105.9, 21.1,  -- max lon, max lat
    4326
)
AND p.status = 'visited'
LIMIT 100;

-- =====================================================
-- 3. USER'S VISITED COUNTRIES (with count)
-- =====================================================
SELECT
    u.id,
    u.username,
    array_agg(DISTINCT p.address_country_code) as visited_countries,
    COUNT(DISTINCT p.address_country_code) as countries_count,
    COUNT(DISTINCT p.address_city) as cities_count
FROM users u
JOIN pins p ON p.user_id = u.id
WHERE p.status = 'visited'
  AND u.id = 1  -- user_id
GROUP BY u.id, u.username;

-- =====================================================
-- 4. REFRESH MATERIALIZED STATS (user denormalized data)
-- =====================================================
-- Update user's visited countries/cities count
UPDATE users u
SET
    visited_countries_count = (
        SELECT COUNT(DISTINCT address_country_code)
        FROM pins
        WHERE user_id = u.id AND status = 'visited'
    ),
    visited_cities_count = (
        SELECT COUNT(DISTINCT address_city)
        FROM pins
        WHERE user_id = u.id AND status = 'visited'
    ),
    total_pins_count = (
        SELECT COUNT(*)
        FROM pins
        WHERE user_id = u.id
    )
WHERE u.id = 1;  -- specific user

-- =====================================================
-- 5. USER FEED (following users' activities)
-- =====================================================
WITH user_following AS (
    SELECT following_id
    FROM follow_relationships
    WHERE follower_id = 1  -- current user
)
SELECT
    a.id,
    a.uuid,
    a.activity_type,
    a.content,
    a.likes_count,
    a.comments_count,
    u.username,
    u.display_name,
    u.avatar_url,
    a.created_at
FROM activities a
JOIN users u ON u.id = a.user_id
WHERE (
    a.user_id IN (SELECT following_id FROM user_following)  -- following users
    OR a.user_id = 1  -- current user's own posts
)
AND a.visibility IN ('public', 'followers')
AND u.deleted_at IS NULL
ORDER BY a.created_at DESC
LIMIT 20
OFFSET 0;

-- =====================================================
-- 6. POPULAR PLACES (most visited by users)
-- =====================================================
SELECT
    p.place_name,
    p.address_city,
    p.address_country,
    COUNT(DISTINCT p.user_id) as unique_visitors,
    AVG(p.rating) as avg_rating,
    ST_X(p.location::geometry) as longitude,
    ST_Y(p.location::geometry) as latitude
FROM pins p
WHERE p.status = 'visited'
  AND p.rating IS NOT NULL
  AND p.address_country_code = 'VN'  -- Vietnam
GROUP BY
    p.place_name,
    p.address_city,
    p.address_country,
    p.location
HAVING COUNT(DISTINCT p.user_id) >= 5  -- at least 5 visitors
ORDER BY unique_visitors DESC, avg_rating DESC
LIMIT 20;

-- =====================================================
-- 7. USER'S PIN HEATMAP DATA (for visualization)
-- =====================================================
-- Group pins by country for heatmap
SELECT
    address_country_code as country_code,
    address_country as country_name,
    COUNT(*) as pins_count
FROM pins
WHERE user_id = 1
  AND status = 'visited'
  AND address_country_code IS NOT NULL
GROUP BY address_country_code, address_country
ORDER BY pins_count DESC;

-- =====================================================
-- 8. CLUSTERING PINS (for map markers)
-- =====================================================
-- Using ST_ClusterKMeans for grouping nearby pins
-- Useful for reducing markers on map zoom out
WITH clustered_pins AS (
    SELECT
        id,
        place_name,
        location,
        ST_ClusterKMeans(location::geometry, 10) OVER() as cluster_id
    FROM pins
    WHERE user_id = 1 AND status = 'visited'
)
SELECT
    cluster_id,
    COUNT(*) as pins_in_cluster,
    ST_Centroid(ST_Collect(location::geometry)) as cluster_center,
    array_agg(place_name) as place_names
FROM clustered_pins
GROUP BY cluster_id;

-- =====================================================
-- 9. ACTIVITY WITH USER ENGAGEMENT
-- =====================================================
SELECT
    a.id,
    a.uuid,
    a.content,
    a.likes_count,
    a.comments_count,
    u.username,
    u.avatar_url,
    EXISTS(
        SELECT 1 FROM activity_likes al
        WHERE al.activity_id = a.id AND al.user_id = 1
    ) as liked_by_me,
    a.created_at
FROM activities a
JOIN users u ON u.id = a.user_id
WHERE a.visibility = 'public'
ORDER BY
    (a.likes_count + a.comments_count * 2) DESC,  -- engagement score
    a.created_at DESC
LIMIT 20;

-- =====================================================
-- 10. SEARCH PINS BY TEXT (Full-Text Search)
-- =====================================================
-- Add tsvector column for full-text search (migration)
-- ALTER TABLE pins ADD COLUMN search_vector tsvector;
-- CREATE INDEX idx_pins_search ON pins USING GIN(search_vector);
--
-- UPDATE pins SET search_vector =
--     to_tsvector('english', coalesce(place_name, '') || ' ' ||
--                            coalesce(notes, '') || ' ' ||
--                            coalesce(address_city, '') || ' ' ||
--                            coalesce(address_country, ''));

-- Search query
SELECT
    id,
    uuid,
    place_name,
    notes,
    address_formatted,
    ts_rank(search_vector, query) as rank
FROM pins,
     to_tsquery('english', 'hanoi & lake') as query
WHERE search_vector @@ query
  AND user_id = 1
ORDER BY rank DESC
LIMIT 20;

-- =====================================================
-- PERFORMANCE TIPS
-- =====================================================

-- 1. ANALYZE tables after bulk inserts
ANALYZE pins;
ANALYZE users;
ANALYZE activities;

-- 2. VACUUM regularly to reclaim space
VACUUM ANALYZE pins;

-- 3. Check index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- 4. Check slow queries
SELECT
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- 5. Explain query plan
EXPLAIN ANALYZE
SELECT * FROM pins
WHERE ST_DWithin(
    location,
    ST_SetSRID(ST_MakePoint(105.8542, 21.0285), 4326),
    5000
);
