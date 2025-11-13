# Authentication Module - Setup Guide

## 📋 Overview

Phần Authentication module đã được triển khai hoàn chỉnh dựa trên thiết kế database, bao gồm:

- ✅ Email/Password Registration & Login
- ✅ Social Login (Google & Apple) 
- ✅ JWT Token Authentication
- ✅ Profile Management
- ✅ Password Management
- ✅ Account Deletion (Soft Delete)
- ✅ Privacy Settings
- ✅ Username/Email Availability Check

## 🗂️ Project Structure

```
backend/
├── src/main/java/com/pinyourword/william/
│   ├── controller/
│   │   └── AuthController.java           # Auth endpoints
│   ├── dto/
│   │   ├── request/
│   │   │   ├── RegisterRequest.java      # Registration request
│   │   │   ├── LoginRequest.java         # Login request
│   │   │   ├── SocialLoginRequest.java   # Social login request
│   │   │   ├── UpdateProfileRequest.java # Update profile request
│   │   │   └── ChangePasswordRequest.java# Change password request
│   │   └── response/
│   │       └── AuthResponse.java         # Auth response with user info & token
│   ├── entity/
│   │   └── User.java                     # User entity
│   ├── exception/
│   │   ├── BadRequestException.java
│   │   ├── UnauthorizedException.java
│   │   ├── ResourceNotFoundException.java
│   │   ├── GlobalExceptionHandler.java
│   │   └── ErrorResponse.java
│   ├── repository/
│   │   └── UserRepository.java           # User data access
│   ├── security/
│   │   ├── JwtTokenProvider.java         # JWT token generation & validation
│   │   ├── JwtAuthenticationFilter.java  # JWT filter
│   │   └── SecurityConfig.java           # Security configuration
│   └── service/
│       └── AuthService.java              # Auth business logic
└── src/main/resources/
    ├── application.properties            # Configuration
    └── db/
        └── init-schema.sql               # Database initialization script
```

## 🚀 Quick Start

### 1. Database Setup

**Tạo database:**
```sql
CREATE DATABASE pinyourword;
```

**Chạy init script:**
```bash
psql -U postgres -d pinyourword -f src/main/resources/db/init-schema.sql
```

Hoặc chạy trực tiếp từ psql:
```sql
\i /path/to/backend/src/main/resources/db/init-schema.sql
```

### 2. Cấu hình Application

Cập nhật `application.properties`:
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/pinyourword
spring.datasource.username=postgres
spring.datasource.password=your_password

# JWT
app.jwt.secret=your-secret-key-minimum-256-bits-long-for-hs256-algorithm
app.jwt.expiration=86400000
```

### 3. Chạy Application

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Server sẽ chạy ở: `http://localhost:8080/api`

### 4. Test API với Swagger

Truy cập: `http://localhost:8080/api/swagger-ui.html`

## 📡 API Endpoints

### Public Endpoints (No Authentication Required)

#### 1. Register New User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Test@123",
  "username": "johndoe",
  "displayName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "username": "johndoe",
      "displayName": "John Doe",
      "profileVisibility": "public",
      "subscriptionStatus": "free",
      ...
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400
  }
}
```

#### 2. Login with Email/Username
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "emailOrUsername": "johndoe",  // or "user@example.com"
  "password": "Test@123"
}
```

#### 3. Social Login (Google/Apple)
```http
POST /api/v1/auth/social-login
Content-Type: application/json

{
  "provider": "GOOGLE",  // or "APPLE"
  "idToken": "google_id_token_here",
  "email": "user@gmail.com",
  "displayName": "John Doe",
  "avatarUrl": "https://..."
}
```

#### 4. Check Email Availability
```http
GET /api/v1/auth/check-email?email=test@example.com
```

**Response:**
```json
{
  "success": true,
  "data": {
    "available": true
  }
}
```

#### 5. Check Username Availability
```http
GET /api/v1/auth/check-username?username=johndoe
```

### Protected Endpoints (Require Authentication)

**Header Required:**
```
Authorization: Bearer <your_jwt_token>
```

#### 6. Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 7. Update Profile
```http
PUT /api/v1/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "John Updated",
  "bio": "Travel enthusiast",
  "avatarUrl": "https://...",
  "profileVisibility": "public",
  "notesVisibility": "followers",
  "bucketlistVisibility": "public"
}
```

#### 8. Change Password
```http
PUT /api/v1/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "Test@123",
  "newPassword": "NewTest@456"
}
```

#### 9. Delete Account (Soft Delete)
```http
DELETE /api/v1/auth/account
Authorization: Bearer <token>
```

## 🔐 Security Features

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Hashed using BCrypt

### Username Requirements
- 3-50 characters
- Only letters, numbers, and underscores
- Must be unique

### JWT Token
- Algorithm: HS256
- Expiration: 24 hours (configurable)
- Stored in `Authorization: Bearer <token>` header

### Privacy Settings
- **Profile Visibility**: `public` | `private`
- **Notes Visibility**: `private` | `followers` | `public`
- **Bucket List Visibility**: `private` | `followers` | `public`

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123",
    "username": "testuser",
    "displayName": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "testuser",
    "password": "Test@123"
  }'
```

### Get Current User (with token)
```bash
curl -X GET http://localhost:8080/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    apple_id VARCHAR(255) UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(512),
    cover_url VARCHAR(512),
    visited_countries_count INT DEFAULT 0,
    visited_cities_count INT DEFAULT 0,
    total_pins_count INT DEFAULT 0,
    profile_visibility user_profile_visibility DEFAULT 'public',
    notes_visibility user_notes_visibility DEFAULT 'private',
    bucketlist_visibility user_bucketlist_visibility DEFAULT 'public',
    subscription_status user_subscription_status DEFAULT 'free',
    subscription_expires_at TIMESTAMPTZ NULL,
    deleted_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

## 🐛 Error Handling

### Validation Errors (400)
```json
{
  "timestamp": "2024-11-13T10:00:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "errors": {
    "email": "Email must be valid",
    "password": "Password must be at least 8 characters"
  }
}
```

### Authentication Errors (401)
```json
{
  "timestamp": "2024-11-13T10:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid credentials"
}
```

### Not Found Errors (404)
```json
{
  "timestamp": "2024-11-13T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "User not found with uuid: '...'"
}
```

## 📝 Next Steps

### TODO for Production:
1. ⚠️ **Implement actual Social Login verification**
   - Google: Verify idToken with Google API
   - Apple: Verify idToken with Apple API

2. 🔒 **Add Rate Limiting**
   - Prevent brute force attacks
   - Limit login attempts

3. 📧 **Email Verification**
   - Send verification email on registration
   - Verify email before allowing full access

4. 🔄 **Refresh Tokens**
   - Implement refresh token mechanism
   - Store refresh tokens securely

5. 🔑 **Password Reset**
   - Forgot password functionality
   - Reset via email link

6. 📊 **Logging & Monitoring**
   - Log authentication events
   - Monitor failed login attempts

7. 🧪 **Unit & Integration Tests**
   - Test all authentication flows
   - Test edge cases

## 🤝 Contributing

Nếu cần thêm tính năng hoặc có bug, vui lòng tạo issue hoặc pull request.

## 📄 License

MIT License
```
