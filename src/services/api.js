// ============================================================
// TẦNG GIAO TIẾP DỮ LIỆU (API SERVICE)
// Đây là "cầu nối" duy nhất giữa giao diện và nguồn dữ liệu.
//
// CƠ CHẾ: Hiện tại đang chạy ở chế độ MOCK (dữ liệu giả lập).
// Khi có Google Sheets/Airtable thật, chỉ cần:
//   1. Đổi USE_MOCK = false
//   2. Điền các URL API vào object API_CONFIG bên dưới
// => Toàn bộ giao diện KHÔNG cần sửa một dòng nào.
// ============================================================

import { MOCK_NEWS, MOCK_QUIZ, MOCK_DEPARTMENTS } from "../mock/data";

// Bật/tắt chế độ giả lập. Đặt false khi đã có API thật.
const USE_MOCK = true;

// Cấu hình endpoint thật (điền sau).
// GỢI Ý: dùng dịch vụ "SheetDB", "Sheety", "Google Apps Script Web App"
// hoặc Airtable REST API để biến Google Sheet thành API JSON.
const API_CONFIG = {
  newsUrl: "https://api.sheetdb.io/v1/XXXXXX?sheet=TinTuc",
  quizUrl: "https://api.sheetdb.io/v1/XXXXXX?sheet=CauHoi",
  feedbackUrl: "https://api.sheetdb.io/v1/XXXXXX?sheet=KienNghi",
};

// Hàm tiện ích: giả lập độ trễ mạng để giao diện loading trông thật hơn.
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ------------------------------------------------------------
// 1. LẤY DANH SÁCH TIN TỨC / ĐIỂM TIN PHÁP LUẬT
// ------------------------------------------------------------
export async function fetchNews() {
  if (USE_MOCK) {
    await delay(400); // giả lập gọi mạng
    return MOCK_NEWS;
  }

  // --- CODE THẬT (đã viết sẵn, bỏ comment khi dùng) ---
  const res = await fetch(API_CONFIG.newsUrl);
  if (!res.ok) throw new Error("Không tải được tin tức");
  const rows = await res.json();
  // Chuẩn hóa dữ liệu từ Sheet.
  // Trên Sheet, 2 cột "theme" và "infographic" lưu dưới dạng chuỗi JSON
  // (do AI hoặc cán bộ sinh ra) => ta parse lại thành object để app dùng.
  return rows.map((row) => ({
    ...row,
    readTime: Number(row.readTime) || 3,
    theme:
      typeof row.theme === "string" ? safeJson(row.theme) : row.theme,
    infographic:
      typeof row.infographic === "string"
        ? safeJson(row.infographic)
        : row.infographic,
  }));
}

// Parse JSON an toàn: lỗi thì trả về object rỗng thay vì làm sập app.
function safeJson(str) {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

// ------------------------------------------------------------
// 2. LẤY DANH SÁCH CÂU HỎI TRẮC NGHIỆM
// ------------------------------------------------------------
export async function fetchQuiz() {
  if (USE_MOCK) {
    await delay(400);
    return MOCK_QUIZ;
  }

  // --- CODE THẬT ---
  const res = await fetch(API_CONFIG.quizUrl);
  if (!res.ok) throw new Error("Không tải được câu hỏi");
  const rows = await res.json();
  // Trên Sheet, các đáp án nằm ở 4 cột optionA..optionD,
  // cột correctIndex là số 0-3. Ta gộp lại thành object chuẩn.
  return rows.map((row) => ({
    id: row.id,
    question: row.question,
    options: [row.optionA, row.optionB, row.optionC, row.optionD],
    correctIndex: Number(row.correctIndex),
    explanation: row.explanation,
  }));
}

// ------------------------------------------------------------
// 3. LẤY DANH MỤC BAN CHUYÊN TRÁCH (cho dropdown của Form)
// ------------------------------------------------------------
export async function fetchDepartments() {
  if (USE_MOCK) {
    await delay(150);
    return MOCK_DEPARTMENTS;
  }
  // Có thể lấy từ 1 sheet riêng; ở đây trả về cố định cho gọn.
  return MOCK_DEPARTMENTS;
}

// ------------------------------------------------------------
// 4. GỬI KIẾN NGHỊ / VƯỚNG MẮC (ghi 1 dòng mới vào Sheet)
// ------------------------------------------------------------
export async function submitFeedback(payload) {
  // payload = { title, content, department, sender, createdAt }
  if (USE_MOCK) {
    await delay(600);
    console.log("[MOCK] Đã gửi kiến nghị:", payload);
    return { success: true, id: "KN" + Date.now() };
  }

  // --- CODE THẬT: gửi POST để thêm dòng mới vào Google Sheet ---
  const res = await fetch(API_CONFIG.feedbackUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // SheetDB nhận dữ liệu theo định dạng { data: { ...cột:giá trị } }
    body: JSON.stringify({ data: payload }),
  });
  if (!res.ok) throw new Error("Gửi kiến nghị thất bại");
  return res.json();
}

// ============================================================
// (THAM KHẢO) LUỒNG "LẤY TIN INTERNET -> AI SINH INFOGRAPHIC"
// App tĩnh không tự đọc tin từ internet được (vướng CORS, không có máy chủ).
// Cần một "trợ lý nền" chạy định kỳ ở phía sau, gồm 4 bước:
//
//   1) THU THẬP: máy chủ nhỏ (Google Apps Script / n8n / serverless) đọc
//      RSS/cổng thông tin về: chính quyền địa phương 2 cấp, hoạt động HĐND
//      cấp xã, Thường trực HĐND tỉnh Thanh Hóa, tin pháp luật mới.
//
//   2) TÓM TẮT BẰNG AI: đưa bài viết cho mô hình ngôn ngữ (vd Claude) kèm
//      yêu cầu trả về ĐÚNG cấu trúc JSON mà app cần:
//        { category, title, summary, source, icon, theme:{c1,c2,accent},
//          infographic:{ badge, headline, stats:[{v,l}], points:[...] } }
//
//   3) SINH ẢNH (tùy chọn): nếu muốn ra file ảnh thật, dùng API tạo ảnh
//      (vd Canva/Bg image generation) từ JSON trên. Còn nếu dùng app này,
//      KHÔNG cần bước ảnh — component Infographic.jsx tự dựng poster đẹp
//      từ chính JSON đó, luôn sắc nét và đồng bộ thương hiệu.
//
//   4) GHI VÀO SHEET: máy chủ ghi mỗi tin thành 1 dòng ở sheet "TinTuc"
//      (cột theme/infographic lưu chuỗi JSON). App đọc lên là hiển thị ngay.
//
// => Cán bộ chỉ cần duyệt nội dung do AI đề xuất trên Google Sheet trước
//    khi công khai, đảm bảo chính xác và đúng định hướng.
// ============================================================
