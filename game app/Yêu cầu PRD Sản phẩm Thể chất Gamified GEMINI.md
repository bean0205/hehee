

# **TÀI LIỆU YÊU CẦU SẢN PHẨM (PRD): NỀN TẢNG SỨC KHỎE DOANH NGHIỆP HEXA-FIT (V1.0)**

## **I. Product Overview (Tổng quan Sản phẩm)**

### **1.1. Mục tiêu và Định vị Sản phẩm (Product Vision & Positioning)**

Mục tiêu dài hạn của Hexa-Fit là trở thành nền tảng Quản lý Sức khỏe Doanh nghiệp (Corporate Wellness Management System) hàng đầu. Nền tảng này sử dụng cơ chế Game hóa dựa trên địa lý và các yếu tố RPG (Role-Playing Game) để tạo động lực tập luyện.1 Bằng cách chuyển đổi các thói quen tập luyện cá nhân thành sự gắn kết cộng đồng và thành tích nhóm có thể đo lường được, Hexa-Fit hướng tới việc giảm chi phí chăm sóc sức khỏe cho khách hàng doanh nghiệp và cải thiện năng suất lao động tổng thể.

Sản phẩm được định vị không chỉ là một ứng dụng theo dõi thể chất (Fitness Tracker) mà là một hệ thống B2B SaaS toàn diện. Đặc điểm khác biệt chính là sự tập trung vào **hệ thống tính điểm nỗ lực công bằng (Fair Effort Scoring \- FES)** và **tuân thủ nghiêm ngặt các quy định về bảo mật dữ liệu sức khỏe (Data Privacy Compliance)**, điều này là tối quan trọng đối với các khách hàng doanh nghiệp.1

### **1.2. Đối tượng Người dùng và Khách hàng (End-Users and Corporate Buyers)**

| Nhóm Người dùng | Nhu cầu Chính | Giá trị Cốt lõi |
| :---- | :---- | :---- |
| **End User (Employee/Athlete)** | Động lực, khả năng so sánh công bằng giữa các loại hình tập luyện, sự gắn kết xã hội và phần thưởng xứng đáng cho nỗ lực. | Fair Effort Score (FES), Boss Raid, Territory War, Guild/Clan Management. |
| **Corporate Buyer (HR Admin/Wellness Manager)** | Đo lường tỷ lệ tham gia (Participation Rates), tác động đến kết quả sức khỏe (Health Outcomes), và Báo cáo ROI tổng hợp.3 | HR Dashboard, Anonymized Reporting, Engagement Metrics. |
| **C-Level Executive** | Dữ liệu chiến lược về tác động văn hóa (Culture Change) và lợi ích tài chính (giảm chi phí vắng mặt/chăm sóc sức khỏe).4 | High-Level Executive Dashboard, ROI Metrics. |

### **1.3. Bối cảnh Kinh doanh và Giá trị Cung cấp (B2B Value Proposition)**

Hexa-Fit hoạt động theo mô hình **Freemium B2B**:

* **Free Tier (Core Platform):** Cung cấp các tính năng theo dõi hoạt động cơ bản, hồ sơ cá nhân, tính điểm nỗ lực FES, và hệ thống thành tích cá nhân (Achievement). Mục đích là thu hút người dùng cá nhân và chứng minh tính hiệu quả của FES.  
* **Premium B2B Subscription (Corporate Client):** Đây là nguồn doanh thu chính. Gói này mở khóa toàn bộ hệ sinh thái Game hóa nhóm (Guild/Clan), Chiến tranh Lãnh thổ (Territory War), cung cấp quyền truy cập vào HR Dashboard cho quản trị viên, và cung cấp các vật phẩm/phần thưởng độc quyền thông qua hệ thống **Battle Pass** hoặc Marketplace.5

## **II. Core Features List (Danh sách Tính năng Tổng thể)**

Dự án được chia thành 4 Module chính, được ưu tiên theo ma trận MoSCoW (Must Have, Should Have, Could Have).

Bảng 1: Danh sách Tính năng Hexa-Fit

| Module | Tên Tính năng | Độ Ưu tiên (MoSCoW) | Tham chiếu |
| :---- | :---- | :---- | :---- |
| **M1: Core Tracking & Foundation** | User Onboarding & Profile Management | Must Have |  |
|  | Wearable API Integration (Strava/Garmin/Apple Health/Google Fit) | Must Have | 7 |
|  | Unified Activity Scoring System (Fair Effort Score \- FES) | Must Have | 9 |
|  | Anti-Cheat & Integrity Layer (V1) | Must Have | 11 |
| **M2: Gamification Layer** | Achievement, Streaks, Levels, Skill Tree | Should Have | 1 |
|  | Guild/Clan Management & Resource Contribution | Should Have | 15 |
|  | Asynchronous Boss Raid Challenge | Should Have | 17 |
|  | Battle Pass & In-App Purchase (IAP) Framework | Could Have | 5 |
| **M3: Geo-location War Layer (V1)** | Hexagon Grid Map Rendering | Should Have | 19 |
|  | Territory Capture Mechanics (FES-based Influence) | Should Have | 20 |
|  | Geo-located AR Scavenger Hunt | Could Have | 22 |
| **M4: B2B Admin & Compliance** | Data Privacy & PHI/PII Masking Policy Enforcement | Must Have | 2 |
|  | Role-Based Access Control (RBAC) System | Must Have | 25 |
|  | Corporate HR/Executive Dashboard (Anonymized Reporting) | Should Have | 27 |

## **III. Detailed PRD: Core Platform & Tracking**

### **3.1. Wearable & API Integration Framework**

#### **Feature Goal**

Xây dựng một khung tích hợp API vững chắc, có khả năng mở rộng để kết nối bảo mật với các nền tảng sức khỏe phổ biến như Strava, Garmin Connect, Apple Health, và Google Fit.7 Mục tiêu là đảm bảo việc đồng bộ hóa dữ liệu hoạt động diễn ra liền mạch, cung cấp dữ liệu đầu vào kịp thời cho hệ thống FES.

#### **User Stories**

* As an Athlete, I want to securely connect my Strava account so that my running and cycling activities are automatically imported, saving me time from manual entry.  
* As an Athlete, I want the system to handle token refreshing automatically so that my data sync is not interrupted, ensuring continuous accrual of FES.8

#### **Business Rules**

1. **Authentication Protocol:** Bắt buộc phải sử dụng OAuth 2.0 (Authorization Code Grant Flow) cho tất cả các kết nối bên thứ ba để đảm bảo tuân thủ bảo mật và quyền ủy quyền người dùng.8  
2. **Token Management Lifecycle:**  
   * Hệ thống Backend (cụ thể là Integration Service) phải lưu trữ Access Token (có thời hạn ngắn, ví dụ: 6 giờ đối với Strava) và Refresh Token (có thời hạn dài hơn).  
   * Cần có một quy trình tự động (Worker Queue) để chủ động kiểm tra và gọi endpoint Refresh Token ngay khi Access Token hiện tại hết hạn hoặc sắp hết hạn (ví dụ: trong vòng 3,600 giây hoặc 1 giờ).8  
   * Mỗi lần làm mới thành công, Refresh Token mới sẽ được cấp. Hệ thống phải ghi đè và lưu trữ Refresh Token mới nhất vì Refresh Token cũ sẽ bị vô hiệu hóa ngay lập tức.8  
3. **Data Scope:** Cần yêu cầu quyền truy cập mở rộng (activity:read\_all hoặc tương đương) để truy xuất dữ liệu chi tiết về nhịp tim, GPS polyline, và các chỉ số cường độ khác, cần thiết cho việc tính toán FES.8  
4. **Supported Formats:** Hỗ trợ nhập và phân tích cú pháp dữ liệu hoạt động ở các định dạng chuẩn ngành như GPX, TCX, hoặc FIT để đảm bảo khả năng tương thích với nhiều thiết bị khác nhau.7

#### **Acceptance Criteria**

* AC\_3.1.1: Tích hợp OAuth 2.0 thành công với Strava/Garmin/Apple Health.  
* AC\_3.1.2: Dữ liệu hoạt động (bao gồm nhịp tim và GPS) được đồng bộ và phân tích cú pháp thành công trong vòng 5 phút sau khi hoạt động kết thúc trên thiết bị gốc.  
* AC\_3.1.3: Quá trình Refresh Token tự động diễn ra thành công mà không yêu cầu tương tác lại từ người dùng.

### **3.2. Unified Activity Scoring System (Fair Effort Score \- FES)**

#### **Feature Goal**

Thiết lập một chỉ số chuẩn hóa duy nhất, công bằng, cho phép so sánh nỗ lực thể chất giữa các cá nhân bất kể loại hình hoạt động (chạy bộ, đạp xe, gym) hay mức độ thể chất ban đầu của họ. FES sẽ là tiền tệ cốt lõi cho mọi cơ chế game hóa.

#### **User Stories**

* As an Athlete, I want my FES calculation to prioritize the intensity I put in (Heart Rate Zones) rather than absolute speed or distance, ensuring fair comparison with colleagues who are naturally faster.9  
* As an Athlete, I want the system to recognize when I improve and make subsequent workouts harder to earn maximum FES, maintaining motivation through adaptive challenge.29

#### **Business Rules (FES Calculation Approach)**

1. **Methodology:** FES sẽ được tính toán bằng cách sử dụng phương pháp **Weighted Sum Optimization** 30, kết hợp các tham số đầu vào khác nhau.  
2. **Core Components and Weighting:**  
   * **Intensity (Trọng số 40-50%):** Đây là yếu tố quyết định. Cường độ được đo chủ yếu bằng thời gian duy trì ở các Vùng Nhịp Tim cao (Zone 3, 4, 5\) hoặc thông qua chỉ số METs/Calorie Burn.9 Hoạt động cường độ càng cao, trọng số càng lớn.  
   * **Volume (Trọng số 25-35%):** Khối lượng hoạt động (bước, khoảng cách). Phải áp dụng **giới hạn trần (cap)** cho các hoạt động dễ "farm" như bước đi bộ (ví dụ: FES tối đa được tính ở 12,000 bước/ngày) để khuyến khích chất lượng thay vì số lượng đơn thuần.9  
   * **Personal Modifiers (Adaptive Scoring):** Áp dụng hệ số chuẩn hóa dựa trên các đặc điểm sinh lý (Tuổi, Giới tính, Cân nặng) 9 và một hệ số thích ứng (Adaptive Factor). Hệ số này điều chỉnh độ khó dựa trên lịch sử hoạt động và các Kỷ lục Cá nhân (PRs). Nếu người dùng liên tục đạt điểm cao, thuật toán phải nâng ngưỡng tối đa của họ để duy trì cảm giác thách thức, tương tự như các hệ thống học hỏi và thích ứng trong game hóa.29  
3. **Integrity Multiplier:** FES cuối cùng phải nhân với **Effort Integrity Multiplier (EIM)** (giá trị từ 0.0 đến 1.0) được cung cấp bởi Hệ thống Anti-Cheat (Mục 6.1). Nếu hoạt động bị Flag do gian lận, EIM sẽ giảm FES tương ứng, duy trì tính công bằng của hệ thống.11

Bảng 2: Cấu trúc Tính điểm Nỗ lực Chung (Fair Effort Score \- FES)

| Metric Category | Input Data Point | Conceptual Weighting | Strategic Rationale |
| :---- | :---- | :---- | :---- |
| **Intensity (I)** | HR Zone Minutes, VO2 Max, Calorie Burn | Highest (40-50%) | Đảm bảo tính công bằng (so sánh nỗ lực tương đối, không phải tuyệt đối). |
| **Volume (V)** | Steps, Duration, Distance | Moderate (25-35%) | Đặt giới hạn trần 12,000 bước/ngày để tập trung vào chất lượng. |
| **Adaptive/Personal (A)** | Age, Sex, Weight, Historical PRs | Dynamic Scaling Factor (10-25%) | Thuật toán học hỏi để giữ thách thức khi thể chất người dùng tiến bộ.29 |
| **Integrity (EIM)** | Anti-Cheat Flag Status (0.0 \- 1.0) | Multiplier (Hệ số nhân) | Giảm trừ điểm nếu phát hiện hành vi cố ý gian lận.11 |

#### **Acceptance Criteria**

* AC\_3.2.1: Thuật toán FES trả về điểm số nhất quán trên các hoạt động khác nhau (ví dụ: 30 phút chạy Zone 4 tương đương 45 phút đạp xe Zone 3).  
* AC\_3.2.2: Khi người dùng đánh giá RPE (Rate of Perceived Exertion) sau buổi tập, điểm RPE đó được ghi lại và dùng làm đầu vào cho mô hình thích ứng (Adaptive Scoring model).

## **IV. Detailed PRD: Gamification & Engagement Layer**

### **4.1. Asynchronous Boss Raid Challenge**

#### **Feature Goal**

Cung cấp một mục tiêu chung hàng ngày/hàng tuần cho Guild, nơi mọi hoạt động tập luyện cá nhân (FES) đều được chuyển đổi thành đóng góp có ý nghĩa (Damage Points).17

#### **Business Rules**

1. **Damage Conversion:** Công thức sát thương phải rõ ràng: $\\text{Damage} \= \\text{FES} \\times (\\text{Gear/Skill Multiplier})$. Multiplier được mở khóa thông qua hệ thống tiến trình Skill Tree 14 hoặc Battle Pass.5  
2. **Raid Duration and State:** Boss Raid phải có thời gian giới hạn (ví dụ: Boss hàng ngày là 24 giờ, Boss tuần là 7 ngày). Backend service phải duy trì trạng thái HP của Boss và chỉ chấp nhận Damage trong cửa sổ thời gian này.32  
3. **Reward Allocation:** Phần thưởng (Crystals, XP, Guild Resources) được phân phối theo ba tiêu chí:  
   * Thưởng chung khi Boss bị đánh bại.  
   * Thưởng xếp hạng cá nhân (ví dụ: Top 5 người gây sát thương cao nhất).  
   * Thưởng đóng góp Guild (dựa trên tổng FES cá nhân đóng góp trong kỳ Raid).  
4. **Boss Mechanics:** Các loại Boss có thể có cơ chế buff/debuff tạm thời để khuyến khích sự đa dạng trong hoạt động của thành viên Guild (ví dụ: Boss "The Sedentary" giảm Damage từ hoạt động tĩnh như Yoga, tăng Damage từ hoạt động ngoài trời).33

### **4.2. Guild/Clan Management System**

#### **Feature Goal**

Thúc đẩy trách nhiệm giải trình và lòng trung thành thông qua một cấu trúc nhóm chặt chẽ.

#### **Business Rules**

1. **Guild Structure and Size:** Guild có thể được tạo với yêu cầu chi phí ban đầu (Guild Resources). Giới hạn thành viên tối đa là 200 người, phù hợp với quy mô phòng ban hoặc đơn vị doanh nghiệp lớn.15  
2. **Resource Loop Mechanism:** FES cá nhân là đầu vào. 100% FES được chuyển thành XP cá nhân; một phần (ví dụ: 10%) được chuyển thành **Guild Resources**. Guild Resources này được sử dụng để:  
   * **Resource Sink:** "Nghiên cứu" (Research) để mở khóa các buff tạm thời (tăng Damage, tăng Defense Rating cho Territory War). Chi phí duy trì (Upkeep) hàng tuần cho Defense Rating sẽ đảm bảo nhu cầu đóng góp FES liên tục.15  
   * "Cống hiến" (Contribution) để đổi lấy các vật phẩm độc quyền hoặc vé Battle Pass.34  
3. **Administrative Tools:** Guild Leaders phải có công cụ để quản lý thành viên (mời, trục xuất, thăng cấp) và có quyền áp dụng các cảnh cáo đối với thành viên không hoạt động hoặc bị Flag bởi hệ thống Anti-Cheat.16 Việc thực thi quy tắc nghiêm ngặt là cần thiết để duy trì tinh thần đồng đội.16

## **V. Detailed PRD: Geo-location Territory Control (Kiểm soát Lãnh thổ Địa lý)**

Module này chuyển các hoạt động tập luyện ngoài trời thành một trò chơi chiến lược lớn trên bản đồ thế giới thực.

### **5.1. Map Grid System Implementation**

#### **Feature Goal**

Sử dụng lưới Hexagon để tạo ra một bản đồ chiến trường công bằng và dễ tính toán, loại bỏ các vấn đề sai lệch liên quan đến ranh giới hành chính không đồng nhất (irregular zoning and data boundary bias).35

#### **Functional/Data Requirements**

* **F\_5.1.1 (Grid Geometry):** Triển khai lưới Hexagon (lục giác) với định hướng 'pointy top' hoặc 'flat top'.19 Lựa chọn Hexagon đảm bảo rằng mọi ô liền kề đều có khoảng cách tâm đồng nhất, tối ưu hóa cho logic tìm kiếm hàng xóm và tính toán ảnh hưởng.19  
* **F\_5.1.2 (Coordinate System):** Sử dụng hệ tọa độ Cube hoặc Offset để đơn giản hóa các phép toán hình học và logic game (ví dụ: tính toán di chuyển, tìm kiếm lân cận).19  
* **F\_5.1.3 (Hex Sizing):** Kích thước Hex (size) phải là một tham số cấu hình được điều chỉnh theo mật độ địa lý của khách hàng doanh nghiệp. Ví dụ: một Hex có thể đại diện cho một khu vực 1-2km2.

### **5.2. Territory Capture & Defense Mechanics**

#### **Feature Goal**

Áp dụng FES tích lũy tại một ô Hex để chiếm đóng và duy trì lãnh thổ. Cơ chế này phải khuyến khích sự tập trung chiến lược trong việc bảo vệ lãnh thổ.

#### **Business Rules (Territory War Core Logic)**

1. **Capture Requirement:** Để chiếm một Hex, thành viên Guild phải hoàn thành một hoạt động (với FES \> X) nằm hoàn toàn trong phạm vi GPS của Hex đó. FES này được chuyển thành **Influence Points** (Điểm Ảnh hưởng) tích lũy. Guild có Influence Points cao nhất sẽ kiểm soát Hex.  
2. **Attack and Defense Balance:**  
   * **Defender’s Advantage (Lợi thế Phòng thủ):** Khi một Guild tấn công Hex của Guild khác, cơ chế game phải áp dụng lợi thế phòng thủ, theo tỷ lệ căn bản là 2 quân tấn công bị tiêu diệt cho 1 quân phòng thủ.21  
   * **Defense Rating (DR):** DR của Guild là hệ số nhân được tính toán dựa trên độ **"compactness"** (sự gọn gàng) của tổng lãnh thổ mà Guild đó kiểm soát, so với tổng chiều dài biên giới tiếp xúc với các Guild đối thủ.20 Lãnh thổ càng "compact," DR càng cao, giúp giảm thiểu thương vong và tỷ lệ mất đất khi bị tấn công.20 Cơ chế này ngăn chặn việc Guild chiếm đóng lãnh thổ dàn trải (sprawling territories) thiếu chiến lược, điều quan trọng để duy trì tính cạnh tranh của game.  
3. **Land Loss Ratio:** Lượng đất (số Hex) bị mất khi phòng thủ thất bại phải liên quan đến tỷ lệ tổn thất quân (Troops/Influence Points) của bên phòng thủ.21

### **5.3. Geo-located AR Scavenger Hunt**

#### **Feature Goal**

Tích hợp trải nghiệm thực tế ảo (AR) dựa trên vị trí địa lý để thêm phần thưởng và yếu tố khám phá, khuyến khích di chuyển đến các địa điểm cụ thể.23

#### **Functional Requirements**

* **F\_5.3.1 (Geofence Trigger):** Hệ thống phải sử dụng tọa độ GPS được xác định trước để tạo Geofence. Khi người dùng di chuyển vào vùng Geofence (ví dụ: bán kính 15m), tính năng AR Loot Chest sẽ được kích hoạt.36  
* **F\_5.3.2 (GPS Tolerance Management):** Vì độ chính xác của GPS có thể dao động lớn (từ \<5 mét đến \>30 mét) tùy thuộc vào môi trường đô thị hoặc trong nhà, hệ thống phải thiết lập dung sai GPS linh hoạt.36 Thay vì yêu cầu độ chính xác tuyệt đối, hệ thống nên sử dụng cơ chế "Xác nhận vị trí" khi người dùng ở gần tâm điểm trong một khoảng thời gian nhất định.

## **VI. Detailed PRD: Integrity & Anti-Cheat System**

#### **Feature Goal**

Đảm bảo tính toàn vẹn của dữ liệu và sự công bằng trong game hóa. Sự thiếu công bằng (như gian lận điểm số) là rủi ro lớn nhất đối với sự gắn kết cộng đồng trong các ứng dụng game hóa.11

### **6.1. Workout Integrity Checks (Kiểm tra Tính toàn vẹn Bài tập)**

#### **Business Rules**

1. **Treadmill Cheating Detection (V1):** Phát hiện hành vi giữ tay vịn trên máy chạy bộ, điều này làm giảm nỗ lực thực tế.11  
   * **Logic:** Phân tích sự mất cân bằng giữa Tốc độ cao (Speed/Pace) và các chỉ số sinh lý (Nhịp tim thấp bất thường \- Low Heart Rate, Nhịp bước thấp \- Low Cadence).11  
   * **Action:** Nếu phát hiện sai lệch nghiêm trọng, FES sẽ bị giảm bằng cách áp dụng **EIM \< 1.0**.  
2. **HR Data Anomaly:** Cảnh báo và giảm trọng số Intensity (I) trong FES nếu dữ liệu Nhịp tim bị mất (Flatlining) hoặc đột ngột tăng/giảm phi vật lý trong thời gian dài.  
3. **RPE Feedback Loop:** Trong các sự kiện xếp hạng (Benchmarks), yêu cầu người dùng nhập đánh giá nỗ lực chủ quan (RPE). Nếu RPE thấp hơn đáng kể so với FES tính toán, đây là một điểm dữ liệu để huấn luyện mô hình FES thích ứng và làm cơ sở cho EIM trong các lần tiếp theo.29

### **6.2. GPS Spoofing Detection**

#### **Functional Requirements**

* **F\_6.2.1 (Path Anomaly Detection):** Backend service phải phân tích chuỗi dữ liệu GPS (Polyline data) 8 để phát hiện các bất thường:  
  * Tốc độ tức thời vượt quá giới hạn vật lý/sinh học (ví dụ: \> 70 km/h khi chạy bộ).  
  * Sự thay đổi đột ngột về vị trí (teleportation) hoặc thay đổi hướng 180 độ không có logic di chuyển hợp lý (non-physical path).  
* **F\_6.2.2 (Advanced Spoofing Defense):** Để chống lại việc sử dụng các thiết bị giả lập GPS (GSG Simulator) hoặc phát lại tín hiệu đã ghi 12, hệ thống cần triển khai các biện pháp kiểm tra nâng cao:  
  * **Time of Arrival (TOA) Analysis:** Phân tích độ trễ và tính đồng bộ của tín hiệu GPS/Thời gian nhận để chống lại việc phát lại tín hiệu đã ghi.37  
  * **Simulator Detection:** Nếu phát hiện các pattern dữ liệu GPS giả lập có tính nhất quán nhân tạo cao hoặc thiếu nhiễu tín hiệu tự nhiên (thường xảy ra khi sử dụng GSG Simulator) 12, hoạt động đó phải bị Flag với EIM \= 0\.

## **VII. Detailed PRD: B2B Compliance & Administration**

Module này đảm bảo tính pháp lý và tính bảo mật, là yếu tố then chốt để thu hút khách hàng doanh nghiệp.

### **7.1. Data Privacy and PHI/PII Handling**

#### **Feature Goal**

Đảm bảo tuân thủ các quy định bảo mật dữ liệu sức khỏe (ví dụ: HIPAA, GDPR) bằng cách tách biệt Dữ liệu Sức khỏe Cá nhân (PHI) khỏi các chức năng liên quan đến việc làm.2

#### **Business Rules**

1. **Non-Disclosure Mandate:** Dữ liệu sức khỏe cá nhân (PHI) và hoạt động (Activity Log) không bao giờ được sử dụng hoặc tiết lộ cho các quyết định liên quan đến việc làm, tuyển dụng, hoặc kỷ luật.2  
2. **Explicit Consent:** Người dùng phải cung cấp sự đồng ý rõ ràng (Employee Consent) về Chính sách Quyền riêng tư của Vendor và Doanh nghiệp trước khi đồng bộ dữ liệu.38  
3. **Anonymization Threshold:** Dữ liệu sức khỏe tổng hợp chỉ được hiển thị trên HR Dashboard nếu kích thước nhóm (Group Size N) vượt qua ngưỡng an toàn để tránh rủi ro nhận dạng lại (Re-identification).27 Ngưỡng tối thiểu là **N \> 10** đối với báo cáo phòng ban và N \> 50 đối với báo cáo toàn công ty.39

#### **Data Requirements (PII Masking)**

* **D\_7.1.1 (Masking/Tokenization):** PII nhạy cảm (Tên, Email, ID cá nhân) phải được che giấu (masking) hoặc mã hóa (tokenization) trong các môi trường Non-Production (Dev/QA) và khi hiển thị cho người dùng có quyền truy cập tổng hợp (HR Admin).24  
* **D\_7.1.2 (Referential Integrity):** Kỹ thuật masking phải giữ lại tính toàn vẹn tham chiếu (referential integrity) để các nhà phân tích HR vẫn có thể theo dõi xu hướng mà không biết danh tính thực tế của cá nhân.40

### **7.2. Role-Based Access Control (RBAC) System**

#### **Feature Goal**

Thiết lập một khung bảo mật dựa trên vai trò để giới hạn quyền truy cập vào dữ liệu dựa trên nguyên tắc "Cần biết" (Need-to-know basis).26

#### **Functional/Data Requirements**

* **F\_7.2.1 (RBAC Model Implementation):** Triển khai mô hình RBAC tiêu chuẩn (Users, Roles, Permissions, Resources) để quản lý quyền truy cập một cách hiệu quả.25  
* **F\_7.2.2 (Row-Level Security \- RLS):** Sử dụng RLS ở cấp độ cơ sở dữ liệu. RLS phải triển khai Filter Predicates để âm thầm lọc các hàng dữ liệu không được phép truy cập bởi một Role cụ thể. Ví dụ: RLS đảm bảo một HR Admin chỉ có thể truy vấn dữ liệu hoạt động của nhân viên trong công ty họ.41  
* **F\_7.2.3 (Audit Logs):** Mọi hành động truy cập, đặc biệt là các truy vấn tới dữ liệu có chứa PII/PHI (ngay cả khi đã được Masking), phải được ghi lại trong nhật ký kiểm toán không thể thay đổi (immutable audit trails) để hỗ trợ tuân thủ.42

Bảng 3: Ma trận Kiểm soát Truy cập Dựa trên Vai trò (RBAC) và Chính sách Masking

| Role | Target Resource/Data Set | Access Type | PII/PHI Masking Policy | Rationale/Compliance |
| :---- | :---- | :---- | :---- | :---- |
| **Employee (End User)** | Personal FES, Activity Log, Avatar, Guild Chat | Full R/W (Self) | None (Toàn quyền dữ liệu cá nhân) | N/A |
| **Guild Leader** | Guild Roster (Username, FES), Contribution Logs | R/W (Admin) | Tên đầy đủ/Email Masked. Chỉ hiển thị Username/Avatar. | Quản lý Guild, tách biệt khỏi chức năng HR. |
| **HR Administrator (Client)** | Participation Rates, FES Trend (Aggregated), Health Outcomes (Aggregated) | Read Only | **Bắt buộc Anonymization:** Chỉ hiển thị dữ liệu tổng hợp với N \> 10\.27 **Không có PII cá nhân.** | Tuân thủ nghiêm ngặt Quy tắc Bảo mật.2 |
| **System Admin (Vendor)** | Production Database, Unmasked PII/PHI | R/W (Restricted) | **RLS Enforced, Strict Auditing:** Truy cập giới hạn theo nguyên tắc "ít đặc quyền nhất." | Bảo vệ dữ liệu, chống rò rỉ.42 |

### **7.3. Corporate HR Dashboard**

#### **Feature Goal**

Cung cấp cho khách hàng doanh nghiệp một giao diện trực quan, dễ hiểu để đo lường thành công của chương trình, tập trung vào các KPI về sự tham gia và kết quả sức khỏe.

#### **Features & Requirements**

* **F\_7.3.1 (Participation Tracking):** Hiển thị tỷ lệ người dùng đã đăng ký, tỷ lệ đồng bộ thiết bị đeo, và tỷ lệ tham gia vào các sự kiện game hóa (Boss Raid, Territory War) được phân tách theo Bộ phận/Vị trí.3  
* **F\_7.3.2 (Health Outcomes Visualization):** Biểu đồ xu hướng FES trung bình của công ty/bộ phận. Dữ liệu này phải được xử lý bởi Reporting Service để đảm bảo tính tổng hợp và tuân thủ ngưỡng Anonymization (N \> 10).39  
* **F\_7.3.3 (ROI Metrics):** Cung cấp các công cụ so sánh dữ liệu tham gia với các chỉ số nhân sự (ví dụ: Absenteeism \- tỷ lệ vắng mặt) để giúp HR chứng minh ROI của chương trình. Việc này hỗ trợ cho các cấp điều hành trong việc hiểu tác động văn hóa và tài chính.4

## **VIII. System Flow / Diagram (Luồng Hệ thống và Sơ đồ)**

Hệ thống được thiết kế theo kiến trúc Microservices để đảm bảo khả năng mở rộng và sự tách biệt giữa các module nhạy cảm (Compliance, Integration, Gaming).

### **8.1. Luồng đồng bộ Dữ liệu Thiết bị đeo (Wearable Data Sync Flow \- Ví dụ Strava)**

1. **Ủy quyền Ban đầu:** Ứng dụng di động (Client Application) chuyển hướng người dùng đến URL OAuth của Strava, cung cấp client\_id, redirect\_uri, response\_type=code và scope=activity:read\_all.8  
2. **Trao đổi Mã (Code Exchange):** Sau khi người dùng ủy quyền, Strava chuyển hướng trở lại với một code ngắn hạn. Integration Service (P2) ngay lập tức gửi mã này cùng với client\_secret và grant\_type=authorization\_code đến endpoint Token của Strava.8  
3. **Lưu trữ Token:** Integration Service nhận và lưu trữ cặp Access Token (ngắn hạn) và Refresh Token (dài hạn).  
4. **Chu kỳ Làm mới Token Bắt buộc:** Integration Service duy trì một Worker Queue. Nếu Access Token sắp hết hạn (ví dụ: còn dưới 1 giờ), Worker Queue sẽ tự động gọi Token endpoint với grant\_type=refresh\_token để nhận cặp Access Token/Refresh Token mới.8 Việc này là tối quan trọng vì Refresh Token cũ sẽ bị vô hiệu hóa, và nếu bị mất, người dùng phải ủy quyền lại, gây ra trải nghiệm người dùng kém.8

### **8.2. Luồng Tính toán và Phân bổ Điểm Nỗ lực (FES Distribution Flow)**

1. **Data Ingestion:** Dữ liệu hoạt động thô (Raw Data) được nhận từ Integration Service (bao gồm GPS Polylines và HR Data).  
2. **Integrity Check:** Data Processing Engine chạy module Anti-Cheat (Mục VI) để phân tích các dị thường (anomalies) như GPS Spoofing hoặc bất thường HR.11 Kết quả là **Effort Integrity Multiplier (EIM)**.  
3. **FES Calculation:** Data Processing Engine áp dụng công thức Weighted Sum (Mục 3.2), tính toán FES dựa trên Intensity, Volume, Personal Modifiers, và nhân kết quả với EIM.  
4. **Gamification Engine Update:** FES được phân bổ ngay lập tức:  
   * Cá nhân: Tăng XP, Progression Skill Tree, Battle Pass.  
   * Guild: Cung cấp Damage Points cho Boss Raid và Guild Resources (cho Territory War Defense/Research).15  
5. **State Persistence:** Trạng thái HP Boss, Territory Ownership, và Guild Resources được cập nhật vào Database.

## **IX. KPI / Success Metrics (Các Chỉ số Đo lường Thành công)**

KPI được phân loại theo ba lĩnh vực: Độ bền Sản phẩm, Thành công Game hóa, và Giá trị B2B thực tế.

Bảng 4: KPI và Mục tiêu

| KPI Category | Specific Metric | Frequency | Target (Giai đoạn 1\) |
| :---- | :---- | :---- | :---- |
| **P1: Product Health & Retention** | WAU/MAU (Tỷ lệ người dùng hoạt động hàng tuần/tháng) | Daily/Weekly | \> 60% WAU/MAU 1 |
|  | Core Activity Completion Rate (Tỷ lệ hoàn thành hoạt động) | Weekly | \> 70% |
| **P2: Gamification Engagement** | Guild Contribution Rate (FES đóng góp/Total FES) | Weekly | \> 80% (Thể hiện sự tham gia vào hệ thống Guild Resources) |
|  | Average Boss Raid Time-to-Kill | Weekly | Duy trì mức thách thức (Ví dụ: 80% Boss bị tiêu diệt trong 24 giờ) |
|  | Territory Defense Rating (DR) trung bình của các Guild | Weekly | \> 0.25 (Khuyến khích chiến lược lãnh thổ Compact) 20 |
| **P3: Corporate ROI (B2B Value)** | **Participation Rate** (Tỷ lệ nhân viên đủ điều kiện hoạt động) | Monthly | \> 50% 3 |
|  | **Health Outcome Trend** (Tăng trưởng FES trung bình tổng thể) | Quarterly | Tăng trưởng 5-10% QoQ 4 |
|  | Correlation with Absenteeism (Tương quan giữa tham gia và giảm tỷ lệ vắng mặt) | Biannually | Chứng minh mối tương quan nghịch rõ rệt 4 |

## **X. Risk & Mitigation (Rủi ro và Kế hoạch Giảm thiểu)**

| Risk (Rủi ro) | Impact | Mitigation Strategy (Giảm thiểu) |
| :---- | :---- | :---- |
| **R\_1: Data Breach / PHI Exposure** | Catastrophic | RBAC/RLS (Mục 7.2) phải là ưu tiên tuyệt đối. Triển khai Data Masking cho môi trường non-production.24 Thực hiện kiểm tra thâm nhập (Penetration Tests) định kỳ. Tuân thủ Breach Notification Rule.2 |
| **R\_2: Cheating làm hỏng Game Balance (FES)** | High | EIM phải được tích hợp vào FES (Mục 3.2 & 6.1). Lãnh đạo Guild có thẩm quyền nội bộ để kỷ luật thành viên gian lận.16 Sử dụng các kỹ thuật chống GPS Spoofing tiên tiến.12 |
| **R\_3: Gián đoạn Tích hợp API (R3: API Dependency)** | High | Triển khai kiến trúc Microservice cho Integration Service. Sử dụng cơ chế lưu trữ và làm mới Refresh Token mạnh mẽ.8 Đa dạng hóa nguồn dữ liệu (Hỗ trợ 4 API lớn).7 |
| **R\_4: Thách thức về ROI và Tuân thủ B2B** | Moderate/High | Đảm bảo dữ liệu HR Dashboard luôn được tổng hợp (N \> 10/50) và ẩn danh hóa.39 Cung cấp các công cụ báo cáo minh bạch để khách hàng thấy được tác động của chương trình.28 |

## **XI. Release Plan / Roadmap (Lộ trình Sản phẩm)**

Lộ trình được xây dựng theo phương pháp luận phát triển lặp lại (Iterative Development), ưu tiên tính năng nền tảng và tuân thủ trước khi mở rộng Gamification.

| Giai đoạn | Thời gian | Tính năng Cốt lõi | Trọng tâm Chiến lược |
| :---- | :---- | :---- | :---- |
| **MVP (Launch Readiness)** | 3 Tháng | Onboarding/Hồ sơ, Tích hợp API cơ bản (Strava, Apple/Google Fit), FES tĩnh (non-adaptive), Achievement, RBAC V1 & Anonymization N \> 20\. | Thiết lập nền tảng kỹ thuật và tuân thủ tối thiểu. Xác nhận FES hoạt động.1 |
| **Giai đoạn 1 (Feature & Scale)** | 6 Tháng | FES Adaptive (AI/ML V1 \- dựa trên RPE/PR), Guild/Clan (tối đa 50), Asynchronous Boss Raid (Tier I), Battle Pass Framework. HR Dashboard V1 (Participation/FES Metrics). Anti-Cheat V1 (Anomaly Detection, Treadmill Cheating).11 | Tăng cường gắn kết và thu hút 3 khách hàng Pilot B2B. Kiểm soát gian lận. |
| **Giai đoạn 2 (Advanced Warfare & B2B Maturity)** | 12 Tháng | Territory Control V1 (Hex Grid Map, Capture Mechanics).19 Guild War Mechanics (Defense Rating, 2:1 ratio).20 Geo-located AR Scavenger Hunt.22 Anti-Cheat V2 (GPS Spoofing Defense \- TOA, Simulator).12 RLS Enforcement N \> 10\. | Mở rộng quy mô B2B, cung cấp trải nghiệm game hóa độc đáo. Chứng minh tác động ROI thông qua HR Dashboard. |

#### **Nguồn trích dẫn**

1. Fitness App Development: Personalized and Gamified Wellness Platforms \- OpenForge, truy cập vào tháng 11 21, 2025, [https://openforge.io/fitness-app-development-personalized-and-gamified-wellness-platforms/](https://openforge.io/fitness-app-development-personalized-and-gamified-wellness-platforms/)  
2. Workplace Wellness \- HHS.gov, truy cập vào tháng 11 21, 2025, [https://www.hhs.gov/hipaa/for-professionals/privacy/workplace-wellness/index.html](https://www.hhs.gov/hipaa/for-professionals/privacy/workplace-wellness/index.html)  
3. Leveraging Gamification to Boost Your Corporate Wellness Program \- BetterYou, truy cập vào tháng 11 21, 2025, [https://www.betteryou.ai/leveraging-gamification-to-boost-your-corporate-wellness-program/](https://www.betteryou.ai/leveraging-gamification-to-boost-your-corporate-wellness-program/)  
4. Determining Key Performance Indicators For Wellness Programs \- WellSteps, truy cập vào tháng 11 21, 2025, [https://www.wellsteps.com/blog/2023/05/03/how-to-determine-key-performance-indicators-for-wellness-programs/](https://www.wellsteps.com/blog/2023/05/03/how-to-determine-key-performance-indicators-for-wellness-programs/)  
5. In-App Purchases, truy cập vào tháng 11 21, 2025, [https://www.businessofapps.com/guide/in-app-purchases/](https://www.businessofapps.com/guide/in-app-purchases/)  
6. Your IAP playbook: For in-app purchases that drive lifetime value | Mistplay, truy cập vào tháng 11 21, 2025, [https://business.mistplay.com/resources/in-app-purchases](https://business.mistplay.com/resources/in-app-purchases)  
7. How to get your Activities to Strava, truy cập vào tháng 11 21, 2025, [https://support.strava.com/hc/en-us/articles/223297187-How-to-get-your-Activities-to-Strava](https://support.strava.com/hc/en-us/articles/223297187-How-to-get-your-Activities-to-Strava)  
8. Strava API V3 Documentation \- Strava Developers, truy cập vào tháng 11 21, 2025, [https://developers.strava.com/docs](https://developers.strava.com/docs)  
9. Physical Activity Level Calculator \- YuMuuv, truy cập vào tháng 11 21, 2025, [https://yumuuv.com/blog/physical-activity-level-calculator](https://yumuuv.com/blog/physical-activity-level-calculator)  
10. Activity Score Scientific Reference \- Docs, truy cập vào tháng 11 21, 2025, [https://docs.sahha.ai/docs/data-flow/sdk/app-store-submission/scientific-references/score-activity](https://docs.sahha.ai/docs/data-flow/sdk/app-store-submission/scientific-references/score-activity)  
11. Benchmark Cheater : r/orangetheory \- Reddit, truy cập vào tháng 11 21, 2025, [https://www.reddit.com/r/orangetheory/comments/13o347f/benchmark\_cheater/](https://www.reddit.com/r/orangetheory/comments/13o347f/benchmark_cheater/)  
12. Can You Cheat Step Counters? Fitness App Testing (+Test Results) \- TestDevLab, truy cập vào tháng 11 21, 2025, [https://www.testdevlab.com/blog/testing-fitness-apps-can-you-cheat-the-algorithm](https://www.testdevlab.com/blog/testing-fitness-apps-can-you-cheat-the-algorithm)  
13. Gamification Use and Design in Popular Health and Fitness Mobile Applications \- PMC, truy cập vào tháng 11 21, 2025, [https://pmc.ncbi.nlm.nih.gov/articles/PMC6348030/](https://pmc.ncbi.nlm.nih.gov/articles/PMC6348030/)  
14. SkillTree is a micro-learning gamification platform that supports multiple training and integration options which enables organizations to use SkillTree as an All in one training platform. It is an innovative approach to implementing self-directed gamified training that can be \- Overview, truy cập vào tháng 11 21, 2025, [https://skilltreeplatform.dev/overview/](https://skilltreeplatform.dev/overview/)  
15. Looking for a game that allows me to contribute towards a guild/clan/group in some way in terms of life skills. : r/LFMMO \- Reddit, truy cập vào tháng 11 21, 2025, [https://www.reddit.com/r/LFMMO/comments/1kmnmke/looking\_for\_a\_game\_that\_allows\_me\_to\_contribute/](https://www.reddit.com/r/LFMMO/comments/1kmnmke/looking_for_a_game_that_allows_me_to_contribute/)  
16. How can running a gaming clan prepare you for management? \- Quora, truy cập vào tháng 11 21, 2025, [https://www.quora.com/How-can-running-a-gaming-clan-prepare-you-for-management](https://www.quora.com/How-can-running-a-gaming-clan-prepare-you-for-management)  
17. We built a gamified fitness app, but most users didn't use it – what are we missing? \- Reddit, truy cập vào tháng 11 21, 2025, [https://www.reddit.com/r/gamification/comments/1m9m662/we\_built\_a\_gamified\_fitness\_app\_but\_most\_users/](https://www.reddit.com/r/gamification/comments/1m9m662/we_built_a_gamified_fitness_app_but_most_users/)  
18. Workout Quest: AI Gamified Gym \- App Store \- Apple, truy cập vào tháng 11 21, 2025, [https://apps.apple.com/us/app/workout-quest-ai-gamified-gym/id6452191825](https://apps.apple.com/us/app/workout-quest-ai-gamified-gym/id6452191825)  
19. Hexagonal Grids \- Red Blob Games, truy cập vào tháng 11 21, 2025, [https://www.redblobgames.com/grids/hexagons/](https://www.redblobgames.com/grids/hexagons/)  
20. How actually does "defense"/"balance" work? : r/territorial\_io \- Reddit, truy cập vào tháng 11 21, 2025, [https://www.reddit.com/r/territorial\_io/comments/194ra9e/how\_actually\_does\_defensebalance\_work/](https://www.reddit.com/r/territorial_io/comments/194ra9e/how_actually_does_defensebalance_work/)  
21. How does defense work? : r/territorial\_io \- Reddit, truy cập vào tháng 11 21, 2025, [https://www.reddit.com/r/territorial\_io/comments/y47sye/how\_does\_defense\_work/](https://www.reddit.com/r/territorial_io/comments/y47sye/how_does_defense_work/)  
22. Geolocated AR treasure hunt for events \- Onirix Documentation Portal, truy cập vào tháng 11 21, 2025, [https://docs.onirix.com/tutorials-and-how-to/geolocated-ar-treasure-hunt-for-events](https://docs.onirix.com/tutorials-and-how-to/geolocated-ar-treasure-hunt-for-events)  
23. How to Create a Web Augmented Reality Treasure hunt 🗺️ \- Onirix, truy cập vào tháng 11 21, 2025, [https://www.onirix.com/learn-about-ar/how-to-create-ar-treasure-hunt/](https://www.onirix.com/learn-about-ar/how-to-create-ar-treasure-hunt/)  
24. What Is PII Masking And How Can You Keep Customer Data Confidential \- Protecto AI, truy cập vào tháng 11 21, 2025, [https://www.protecto.ai/blog/what-is-pii-masking-keep-customer-data-confidential/](https://www.protecto.ai/blog/what-is-pii-masking-keep-customer-data-confidential/)  
25. Best Role-Based Access Control (RBAC) database model \[closed\] \- Stack Overflow, truy cập vào tháng 11 21, 2025, [https://stackoverflow.com/questions/190257/best-role-based-access-control-rbac-database-model](https://stackoverflow.com/questions/190257/best-role-based-access-control-rbac-database-model)  
26. How Role-Based Access Protects Product Data \- Userlens, truy cập vào tháng 11 21, 2025, [https://www.wudpecker.io/blog/how-role-based-access-protects-product-data](https://www.wudpecker.io/blog/how-role-based-access-protects-product-data)  
27. A Comprehensive Guide to Wellness Platform Reporting Features \- Give River, truy cập vào tháng 11 21, 2025, [https://www.giveriver.com/blog/wellness-platforms-anonymized-employee-health-data-reporting](https://www.giveriver.com/blog/wellness-platforms-anonymized-employee-health-data-reporting)  
28. HR Dashboard: 7 Key Examples and Best Practices \- Qlik, truy cập vào tháng 11 21, 2025, [https://www.qlik.com/us/dashboard-examples/hr-dashboard](https://www.qlik.com/us/dashboard-examples/hr-dashboard)  
29. I don't get the analytical logic for how the fitness app classifies effort. Exhibit A: more exertion and new PRs but “moderate” compared to a previous, lower exertion that was “hard” : r/AppleWatch \- Reddit, truy cập vào tháng 11 21, 2025, [https://www.reddit.com/r/AppleWatch/comments/1inuuq2/i\_dont\_get\_the\_analytical\_logic\_for\_how\_the/](https://www.reddit.com/r/AppleWatch/comments/1inuuq2/i_dont_get_the_analytical_logic_for_how_the/)  
30. Fitness function \- Wikipedia, truy cập vào tháng 11 21, 2025, [https://en.wikipedia.org/wiki/Fitness\_function](https://en.wikipedia.org/wiki/Fitness_function)  
31. Machine learning algorithm with fitness score \- Stack Overflow, truy cập vào tháng 11 21, 2025, [https://stackoverflow.com/questions/34728080/machine-learning-algorithm-with-fitness-score](https://stackoverflow.com/questions/34728080/machine-learning-algorithm-with-fitness-score)  
32. Gang War \- District Control \- Game \- GamersFirst Forums, truy cập vào tháng 11 21, 2025, [https://forums.gamersfirst.com/topic/8788-gang-war-district-control/](https://forums.gamersfirst.com/topic/8788-gang-war-district-control/)  
33. Guild/clan system \- Age of Strategy Forums, truy cập vào tháng 11 21, 2025, [https://server.androidutils.com/forum/viewtopic.php?t=13545](https://server.androidutils.com/forum/viewtopic.php?t=13545)  
34. Fitness RPG: Hero health game \- App Store, truy cập vào tháng 11 21, 2025, [https://apps.apple.com/us/app/fitness-rpg-hero-health-game/id1252580641](https://apps.apple.com/us/app/fitness-rpg-hero-health-game/id1252580641)  
35. Hexagons for Location Intelligence: Why, When & How? \- CARTO, truy cập vào tháng 11 21, 2025, [https://carto.com/blog/hexagons-for-location-intelligence](https://carto.com/blog/hexagons-for-location-intelligence)  
36. Geofencing with Location Triggers | Hololink Help Center \- Intercom, truy cập vào tháng 11 21, 2025, [https://intercom.help/hololink/en/articles/7887630-geofencing-with-location-triggers](https://intercom.help/hololink/en/articles/7887630-geofencing-with-location-triggers)  
37. Anti-Spoofing \- Stanford GPS Lab, truy cập vào tháng 11 21, 2025, [https://gps.stanford.edu/research/current-and-continuing-gpspnt-research/cyber-safety-transportation/anti-spoofing](https://gps.stanford.edu/research/current-and-continuing-gpspnt-research/cyber-safety-transportation/anti-spoofing)  
38. Corporate Wellness Programs Best Practices: ensuring the privacy and security of employee health information \- Healthcare Compliance Pros, truy cập vào tháng 11 21, 2025, [https://www.healthcarecompliancepros.com/blog/corporate-wellness-programs-best-practices-ensuring-the-privacy-and-security-of-employee](https://www.healthcarecompliancepros.com/blog/corporate-wellness-programs-best-practices-ensuring-the-privacy-and-security-of-employee)  
39. How B2B Health and Wellness Companies Can Effectively Measure ROI to Attract More Corporate Clients \- Zigpoll, truy cập vào tháng 11 21, 2025, [https://www.zigpoll.com/content/how-can-businessestobusiness-health-and-wellness-companies-effectively-measure-the-roi-of-their-employee-wellness-programs-to-attract-more-corporate-clients](https://www.zigpoll.com/content/how-can-businessestobusiness-health-and-wellness-companies-effectively-measure-the-roi-of-their-employee-wellness-programs-to-attract-more-corporate-clients)  
40. What is Data Masking? A Practical Guide \- K2view, truy cập vào tháng 11 21, 2025, [https://www.k2view.com/what-is-data-masking/](https://www.k2view.com/what-is-data-masking/)  
41. Row-Level Security \- SQL Server | Microsoft Learn, truy cập vào tháng 11 21, 2025, [https://learn.microsoft.com/en-us/sql/relational-databases/security/row-level-security?view=sql-server-ver17](https://learn.microsoft.com/en-us/sql/relational-databases/security/row-level-security?view=sql-server-ver17)  
42. How Role-Based Access Control (RBAC) Helps Data Security Governance \- Concentric AI, truy cập vào tháng 11 21, 2025, [https://concentric.ai/how-role-based-access-control-rbac-helps-data-security-governance/](https://concentric.ai/how-role-based-access-control-rbac-helps-data-security-governance/)