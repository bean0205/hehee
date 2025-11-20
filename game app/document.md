Đây là bản tài liệu **hoàn chỉnh và chi tiết nhất**, đã được tổng hợp từ ý tưởng gốc của bạn và tích hợp các **nâng cấp chiến lược** (về cân bằng game, tâm lý học hành vi, bảo mật và mô hình kinh doanh) mà tôi đã phân tích.

Bạn có thể sử dụng ngay bản này để trình bày (Pitching) cho nhà đầu tư hoặc chuyển cho đội ngũ Product/Tech để bắt đầu xây dựng.

---

# PROJECT: TERRARUN / URBAN LEGENDS
**Thể loại:** Real-world Strategy MMO (Massively Multiplayer Online) & Health Gamification.

> **Sứ mệnh:** Biến thành phố thực thành một bàn cờ chiến thuật khổng lồ. Nơi mỗi giọt mồ hôi là tài nguyên, mỗi bước chân là hành động chinh phục, kết nối thế giới vật lý (Offline) với thế giới số (Online).

> **Cốt truyện (Lore):** *Năm 20XX, một làn sương mù kỹ thuật số (Digital Fog) bao phủ các thành phố, khiến con người trở nên thụ động và rời rạc. Bạn là những "Run-Walker" – những chiến binh vận động, sử dụng năng lượng sinh học để xua tan sương mù, tái chiếm lãnh thổ và kết nối lại nền văn minh.*

---

## PHẦN 1: CORE ENGINE - NỀN TẢNG KỸ THUẬT & CÂN BẰNG
*Trái tim của hệ thống, đảm bảo tính công bằng và gây nghiện.*

### 1. Hexagon Grid System (Bàn cờ sống)
* **Cấu trúc:** Bản đồ thực tế (Google/Mapbox) được chia thành lưới lục giác (bán kính 200m - 500m).
* **Trạng thái Ô:**
    * *Sương mù:* Chưa ai chạy qua.
    * *Trung lập:* Đã khám phá nhưng chưa ai chiếm.
    * *Chiếm đóng:* Mang màu cờ của Team/User (Có cờ hiệu ảo cắm ở giữa).
* **Cơ chế "Độ bền" (Decay Rate):** Một ô đất không thuộc về ai mãi mãi. Nếu trong **7 ngày** không có thành viên phe sở hữu chạy qua để "bảo trì", ô đất sẽ mất dần điểm phòng thủ và trở về trạng thái Trung lập. -> *Buộc người dùng duy trì thói quen chạy.*
* **Tài nguyên Địa hình:**
    * *Ô Đường phố:* +Speed (Tốc độ tích điểm).
    * *Ô Công viên/Hồ:* +Recovery (Hồi máu cho nhân vật).
    * *Ô Đồi dốc:* +Strength (x1.5 Kinh nghiệm).

### 2. Sync Engine & Hệ thống "Nỗ lực tương đối" (Fair Play)
* **Đồng bộ:** Strava, Garmin, Coros, Apple Health, Google Fit.
* **Quy đổi điểm công bằng (Relative Effort Score - RES):**
    * Thay vì chỉ tính Pace/Km (lợi cho người khỏe sẵn), hệ thống tính điểm dựa trên **Vùng nhịp tim (Heart Rate Zones)**.
    * *Ví dụ:* Một người béo chạy Pace 8 ở Zone 4 (Nỗ lực cao) sẽ nhận điểm ngang bằng một VĐV chạy Pace 4 ở Zone 2 (Chạy nhẹ).
    * *Tác dụng:* Khuyến khích nỗ lực cá nhân, ai cũng có thể đóng góp cho team.

### 3. Bảo mật & Chống gian lận (Safety First)
* **Privacy Zones (Vùng an toàn):** Người dùng cài đặt vùng quanh nhà/cơ quan (bán kính 500m). Tracklog trong vùng này vẫn tính điểm nhưng **ẨN** trên bản đồ công khai để bảo vệ sự riêng tư.
* **AI Anti-Cheat:** Phát hiện xe máy/ô tô qua Pace, Cadence và phân tích độ rung của thiết bị (Device sensors).

---

## PHẦN 2: B2B - CORP RACE (GIẢI PHÁP VĂN HÓA DOANH NGHIỆP)
*Biến KPI sức khỏe thành cuộc chiến sinh tồn hấp dẫn.*

### 1. Class System (Phân vai chiến thuật)
Để ai cũng quan trọng, không ai bị bỏ lại:
* **🏃 Runner (Bộ binh):**
    * *Sở trường:* Tốc độ trung bình, quãng đường trung bình.
    * *Nhiệm vụ:* Gây sát thương chính (DPS) lên Boss. Chiếm đất.
* **🚴 Cyclist (Kỵ binh):**
    * *Sở trường:* Đi rất xa, tốc độ cao.
    * *Nhiệm vụ:* Mở bản đồ (Scout), phá giáp (Armor Break) của Boss để Runner đánh vào máu. Vận chuyển tài nguyên giữa các Pháo đài.
* **🚶 Walker (Hậu cần/Support):**
    * *Sở trường:* Đi bộ, kiên trì.
    * *Nhiệm vụ:* Thu thập "Bình năng lượng". Cứ 2000 bước chân tạo ra 1 vật phẩm Buff (Hồi sức/Tăng điểm) cho Runner và Cyclist.

### 2. Boss Raid & Chiến dịch (Campaign)
* **Kẻ thù chung (Common Enemy):** Thay vì đấu đá nội bộ, cả công ty hợp sức đánh Boss "KPI Cuối Năm" hoặc "Boss Deadline".
    * Boss có lượng máu = 10.000 km (Tổng quãng đường cả công ty phải chạy trong 1 tháng).
    * **Critical Hit:** Chạy vào giờ sáng sớm (5AM - 6AM) hoặc trời mưa gây x2 sát thương lên Boss.
* **Pháo đài (Stronghold):** Các địa điểm như Văn phòng chi nhánh, Quán Cafe đối tác. Team nào chiếm được sẽ nhận Buff x2 điểm thưởng toàn server trong 24h.

### 3. HR Dashboard & Đổi thưởng
* **Biểu đồ Burnout:** Cảnh báo nhân sự tập luyện quá sức hoặc thức khuya (dựa trên dữ liệu ngủ/tập).
* **Sàn đấu giá ngược:** Dùng điểm đổi ngày nghỉ phép, vé đi muộn, hoặc suất ăn trưa miễn phí.

---

## PHẦN 3: B2C - URBAN LEGENDS (THẾ GIỚI MỞ MMO)
*Game hóa đời thực, kết nối cộng đồng (Social-Fi).*

### 1. Đại chiến Quận (District Domination)
* **Local Pride:** Người chơi tự động thuộc về Quận nơi họ sinh sống/hay chạy.
* **Mùa giải (Season - 30 ngày):**
    * Quận có tổng điểm cao nhất sẽ "nhuộm màu" bản đồ thành phố trong 1 tuần.
    * **Thị trưởng ảo (Mayor):** Top 1 user của Quận được vinh danh, Avatar xuất hiện trên trang chủ của mọi user trong quận.
* **Clan/Guild:** Người dùng tự lập Bang hội. Có tính năng **"Xây căn cứ"**: Chọn 1 quán cafe làm nhà chính, chạy quanh đó để nâng cấp nhà, mở rộng tầm kiểm soát.

### 2. Tính năng AR & Sự kiện động (Dynamic Events)
* **Săn rương AR (Hunt-to-Earn):** Đến tọa độ GPS chỉ định, bật Camera điện thoại để thấy Rương báu/Quái vật ảo. Tương tác để nhận Voucher/Vật phẩm.
* **Sự kiện ngẫu nhiên:**
    * *Cơn mưa vàng:* "Trong 1 giờ tới, khu vực Công viên Thống Nhất x3 điểm thưởng". -> Kéo traffic thực tế về một điểm.
    * *Bóng ma (Ghost):* Xuất hiện ngẫu nhiên, user phải đuổi theo (chạy nhanh hơn pace quy định) để bắt và nhận quà.

### 3. RPG Progression (Nhập vai)
* **Avatar 3D:** Tiến hóa ngoại hình (Gầy -> Fit -> Cơ bắp -> Cyborg) theo số Km tích lũy trọn đời.
* **Skill Tree:**
    * *Explorer:* Tăng khả năng phát hiện rương báu từ xa.
    * *Speedster:* Tăng điểm thưởng khi chạy pace cao.
    * *Socializer:* Tăng điểm khi chạy cùng nhóm (Squad).
* **Di sản (Legacy):** Cho phép user trồng cây ảo/đặt bia đá tại những cung đường họ chạy qua nhiều nhất. Sau 1 năm nhìn lại thấy "rừng cây" của chính mình.

---

## PHẦN 4: MÔ HÌNH KINH DOANH (REVENUE STREAMS)

1.  **B2B SaaS (Cash Cow):**
    * Thu phí doanh nghiệp theo User/Tháng để tổ chức giải chạy nội bộ & dùng HR Dashboard.
    * Gói Premium: Thiết kế Boss/Item riêng theo nhận diện thương hiệu công ty.
2.  **O2O Partnership (Location-Based Ads):**
    * Các cửa hàng (F&B, Retail) trả phí để biến cửa hàng thành **"Trạm tiếp tế" (Supply Station)** trong game.
    * User chạy đến đó check-in để nhận vật phẩm game -> Nhận Voucher thật -> Mua hàng thật.
3.  **B2C In-App Purchase:**
    * Bán Skin (Giày ảo, Áo ảo, Hiệu ứng vệt sáng sau lưng khi chạy).
    * Bán Battle Pass (Vé tham gia mùa giải cao cấp với phần thưởng lớn).
4.  **Health Finance (New):**
    * Hợp tác với công ty Bảo hiểm. User có "Điểm uy tín sức khỏe" cao (Chạy đều) được giảm phí mua bảo hiểm thực tế. App nhận hoa hồng từ hợp đồng.

---
