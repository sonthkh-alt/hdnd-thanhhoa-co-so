# Backend miễn phí bằng Google Apps Script

File [Code.gs](Code.gs) biến Google Sheet thành backend cho app: vừa làm **API đọc dữ liệu** (thay SheetDB), vừa **nhận kiến nghị**, vừa chạy **AI tóm tắt tin** (có chống bịa đặt). Tất cả miễn phí trên tài khoản Google.

---

## A. Cài đặt API backend (đọc Sheet + nhận kiến nghị)

1. Mở Google Sheet của bạn (đã có 3 tab `TinTuc`, `CauHoi`, `KienNghi`).
2. Menu **Tiện ích mở rộng → Apps Script**.
3. Xóa code mẫu, dán toàn bộ nội dung [Code.gs](Code.gs) vào.
4. Bấm **Triển khai (Deploy) → Lần triển khai mới → Ứng dụng web (Web app)**:
   - **Execute as**: Me (chính bạn).
   - **Who has access**: Anyone (để app gọi được).
   - Bấm **Deploy**, sao chép **URL Web app** (dạng `https://script.google.com/macros/s/XXXX/exec`).
5. Mở [src/services/api.js](../src/services/api.js), đặt `USE_MOCK = false` và điền:
   ```js
   const API_CONFIG = {
     newsUrl:     "https://script.google.com/macros/s/XXXX/exec?sheet=TinTuc",
     quizUrl:     "https://script.google.com/macros/s/XXXX/exec?sheet=CauHoi",
     feedbackUrl: "https://script.google.com/macros/s/XXXX/exec",
   };
   ```
   > App đọc tin qua `?sheet=TinTuc`, đọc câu hỏi qua `?sheet=CauHoi`, và gửi kiến nghị bằng POST tới chính URL đó (Apps Script tự ghi vào tab `KienNghi`).

> Lưu ý: chỉ những tin có cột `status` = "Đã duyệt" mới hiện công khai — tin AI tự sinh ở trạng thái "Chờ duyệt" sẽ ẩn cho tới khi cán bộ kiểm tra.

---

## B. Bật luồng AI tóm tắt tin (tùy chọn)

1. Lấy **Claude API key** tại https://console.anthropic.com → API Keys.
2. Trong Apps Script: **Project Settings (bánh răng) → Script properties → Add property**:
   - Tên: `CLAUDE_API_KEY` — Giá trị: dán API key.
3. **Nguồn tin đã cắm sẵn**: Cổng thông tin Đoàn ĐBQH & HĐND tỉnh Thanh Hóa
   (`dbndthanhhoa.gov.vn`). Trang này **không có RSS** nên script đọc thẳng HTML
   (mục `CAU_HINH.nguonPortal`). Muốn thêm nguồn khác:
   - Nếu trang có RSS → thêm link vào `CAU_HINH.nguonRss`.
   - Nếu trang dạng portal HTML → thêm `{ listing, base }` vào `CAU_HINH.nguonPortal`.
4. Chạy thử: chọn hàm `capNhatTinBangAI` → bấm **Run**. Lần đầu Google hỏi cấp quyền → đồng ý.
5. Mở Sheet tab `TinTuc` xem các tin AI vừa thêm (cột `status` = "Chờ duyệt").
6. **Cán bộ kiểm tra** nội dung từng tin; nếu chính xác thì sửa cột `status` thành **"Đã duyệt"** → tin lập tức hiển thị trên app.
7. Đặt chạy tự động: biểu tượng **đồng hồ (Triggers) → Add Trigger**:
   - Function: `capNhatTinBangAI` — Event: Time-driven — chọn tần suất (vd mỗi ngày).

### Cơ chế chống bịa đặt (đã cài sẵn trong code)
- AI chỉ được tóm tắt **từ nội dung bài báo** đưa vào; lời nhắc hệ thống cấm thêm số liệu/tỷ lệ/tên không có trong bài.
- Cột `source` luôn là **link bài gốc** để truy vết.
- Mọi tin AI sinh ra đều **"Chờ duyệt"** — bắt buộc qua mắt cán bộ trước khi công bố.
- Bài không liên quan chủ đề sẽ bị bỏ qua (category = "BỎ QUA").

### Chi phí
- Mặc định dùng `claude-opus-4-8` (chất lượng cao nhất). Muốn rẻ hơn cho việc tóm tắt hàng loạt, đổi `CAU_HINH.model` thành `claude-haiku-4-5`.
- Mỗi tin chỉ tốn một lượng nhỏ token; giới hạn `soTinToiDaMoiLan` giúp kiểm soát chi phí mỗi lần chạy.
