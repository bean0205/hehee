# PinYourWord Backend - Setup Guide

## 🎯 Prerequisites

### Required Software:
- **Java JDK 17+** (NOT JRE!) - [Download OpenJDK 17](https://adoptium.net/)
- **Maven 3.8+** - [Download Maven](https://maven.apache.org/download.cgi)
- **PostgreSQL 14+** with PostGIS - [Download PostgreSQL](https://www.postgresql.org/download/)
- **Git** - For version control

### Verify Installation:
```bash
# Java (must show JDK, not JRE)
java -version
# Should show: openjdk version "17.x.x" or similar

# Maven
mvn -version

# PostgreSQL
psql --version
```

---

## 📦 Database Setup

### 1. Install PostGIS Extension
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE pinyourword;

# Connect to database
\c pinyourword

# Enable extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# Verify PostGIS
SELECT PostGIS_version();

# Exit
\q
```

### 2. Run Migration
```bash
# From backend directory
psql -U postgres -d pinyourword -f src/main/resources/db/migration/V001__initial_schema.sql
```

**Expected output:**
```
CREATE EXTENSION
CREATE EXTENSION
CREATE TABLE
CREATE INDEX
...
(multiple CREATE statements)
```

### 3. Verify Schema
```bash
psql -U postgres -d pinyourword -c "\dt"
```

Should show tables: `users`, `pins`, `pin_media`, `activities`, etc.

---

## 🔑 Environment Configuration

### 1. Create .env File

**Windows:**
```cmd
copy .env.example .env
notepad .env
```

**Linux/Mac:**
```bash
cp .env.example .env
nano .env
```

### 2. Configure Required Variables

**CRITICAL - Must Change:**
```bash
# Generate secure JWT secret
openssl rand -base64 32

# Then set in .env:
JWT_SECRET=<paste-generated-secret-here>
```

**Database (if different from .env defaults):**
```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/pinyourword
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
```

**Optional - Can Skip for Now:**
```bash
# AWS S3 (for image upload - can skip in development)
AWS_S3_BUCKET=your-bucket
AWS_ACCESS_KEY=your-key
AWS_SECRET_KEY=your-secret

# Google Places API (for location autocomplete)
GOOGLE_PLACES_API_KEY=your-key

# Email (for notifications)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

---

## 🚀 Build & Run

### Option 1: Using Script (Recommended)

**Windows:**
```cmd
setup-and-run.bat
```

**Linux/Mac:**
```bash
chmod +x setup-and-run.sh
./setup-and-run.sh
```

### Option 2: Manual Steps

```bash
# 1. Clean and build
mvn clean install

# 2. Run application
mvn spring-boot:run

# Or with specific profile
mvn spring-boot:run -Dspring.profiles.active=local
```

### Verify Application Started:
```
🌐 Application: http://localhost:8080/api
📚 Swagger UI:  http://localhost:8080/api/swagger-ui.html
📖 API Docs:    http://localhost:8080/api/v3/api-docs
```

---

## ✅ Testing the API

### 1. Health Check
```bash
curl http://localhost:8080/api/v1/auth/check-email?email=test@example.com
```

Expected response:
```json
{
  "success": true,
  "data": {
    "available": true
  }
}
```

### 2. Register User
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test1234",
    "displayName": "Test User"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "user": {
      "uuid": "...",
      "email": "test@example.com",
      "username": "testuser"
    }
  }
}
```

### 3. Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "testuser",
    "password": "Test1234"
  }'
```

### 4. Create Pin (Authenticated)
```bash
# Use token from login response
curl -X POST http://localhost:8080/api/v1/pins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "placeName": "Hoan Kiem Lake",
    "latitude": 21.0285,
    "longitude": 105.8542,
    "addressFormatted": "Hanoi, Vietnam",
    "status": "visited",
    "notes": "Beautiful lake in the heart of Hanoi"
  }'
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "No compiler is provided in this environment"
**Cause:** Running on JRE instead of JDK

**Solution:**
```bash
# Download JDK 17 (NOT JRE)
https://adoptium.net/

# Set JAVA_HOME
# Windows:
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

# Linux/Mac:
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export PATH=$JAVA_HOME/bin:$PATH
```

### Issue 2: "Connection refused" to PostgreSQL
**Cause:** PostgreSQL not running or wrong credentials

**Solution:**
```bash
# Check PostgreSQL status
# Windows:
sc query postgresql-x64-14

# Linux:
sudo systemctl status postgresql

# Start PostgreSQL if stopped
# Windows:
net start postgresql-x64-14

# Linux:
sudo systemctl start postgresql

# Verify connection
psql -U postgres -d pinyourword -c "SELECT 1"
```

### Issue 3: "JWT secret must be at least 256 bits"
**Cause:** JWT_SECRET in .env is too short or not set

**Solution:**
```bash
# Generate secure secret
openssl rand -base64 32

# Or use online generator:
https://generate-secret.vercel.app/32

# Update .env:
JWT_SECRET=<generated-secret>
```

### Issue 4: "Could not find or load main class"
**Cause:** Build failed or incomplete

**Solution:**
```bash
# Clean rebuild
mvn clean install -DskipTests

# If still fails, delete target directory
rm -rf target/
mvn clean install
```

### Issue 5: PostGIS functions not found
**Cause:** PostGIS extension not enabled

**Solution:**
```sql
-- Connect to database
psql -U postgres -d pinyourword

-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify
SELECT PostGIS_version();
```

---

## 📊 Development Tips

### Use Local Profile
Create `application-local.properties` (already created) and run:
```bash
mvn spring-boot:run -Dspring.profiles.active=local
```

### Enable Debug Logging
In `.env`:
```bash
LOG_LEVEL_APP=DEBUG
LOG_LEVEL_SQL=DEBUG
```

### Hot Reload (DevTools)
Already configured! Just save Java files and app will auto-reload.

### Test Spatial Queries
```sql
-- Find pins within 5km of Hanoi center
SELECT
    place_name,
    ST_Distance(location, ST_SetSRID(ST_MakePoint(105.8542, 21.0285), 4326)) as distance_meters
FROM pins
WHERE ST_DWithin(
    location,
    ST_SetSRID(ST_MakePoint(105.8542, 21.0285), 4326),
    5000
)
ORDER BY distance_meters;
```

---

## 🔒 Security Checklist Before Production

- [ ] Change JWT_SECRET to strong random value (256+ bits)
- [ ] Use production database with strong password
- [ ] Set `HIBERNATE_DDL_AUTO=none` (no auto schema changes)
- [ ] Set `JPA_SHOW_SQL=false` (don't log SQL in production)
- [ ] Configure CORS_ALLOWED_ORIGINS to your frontend domains only
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Setup rate limiting
- [ ] Configure logging to file/service
- [ ] Setup database backups
- [ ] Use environment-specific .env files

---

## 📚 Next Steps

1. ✅ Setup complete - Backend is running
2. 📱 Connect mobile app (update API_BASE_URL in mobile-app)
3. 🧪 Write integration tests
4. 📊 Add monitoring (Actuator + Prometheus)
5. 🚀 Deploy to cloud (AWS, GCP, Azure)

---

## 🆘 Need Help?

- **Documentation**: [README.md](README.md)
- **Improvements**: [IMPROVEMENTS.md](IMPROVEMENTS.md)
- **Database Queries**: [optimized_queries.sql](src/main/resources/db/queries/optimized_queries.sql)
- **API Docs**: http://localhost:8080/api/swagger-ui.html (when running)

---

**Last Updated:** 2025-11-19
**Status:** ✅ Ready for Development
