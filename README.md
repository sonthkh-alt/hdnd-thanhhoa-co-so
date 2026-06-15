# HĐND tỉnh Thanh Hóa đồng hành với Cơ Sở — Zalo Mini App (Prototype)

Nguyên mẫu Zalo Mini App gồm 3 phân hệ: **Điểm tin pháp luật**, **Thử tài đại biểu (Quiz)**, **Gửi kiến nghị & vướng mắc**. Backend tinh gọn bằng **Google Sheets** (qua API JSON), cán bộ Văn phòng chỉ cần nhập liệu trên bảng tính.

---

## 1. Cấu trúc thư mục

```
Zalominiapp/
├── app-config.json            # Cấu hình Zalo Mini App (tên, màu header...)
├── package.json               # Khai báo thư viện & lệnh chạy
├── vite.config.mjs            # Cấu hình build (Vite + zmp plugin)
├── tailwind.config.js         # Cấu hình TailwindCSS
├── postcss.config.js          # Xử lý CSS
└── src/
    ├── index.html             # Trang gốc, điểm gắn ứng dụng
    ├── app.jsx                # Entry point - render App vào HTML
    ├── css/
    │   └── app.css            # Nạp Tailwind + style chung
    ├── mock/
    │   └── data.js            # DỮ LIỆU GIẢ LẬP (mô phỏng Google Sheets)
    ├── services/
    │   └── api.js             # Hàm fetch/POST — đổi 1 chỗ là chạy API thật
    └── components/
        ├── App.jsx            # Router điều hướng giữa các phân hệ
        ├── HomePage.jsx       # Trang chủ — 3 thẻ phân hệ
        ├── NewsComponent.jsx  # Phân hệ 1 — Infographic pháp luật (slide lật)
        ├── QuizComponent.jsx  # Phân hệ 2 — Trắc nghiệm + giải thích + chấm điểm
        └── FeedbackComponent.jsx # Phân hệ 3 — Form gửi kiến nghị
```

---

## 2. Cách chạy thử nguyên mẫu

```bash
# B1: Cài Zalo Mini App CLI (chỉ làm 1 lần cho máy)
npm install -g zmp-cli

# B2: Cài thư viện của dự án (chạy trong thư mục Zalominiapp)
npm install

# B3: Chạy bản xem trước trên trình duyệt / Zalo Studio
zmp start
```

> App chạy ngay với **dữ liệu giả lập** trong `src/mock/data.js` (biến `USE_MOCK = true` trong `services/api.js`). Chưa cần Google Sheets vẫn xem được đầy đủ giao diện.

Đăng nhập tài khoản nhà phát triển tại **https://mini.zalo.me** để lấy App ID, sau đó `zmp deploy` để đưa lên Zalo.

---

## 3. Thiết lập Google Sheets làm cơ sở dữ liệu

### Bước 1 — Tạo 1 Google Sheet với 3 trang tính (sheet/tab)

**Tab 1: `TinTuc`** (Phân hệ Điểm tin pháp luật)

| id | title | summary | category | coverImage | slides | publishedAt |
|----|-------|---------|----------|-----------|--------|-------------|
| TT001 | Luật Đất đai 2024... | Tóm tắt ngắn | Đất đai | https://.../bia.jpg | https://.../s1.jpg, https://.../s2.jpg | 2025-06-01 |

> Cột `slides`: dán nhiều link ảnh, **cách nhau bằng dấu phẩy** (hàm `fetchNews` tự tách thành mảng để lật slide).

**Tab 2: `CauHoi`** (Phân hệ Trắc nghiệm)

| id | question | optionA | optionB | optionC | optionD | correctIndex | explanation |
|----|----------|---------|---------|---------|---------|--------------|-------------|
| Q1 | HĐND cấp xã do ai bầu? | Chủ tịch UBND | Cử tri địa phương | HĐND huyện | Đảng ủy xã | 1 | HĐND do cử tri bầu... |

> Cột `correctIndex`: nhập số **0,1,2,3** ứng với đáp án đúng (0 = optionA, 1 = optionB...).

**Tab 3: `KienNghi`** (Phân hệ Gửi kiến nghị — App sẽ tự ghi dữ liệu vào đây)

| id | title | content | department | sender | createdAt | status |
|----|-------|---------|-----------|--------|-----------|--------|
| (tự sinh) | (người dân nhập) | (nội dung) | phap_che / kinh_te_ngan_sach / van_hoa_xa_hoi | Tên đơn vị | (thời gian) | Mới tiếp nhận |

> Để trống các dòng — App sẽ tự thêm dòng mới mỗi khi có người gửi.

### Bước 2 — Biến Google Sheet thành API JSON

Cách nhanh nhất (không cần code): dùng **SheetDB.io** hoặc **Sheety.co**.
1. Đăng nhập, dán link Google Sheet, dịch vụ sẽ tạo cho bạn một URL API dạng `https://api.sheetdb.io/v1/XXXXXX`.
2. Mỗi tab truy cập qua tham số `?sheet=TenTab`.

> Lưu ý: chia sẻ Google Sheet ở chế độ cho phép đọc, và cấp quyền cho dịch vụ API.

### Bước 3 — Kết nối App với dữ liệu thật

Mở file `src/services/api.js` và sửa **2 chỗ**:

```js
const USE_MOCK = false; // (1) Tắt chế độ giả lập

const API_CONFIG = {     // (2) Dán URL API của bạn vào đây
  newsUrl:     "https://api.sheetdb.io/v1/XXXXXX?sheet=TinTuc",
  quizUrl:     "https://api.sheetdb.io/v1/XXXXXX?sheet=CauHoi",
  feedbackUrl: "https://api.sheetdb.io/v1/XXXXXX?sheet=KienNghi",
};
```

Lưu lại, chạy lại `zmp start` — App lập tức dùng dữ liệu từ Google Sheets. **Không phải sửa bất kỳ file giao diện nào.**

---

## 4. Quy trình vận hành cho cán bộ Văn phòng

- **Cập nhật tin/luật mới** → thêm 1 dòng vào tab `TinTuc`.
- **Thêm câu hỏi trắc nghiệm** → thêm 1 dòng vào tab `CauHoi`.
- **Tiếp nhận & xử lý kiến nghị** → mở tab `KienNghi`, lọc theo cột `department`, cập nhật cột `status` (vd: "Đang xử lý", "Đã trả lời").

Tất cả thay đổi trên bảng tính sẽ hiển thị trên App sau khi người dùng tải lại — không cần lập trình.
