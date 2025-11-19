@echo off
REM ==============================================
REM PinYourWord Backend - Setup & Run Script (Windows)
REM ==============================================

echo.
echo ======================================
echo    PinYourWord Backend - Setup
echo ======================================
echo.

REM Check Java
echo [1/5] Checking Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java not found. Please install Java 17+
    pause
    exit /b 1
)
echo [OK] Java found

REM Check Maven
echo.
echo [2/5] Checking Maven...
mvn -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Maven not found. Please install Maven 3.8+
    pause
    exit /b 1
)
echo [OK] Maven found

REM Check .env file
echo.
echo [3/5] Checking .env file...
if not exist ".env" (
    echo [WARNING] .env file not found!
    echo [INFO] Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo [ACTION REQUIRED] Please edit .env with your credentials
    echo Then run this script again.
    pause
    exit /b 1
)
echo [OK] .env file exists

REM Clean and build
echo.
echo [4/5] Building project...
echo This may take a few minutes...
echo.
call mvn clean install -DskipTests

if errorlevel 1 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo [OK] Build successful!

REM Run application
echo.
echo [5/5] Starting application...
echo.
echo ======================================
echo   Application Starting
echo ======================================
echo.
echo Swagger UI: http://localhost:8080/api/swagger-ui.html
echo API Docs:   http://localhost:8080/api/v3/api-docs
echo.
echo Press Ctrl+C to stop the server
echo.

call mvn spring-boot:run

pause
