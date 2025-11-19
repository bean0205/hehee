#!/bin/bash
# ==============================================
# PinYourWord Backend - Setup & Run Script
# ==============================================

set -e  # Exit on error

echo "🚀 PinYourWord Backend - Setup Script"
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Java version
echo ""
echo "📋 Checking prerequisites..."
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java not found. Please install Java 17+${NC}"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo -e "${RED}❌ Java version must be 17 or higher. Current: $JAVA_VERSION${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Java version: $JAVA_VERSION${NC}"

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven not found. Please install Maven 3.8+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Maven found${NC}"

# Check PostgreSQL
echo ""
echo "📦 Checking PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  psql not found. Make sure PostgreSQL is installed and running.${NC}"
else
    echo -e "${GREEN}✅ PostgreSQL client found${NC}"
fi

# Check .env file
echo ""
echo "🔑 Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env with your credentials before running!${NC}"
    exit 1
else
    echo -e "${GREEN}✅ .env file found${NC}"
fi

# Load .env
export $(cat .env | grep -v '^#' | xargs)

# Check database connection
echo ""
echo "🗄️  Checking database connection..."
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not set in .env${NC}"
    exit 1
fi

# Extract DB details from JDBC URL
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*\/\/\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "Database: $DB_NAME @ $DB_HOST:$DB_PORT"

# Test database connection (optional - comment out if DB is remote)
# if ! PGPASSWORD=$DATABASE_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DATABASE_USERNAME -d $DB_NAME -c '\q' 2>/dev/null; then
#     echo -e "${YELLOW}⚠️  Could not connect to database. Make sure it's running.${NC}"
# else
#     echo -e "${GREEN}✅ Database connection successful${NC}"
# fi

# Check JWT secret
if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" == "your-secret-key-minimum-256-bits-long-for-hs256" ]; then
    echo -e "${RED}❌ JWT_SECRET not set or using default value!${NC}"
    echo -e "${YELLOW}Generate a secure secret: openssl rand -base64 32${NC}"
    exit 1
fi
echo -e "${GREEN}✅ JWT_SECRET configured${NC}"

# Clean and build
echo ""
echo "🔨 Building project..."
mvn clean install -DskipTests

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Ask to run
echo ""
read -p "🚀 Do you want to run the application now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting PinYourWord Backend..."
    echo "📝 Logs will appear below..."
    echo "🌐 Swagger UI: http://localhost:${SERVER_PORT:-8080}/api/swagger-ui.html"
    echo "🛑 Press Ctrl+C to stop"
    echo ""

    mvn spring-boot:run
fi
