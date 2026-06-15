// ============================================================
// CÁC THÀNH PHẦN GIAO DIỆN DÙNG CHUNG (TÁI SỬ DỤNG NHIỀU NƠI)
// Viết bằng React + TailwindCSS thuần, không phụ thuộc thư viện ngoài.
// ============================================================
import React from "react";
import { useNavigate } from "react-router-dom";

// ----- Thanh tiêu đề trên cùng, có nút quay lại Trang chủ -----
export function AppHeader({ title }) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-10 bg-primary text-white flex items-center gap-3 px-4 py-3 shadow-md">
      {/* Nút quay lại trang chủ */}
      <button
        onClick={() => navigate("/")}
        className="text-2xl leading-none w-8 h-8 flex items-center justify-center -ml-1"
        aria-label="Quay lại"
      >
        ‹
      </button>
      <h1 className="font-semibold text-base truncate">{title}</h1>
    </div>
  );
}

// ----- Vòng xoay "đang tải" -----
export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-9 h-9 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
