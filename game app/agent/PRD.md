# MASTER PRODUCT REQUIREMENTS DOCUMENT (PRD) - TERRARUN

## MỤC LỤC
1. [Tầm Nhìn & Nguyên Tắc](#1-tầm-nhìn--nguyên-tắc)
2. [Cơ Chế Kỹ Thuật Cốt Lõi](#2-cơ-chế-kỹ-thuật-cốt-lõi)
3. [Tính Năng Gameplay](#3-tính-năng-gameplay)
4. [Quy Tắc Nghiệp Vụ & Kinh Tế](#4-quy-tắc-nghiệp-vụ--kinh-tế)
5. [Chiến Lược Sinh Tồn Startup](#5-chiến-lược-sinh-tồn-startup)

---

## 1. TẦM NHÌN & NGUYÊN TẮC
* **Vision:** Biến thành phố thực thành bàn cờ MMO Real-world.
* **Core Philosophy:**
    * **Fairness:** Chống gian lận là ưu tiên số 1.
    * **Offline-First:** Mất mạng là trạng thái bình thường. Hệ thống phải hoạt động local-first.
    * **Instant Gratification:** Phản hồi UI tức thì (<100ms) trước khi chờ Server.

## 2. CƠ CHẾ KỸ THUẬT CỐT LÕI
### A. Hệ Thống Đồng Bộ (Sync Engine)
* **Input:** Strava, Garmin, HealthKit (qua Webhook hoặc API).
* **Idempotency Rule:** BẮT BUỘC kiểm tra `activity_id` để tránh duplicate data.
* **Normalization:** 1km Chạy = 3km Đạp = 300m Bơi = 100 Energy.

### B. Bản Đồ Lục Giác (Hexagon Grid)
* **Standard:** Uber H3 Index.
* **Resolution:** Level 9 (Cạnh ~174m, Diện tích ~0.1km²).
* **States:**
    * `FOG`: Chưa khám phá (Client-side only).
    * `NEUTRAL`: Trống.
    * `OCCUPIED`: Đã chiếm (User/Bot).
    * `LOCKED`: Đang tranh chấp (Khóa 5 phút).

### C. Bảo Mật & Anti-Cheat
* **Layer 1:** Device Check (Jailbreak/Root detection).
* **Layer 2:** Speed Limit (Run < 30km/h, Bike < 50km/h).
* **Layer 3:** Teleport Check (Khoảng cách > 100m trong 1s -> Flag).

## 3. TÍNH NĂNG GAMEPLAY
### A. Chế độ chơi
* **PvP (Territory War):** So sánh tổng điểm tích lũy tại ô H3. Winner takes all.
* **PvE (Boss Raid):** Boss xuất hiện theo mùa. Máu Boss Dynamic theo số lượng Active User.
* **O2O (Hunt-to-Earn):** Check-in tại toạ độ GPS cửa hàng đối tác để nhận Voucher.

### B. Hệ thống Bot (Ghost Bots)
* **Mục đích:** Chống hiệu ứng "Sa mạc" (Map trống).
* **Hành vi:** Bot chiếm đất ngẫu nhiên, tự động nhường đất (Def = 0) khi User thật tấn công.

## 4. QUY TẮC NGHIỆP VỤ & KINH TẾ
* **Economy:**
    * **Daily Cap:** Max 2000 Energy/ngày (Chống lạm phát).
    * **Decay (Hao mòn):** Điểm ô đất giảm 10%/ngày.
* **Timezone:** Database lưu UTC. Client hiển thị Local Time.

## 5. CHIẾN LƯỢC SINH TỒN STARTUP
* **Shadow Ban:** User gian lận vẫn chơi bình thường, nhưng data không được tính vào Leaderboard/Map Global.
* **Graceful Degradation:** Nếu Server Map sập, App vẫn cho phép chạy và lưu tracklog local.