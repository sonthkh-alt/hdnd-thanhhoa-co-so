// ============================================================
// TRANG CHỦ - HIỂN THỊ 3 PHÂN HỆ DƯỚI DẠNG THẺ (CARD) BẤM ĐƯỢC
// Viết bằng React + TailwindCSS thuần.
// ============================================================
import React from "react";
import { useNavigate } from "react-router-dom";

// Khai báo dữ liệu 3 phân hệ. Tách riêng để dễ thêm/bớt sau này.
const MODULES = [
  {
    path: "/tin-tuc",
    icon: "📰",
    title: "Điểm Tin Pháp Luật",
    desc: "Tóm tắt luật, nghị quyết mới qua Infographic trực quan",
    bg: "bg-red-50",
    accent: "text-red-700",
  },
  {
    path: "/trac-nghiem",
    icon: "🎯",
    title: "Thử Tài Đại Biểu",
    desc: "Trắc nghiệm nhanh 5 câu, có giải thích & chấm điểm",
    bg: "bg-blue-50",
    accent: "text-blue-700",
  },
  {
    path: "/kien-nghi",
    icon: "✍️",
    title: "Gửi Kiến Nghị & Vướng Mắc",
    desc: "Phản ánh từ cơ sở tới các Ban chuyên trách của HĐND",
    bg: "bg-green-50",
    accent: "text-green-700",
  },
];

export default function HomePage() {
  // Hook điều hướng: gọi navigate("/duong-dan") để chuyển trang.
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* ----- PHẦN ĐẦU TRANG (HERO) ----- */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-5 pt-10 pb-8 text-white rounded-b-3xl shadow-lg">
        <p className="text-sm opacity-90">Thường trực HĐND tỉnh Thanh Hóa</p>
        <h1 className="text-2xl font-bold leading-snug mt-1">
          Đồng hành với Cơ Sở
        </h1>
        <p className="text-sm opacity-90 mt-2">
          Cập nhật pháp luật • Học hỏi mô hình hay • Phản ánh kịp thời
        </p>
      </div>

      {/* ----- DANH SÁCH 3 PHÂN HỆ ----- */}
      <div className="px-4 mt-5 space-y-4">
        {MODULES.map((m) => (
          <button
            key={m.path}
            onClick={() => navigate(m.path)}
            className={`${m.bg} w-full flex items-center gap-4 p-4 rounded-2xl shadow-sm active:scale-[0.98] transition-transform text-left`}
          >
            {/* Biểu tượng phân hệ */}
            <span className="text-3xl">{m.icon}</span>
            <div className="flex-1">
              <h2 className={`font-bold text-base ${m.accent}`}>{m.title}</h2>
              <p className="text-gray-600 text-sm mt-0.5">{m.desc}</p>
            </div>
            <span className="text-gray-400 text-xl">›</span>
          </button>
        ))}
      </div>

      {/* ----- CHÂN TRANG ----- */}
      <p className="text-center text-xs text-gray-400 mt-8 px-6">
        Phiên bản thử nghiệm (Prototype) • Dữ liệu phục vụ minh họa
      </p>
    </div>
  );
}
