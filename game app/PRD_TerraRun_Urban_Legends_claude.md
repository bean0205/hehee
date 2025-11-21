# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# TERRARUN / URBAN LEGENDS

**Version:** 1.0
**Last Updated:** 2025-11-21
**Document Owner:** Senior Product Manager
**Status:** Draft for Review

---

## 1. OVERVIEW (TỔNG QUAN SẢN PHẨM)

### 1.1. Mục tiêu sản phẩm (Product Goals)

TerraRun/Urban Legends là một nền tảng kết hợp Real-world Strategy MMO và Health Gamification, nhằm:

1. **Tăng cường sức khỏe cộng đồng**: Khuyến khích người dùng duy trì thói quen vận động hàng ngày thông qua cơ chế gamification hấp dẫn
2. **Kết nối thế giới vật lý và số**: Biến thành phố thực thành bàn cờ chiến lược khổng lồ, nơi mỗi bước chân là hành động chinh phục
3. **Xây dựng cộng đồng địa phương**: Tạo sự cạnh tranh lành mạnh và kết nối giữa các khu vực/quận/thành phố
4. **Giải quyết vấn đề văn hóa doanh nghiệp**: Cung cấp công cụ B2B để doanh nghiệp thúc đẩy sức khỏe nhân viên một cách vui vẻ và hiệu quả

### 1.2. Người dùng mục tiêu (Target Users)

**B2C Users:**
- **Tuổi:** 18-45
- **Đặc điểm:**
  - Người yêu thích chạy bộ/đạp xe/đi bộ (từ mới bắt đầu đến vận động viên nghiệp dư)
  - Game thủ thích thể loại strategy, MMO, location-based games
  - Người quan tâm đến sức khỏe và cộng đồng địa phương
- **Pain Points:** Thiếu động lực duy trì vận động, cô đơn khi tập luyện, không thấy giá trị ngay lập tức

**B2B Customers:**
- **Loại hình:** SME đến Enterprise (50+ nhân viên)
- **Ngành:** Technology, Finance, Retail, F&B
- **Pain Points:**
  - Khó khuyến khích nhân viên tham gia hoạt động thể chất
  - Team building nhàm chán, không bền vững
  - Thiếu công cụ đo lường health KPI một cách vui vẻ

**Partnership (Merchants):**
- Cửa hàng F&B, gyms, sports retail cần traffic offline

### 1.3. Giá trị cốt lõi (Core Value Proposition)

| User Segment | Value Proposition |
|--------------|-------------------|
| **Individual Runners** | "Mỗi bước chân đều có giá trị. Bạn không cần phải là VĐV để chinh phục thành phố." |
| **Casual Gamers** | "Thế giới MMO lớn nhất nằm ngay ngoài cửa nhà bạn." |
| **Corporations** | "Biến KPI sức khỏe thành cuộc chiến sinh tồn hấp dẫn - không cần ép buộc, nhân viên tự động tham gia." |
| **Local Businesses** | "Biến cửa hàng thành điểm đến trong game - thu hút khách hàng thực từ thế giới ảo." |

### 1.4. Phạm vi và Phi phạm vi (Scope)

**✅ IN-SCOPE (MVP - Phase 1):**
- Hexagon Grid System với 3 trạng thái cơ bản
- Đồng bộ Strava, Apple Health, Google Fit
- Fair Effort Score (RES) engine
- Basic Anti-Cheat (GPS speed validation)
- User Authentication & Profile
- District War cơ bản (leaderboard theo quận)
- Basic Clan/Guild system
- Boss Raid cho B2B
- 3 Class system (Runner/Cyclist/Walker)
- Basic HR Dashboard cho doanh nghiệp
- Reward Marketplace
- Web Admin Panel cho B2B managers

**🔄 IN-SCOPE (Phase 2):**
- AR Chest Hunt
- Advanced Skill Tree
- Privacy Zones
- AI Anti-Cheat nâng cao
- Stronghold/Fortress mechanics
- Ghost events
- Legacy system (virtual trees/monuments)
- 3D Avatar evolution
- Battle Pass

**❌ OUT-OF-SCOPE:**
- VR/Metaverse integration
- Cryptocurrency/NFT (focus on real rewards)
- Live video streaming của runs
- Social media cloning (chat phức tạp)
- Wearable device manufacturing

---

## 2. LIST OF FEATURES (DANH SÁCH TÍNH NĂNG ĐẦY ĐỦ)

### 2.1. Foundation Features (Tính năng nền tảng)

#### **Authentication & User Management**
- F001: Email/Password Registration
- F002: Email/Password Login
- F003: Social Login (Google)
- F004: Social Login (Apple)
- F005: Social Login (Facebook/Meta)
- F006: Forgot Password / Reset Password
- F007: Email Verification
- F008: Phone Number Verification (Optional)
- F009: User Profile Management
- F010: Avatar Upload
- F011: Bio & Personal Stats Display
- F012: Privacy Settings
- F013: Account Deletion

#### **Role-Based Access Control (RBAC)**
- F014: User Role Assignment (Individual User / Corporate Employee / Corporate Manager / Admin)
- F015: Permission Management per Role
- F016: Corporate Team/Department Management

#### **Onboarding**
- F017: Welcome Tutorial (First-time user flow)
- F018: Class Selection (Runner/Cyclist/Walker)
- F019: Home Location Setup
- F020: Privacy Zone Configuration
- F021: Device/App Connection Guide

### 2.2. Core Gameplay Features

#### **Hexagon Grid System**
- F022: Map Rendering with Hexagon Overlay (200m-500m radius)
- F023: Hex State Management (Fog / Neutral / Occupied)
- F024: Hex Claiming Mechanism
- F025: Hex Defense Point (Decay after 7 days without activity)
- F026: Hex Maintenance (Run through to refresh ownership)
- F027: Terrain Buff System
  - F027a: Street Hex (+Speed bonus)
  - F027b: Park/Lake Hex (+Recovery bonus)
  - F027c: Hill Hex (+1.5x Experience)
- F028: Hex Color by Team/Faction
- F029: Virtual Flag Placement on Hex Center

#### **Activity Sync Engine**
- F030: Strava Integration (OAuth + Webhook)
- F031: Garmin Integration
- F032: Coros Integration
- F033: Apple Health Integration
- F034: Google Fit Integration
- F035: Manual Activity Upload (GPX/TCX)
- F036: Activity Data Parsing (GPS, Distance, Pace, Heart Rate, Elevation)
- F037: Real-time Sync Status Indicator

#### **Fair Effort Score (RES) System**
- F038: Heart Rate Zone Detection (Zone 1-5)
- F039: Relative Effort Score Calculation
  - Formula: `RES = (Distance × Zone Multiplier × Terrain Multiplier)`
  - Zone 1: 0.5x, Zone 2: 1x, Zone 3: 1.5x, Zone 4: 2x, Zone 5: 2.5x
- F040: Handicap System for Beginners (First 30 days: +20% bonus)
- F041: Leaderboard Normalization (Sort by RES, not raw distance)

#### **Anti-Cheat & Safety**
- F042: GPS Speed Validation (Flag if speed > 25 km/h for runners)
- F043: Cadence Analysis (Detect abnormal step patterns)
- F044: Device Sensor Vibration Analysis
- F045: Privacy Zone Implementation (Hide GPS tracks within 500m of home/work)
- F046: Manual Activity Review (Flagged activities sent to moderators)
- F047: Automated Account Suspension (3 violations = 7-day ban)

### 2.3. B2C Features (Urban Legends Mode)

#### **District War**
- F048: Auto District Assignment (Based on GPS frequency)
- F049: District Leaderboard (30-day season)
- F050: District Map Coloring (Winner's color displayed city-wide)
- F051: Virtual Mayor Election (Top 1 user)
- F052: Mayor Badge & Privileges
- F053: Season Rewards Distribution

#### **Clan/Guild System**
- F054: Create Clan (Name, Logo, HQ Location)
- F055: Invite Members (Max 50 for MVP)
- F056: Clan Chat (Text only)
- F057: Clan Leaderboard
- F058: HQ Base Building (Select a cafe/location as HQ)
- F059: HQ Upgrade (Run around HQ to gain resources)
- F060: Clan Territory Expansion
- F061: Clan vs Clan Challenges

#### **AR Chest Hunt** *(Phase 2)*
- F062: Spawn AR Chests at Random GPS Coordinates
- F063: AR Camera View (Unity AR Foundation)
- F064: Chest Interaction (Tap to open)
- F065: Reward Randomization (Vouchers, In-game currency, Buffs)
- F066: Chest Expiration (Disappear after 2 hours)

#### **Dynamic Events**
- F067: Golden Rain Event (x3 Points in specific zone for 1 hour)
- F068: Ghost Chase Event (Appear randomly, users must run faster than target pace)
- F069: Event Push Notifications
- F070: Event History Log

#### **RPG Progression**
- F071: User Level System (XP from activities)
- F072: 3D Avatar Evolution (5 stages: Beginner → Fit → Athlete → Champion → Legend)
- F073: Skill Tree (3 branches: Explorer / Speedster / Socializer)
  - F073a: Explorer Skills (Increased chest detection radius)
  - F073b: Speedster Skills (Bonus points for high pace)
  - F073c: Socializer Skills (Bonus for group runs)
- F074: Skill Point Allocation
- F075: Skill Reset (Paid feature)

#### **Legacy System** *(Phase 2)*
- F076: Virtual Tree Planting (Plant on frequently run routes)
- F077: Monument Placement (After 1000km on a route)
- F078: Legacy Map View (See your forest over time)
- F079: Share Legacy on Social Media

### 2.4. B2B Features (Corp Race Mode)

#### **Class System**
- F080: Class Assignment (Runner/Cyclist/Walker)
- F081: Class-specific Scoring
  - Runner: Base score, DPS to Boss
  - Cyclist: 0.3x distance but Armor Break bonus
  - Walker: 1 Energy Pack per 2000 steps
- F082: Class Badge Display
- F083: Class Leaderboard per Company

#### **Boss Raid**
- F084: Monthly Boss Creation (Auto-generated or Custom by HR)
- F085: Boss Health Pool (e.g., 10,000 km for 100-person company)
- F086: Damage Calculation (Distance = Damage)
- F087: Critical Hit Mechanics
  - Morning Run (5-6 AM): x2 Damage
  - Rainy Day: x2 Damage
  - Stack multipliers: x4 if both
- F088: Boss Defeat Rewards (Company-wide prizes)
- F089: Boss Raid Leaderboard (Top Contributors)
- F090: Custom Boss Design (Upload logo, name for Premium tier)

#### **Stronghold/Fortress System**
- F091: Stronghold Placement (Office branches, partner cafes)
- F092: Stronghold Capture (Team must run around it to claim)
- F093: Stronghold Buff (x2 Points for 24 hours server-wide)
- F094: Stronghold Defense (Must maintain activity to hold)

#### **HR Dashboard**
- F095: Company-wide Activity Overview (Total km, Active users, Avg. RES)
- F096: Department Comparison
- F097: Individual Employee Stats (Anonymized option)
- F098: Burnout Alert (Flag users with excessive training + poor sleep)
- F099: Sleep Data Integration (From wearables)
- F100: Custom Campaign Creation (Set goals, duration, rewards)
- F101: Export Reports (CSV, PDF)

#### **Reward Auction System**
- F102: Point Currency for Employees
- F103: Reward Catalog (Leave days, Late pass, Lunch vouchers)
- F104: Reverse Auction (Highest bidder wins limited rewards)
- F105: Reward Redemption History

### 2.5. Marketplace & Economy

#### **In-App Currency**
- F106: Coin System (Earned from activities)
- F107: Gem System (Premium currency - IAP only)

#### **Reward Marketplace**
- F108: Voucher Redemption (Partner merchants)
- F109: Digital Rewards (Discounts, promo codes)
- F110: Physical Rewards (Shipped items - future)

#### **In-App Purchase (IAP)**
- F111: Buy Gems
- F112: Buy Avatar Skins
- F113: Buy Cosmetic Effects (Light trails, footstep effects)
- F114: Battle Pass Purchase (Season ticket)
- F115: Purchase History

#### **Battle Pass** *(Phase 2)*
- F116: Free Track (Basic rewards)
- F117: Premium Track (Enhanced rewards)
- F118: Track Progression (Levels 1-50)
- F119: Challenge Missions (Weekly tasks)
- F120: Reward Claim Interface

### 2.6. Partnership & O2O

#### **Supply Station System**
- F121: Merchant Registration Portal
- F122: Supply Station Placement on Map
- F123: Check-in at Station (GPS-based)
- F124: In-game Reward Distribution (Buff items)
- F125: Real Voucher Distribution
- F126: Merchant Analytics Dashboard (Footfall, Conversion rate)

### 2.7. Social & Community

#### **Social Features**
- F127: Friend System (Add/Remove friends)
- F128: Activity Feed (See friends' recent runs)
- F129: Kudos/Like System
- F130: Squad Run (Group activity tracking - max 10 people)
- F131: Squad Bonus (x1.2 points when running together)
- F132: Global Chat (Per district)
- F133: Clan Chat (Private)

#### **Notifications**
- F134: Push Notifications (Achievements, Events, Boss raids)
- F135: Email Notifications (Weekly summary)
- F136: In-app Notifications Center

### 2.8. Admin & Support

#### **Admin Panel**
- F137: User Management (Search, Ban, Edit profiles)
- F138: Content Moderation (Review flagged activities)
- F139: Event Management (Create/Edit/Schedule events)
- F140: Boss Management (Approve custom bosses)
- F141: Merchant Approval (Verify Supply Stations)
- F142: Analytics Dashboard (DAU, Retention, Revenue)
- F143: Support Ticket System

#### **Help & Support**
- F144: In-app FAQ
- F145: Submit Support Ticket
- F146: Live Chat (Business hours)
- F147: Feedback Form

### 2.9. Analytics & Tracking

#### **User Analytics**
- F148: Activity Heatmap (Where users run most)
- F149: Personal Progress Charts (Distance over time, RES trends)
- F150: Achievement System (Badges for milestones)

#### **Business Analytics**
- F151: Cohort Analysis
- F152: Churn Prediction
- F153: Revenue Tracking (B2B subscriptions, IAP)
- F154: Partnership ROI (Merchant performance)

---

## 3. PRD CHI TIẾT CHO TỪNG TÍNH NĂNG

### FEATURE F001: Email/Password Registration

#### 3.1. Mục tiêu tính năng
Cho phép người dùng tạo tài khoản mới bằng email và mật khẩu để bắt đầu sử dụng ứng dụng.

#### 3.2. User Stories
- **US-F001-01**: As a new user, I want to register with my email and password, so that I can create a personal account.
- **US-F001-02**: As a user, I want to receive a verification email after registration, so that I can confirm my email address is valid.
- **US-F001-03**: As a user, I want to see clear error messages if my registration fails, so that I can correct my input.

#### 3.3. Business Rules
- Email must be unique in the system
- Email must follow RFC 5322 standard format
- Password must meet minimum security requirements
- Account is created in "unverified" state until email is confirmed
- Unverified accounts can login but have limited features (cannot join clans, participate in boss raids)
- Unverified accounts auto-deleted after 30 days if not verified

#### 3.4. Functional Requirements

**Inputs:**
- Email address (String, required)
- Password (String, required)
- Password confirmation (String, required)
- Display name (String, optional - can be set later)
- Terms & Conditions acceptance (Boolean, required)
- Age confirmation (Checkbox: "I am 13 years or older", required)

**Validation Rules:**
- Email:
  - Required
  - Valid email format
  - Max 255 characters
  - Not already registered
- Password:
  - Required
  - Min 8 characters
  - Max 128 characters
  - Must contain at least: 1 uppercase, 1 lowercase, 1 number
  - Must not be common password (check against blacklist of 10k common passwords)
- Password confirmation:
  - Must match password field
- Display name:
  - 3-30 characters if provided
  - Alphanumeric + spaces only
  - No profanity (check against profanity filter)

**Process Flow:**
1. User navigates to Registration screen
2. User fills in form fields
3. User taps "Create Account" button
4. System validates all inputs (client-side first, then server-side)
5. If validation fails → Show error messages inline
6. If validation passes:
   - Create user record in database (status: unverified)
   - Generate email verification token (JWT, expires in 24 hours)
   - Send verification email
   - Show success message: "Account created! Please check your email to verify."
   - Auto-navigate to "Email Verification Pending" screen
7. User can tap "Resend Email" if not received (rate limit: 1 per minute)

**Outputs:**
- User account created in database
- Verification email sent to user's email
- JWT auth token returned (stored in secure storage)
- User redirected to onboarding flow (but limited features until verified)

**Edge Cases:**
- User tries to register with already-existing email → Show: "Email already registered. Try logging in or reset password."
- User loses internet during registration → Show: "Connection lost. Please try again."
- Email service is down → Queue email for retry (up to 3 attempts), show: "Account created but verification email is delayed. You can resend it shortly."
- User tries to bypass email verification → Block access to core features (hexagon claiming, boss raids) with prompt to verify

**Error Handling:**
- Display inline errors for each field
- Show general error banner at top for server errors
- Log all registration attempts (successful + failed) for analytics
- Rate limiting: Max 5 registration attempts per IP per hour (prevent spam)

#### 3.5. UI/UX Requirements

**Screen Layout:**
```
┌─────────────────────────┐
│   [Logo: TerraRun]      │
│                         │
│   Create Your Account   │
│                         │
│   Email                 │
│   [________________]    │
│                         │
│   Password              │
│   [________________] 👁  │
│   Min 8 chars, 1 upper, │
│   1 lower, 1 number     │
│                         │
│   Confirm Password      │
│   [________________] 👁  │
│                         │
│   Display Name (Opt.)   │
│   [________________]    │
│                         │
│   ☑ I accept Terms      │
│   ☑ I am 13+ years old  │
│                         │
│   [  Create Account  ]  │
│                         │
│   Already have account? │
│   Log In                │
│                         │
│   ─── Or sign up with ───│
│   [G] [Apple] [Meta]    │
└─────────────────────────┘
```

**Interaction:**
- Password toggle (eye icon) to show/hide password
- Real-time validation (show green checkmark when field is valid)
- Disable "Create Account" button until all required fields are valid
- Loading spinner on button during submission

**Accessibility:**
- All fields have labels and ARIA tags
- Error messages announced by screen readers
- Support keyboard navigation (Tab order)
- Min touch target size: 44x44 pts

#### 3.6. Data Requirements

**Database Table: `users`**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique user identifier |
| `email` | VARCHAR(255) | Unique, Not Null | User's email address |
| `password_hash` | VARCHAR(255) | Not Null | Bcrypt hash of password |
| `display_name` | VARCHAR(30) | Nullable | Public display name |
| `email_verified` | BOOLEAN | Default: false | Email verification status |
| `email_verification_token` | VARCHAR(500) | Nullable | JWT for email verification |
| `role` | ENUM | Default: 'user' | 'user', 'corp_employee', 'corp_manager', 'admin' |
| `status` | ENUM | Default: 'active' | 'active', 'suspended', 'deleted' |
| `created_at` | TIMESTAMP | Not Null | Account creation time |
| `updated_at` | TIMESTAMP | Not Null | Last update time |

**Database Table: `user_profiles`** (1:1 with users)

| Field | Type | Constraints |
|-------|------|-------------|
| `user_id` | UUID | Foreign Key → users.id |
| `avatar_url` | VARCHAR(500) | Nullable |
| `bio` | TEXT | Nullable |
| `home_location` | GEOGRAPHY(POINT) | Nullable |
| `privacy_zone_radius` | INT | Default: 500 (meters) |
| `class` | ENUM | 'runner', 'cyclist', 'walker' |
| `total_distance` | DECIMAL(10,2) | Default: 0 |
| `total_res` | DECIMAL(10,2) | Default: 0 |
| `level` | INT | Default: 1 |
| `xp` | INT | Default: 0 |

**Email Template: Verification Email**
- Subject: "Verify your TerraRun account"
- Content: Welcome message + CTA button with verification link
- Link format: `https://app.terrarun.com/verify-email?token={JWT}`

#### 3.7. Acceptance Criteria

**✅ Definition of Done:**
- [ ] User can access registration screen from login page
- [ ] All form validations work correctly (email format, password strength, etc.)
- [ ] Server-side validation prevents duplicate emails
- [ ] User account is created with correct default values
- [ ] Verification email is sent within 5 seconds of registration
- [ ] Verification link in email correctly verifies the account when clicked
- [ ] Error messages are clear and actionable
- [ ] Rate limiting prevents abuse (5 attempts/hour per IP)
- [ ] Password is hashed using bcrypt (cost factor: 12)
- [ ] User is auto-logged in after registration (JWT token stored securely)
- [ ] Analytics event fired: `registration_completed` with metadata (method: email)
- [ ] Common password blacklist blocks weak passwords
- [ ] Profanity filter blocks inappropriate display names
- [ ] UI matches design mockups (Figma)
- [ ] Works on iOS 14+, Android 10+
- [ ] Screen reader accessible
- [ ] Unit tests: 90%+ coverage for registration logic
- [ ] Integration test: Full registration flow (happy path + error cases)
- [ ] Load test: System handles 100 concurrent registrations without errors

---

### FEATURE F022: Map Rendering with Hexagon Overlay

#### 3.1. Mục tiêu tính năng
Hiển thị bản đồ thực tế với lớp phủ lưới lục giác (hexagon grid), cho phép người dùng thấy trạng thái từng ô đất và tương tác với chúng.

#### 3.2. User Stories
- **US-F022-01**: As a user, I want to see a map of my city with hexagon grid overlay, so that I can understand the game board.
- **US-F022-02**: As a user, I want hexagons to be colored differently based on their state (fog/neutral/occupied), so that I can identify strategic targets.
- **US-F022-03**: As a user, I want to tap on a hexagon to see its details, so that I can learn who owns it and its terrain type.
- **US-F022-04**: As a user, I want the map to center on my current location by default, so that I can start exploring my area immediately.

#### 3.3. Business Rules
- Hexagon radius: 200m (urban areas) to 500m (rural areas) - configurable per region
- Hexagon uses H3 Uber system (Hierarchical Hexagonal Geospatial Indexing)
- Map provider: Mapbox (primary), Google Maps (fallback)
- Maximum visible hexagons on screen: 100 (performance limit)
- Hexagon data cached locally for offline viewing (last 7 days of activity area)
- Hexagon state refresh rate: Every 30 seconds when map is active

#### 3.4. Functional Requirements

**Inputs:**
- User's GPS location (lat, long)
- Map zoom level (10-18)
- Map bounds (NE corner, SW corner)

**Data Fetched from Backend:**
```json
{
  "hexagons": [
    {
      "h3_index": "8928308280fffff",
      "center_lat": 21.0285,
      "center_lng": 105.8542,
      "state": "occupied",
      "owner_id": "user-uuid-123",
      "owner_name": "RunnerAlpha",
      "team_color": "#FF5733",
      "terrain_type": "park",
      "defense_points": 850,
      "last_activity": "2025-11-20T15:30:00Z",
      "decay_days_left": 5
    }
  ]
}
```

**Process Flow:**
1. User opens Map screen
2. System requests location permission (if not granted)
3. Get user's current GPS coordinates
4. Calculate visible map bounds
5. Generate H3 hexagon indexes for visible area (resolution 9 = ~200m radius)
6. Fetch hexagon states from backend API: `GET /api/hexagons?bounds={NE_lat,NE_lng,SW_lat,SW_lng}`
7. Render base map (Mapbox tiles)
8. Overlay hexagon polygons on map with colors based on state:
   - **Fog (unexplored)**: Semi-transparent dark gray (#333333, 30% opacity)
   - **Neutral**: Light gray border, no fill (#CCCCCC)
   - **Occupied**: Filled with team/user color, thicker border
9. Add flag icon at center of occupied hexagons
10. Enable tap gesture on hexagons → Show detail modal

**Outputs:**
- Interactive map with hexagon grid
- Color-coded hexagons based on state
- Smooth pan/zoom experience (60 fps target)

**Hexagon Detail Modal (on tap):**
```
┌─────────────────────────┐
│  Hexagon Details        │
│                         │
│  [Park Icon] 🌳         │
│  Lenin Park Hex         │
│                         │
│  Status: Occupied       │
│  Owner: RunnerAlpha     │
│  Team: Red Dragons      │
│                         │
│  Terrain: Park          │
│  Bonus: +30% Recovery   │
│                         │
│  Defense: 850/1000      │
│  Decays in: 5 days      │
│                         │
│  Last Activity:         │
│  Nov 20, 3:30 PM        │
│                         │
│  [Close] [Navigate Here]│
└─────────────────────────┘
```

**Edge Cases:**
- No GPS signal → Show last known location + banner: "GPS signal weak. Map may be outdated."
- User denies location permission → Show world map centered on default city + prompt to enable location
- Slow network → Show cached hexagons with "Updating..." indicator
- User zooms out too far (zoom < 10) → Hide hexagons (too many to render), show message: "Zoom in to see hexagons"
- User in area with no hexagon data (e.g., ocean) → Show empty hexagons as "unexplored"

**Performance Optimization:**
- Hexagon polygons rendered using GPU-accelerated map layers (Mapbox GL JS)
- Cluster hexagons when zoomed out (show aggregated stats)
- Lazy load hexagon details (only fetch data for visible area)
- Use WebSocket for real-time updates (if user is stationary and watching the map)

**Error Handling:**
- API timeout (> 10s) → Use cached data + show warning
- Invalid hexagon data → Skip rendering that hexagon + log error to Sentry
- Map rendering error → Fallback to static image map + retry button

#### 3.5. UI/UX Requirements

**Map Controls:**
- Center on User Location button (bottom-right)
- Zoom In/Out buttons (right side)
- Layer toggle (Show/Hide hexagons, Show/Hide terrain types)
- Legend button (explain colors and symbols)

**Legend:**
```
🔲 Fog = Not explored
⬡ Neutral = No owner
🟥 Red = Team A
🟦 Blue = Team B
🌳 Park = +Recovery
⛰️ Hill = +XP
🏙️ Street = +Speed
```

**Gestures:**
- Pinch to zoom
- Pan to move map
- Tap hexagon = Show details
- Long-press hexagon = Quick actions menu (Navigate, Share, Report)

#### 3.6. Data Requirements

**API Endpoint: `GET /api/hexagons`**

Query Parameters:
- `ne_lat`, `ne_lng`: Northeast corner of map bounds
- `sw_lat`, `sw_lng`: Southwest corner of map bounds
- `zoom`: Current zoom level (optional, for optimization)

Response: JSON array of hexagon objects (see Process Flow section)

**Caching Strategy:**
- Cache hexagon data in local SQLite database
- TTL: 5 minutes for active area, 1 day for previously viewed areas
- Invalidate cache when user claims/loses a hexagon

**Database Table: `hexagons` (Backend)**

| Field | Type | Constraints |
|-------|------|-------------|
| `h3_index` | VARCHAR(15) | Primary Key |
| `center_point` | GEOGRAPHY(POINT) | Not Null, Spatial Index |
| `state` | ENUM | 'fog', 'neutral', 'occupied' |
| `owner_id` | UUID | Foreign Key → users.id, Nullable |
| `team_id` | UUID | Foreign Key → teams.id, Nullable |
| `terrain_type` | ENUM | 'street', 'park', 'hill', 'water' |
| `defense_points` | INT | Default: 0, Max: 1000 |
| `last_activity_at` | TIMESTAMP | Nullable |
| `created_at` | TIMESTAMP | Not Null |
| `updated_at` | TIMESTAMP | Not Null |

**Spatial Indexing:**
- Create PostGIS spatial index on `center_point` for fast geospatial queries
- Use H3 library for efficient hexagon calculations

#### 3.7. Acceptance Criteria

**✅ Definition of Done:**
- [ ] Map loads within 2 seconds on 4G connection
- [ ] Hexagons render correctly at zoom levels 12-18
- [ ] Hexagon colors match their state (fog/neutral/occupied)
- [ ] Tapping a hexagon shows detail modal with correct data
- [ ] "Center on Me" button works and animates smoothly
- [ ] Map performs at 60fps while panning/zooming
- [ ] Offline mode shows last cached hexagons
- [ ] Legend is accessible and explains all symbols
- [ ] Works on iOS 14+ and Android 10+
- [ ] Handles 100+ visible hexagons without lag
- [ ] Real-time updates via WebSocket (hexagon state changes reflected within 5s)
- [ ] Unit tests for hexagon state logic
- [ ] Integration test: Fetch hexagons for a given map bounds
- [ ] Visual regression test: Compare screenshots with baseline
- [ ] Accessibility: VoiceOver/TalkBack can describe hexagon states

---

### FEATURE F038-F041: Fair Effort Score (RES) System

#### 3.1. Mục tiêu tính năng
Tính toán điểm công bằng dựa trên nỗ lực tương đối (heart rate zones), không chỉ dựa vào tốc độ hoặc khoảng cách, để khuyến khích mọi người tham gia bất kể trình độ.

#### 3.2. User Stories
- **US-F038-01**: As a beginner runner, I want my effort to be valued fairly, so that I feel motivated even if I run slower than others.
- **US-F038-02**: As a user, I want to see my heart rate zone distribution after each run, so that I can understand my effort level.
- **US-F038-03**: As a user, I want to compete on a leaderboard that values effort over speed, so that everyone has a fair chance.

#### 3.3. Business Rules

**Heart Rate Zone Definitions (% of Max HR):**
- **Zone 1 (Recovery)**: 50-60% → Multiplier: 0.5x
- **Zone 2 (Endurance)**: 60-70% → Multiplier: 1.0x
- **Zone 3 (Tempo)**: 70-80% → Multiplier: 1.5x
- **Zone 4 (Threshold)**: 80-90% → Multiplier: 2.0x
- **Zone 5 (VO2 Max)**: 90-100% → Multiplier: 2.5x

**Max Heart Rate Calculation:**
- Default formula: `Max HR = 220 - Age`
- Allow user to set custom Max HR in settings (if they know from lab test)

**RES Formula:**
```
RES = Σ (Distance_in_zone × Zone_Multiplier × Terrain_Multiplier)

Where:
- Distance_in_zone: km spent in each HR zone
- Zone_Multiplier: from table above
- Terrain_Multiplier:
  - Street: 1.0x
  - Park: 1.1x
  - Hill: 1.5x
```

**Beginner Handicap:**
- Users in first 30 days: +20% bonus to final RES
- Users with < 100km total lifetime: +10% bonus

**Edge Cases:**
- No heart rate data available (device doesn't support HR):
  - Fallback to pace-based estimation:
    - Pace < 8 min/km: Assume Zone 2 (1.0x)
    - Pace 6-8 min/km: Assume Zone 3 (1.5x)
    - Pace < 6 min/km: Assume Zone 4 (2.0x)
  - Show warning: "Connect heart rate monitor for accurate scores"
- Abnormal heart rate (> 200 bpm or < 40 bpm during run):
  - Flag for review, use fallback pace estimation
  - Notify user: "Unusual heart rate detected. Score may be adjusted."

#### 3.4. Functional Requirements

**Inputs:**
- Activity GPX/FIT file with:
  - GPS trackpoints (lat, lng, timestamp)
  - Heart rate data per trackpoint (bpm)
  - Elevation data (meters)
- User profile: Age, Custom Max HR (if set), Account age, Total lifetime distance

**Processing Steps:**
1. Parse activity file
2. Calculate user's Max HR (custom or 220 - age)
3. For each trackpoint:
   - Determine HR zone (% of Max HR)
   - Calculate distance to next point (Haversine formula)
   - Determine terrain type (query hexagon at that lat/lng)
   - Apply zone multiplier and terrain multiplier
   - Add to zone-specific totals
4. Sum up RES across all zones
5. Apply handicap bonus if applicable
6. Store RES in activity record
7. Update user's total RES

**Outputs:**
- RES score (decimal, 2 decimal places)
- HR zone distribution (time and distance spent in each zone)
- Breakdown of score by zone and terrain

**Example Calculation:**

```
User: Age 35 (Max HR = 185)
Activity: 5 km run

Segment 1: 2 km in Zone 3 (HR 130-148) on Street
  RES = 2 × 1.5 × 1.0 = 3.0

Segment 2: 2 km in Zone 4 (HR 148-167) on Hill
  RES = 2 × 2.0 × 1.5 = 6.0

Segment 3: 1 km in Zone 2 (HR 111-130) on Park
  RES = 1 × 1.0 × 1.1 = 1.1

Total Base RES = 3.0 + 6.0 + 1.1 = 10.1

Handicap (user has only 50km lifetime): +10%
Final RES = 10.1 × 1.1 = 11.11
```

**API Endpoint: `POST /api/activities/calculate-res`**

Request:
```json
{
  "activity_id": "activity-uuid",
  "gpx_data": "...",
  "user_id": "user-uuid"
}
```

Response:
```json
{
  "res_score": 11.11,
  "zone_breakdown": {
    "zone_1": {"distance": 0, "time": 0, "res": 0},
    "zone_2": {"distance": 1.0, "time": 540, "res": 1.1},
    "zone_3": {"distance": 2.0, "time": 900, "res": 3.0},
    "zone_4": {"distance": 2.0, "time": 960, "res": 6.0},
    "zone_5": {"distance": 0, "time": 0, "res": 0}
  },
  "terrain_breakdown": {
    "street": {"distance": 2.0, "res": 3.0},
    "park": {"distance": 1.0, "res": 1.1},
    "hill": {"distance": 2.0, "res": 6.0}
  },
  "handicap_applied": 0.1,
  "final_res": 11.11
}
```

#### 3.5. UI/UX Requirements

**Activity Detail Screen - RES Breakdown:**

```
┌─────────────────────────┐
│  Morning Run            │
│  5.0 km • 40 min        │
│                         │
│  📊 Effort Score        │
│  ┌─────────────────┐   │
│  │   11.11 RES     │   │
│  │   +10% Bonus    │   │
│  └─────────────────┘   │
│                         │
│  Heart Rate Zones       │
│  🟢 Z1 ▓░░░░░░░░░   0% │
│  🟡 Z2 ▓▓▓░░░░░░░  20% │
│  🟠 Z3 ▓▓▓▓▓▓░░░░  40% │
│  🔴 Z4 ▓▓▓▓▓▓░░░░  40% │
│  🔥 Z5 ▓░░░░░░░░░   0% │
│                         │
│  Terrain Breakdown      │
│  🏙️ Street   2km  3.0  │
│  🌳 Park     1km  1.1  │
│  ⛰️  Hill     2km  6.0  │
│                         │
│  [Share] [Close]        │
└─────────────────────────┘
```

**Leaderboard - Sort by RES:**

```
┌─────────────────────────┐
│  🏆 District Leaderboard│
│                         │
│  Sort by: [RES ▼] Dist  │
│                         │
│  1. 👤 AlphaRunner      │
│     2,450 RES • 180 km  │
│                         │
│  2. 👤 BetaWalker       │
│     2,380 RES • 220 km  │
│     (Beginner +20%)     │
│                         │
│  3. 👤 You              │
│     2,100 RES • 150 km  │
│                         │
│  ...                    │
└─────────────────────────┘
```

#### 3.6. Data Requirements

**Database Table: `activities`**

Additional fields:
| Field | Type | Description |
|-------|------|-------------|
| `res_score` | DECIMAL(10,2) | Final RES score |
| `zone_1_distance` | DECIMAL(8,2) | km in Zone 1 |
| `zone_2_distance` | DECIMAL(8,2) | km in Zone 2 |
| `zone_3_distance` | DECIMAL(8,2) | km in Zone 3 |
| `zone_4_distance` | DECIMAL(8,2) | km in Zone 4 |
| `zone_5_distance` | DECIMAL(8,2) | km in Zone 5 |
| `terrain_street_distance` | DECIMAL(8,2) | km on streets |
| `terrain_park_distance` | DECIMAL(8,2) | km in parks |
| `terrain_hill_distance` | DECIMAL(8,2) | km on hills |
| `handicap_bonus` | DECIMAL(4,2) | Handicap multiplier applied |

**User Profile Fields:**
| Field | Type |
|-------|------|
| `max_heart_rate` | INT (Nullable, default: 220 - age) |
| `total_res` | DECIMAL(12,2) |

#### 3.7. Acceptance Criteria

**✅ Definition of Done:**
- [ ] RES calculation engine processes activities within 5 seconds
- [ ] Heart rate zone distribution displayed correctly
- [ ] Beginner handicap (+20%) applied for users < 30 days
- [ ] Leaderboard can sort by RES (default) or Distance
- [ ] Users without HR data get fallback pace-based estimation
- [ ] Abnormal HR values (>200 or <40 bpm) flagged for review
- [ ] User can set custom Max HR in settings
- [ ] RES breakdown shows zone and terrain contributions
- [ ] Unit tests: Test RES formula with sample data
- [ ] Integration test: Upload activity → Verify RES calculated correctly
- [ ] Performance test: Calculate RES for 10,000-point GPX file in < 3s
- [ ] Accuracy test: Compare RES with manual calculation (tolerance: ±0.5%)

---

## 4. SYSTEM FLOW / DIAGRAMS

### 4.1. User Registration & Onboarding Flow

```
┌─────────┐
│  Start  │
└────┬────┘
     │
     ▼
┌──────────────────┐
│ Landing Screen   │
│ [Sign Up] [Login]│
└────┬────┬────────┘
     │    │
     │    └──────────────────┐
     │                       │
     ▼                       ▼
┌────────────────┐     ┌──────────┐
│ Registration   │     │  Login   │
│ Form           │     │  Screen  │
└────┬───────────┘     └─────┬────┘
     │                       │
     ▼                       │
┌────────────────┐           │
│ Email Sent     │           │
│ Verify Account │           │
└────┬───────────┘           │
     │                       │
     ▼                       │
┌────────────────┐           │
│ Click Link     │           │
│ in Email       │           │
└────┬───────────┘           │
     │                       │
     │◄──────────────────────┘
     │
     ▼
┌────────────────┐
│ Onboarding #1  │
│ Welcome Tour   │
└────┬───────────┘
     │
     ▼
┌────────────────┐
│ Onboarding #2  │
│ Choose Class   │
│ Runner/Cyclist │
│ /Walker        │
└────┬───────────┘
     │
     ▼
┌────────────────┐
│ Onboarding #3  │
│ Set Home       │
│ Location &     │
│ Privacy Zone   │
└────┬───────────┘
     │
     ▼
┌────────────────┐
│ Onboarding #4  │
│ Connect Strava/│
│ Apple Health   │
└────┬───────────┘
     │
     ▼
┌────────────────┐
│ Main App       │
│ (Map Screen)   │
└────────────────┘
```

### 4.2. Activity Sync Flow

```
┌──────────────┐
│ User finishes│
│ run (Strava) │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Strava Webhook   │
│ notifies TerraRun│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐     ┌────────────┐
│ Fetch Activity   │────▶│ Strava API │
│ Details (GPX)    │     └────────────┘
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Anti-Cheat Check │
│ - Speed > 25km/h?│
│ - Cadence normal?│
└──────┬───────────┘
       │
       ├─── Suspicious? ─┐
       │                 ▼
       │           ┌──────────────┐
       │           │ Flag for     │
       │           │ Manual Review│
       │           └──────────────┘
       │
       ▼
┌──────────────────┐
│ Calculate RES    │
│ - Parse HR zones │
│ - Calc terrain   │
│ - Apply handicap │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Update Hexagons  │
│ - Find hexes     │
│   crossed        │
│ - Claim/defend   │
│ - Update state   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Award Points     │
│ - Add RES to user│
│ - Add to team    │
│ - Update level/XP│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Push Notification│
│ "Activity synced!│
│  +11.5 RES"      │
└──────────────────┘
```

### 4.3. Hexagon Claiming Flow

```
User Runs Through Hexagon
          │
          ▼
    ┌──────────┐
    │GPS Track │
    │ Recorded │
    └────┬─────┘
         │
         ▼
    ┌──────────────────┐
    │ Activity Sync    │
    │ (see Flow 4.2)   │
    └────┬─────────────┘
         │
         ▼
    ┌──────────────────┐
    │ Identify Hexagons│
    │ Crossed (H3)     │
    └────┬─────────────┘
         │
         ▼
    For Each Hexagon:
         │
         ▼
    ┌──────────────────┐
    │ Check Current    │
    │ State            │
    └────┬─────────────┘
         │
         ├─ Fog? ──────────┐
         │                 ▼
         │         ┌───────────────┐
         │         │ Reveal Hex    │
         │         │ State = Neutral│
         │         │ Award XP      │
         │         └───────────────┘
         │
         ├─ Neutral? ──────┐
         │                 ▼
         │         ┌───────────────┐
         │         │ Claim Hex     │
         │         │ State = Owned │
         │         │ Owner = User  │
         │         │ Defense = 1000│
         │         │ Award RES×2   │
         │         └───────────────┘
         │
         ├─ Owned by User?─┐
         │                 ▼
         │         ┌───────────────┐
         │         │ Maintain Hex  │
         │         │ Reset Decay   │
         │         │ Defense = 1000│
         │         │ Award RES×0.5 │
         │         └───────────────┘
         │
         └─ Owned by Enemy?┐
                           ▼
                   ┌───────────────┐
                   │ Attack Hex    │
                   │ Reduce Defense│
                   │ by RES/10     │
                   └───┬───────────┘
                       │
                       ├─ Defense <= 0?
                       │       │
                       │       ▼
                       │  ┌────────────┐
                       │  │ Capture!   │
                       │  │ New Owner  │
                       │  │ = User     │
                       │  │ Award RES×3│
                       │  └────────────┘
                       │
                       └─ Defense > 0?
                               │
                               ▼
                          ┌────────────┐
                          │ Weakened   │
                          │ (no capture)│
                          │ Award RES×1│
                          └────────────┘
```

### 4.4. Boss Raid Flow (B2B)

```
┌─────────────────┐
│ HR Manager      │
│ Creates Boss    │
│ via Dashboard   │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Boss Spawned    │
│ Health: 10,000km│
│ Duration: 30 day│
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Notify All      │
│ Employees       │
│ (Push + Email)  │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Employees Run   │
│ (Normal Activ.) │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Calculate Damage│
│ Base = Distance │
└────┬────────────┘
     │
     ▼
┌──────────────────────┐
│ Check Multipliers:   │
│ - Morning (5-6AM)? ×2│
│ - Rainy day? ×2      │
│ - Cyclist Armor Break│
│   active? ×1.5       │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Apply Damage to Boss │
│ Health -= Damage     │
└────┬─────────────────┘
     │
     ├─ Health > 0? ────┐
     │                  │
     │                  ▼
     │          ┌───────────────┐
     │          │ Update Boss   │
     │          │ UI (Progress  │
     │          │ Bar)          │
     │          └───────────────┘
     │
     └─ Health <= 0? ───┐
                        ▼
                 ┌──────────────┐
                 │ Boss Defeated│
                 └──┬───────────┘
                    │
                    ▼
                 ┌──────────────┐
                 │ Distribute   │
                 │ Rewards:     │
                 │ - Top 3: Gold│
                 │ - Top 10: Sil│
                 │ - All: Bronze│
                 └──┬───────────┘
                    │
                    ▼
                 ┌──────────────┐
                 │ HR Dashboard │
                 │ Shows Victory│
                 │ Stats        │
                 └──────────────┘
```

### 4.5. AR Chest Hunt Flow

```
┌─────────────────┐
│ System Spawns   │
│ AR Chest at     │
│ Random GPS      │
│ (Cron Job)      │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Nearby Users    │
│ Get Push Notif: │
│ "Chest nearby!" │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ User Opens Map  │
│ Sees Chest Icon │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ User Navigates  │
│ to Chest (Run)  │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Within 20m?     │
└────┬────────────┘
     │
     ├─ No ──────────┐
     │               │
     │               ▼
     │         "Keep going!"
     │
     └─ Yes ─────────┐
                     ▼
              ┌──────────────┐
              │ Prompt:      │
              │ "Tap to Open │
              │  AR View"    │
              └──┬───────────┘
                 │
                 ▼
              ┌──────────────┐
              │ Open Camera  │
              │ AR View      │
              │ (Unity AR)   │
              └──┬───────────┘
                 │
                 ▼
              ┌──────────────┐
              │ 3D Chest     │
              │ Appears      │
              └──┬───────────┘
                 │
                 ▼
              ┌──────────────┐
              │ User Taps    │
              │ Chest        │
              └──┬───────────┘
                 │
                 ▼
              ┌──────────────┐
              │ Randomize    │
              │ Reward:      │
              │ - 60% Coins  │
              │ - 25% Voucher│
              │ - 10% Buff   │
              │ - 5% Gem     │
              └──┬───────────┘
                 │
                 ▼
              ┌──────────────┐
              │ Award Reward │
              │ to User      │
              └──┬───────────┘
                 │
                 ▼
              ┌──────────────┐
              │ Show Reward  │
              │ Animation    │
              └──┬───────────┘
                 │
                 ▼
              ┌──────────────┐
              │ Remove Chest │
              │ from Map     │
              └──────────────┘
```

### 4.6. Guild Territory Expansion Flow

```
┌─────────────────┐
│ Clan Leader     │
│ Selects HQ      │
│ (Cafe Location) │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Initial         │
│ Territory:      │
│ 3 hexagons      │
│ around HQ       │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Clan Members    │
│ Run Around HQ   │
│ (Within 1km)    │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Collect         │
│ "Territory      │
│  Points"        │
│ (1 point/km)    │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Reach 100 pts?  │
└────┬────────────┘
     │
     ├─ No ──────────┐
     │               │
     │               ▼
     │         "Keep running"
     │
     └─ Yes ─────────┐
                     ▼
              ┌──────────────┐
              │ Spend Points │
              │ to Expand    │
              │ Territory    │
              └──┬───────────┘
                 │
                 ▼
              ┌──────────────┐
              │ Choose       │
              │ Adjacent Hex │
              │ to Claim     │
              └──┬───────────┘
                 │
                 ▼
              ┌──────────────┐
              │ Hex Added to │
              │ Clan Control │
              └──┬───────────┘
                 │
                 ▼
              ┌──────────────┐
              │ Notify Clan: │
              │ "Territory   │
              │  Expanded!"  │
              └──────────────┘
```

---

## 5. KPI / SUCCESS METRICS

### 5.1. North Star Metric
**Active Running Days per User per Month (ARD/U/M)**
- Target: 12+ days/month (avg 3x/week)
- Definition: Days with at least 1 synced activity

### 5.2. Product Metrics

#### **Engagement Metrics**
| Metric | Target (Month 6) | Measurement |
|--------|------------------|-------------|
| DAU/MAU Ratio | 30%+ | Daily Active / Monthly Active Users |
| Weekly Retention (W1) | 40%+ | % users active 7 days after signup |
| Monthly Retention (M1) | 25%+ | % users active 30 days after signup |
| Avg Session Length | 8+ min | Time in app per session |
| Sessions per User per Week | 5+ | App opens |
| Hexagon Claiming Rate | 2+ per user/week | New hexagons claimed |

#### **Health Impact Metrics**
| Metric | Target | Measurement |
|--------|--------|-------------|
| Avg km per User per Month | 40+ km | Total distance / MAU |
| Avg RES per User per Month | 60+ RES | Total RES / MAU |
| % Users Improving Effort | 60%+ | Users with increasing RES month-over-month |
| Beginner Retention | 50%+ | Users < 30 days still active after 60 days |

#### **B2B Metrics**
| Metric | Target (Year 1) | Measurement |
|--------|-----------------|-------------|
| Corporate Clients | 50+ companies | Paying B2B accounts |
| Avg Employees per Corp | 200+ | Users linked to corp accounts |
| Corp Employee Participation | 40%+ | % of employees with 1+ activity/month |
| Boss Raid Completion Rate | 70%+ | % of boss raids defeated |
| NPS (B2B Decision Makers) | 40+ | Net Promoter Score |

#### **Monetization Metrics**
| Metric | Target (Year 1) | Measurement |
|--------|-----------------|-------------|
| MRR (Monthly Recurring Revenue) | $50k+ | B2B subscriptions |
| ARPU (Avg Revenue Per User) | $2+ | (IAP + Subscriptions) / MAU |
| IAP Conversion Rate | 5%+ | % of users who made 1+ purchase |
| Merchant Partners | 100+ | Supply Stations active |
| Voucher Redemption Rate | 30%+ | % of earned vouchers redeemed |

### 5.3. Technical Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time (p95) | < 500ms | 95th percentile |
| App Crash Rate | < 0.5% | Crashes per session |
| Activity Sync Success Rate | > 99% | Successful syncs / total |
| Map Load Time | < 2s | Time to first hexagon render |

### 5.4. Growth Metrics
| Metric | Target (Year 1) | Measurement |
|--------|-----------------|-------------|
| MAU | 10,000+ | Monthly Active Users |
| Viral Coefficient (k) | 0.3+ | New users from referrals / existing users |
| Organic Download Rate | 60%+ | Non-paid installs |
| District Coverage | 50+ districts | Unique districts with 10+ active users |

---

## 6. RISK & MITIGATION

### 6.1. Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **GPS Data Privacy Breach** | Critical | Low | - Implement Privacy Zones<br>- Encrypt GPS data at rest<br>- GDPR/CCPA compliance audit<br>- Allow users to delete all activity data |
| **Cheating at Scale** | High | Medium | - Multi-layer anti-cheat (GPS speed, cadence, sensor)<br>- Manual review queue<br>- Community reporting<br>- Machine learning fraud detection (Phase 2) |
| **3rd Party API Downtime (Strava)** | High | Low | - Queue failed syncs for retry<br>- Support multiple platforms (Garmin, Apple Health)<br>- Manual GPX upload fallback |
| **Map Rendering Performance** | Medium | Medium | - Limit visible hexagons to 100<br>- Use map clustering for zoom-out<br>- GPU-accelerated rendering<br>- Load testing before launch |
| **Hexagon Decay Causing User Frustration** | Medium | High | - Clear in-app notifications before decay<br>- Allow "vacation mode" (pause decay for 14 days)<br>- Gradual decay (not instant) |

### 6.2. Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Low B2B Adoption** | Critical | Medium | - Offer free pilot program (first 3 months)<br>- Case studies with early adopters<br>- Partnership with HR consulting firms<br>- Freemium tier for small companies |
| **Merchant Partners No ROI** | High | Medium | - Share analytics with partners (footfall, conversion)<br>- Pilot with 10 partners, optimize before scaling<br>- Flexible pricing (pay per check-in vs fixed fee) |
| **User Retention Drop After 30 Days** | High | High | - Implement habit loops (daily quests, streaks)<br>- Social pressure (clan obligations)<br>- Progressive rewards (unlock features over time)<br>- Re-engagement push notifications |
| **Seasonality (Winter Drop)** | Medium | High | - Indoor activity support (treadmill, gym)<br>- Winter-themed events (Ice Boss Raid)<br>- Partner with indoor gyms<br>- Offer off-season challenges |

### 6.3. Legal & Compliance Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Data Privacy Violation (GDPR/CCPA)** | Critical | Low | - Legal review of privacy policy<br>- Right to deletion<br>- Explicit consent for GPS tracking<br>- Data retention policy (delete after 2 years) |
| **Injury Liability** | High | Low | - Disclaimer in T&C (user assumes risk)<br>- Safety tips in app (hydration, rest)<br>- Burnout detection and warnings<br>- Insurance coverage |
| **Intellectual Property (Map Data)** | Medium | Low | - Licensed map provider (Mapbox/Google)<br>- Avoid proprietary game mechanics from competitors<br>- Trademark "TerraRun" |

### 6.4. Market Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Competitor Launch (Niantic, etc.)** | High | Medium | - Focus on B2B niche (differentiation)<br>- Community-first (local pride vs global game)<br>- Faster iteration (agile releases) |
| **Economic Downturn (B2B Budget Cuts)** | Medium | Medium | - Demonstrate ROI (health cost savings)<br>- Flexible pricing tiers<br>- Pivot to B2C focus if needed |

---

## 7. RELEASE PLAN / ROADMAP

### Phase 0: Pre-Launch (Months -2 to 0)

**Goals:**
- Validate core mechanics
- Build beta community

**Deliverables:**
- [ ] Closed beta (100 users in 1 city - Hanoi)
- [ ] Core features only: Map, Hexagons, Strava sync, Basic leaderboard
- [ ] Collect feedback via surveys
- [ ] Fix critical bugs
- [ ] Load testing (1000 concurrent users)

**Success Criteria:**
- 70% of beta users active for 4+ weeks
- <1% crash rate
- Positive feedback on core mechanics

---

### Phase 1: MVP Launch (Months 1-3)

**Goals:**
- Launch in 3 cities (Hanoi, HCMC, Da Nang)
- Acquire first 1,000 users (B2C)
- Sign first 5 B2B clients

**Features Included:**
- ✅ F001-F013: Authentication
- ✅ F014-F016: RBAC
- ✅ F017-F021: Onboarding
- ✅ F022-F029: Hexagon Grid
- ✅ F030-F037: Activity Sync (Strava, Apple Health, Google Fit)
- ✅ F038-F041: RES System
- ✅ F042-F047: Basic Anti-Cheat
- ✅ F048-F053: District War
- ✅ F054-F061: Clan System
- ✅ F080-F083: Class System (B2B)
- ✅ F084-F090: Boss Raid (B2B)
- ✅ F095-F101: HR Dashboard
- ✅ F106-F110: Reward Marketplace
- ✅ F127-F133: Social Features
- ✅ F137-F143: Admin Panel

**Marketing:**
- PR launch in running communities
- Partnership with local running clubs
- Free 3-month trial for B2B

**Success Criteria:**
- 1,000 MAU
- 30% W1 retention
- 5 B2B clients signed
- <0.5% crash rate

---

### Phase 2: Expansion & Gamification (Months 4-6)

**Goals:**
- Expand to 10 cities in Vietnam
- Introduce AR and advanced RPG features
- Grow to 10,000 MAU

**Features Added:**
- ✅ F062-F066: AR Chest Hunt
- ✅ F067-F070: Dynamic Events
- ✅ F071-F075: RPG Progression & Skill Tree
- ✅ F091-F094: Stronghold System
- ✅ F111-F115: IAP (Skins, Cosmetics)
- ✅ F121-F126: Supply Station (O2O)

**Marketing:**
- AR chest events for launch hype
- Merchant partnership program
- Influencer campaigns (fitness YouTubers)

**Success Criteria:**
- 10,000 MAU
- 5% IAP conversion rate
- 20 B2B clients
- 50+ merchant partners

---

### Phase 3: Scale & Monetization (Months 7-12)

**Goals:**
- National coverage (Vietnam)
- Introduce Battle Pass
- Optimize revenue streams

**Features Added:**
- ✅ F076-F079: Legacy System
- ✅ F116-F120: Battle Pass
- ✅ Advanced AI Anti-Cheat
- ✅ Weather API integration (rainy day detection)
- ✅ Sleep data integration (burnout prevention)

**Partnerships:**
- Insurance companies (health score discount)
- Sports brands (branded in-game items)

**Success Criteria:**
- 50,000 MAU
- $50k MRR
- 50 B2B clients
- 100+ merchant partners
- 40+ NPS

---

### Phase 4: Regional Expansion (Year 2)

**Goals:**
- Launch in Thailand, Singapore, Indonesia
- Localization (Thai, Bahasa)

**Features:**
- Multi-language support
- Regional leaderboards
- Cross-country clan wars

**Success Criteria:**
- 200,000 MAU across SEA
- $200k MRR

---

## 8. APPENDIX

### 8.1. Assumptions
- Target market has 60%+ smartphone penetration
- 30% of runners use Strava or similar apps
- B2B clients have 100+ employees on average
- Users comfortable sharing GPS data with privacy controls

### 8.2. Dependencies
- Mapbox API (or Google Maps API)
- Strava API access
- Apple HealthKit / Google Fit APIs
- Payment gateway (Stripe for IAP, B2B subscriptions)
- Email service (SendGrid)
- Push notification service (Firebase Cloud Messaging)
- Cloud hosting (AWS / GCP)

### 8.3. Out-of-Scope for MVP (Future Considerations)
- Live multiplayer races
- Voice chat
- Video streaming of runs
- Blockchain/NFT integration
- Smartwatch standalone app (require phone for MVP)
- TV/web version

### 8.4. Glossary
- **RES**: Relative Effort Score - Điểm nỗ lực tương đối
- **Hexagon / Hex**: Ô lục giác trên bản đồ
- **District**: Quận/huyện
- **Clan/Guild**: Bang hội
- **Boss Raid**: Chiến dịch đánh Boss tập thể
- **Supply Station**: Trạm tiếp tế (cửa hàng đối tác)
- **HQ**: Headquarters - Căn cứ chính của Clan
- **MAU**: Monthly Active Users
- **DAU**: Daily Active Users
- **ARPU**: Average Revenue Per User
- **MRR**: Monthly Recurring Revenue

---

## 9. APPROVAL SIGN-OFF

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Manager | [Your Name] | _________ | 2025-11-21 |
| Engineering Lead | _________ | _________ | _________ |
| Design Lead | _________ | _________ | _________ |
| QA Lead | _________ | _________ | _________ |
| Business Stakeholder | _________ | _________ | _________ |

---

**END OF PRD**

---

## Next Steps:
1. **Review & Feedback**: Share with stakeholders for input
2. **Prioritization**: Finalize feature priority with Engineering
3. **Design Kickoff**: Hand off to Design team for mockups
4. **Tech Spec**: Engineering to write technical specification
5. **Sprint Planning**: Break down into 2-week sprints

**Contact:**
For questions or clarifications, contact: [Product Manager Email]
