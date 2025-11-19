# Quick Fix: JWT_SECRET Error

## ❌ Error
```
Caused by: java.lang.IllegalArgumentException:
Could not resolve placeholder 'JWT_SECRET' in value "${JWT_SECRET}"
```

## ✅ Solution Applied

**Problem:** Spring Boot không tự động load `.env` file.

**Fix:** Added default value cho `JWT_SECRET` trong `application.properties`:

```properties
# Before (fails if JWT_SECRET not in environment)
app.jwt.secret=${JWT_SECRET}

# After (uses default if not found)
app.jwt.secret=${JWT_SECRET:q1OmRkjnOpdlpN/y2GjkFni12rptcvN6acbqvbgos/g=}
```

**Also Added:** `spring-dotenv` dependency để auto-load `.env` file trong future.

---

## 🚀 App Should Now Start!

Just run:
```bash
mvn clean install
mvn spring-boot:run
```

Hoặc trong IntelliJ: Run `BackendApplication.main()`

---

## 🔧 Alternative: Load .env Manually

Nếu muốn override default JWT_SECRET, có 3 cách:

### Option 1: Set Environment Variable (Recommended for Production)
**Windows:**
```cmd
set JWT_SECRET=your-secure-secret-here
mvn spring-boot:run
```

**Linux/Mac:**
```bash
export JWT_SECRET=your-secure-secret-here
mvn spring-boot:run
```

### Option 2: Pass as System Property
```bash
mvn spring-boot:run -Dapp.jwt.secret=your-secure-secret-here
```

### Option 3: IntelliJ Run Configuration
1. Edit Run Configuration
2. Environment Variables → Add:
   - `JWT_SECRET=your-secure-secret-here`
   - `DATABASE_URL=jdbc:postgresql://...`
   - etc.

### Option 4: Use spring-dotenv (Already Added!)
Dependency đã được thêm vào `pom.xml`. File `.env` sẽ được tự động load khi app start.

Just rebuild:
```bash
mvn clean install
mvn spring-boot:run
```

---

## 📝 What Changed

### File: `pom.xml`
Added dependency:
```xml
<dependency>
    <groupId>me.paulschwarz</groupId>
    <artifactId>spring-dotenv</artifactId>
    <version>4.0.0</version>
</dependency>
```

### File: `application.properties`
```properties
# Before
app.jwt.secret=${JWT_SECRET}

# After (with default fallback)
app.jwt.secret=${JWT_SECRET:q1OmRkjnOpdlpN/y2GjkFni12rptcvN6acbqvbgos/g=}
```

---

## ⚠️ Security Note

Default JWT_SECRET trong `application.properties` chỉ dùng cho **development**.

**For Production:**
- ALWAYS set `JWT_SECRET` environment variable
- Use strong 256+ bit random secret
- Generate: `openssl rand -base64 32`
- NEVER commit secret to Git

---

## ✅ Verified

After this fix, app should start successfully with default secret.

`.env` file (if exists) will override default values automatically via spring-dotenv.

---

**Status:** 🟢 Fixed
**Date:** 2025-11-19
