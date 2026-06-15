// ============================================================
// DỮ LIỆU GIẢ LẬP (MOCK DATA)
// Cấu trúc bên dưới mô phỏng dữ liệu Google Sheets / Airtable trả về.
//
// ĐIỂM MỚI: mỗi bản tin có thêm khối "infographic" (dữ liệu có cấu trúc).
// Từ khối này, ứng dụng TỰ DỰNG ra ảnh infographic đẹp ngay trong app
// (không cần ảnh thiết kế sẵn). Đây chính là đầu ra mà luồng "AI infographic"
// sẽ sinh tự động khi lấy tin mới từ internet (xem services/api.js).
//
// LƯU Ý: Nội dung tin dưới đây là DỮ LIỆU MINH HỌA bám sát chủ đề thời sự
// (chính quyền địa phương 2 cấp, HĐND cấp xã, hoạt động Thường trực HĐND
// tỉnh). Khi vận hành thật, cán bộ Văn phòng hoặc luồng AI sẽ cập nhật lại.
// ============================================================

// ----- BẢNG 1: TIN TỨC / ĐIỂM TIN PHÁP LUẬT (Phân hệ 1) -----
export const MOCK_NEWS = [
  {
    id: "TT001",
    category: "Chính quyền 2 cấp",
    title: "Vận hành mô hình chính quyền địa phương 2 cấp",
    summary:
      "Tổ chức bộ máy theo 2 cấp: cấp tỉnh và cấp xã/phường; kết thúc hoạt động cấp huyện, đẩy mạnh phân cấp về cơ sở.",
    source: "Tổng hợp văn bản pháp luật",
    publishedAt: "2026-06-10",
    readTime: 3,
    icon: "🏛️",
    // Bộ màu riêng cho infographic của bản tin này (dạng mã hex).
    theme: { c1: "#C8102E", c2: "#7A0A1B", accent: "#F4B400" },
    infographic: {
      badge: "CHÍNH QUYỀN ĐỊA PHƯƠNG 2 CẤP",
      headline: "Bộ máy tinh gọn — Phục vụ tận cơ sở",
      stats: [
        { v: "2", l: "cấp chính quyền" },
        { v: "100%", l: "thủ tục về xã" },
        { v: "↓", l: "tầng nấc trung gian" },
      ],
      points: [
        "Cấp tỉnh giữ vai trò định hướng, ban hành cơ chế, giám sát.",
        "Cấp xã/phường trực tiếp phục vụ người dân, doanh nghiệp.",
        "Tăng phân cấp, phân quyền gắn với trách nhiệm người đứng đầu.",
      ],
    },
  },
  {
    id: "TT002",
    category: "HĐND cấp xã",
    title: "Nâng cao chất lượng hoạt động HĐND cấp xã",
    summary:
      "Đại biểu HĐND cấp xã đẩy mạnh giám sát, tiếp xúc cử tri và quyết định các vấn đề quan trọng ở địa phương.",
    source: "Tài liệu bồi dưỡng đại biểu",
    publishedAt: "2026-06-08",
    readTime: 4,
    icon: "⚖️",
    theme: { c1: "#1D4ED8", c2: "#1E3A8A", accent: "#38BDF8" },
    infographic: {
      badge: "HĐND CẤP XÃ",
      headline: "3 vai trò cốt lõi của đại biểu cơ sở",
      stats: [
        { v: "≥2", l: "kỳ họp/năm" },
        { v: "5 năm", l: "nhiệm kỳ" },
        { v: "100%", l: "gần dân" },
      ],
      points: [
        "Quyết định: thông qua nghị quyết phát triển KT-XH, ngân sách xã.",
        "Giám sát: theo dõi việc thi hành pháp luật, chất vấn tại kỳ họp.",
        "Đại diện: tiếp xúc, tổng hợp và phản ánh ý kiến cử tri.",
      ],
    },
  },
  {
    id: "TT003",
    category: "Hoạt động HĐND tỉnh",
    title: "Thường trực HĐND tỉnh Thanh Hóa tăng cường giám sát cơ sở",
    summary:
      "Thường trực HĐND tỉnh chỉ đạo giám sát chuyên đề, đôn đốc giải quyết kiến nghị cử tri và đồng hành cùng cấp xã.",
    source: "Cổng thông tin HĐND tỉnh Thanh Hóa",
    publishedAt: "2026-06-05",
    readTime: 3,
    icon: "🤝",
    theme: { c1: "#047857", c2: "#064E3B", accent: "#34D399" },
    infographic: {
      badge: "THƯỜNG TRỰC HĐND TỈNH THANH HÓA",
      headline: "Đồng hành — Lắng nghe — Giải quyết",
      stats: [
        { v: "27", l: "huyện/thị/xã đồng hành" },
        { v: "100%", l: "kiến nghị được phân loại" },
        { v: "24/7", l: "tiếp nhận phản ánh" },
      ],
      points: [
        "Giám sát chuyên đề việc thực hiện nghị quyết tại cơ sở.",
        "Đôn đốc các cơ quan trả lời kiến nghị cử tri đúng hạn.",
        "Hỗ trợ HĐND cấp xã về nghiệp vụ trong mô hình 2 cấp.",
      ],
    },
  },
  {
    id: "TT004",
    category: "Mô hình hay",
    title: "Mô hình 'Chính quyền thân thiện' tại cơ sở",
    summary:
      "Kinh nghiệm số hóa tiếp nhận phản ánh, rút ngắn thời gian xử lý thủ tục hành chính cho người dân.",
    source: "Tổng hợp mô hình tiêu biểu",
    publishedAt: "2026-06-01",
    readTime: 2,
    icon: "🌟",
    theme: { c1: "#B45309", c2: "#7C2D12", accent: "#FBBF24" },
    infographic: {
      badge: "MÔ HÌNH HAY — CÁCH LÀM TỐT",
      headline: "Số hóa để gần dân hơn",
      stats: [
        { v: "-50%", l: "thời gian chờ" },
        { v: "QR", l: "gửi phản ánh" },
        { v: "98%", l: "hài lòng" },
      ],
      points: [
        "Tiếp nhận phản ánh qua mã QR đặt tại nhà văn hóa thôn.",
        "Cán bộ phản hồi tiến độ xử lý ngay trên ứng dụng.",
        "Công khai kết quả để người dân cùng giám sát.",
      ],
    },
  },
];

// ----- BẢNG 2: CÂU HỎI TRẮC NGHIỆM (Phân hệ 2) -----
export const MOCK_QUIZ = [
  {
    id: "Q1",
    question:
      "Mô hình chính quyền địa phương đang được tổ chức theo mấy cấp?",
    options: ["1 cấp", "2 cấp (tỉnh và xã)", "3 cấp", "4 cấp"],
    correctIndex: 1,
    explanation:
      "Chính quyền địa phương được tổ chức theo 2 cấp: cấp tỉnh và cấp xã/phường, nhằm tinh gọn bộ máy và phục vụ tốt hơn ở cơ sở.",
  },
  {
    id: "Q2",
    question: "Nhiệm kỳ của mỗi khóa HĐND hiện nay là bao nhiêu năm?",
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
      "Ban Kinh tế - Ngân sách thẩm tra các vấn đề về kinh tế, ngân sách, đầu tư công.",
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
      "Quyết định các vấn đề của địa phương",
      "Giám sát việc tuân theo pháp luật",
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
