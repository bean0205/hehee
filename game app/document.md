Dưới đây là bản tài liệu đã được định dạng chuẩn **Markdown (`.md`)**. Bạn có thể copy nội dung này và dán trực tiếp vào **Notion, Obsidian, GitHub Readme, Trello** hoặc các công cụ quản lý dự án khác để hiển thị đẹp mắt.

---

# TÊN DỰ ÁN (DỰ KIẾN): TERRARUN / URBAN LEGENDS

> **Tầm nhìn:** Biến thành phố thực thành một bàn cờ chiến thuật khổng lồ (MMO Real-world Game), nơi mỗi bước chân là một nước đi, kết nối sức khỏe với niềm vui và lợi ích thực tế.

---

## PHẦN 1: NỀN TẢNG KỸ THUẬT CỐT LÕI (CORE FOUNDATION)
*Các tính năng dùng chung cho cả B2B và B2C.*

### 1. Đa nền tảng & Đồng bộ (Sync Engine)
* **Chức năng:** Tự động đồng bộ dữ liệu (Activity) từ các nền tảng phổ biến: Strava, Garmin, Coros, Apple Health, Google Fit.
* **Quy đổi:** Hệ thống tự động quy đổi các môn khác nhau về cùng một đơn vị điểm (Point/Energy).
    * *Ví dụ:* 3km Đạp xe = 1km Chạy bộ = 300m Bơi lội.

### 2. Bản đồ Lục giác (Hexagon Grid Map)
* **Hiển thị:** Phủ một lớp lưới lục giác lên bản đồ thực tế (Google Maps/Mapbox).
* **Kích thước:** Mỗi ô có bán kính 200m - 500m (tùy chỉnh theo mật độ dân cư).
* **Trạng thái ô:** Trống (Sương mù) / Đang tranh chấp / Đã chiếm đóng (Hiển thị màu cờ).

### 3. Hệ thống Chống gian lận (AI Anti-Cheat)
* **Pace Limit:** Tự động loại bỏ tracklog có tốc độ bất thường (xe máy, ô tô).
* **Cadence Check:** Phân tích nhịp bước chân. Nếu Pace cao mà Cadence thấp/không có -> Cảnh báo gian lận.
* **Device Fingerprint:** Chặn việc 1 thiết bị upload dữ liệu cho nhiều tài khoản khác nhau để "cày" giải.

---

## PHẦN 2: B2B - GIẢI PHÁP DOANH NGHIỆP (CORP RACE)
*Mục tiêu: Team Building, Văn hóa doanh nghiệp, Quản trị sức khỏe nhân sự.*

### 1. Gameplay Chiến thuật (PvE & PvP)
* **Chiến trường Lục giác (Nội bộ):**
    * **Chia phe:** Theo Phòng ban (Ví dụ: Team Sale vs Team Tech).
    * **Cơ chế Sương mù (Fog of War):** Khu vực chưa ai chạy qua bị che phủ. Team nào khai phá đầu tiên nhận Bonus điểm.
    * **Pháo đài (Stronghold):** Các điểm mốc quan trọng (Công viên, Hồ). Chiếm được sẽ nhân đôi (x2) điểm cho cả team trong 24h.
* **Săn Boss Thế giới (Boss Raid):**
    * **Concept:** Tạo Boss theo mùa/sự kiện (Boss "Deadline", Boss "Mỡ Bụng").
    * **Lớp nhân vật (Class):**
        * *Runner:* Damage chính.
        * *Cyclist:* Damage nhanh.
        * *Walker:* Hồi máu/Buff cho team (dành cho người yếu/đi bộ).
    * **Bạo kích (Critical Hit):** Chạy lúc trời mưa hoặc sáng sớm (4-5h sáng) gây sát thương x2 lên Boss (Tích hợp Weather API).
* **Thẻ bài Chiến thuật (Item Shop):**
    * Dùng điểm chạy để mua thẻ.
    * **Thẻ Khiên:** Bảo vệ ô đất không bị chiếm.
    * **Thẻ Mìn (Trap):** Trừ 50% thành tích đối thủ chạy qua ô đó.
    * **Thẻ Copy:** Sao chép thành tích của người giỏi nhất team (1 lần/tháng).

### 2. Social & Gắn kết
* **Đồng đội ảo (Ghost Pacer):** Chế độ "Chạy cùng Sếp". Nghe giọng nói cổ vũ hoặc thách thức từ lãnh đạo khi chạy.
* **Biệt đội (Squad Mode):** Nhóm nhỏ 4 người cùng cam kết. Cả 4 hoàn thành mục tiêu -> Nhận thưởng lớn. 1 người bỏ cuộc -> Cả nhóm mất quà (Áp lực tích cực).
* **Newsfeed Sống ảo:**
    * Khung ảnh (Frame) độc quyền của công ty.
    * Nút "Kudos" tùy chỉnh (Mời cafe, Trâu bò quá...).
    * Voice Comment (Bình luận bằng giọng nói).

### 3. Quản trị & Đổi thưởng (HR Tools)
* **Sàn giao dịch (Rewards Marketplace):**
    * **Tiền tệ:** SweatCoin (Do chạy) & Diamond (Do công ty cấp).
    * **Cơ chế:** Đấu giá ngược các món quà giá trị (Apple Watch).
    * **Đổi phép:** Dùng SweatCoin đổi giờ đi muộn/về sớm.
* **HR Dashboard:** Biểu đồ sức khỏe toàn công ty, cảnh báo nhân viên có dấu hiệu Burnout (tập quá khuya), phát hiện nhân tài kỷ luật cao.

---

## PHẦN 3: B2C - CỘNG ĐỒNG NGƯỜI DÙNG (URBAN LEGENDS)
*Mục tiêu: Tăng trưởng người dùng (Growth), Viral, Doanh thu quảng cáo/bán vật phẩm.*

### 1. Hệ thống Thế giới mở (Open World MMO)
* **Đại chiến Quận/Huyện (District Battle):**
    * Tự động phân loại user vào Team Quận dựa trên vị trí hay chạy.
    * Bảng xếp hạng các Quận hàng tháng. Quận vô địch được "nhuộm màu" bản đồ thành phố.
    * *Mục đích:* Đánh vào lòng tự hào địa phương (Local Pride).
* **Gia tộc (Clan/Guild):**
    * Người dùng tự lập nhóm chạy (Run Club).
    * **Xây căn cứ (Base Building):** Chọn 1 địa điểm làm nhà chính, chạy quanh đó để nâng cấp.
    * **Công thành chiến:** Clan này chạy sang địa bàn Clan kia để cướp cờ/phá hủy công trình ảo.

### 2. Săn quà thực tế (Hunt-to-Earn / O2O)
* **Check-in nhận quà (Sponsored Checkpoints):**
    * Hợp tác với các nhãn hàng (Highlands, Circle K...).
    * Hộp quà xuất hiện tại cửa hàng đối tác trên bản đồ.
    * **Luật chơi:** User phải chạy đến tận nơi mới mở được quà (Voucher/Discount).
* **Rương báu ngẫu nhiên (Random Loot):** Rải rác trên đường chạy (Hồ Tây, Sala). Nhặt được vật phẩm game hoặc mảnh ghép đổi quà thật.

### 3. Nhập vai & Cá nhân hóa (RPG Progression)
* **Avatar tiến hóa:** Nhân vật thay đổi ngoại hình từ Gầy -> Cơ bắp -> Siêu nhân theo số km tích lũy.
* **Trang phục (Skins):** Mua quần áo, giày, xe đạp ảo để làm đẹp và khoe (Flex).
* **Cây kỹ năng (Skill Tree):**
    * Nhánh Speedster (Tốc độ).
    * Nhánh Tanker (Sức bền/Ultra).
    * Nhánh Explorer (Thám hiểm đường mới).

### 4. Kết nối Chiều sâu
* **Thách đấu bóng ma (Race against Ghost):** Chạy đua với dữ liệu lịch sử của bản thân hoặc người khác hiển thị dạng AR/Map.
* **Lời nhắn địa điểm (Location Notes):** Ghim tin nhắn tại toạ độ GPS (Review quán nước, cảnh báo chó dữ, động viên ở dốc cao). Người sau chạy tới mới đọc được.

---

## PHẦN 4: MÔ HÌNH DOANH THU (MONETIZATION) "KIỀNG 3 CHÂN"

1.  **B2B (Doanh nghiệp):** Thu phí SaaS (Software as a Service) theo năm hoặc theo quy mô nhân sự (Per user/month) để tổ chức giải đấu và dùng Dashboard HR.
2.  **B2C (Người dùng lẻ):** Freemium. Miễn phí chơi cơ bản. Thu phí bán vật phẩm ảo (Skin, Thẻ bài), vé tham gia các giải chạy Online đặc biệt (Premium Race).
3.  **Partnership (Đối tác/Merchant):** Thu phí quảng cáo theo địa điểm (LBS Ads). Các cửa hàng trả tiền để đặt "Hộp quà Voucher" tại quán của họ nhằm kéo người chạy bộ tới mua nước/đồ ăn.

---

## Lời khuyên triển khai (Next Step)
*Để bắt đầu, bạn không nên xây dựng tất cả cùng lúc. Hãy đi theo lộ trình MVP (Minimum Viable Product):*

* **Tháng 1-3:** Xây dựng Core (Sync Strava + Map Hexagon đơn giản) + B2B Feature (Săn Boss cơ bản). Bán cho 3 công ty khách hàng đầu tiên.
* **Tháng 4-6:** Hoàn thiện Anti-Cheat và ra mắt B2C Feature (Đại chiến Quận) để viral cộng đồng.
* **Tháng 7+:** Tích hợp Voucher/Check-in để kiếm tiền từ đối tác thứ 3.