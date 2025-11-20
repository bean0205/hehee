# CẨM NANG TÁC CHIẾN: SPEC-DRIVEN WORKFLOW
**Project:** TERRARUN / URBAN LEGENDS
**Methodology:** State Machine & Token Passing.
**Core Document:** `FEATURE_SPEC.md`.

---

## 🧠 NGUYÊN TẮC CỐT LÕI
1.  **Spec First:** Không viết một dòng code nào cho đến khi file `FEATURE_SPEC.md` có trạng thái `🏁 SPEC_COMPLETED`.
2.  **Follow the Flag:** Luôn nhìn vào dòng **"Next Agent"** trong file Spec để biết phải gọi ai tiếp theo.
3.  **Double Check:** Tech Lead duyệt bản vẽ (Spec), Code Auditor duyệt thi công (Code).

---

## 🔄 GIAI ĐOẠN 1: THIẾT KẾ (SPECIFICATION PHASE)
*Mục tiêu: Điền đầy đủ thông tin vào file `FEATURE_SPEC.md`.*

### BƯỚC 0: KHỞI TẠO (HUMAN)
* Reset file `FEATURE_SPEC.md` về mẫu DRAFT.
* Điền tên tính năng.

### BƯỚC 1: DATABASE AGENT (Thiết kế Dữ liệu)
* **Dấu hiệu:** Next Agent là `🤖 DATABASE AGENT`.
* **Lệnh:**
    > `@PRD.md` `@tech_stack.md` `@FEATURE_SPEC.md` `@agent_database.md`
    > Thực hiện nhiệm vụ thiết kế Schema cho tính năng này.
    > Thực hiện **Handover Protocol** sau khi xong.
* **Kết quả:** State -> `🟡 DB_DONE`.

### BƯỚC 2: BACKEND AGENT (Thiết kế API)
* **Dấu hiệu:** Next Agent là `🤖 BACKEND AGENT`.
* **Lệnh:**
    > `@tech_stack.md` `@FEATURE_SPEC.md` `@agent_backend.md`
    > Đọc Schema ở Mục 1. Thiết kế API Contract.
    > Thực hiện **Handover Protocol** sau khi xong.
* **Kết quả:** State -> `🔵 API_DONE`.

### BƯỚC 3: SECURITY AGENT (Kiểm duyệt An ninh)
* **Dấu hiệu:** Next Agent là `🛡️ SECURITY AGENT`.
* **Lệnh:**
    > `@FEATURE_SPEC.md` `@agent_qa_security.md`
    > Review Mục 1 và 2. Tìm lỗ hổng.
    > Thực hiện **Handover Protocol**.
* **Kết quả:** State -> `🟢 SAFE_TO_CODE` (hoặc Failed).

### BƯỚC 4: FRONTEND AGENT (Thiết kế UI)
* **Dấu hiệu:** Next Agent là `🎨 FRONTEND AGENT`.
* **Lệnh:**
    > `@tech_stack.md` `@FEATURE_SPEC.md` `@agent_frontend.md`
    > Đọc API ở Mục 2. Lên kế hoạch UI/State.
    > Thực hiện **Handover Protocol**.
* **Kết quả:** State -> `🟣 UI_PLANNED`. Next Agent -> `🤵 TECH LEAD AGENT`.

### BƯỚC 5: TECH LEAD (Duyệt Phương Án)
* **Dấu hiệu:** Next Agent là `🤵 TECH LEAD AGENT`.
* **Lệnh:**
    > `@tech_stack.md` `@FEATURE_SPEC.md` `@agent_tech_lead.md`
    > Hãy đóng vai Tech Lead. Review toàn bộ giải pháp (Mục 1, 2, 4).
    > Chốt phương án: Approve hoặc Reject.
* **Kết quả:** State -> `🏁 SPEC_COMPLETED`. Next Agent -> `👨‍💻 HUMAN DEVELOPER`.

---

## 🚧 GIAI ĐOẠN 2: ĐIỂM DỪNG (HUMAN CHECKPOINT)
* **Dấu hiệu:** Next Agent là `👨‍💻 HUMAN DEVELOPER`.
* **Hành động:**
    1. Bạn mở file `FEATURE_SPEC.md` ra đọc lướt.
    2. Nếu Tech Lead đã ghi "APPROVED" ở Mục 5 -> **Chuyển sang Giai đoạn 3**.
    3. Nếu thấy chưa ổn -> Sửa State về `DRAFT` và bắt làm lại.

---

## 🛠️ GIAI ĐOẠN 3: TRIỂN KHAI CODE (IMPLEMENTATION PHASE)
*Mục tiêu: Biến Spec thành Code chạy thật & Review từng dòng code.*

### 1. TRIỂN KHAI DATABASE
* **Lệnh:**
    > `@agent_database.md` `@FEATURE_SPEC.md`
    > Spec đã duyệt. Viết SQL Migration để tôi chạy vào DB.

### 2. TRIỂN KHAI SERVER (NESTJS)
* **Bước 2.1 (Viết Code):**
    > `@agent_backend.md` `@FEATURE_SPEC.md`
    > Spec đã duyệt. Viết code NestJS cho tính năng này.
* **Bước 2.2 (Audit Code):**
    > `@agent_code_auditor.md`
    > Soi lỗi đoạn code trên. Refactor lại cho chuẩn Clean Code.
* **Hành động:** Copy code **CỦA AUDITOR** vào dự án.

### 3. TRIỂN KHAI MOBILE (FLUTTER)
* **Bước 3.1 (Viết Code):**
    > `@agent_frontend.md` `@FEATURE_SPEC.md`
    > Spec đã duyệt. Viết code Flutter cho tính năng này.
* **Bước 3.2 (Audit Code):**
    > `@agent_code_auditor.md`
    > Soi lỗi Widget này. Kiểm tra Performance/Rebuild.
* **Hành động:** Copy code **CỦA AUDITOR** vào dự án.

---

## 🆘 XỬ LÝ SỰ CỐ
* **Tech Lead từ chối (REJECTED):**
    * Đọc lý do ở Mục 5.
    * Quay lại Bước 1 hoặc 2 để sửa theo yêu cầu.
* **Code bị lỗi Runtime:**
    * Copy lỗi ném cho Agent tương ứng (`@agent_backend.md` hoặc `@agent_frontend.md`) để fix.