// ============================================================
// CÁC THÀNH PHẦN GIAO DIỆN DÙNG CHUNG (TÁI SỬ DỤNG NHIỀU NƠI)
// React + TailwindCSS thuần — phong cách "HĐND số" hiện đại.
// ============================================================
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ----- Thanh tiêu đề gradient, có nút quay lại -----
export function AppHeader({ title, subtitle }) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-20 bg-gradient-to-r from-primary-dark to-primary text-white shadow-glow">
      <div className="flex items-center gap-3 px-4 pt-4 pb-4">
        <button
          onClick={() => navigate("/")}
          className="w-9 h-9 rounded-full glass flex items-center justify-center text-xl active:scale-90 transition"
          aria-label="Quay lại"
        >
          ‹
        </button>
        <div className="min-w-0">
          <h1 className="font-bold text-base leading-tight truncate">{title}</h1>
          {subtitle && (
            <p className="text-[12px] text-white/80 truncate">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ----- Vòng xoay "đang tải" có thương hiệu -----
export function Spinner({ label = "Đang tải dữ liệu..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <span className="text-sm text-ink-soft">{label}</span>
    </div>
  );
}

// ----- Thanh điều hướng dưới cùng (kiểu native app) -----
const TABS = [
  { path: "/", icon: "🏠", label: "Trang chủ" },
  { path: "/tin-tuc", icon: "📰", label: "Điểm tin" },
  { path: "/trac-nghiem", icon: "🎯", label: "Thử tài" },
  { path: "/kien-nghi", icon: "✍️", label: "Kiến nghị" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur border-t border-gray-200 shadow-[0_-4px_20px_-8px_rgba(15,23,42,0.15)]">
      <div className="max-w-md mx-auto grid grid-cols-4">
        {TABS.map((t) => {
          const active = pathname === t.path;
          return (
            <button
              key={t.path}
              onClick={() => navigate(t.path)}
              className="flex flex-col items-center gap-0.5 py-2.5 active:scale-95 transition"
            >
              <span
                className={`text-xl transition ${
                  active ? "scale-110" : "opacity-50 grayscale"
                }`}
              >
                {t.icon}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-primary font-bold" : "text-gray-400"
                }`}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
