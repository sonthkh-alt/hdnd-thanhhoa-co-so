// ============================================================
// DỮ LIỆU GIẢ LẬP (MOCK DATA)
// Cấu trúc bên dưới mô phỏng dữ liệu Google Sheets / Airtable trả về.
//
// NGUYÊN TẮC QUAN TRỌNG: KHÔNG BỊA SỐ LIỆU / SỰ KIỆN.
// Dữ liệu tin dưới đây CHỈ gồm kiến thức pháp luật mang tính nền tảng,
// có thể tra cứu trong Luật Tổ chức chính quyền địa phương. KHÔNG đưa
// con số thống kê, tỷ lệ %, hay tường thuật sự kiện cụ thể nào.
//
// Tin thời sự thật (hoạt động của Thường trực HĐND tỉnh, tin mới...) sẽ
// được cập nhật TỪ NGUỒN CHÍNH THỐNG qua Google Sheets, hoặc do luồng AI
// tóm tắt kèm trích dẫn nguồn rồi cán bộ duyệt (xem services/api.js và
// thư mục google-apps-script/). App luôn hiển thị nhãn "Dữ liệu mẫu".
// ============================================================

// ----- BẢNG 1: TIN TỨC / ĐIỂM TIN PHÁP LUẬT (Phân hệ 1) -----
export const MOCK_NEWS = [
  {
    id: "TT001",
    category: "Chính quyền 2 cấp",
    title: "Mô hình chính quyền địa phương 2 cấp",
    summary:
      "Chính quyền địa phương được tổ chức ở cấp tỉnh và cấp xã/phường, gắn với đẩy mạnh phân cấp, phân quyền cho cơ sở.",
    source: "Luật Tổ chức chính quyền địa phương",
    publishedAt: "2026-06-10",
    readTime: 3,
    icon: "🏛️",
    theme: { c1: "#C8102E", c2: "#7A0A1B", accent: "#F4B400" },
    infographic: {
      badge: "CHÍNH QUYỀN ĐỊA PHƯƠNG 2 CẤP",
      headline: "Tổ chức ở cấp tỉnh và cấp xã/phường",
      // Thẻ mang tính mô tả vai trò (không phải số liệu thống kê).
      stats: [
        { v: "Cấp tỉnh", l: "Định hướng, ban hành cơ chế, giám sát" },
        { v: "Cấp xã", l: "Trực tiếp phục vụ người dân, doanh nghiệp" },
      ],
      points: [
        "Chính quyền địa phương gồm cấp tỉnh và cấp xã/phường.",
        "Đẩy mạnh phân cấp, phân quyền gắn với trách nhiệm người đứng đầu.",
        "Chính quyền cơ sở là nơi trực tiếp tiếp nhận, giải quyết việc của dân.",
      ],
    },
  },
  {
    id: "TT002",
    category: "HĐND cấp xã",
    title: "Chức năng, nhiệm vụ của HĐND cấp xã",
    summary:
      "HĐND là cơ quan quyền lực nhà nước ở địa phương, do cử tri bầu, thực hiện ba nhóm chức năng: quyết định, giám sát và đại diện.",
    source: "Luật Tổ chức chính quyền địa phương",
    publishedAt: "2026-06-08",
    readTime: 4,
    icon: "⚖️",
    theme: { c1: "#1D4ED8", c2: "#1E3A8A", accent: "#38BDF8" },
    infographic: {
      badge: "HĐND CẤP XÃ",
      headline: "Ba nhóm chức năng cốt lõi",
      // Các con số dưới đây là quy định pháp luật (xác thực), không phải thống kê.
      stats: [
        { v: "5 năm", l: "Nhiệm kỳ mỗi khóa HĐND" },
        { v: "≥ 2", l: "Kỳ họp thường lệ mỗi năm" },
        { v: "3", l: "Nhóm chức năng chính" },
      ],
      points: [
        "Quyết định: thông qua nghị quyết về phát triển KT-XH, ngân sách địa phương.",
        "Giám sát: theo dõi việc tuân theo pháp luật, chất vấn tại kỳ họp.",
        "Đại diện: tiếp xúc cử tri, phản ánh ý chí, nguyện vọng của nhân dân.",
      ],
    },
  },
  {
    id: "TT003",
    category: "Vai trò Thường trực HĐND",
    title: "Vai trò của Thường trực HĐND giữa hai kỳ họp",
    summary:
      "Thường trực HĐND điều hòa hoạt động của các Ban, đôn đốc giải quyết kiến nghị cử tri và tổ chức giám sát theo quy định.",
    source: "Luật Tổ chức chính quyền địa phương; Luật Hoạt động giám sát của Quốc hội và HĐND",
    publishedAt: "2026-06-05",
    readTime: 3,
    icon: "🤝",
    theme: { c1: "#047857", c2: "#064E3B", accent: "#34D399" },
    infographic: {
      badge: "THƯỜNG TRỰC HĐND",
      headline: "Điều hành — Đôn đốc — Giám sát",
      stats: [
        { v: "Điều hòa", l: "Phối hợp hoạt động các Ban của HĐND" },
        { v: "Đôn đốc", l: "Giải quyết kiến nghị, khiếu nại của cử tri" },
        { v: "Giám sát", l: "Việc thi hành Hiến pháp, pháp luật, nghị quyết" },
      ],
      points: [
        "Triệu tập và chủ tọa các kỳ họp của HĐND.",
        "Đôn đốc, kiểm tra việc giải quyết kiến nghị của cử tri.",
        "Giữ mối liên hệ với đại biểu và tổ chức hoạt động giám sát.",
      ],
    },
  },
];

// ----- BẢNG 2: CÂU HỎI TRẮC NGHIỆM (Phân hệ 2) -----
// Các câu hỏi dựa trên kiến thức pháp luật phổ thông, có thể tra cứu.
export const MOCK_QUIZ = [
  {
    id: "Q1",
    question: "Chính quyền địa phương được tổ chức theo mô hình mấy cấp?",
    options: ["1 cấp", "2 cấp (tỉnh và xã)", "3 cấp", "4 cấp"],
    correctIndex: 1,
    explanation:
      "Theo định hướng tổ chức bộ máy hiện nay, chính quyền địa phương gồm 2 cấp: cấp tỉnh và cấp xã/phường.",
  },
  {
    id: "Q2",
    question: "Nhiệm kỳ của mỗi khóa HĐND là bao nhiêu năm?",
    options: ["3 năm", "4 năm", "5 năm", "6 năm"],
    correctIndex: 2,
    explanation: "Nhiệm kỳ của mỗi khóa HĐND là 5 năm, kể từ kỳ họp thứ nhất.",
  },
  {
    id: "Q3",
    question: "HĐND là cơ quan do ai bầu ra?",
    options: [
      "Do UBND cùng cấp bầu",
      "Do cử tri địa phương bầu",
      "Do HĐND cấp trên chỉ định",
      "Do Chính phủ bổ nhiệm",
    ],
    correctIndex: 1,
    explanation:
      "HĐND là cơ quan quyền lực nhà nước ở địa phương, do cử tri ở địa phương bầu ra.",
  },
  {
    id: "Q4",
    question: "HĐND họp thường lệ mỗi năm tối thiểu mấy kỳ?",
    options: ["1 kỳ", "2 kỳ", "3 kỳ", "4 kỳ"],
    correctIndex: 1,
    explanation:
      "HĐND họp thường lệ mỗi năm ít nhất 2 kỳ (giữa năm và cuối năm).",
  },
  {
    id: "Q5",
    question: "Đâu KHÔNG phải là chức năng của HĐND?",
    options: [
      "Quyết định các vấn đề quan trọng của địa phương",
      "Giám sát việc tuân theo pháp luật ở địa phương",
      "Đại diện cho ý chí, nguyện vọng của nhân dân",
      "Xét xử các vụ án hình sự",
    ],
    correctIndex: 3,
    explanation:
      "Xét xử án hình sự thuộc thẩm quyền của Tòa án nhân dân, không phải chức năng của HĐND.",
  },
];

// ----- BẢNG 3: DANH MỤC BAN CHUYÊN TRÁCH (dùng cho Form kiến nghị) -----
export const MOCK_DEPARTMENTS = [
  { value: "phap_che", label: "Ban Pháp chế", icon: "⚖️" },
  { value: "kinh_te_ngan_sach", label: "Ban Kinh tế - Ngân sách", icon: "💰" },
  { value: "van_hoa_xa_hoi", label: "Ban Văn hóa - Xã hội", icon: "🎓" },
];
