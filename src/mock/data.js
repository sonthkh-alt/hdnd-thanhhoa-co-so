// ============================================================
// DỮ LIỆU GIẢ LẬP (MOCK DATA)
// Cấu trúc các object dưới đây được thiết kế GIỐNG HỆT cấu trúc
// dữ liệu mà Google Sheets / Airtable sẽ trả về qua API.
// => Khi có API thật, ta chỉ cần đổi nguồn lấy dữ liệu trong file
//    services/api.js mà KHÔNG phải sửa lại giao diện.
// ============================================================

// ----- BẢNG 1: TIN TỨC / ĐIỂM TIN PHÁP LUẬT (Phân hệ 1) -----
// Mỗi bản tin tương ứng 1 dòng (row) trong Google Sheet "TinTuc".
export const MOCK_NEWS = [
  {
    id: "TT001",
    title: "Luật Đất đai 2024: 5 điểm mới cán bộ xã cần nắm",
    summary:
      "Tổng hợp những thay đổi quan trọng nhất về bồi thường, tái định cư và bảng giá đất áp dụng từ 01/2025.",
    category: "Đất đai",
    coverImage:
      "https://placehold.co/800x500/b91c1c/ffffff?text=Luat+Dat+Dai+2024",
    // Mảng ảnh infographic để người dùng "lật" xem (slide ảnh).
    slides: [
      "https://placehold.co/800x1000/b91c1c/ffffff?text=Slide+1:+Bang+gia+dat",
      "https://placehold.co/800x1000/991b1b/ffffff?text=Slide+2:+Boi+thuong",
      "https://placehold.co/800x1000/7f1d1d/ffffff?text=Slide+3:+Tai+dinh+cu",
    ],
    publishedAt: "2025-06-01",
  },
  {
    id: "TT002",
    title: "Nghị quyết HĐND tỉnh về phân bổ ngân sách 2025",
    summary:
      "Nguyên tắc, tiêu chí và định mức phân bổ vốn đầu tư công cho cấp xã, phường trên địa bàn tỉnh.",
    category: "Ngân sách",
    coverImage:
      "https://placehold.co/800x500/1d4ed8/ffffff?text=Ngan+Sach+2025",
    slides: [
      "https://placehold.co/800x1000/1d4ed8/ffffff?text=Slide+1:+Nguyen+tac",
      "https://placehold.co/800x1000/1e40af/ffffff?text=Slide+2:+Dinh+muc",
    ],
    publishedAt: "2025-05-20",
  },
  {
    id: "TT003",
    title: "Mô hình hay: 'Ngày thứ 7 vì dân' tại xã Đông Sơn",
    summary:
      "Kinh nghiệm tổ chức tiếp công dân định kỳ cuối tuần giúp giải quyết nhanh thủ tục hành chính.",
    category: "Mô hình hay",
    coverImage:
      "https://placehold.co/800x500/15803d/ffffff?text=Mo+Hinh+Hay",
    slides: [
      "https://placehold.co/800x1000/15803d/ffffff?text=Slide+1:+Cach+lam",
      "https://placehold.co/800x1000/166534/ffffff?text=Slide+2:+Ket+qua",
    ],
    publishedAt: "2025-05-10",
  },
];

// ----- BẢNG 2: CÂU HỎI TRẮC NGHIỆM (Phân hệ 2) -----
// Mỗi câu hỏi tương ứng 1 dòng trong Google Sheet "CauHoi".
// correctIndex: vị trí đáp án đúng trong mảng options (bắt đầu từ 0).
export const MOCK_QUIZ = [
  {
    id: "Q1",
    question:
      "Theo Luật Tổ chức chính quyền địa phương, HĐND cấp xã do ai bầu ra?",
    options: [
      "Chủ tịch UBND xã chỉ định",
      "Cử tri ở địa phương bầu ra",
      "HĐND cấp huyện cử xuống",
      "Đảng ủy xã phân công",
    ],
    correctIndex: 1,
    explanation:
      "HĐND là cơ quan quyền lực nhà nước ở địa phương, do cử tri địa phương trực tiếp bầu ra.",
  },
  {
    id: "Q2",
    question: "Nhiệm kỳ của mỗi khóa HĐND các cấp hiện nay là bao nhiêu năm?",
    options: ["3 năm", "4 năm", "5 năm", "6 năm"],
    correctIndex: 2,
    explanation: "Nhiệm kỳ của mỗi khóa HĐND là 5 năm, kể từ kỳ họp thứ nhất.",
  },
  {
    id: "Q3",
    question: "Ban nào của HĐND phụ trách lĩnh vực ngân sách, đầu tư?",
    options: [
      "Ban Pháp chế",
      "Ban Kinh tế - Ngân sách",
      "Ban Văn hóa - Xã hội",
      "Ban Dân tộc",
    ],
    correctIndex: 1,
    explanation:
      "Ban Kinh tế - Ngân sách chịu trách nhiệm thẩm tra các vấn đề về kinh tế, ngân sách, đầu tư công.",
  },
  {
    id: "Q4",
    question: "Kỳ họp thường lệ của HĐND mỗi năm tổ chức tối thiểu mấy lần?",
    options: ["1 lần", "2 lần", "3 lần", "4 lần"],
    correctIndex: 1,
    explanation:
      "HĐND họp thường lệ mỗi năm ít nhất 2 kỳ (giữa năm và cuối năm).",
  },
  {
    id: "Q5",
    question:
      "Hình thức giám sát nào KHÔNG thuộc thẩm quyền của HĐND cấp xã?",
    options: [
      "Chất vấn tại kỳ họp",
      "Giám sát chuyên đề",
      "Xét xử các vụ án hình sự",
      "Lấy phiếu tín nhiệm",
    ],
    correctIndex: 2,
    explanation:
      "Xét xử án hình sự thuộc thẩm quyền của Tòa án nhân dân, không phải chức năng giám sát của HĐND.",
  },
];

// ----- BẢNG 3: DANH MỤC BAN CHUYÊN TRÁCH (dùng cho Form kiến nghị) -----
export const MOCK_DEPARTMENTS = [
  { value: "phap_che", label: "Ban Pháp chế" },
  { value: "kinh_te_ngan_sach", label: "Ban Kinh tế - Ngân sách" },
  { value: "van_hoa_xa_hoi", label: "Ban Văn hóa - Xã hội" },
];
