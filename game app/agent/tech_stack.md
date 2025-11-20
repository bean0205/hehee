# TECH STACK SPECIFICATION - TERRARUN (SOLO ARCHITECT)

## MỤC LỤC
1. [Frontend (Mobile)](#1-frontend-mobile)
2. [Backend (Server)](#2-backend-server)
3. [Infrastructure (DevOps)](#3-infrastructure-devops)
4. [Core Libraries](#4-core-libraries)

---

## 1. FRONTEND (MOBILE)
* **Framework:** Flutter (Dart 3.0+).
* **Architecture:** Feature-first Layered Architecture (Presentation, Domain, Data).
* **Maps:** `mapbox_maps_flutter` (Vector Tiles). **CẤM dùng Google Maps SDK**.
* **State Management:** `flutter_riverpod` + `freezed` (Immutable state).
* **Local Storage:** `drift` (SQLite) cho Game Data, `hive` cho Settings.
* **Network:** `dio` + `retry` interceptor + `connectivity_plus`.

## 2. BACKEND (SERVER)
* **Framework:** NestJS (Modular Monolith).
* **Language:** TypeScript (Strict Mode).
* **Database:** PostgreSQL 16 + **PostGIS 3.4** (Bắt buộc).
* **ORM:** TypeORM (Hỗ trợ Spatial Column tốt nhất).
* **Queue System:** BullMQ (Redis) -> BẮT BUỘC cho mọi tác vụ Ghi (Write).
* **Cache:** Redis (Geo commands & Leaderboard).

## 3. INFRASTRUCTURE (DEVOPS)
* **Server:** VPS (Hetzner/DigitalOcean) + Docker Compose. Tránh Serverless.
* **Image Storage:** Cloudflare R2 (S3 Compatible).
* **Monitoring:** GlitchTip (Self-hosted Sentry alternative).
* **CI/CD:** GitHub Actions (Lint -> Build Docker -> Deploy).

## 4. CORE LIBRARIES
* **Geospatial:** `h3-js` (Uber Hexagon), `turf` (Geo Utils).
* **Validation:** `class-validator`, `zod`.
* **Date:** `dayjs` (Lightweight).