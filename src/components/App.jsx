// ============================================================
// COMPONENT GỐC: ĐIỀU HƯỚNG (ROUTER) + KHUNG GIAO DIỆN CHUNG
// Dùng HashRouter (đường dẫn /#/...) để chạy tốt cả trên GitHub Pages
// lẫn trong webview của Zalo, không bị lỗi 404 khi tải lại trang.
// ============================================================
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import HomePage from "./HomePage";
import NewsComponent from "./NewsComponent";
import QuizComponent from "./QuizComponent";
import FeedbackComponent from "./FeedbackComponent";
import { BottomNav } from "./common";

export default function MyApp() {
  return (
    <HashRouter>
      {/* Giới hạn bề rộng tối đa để đẹp cả trên máy tính (giả lập khung mobile) */}
      <div className="max-w-md mx-auto min-h-screen bg-gray-100 relative shadow-xl">
        {/* Chừa khoảng trống dưới cho thanh điều hướng cố định */}
        <div className="pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tin-tuc" element={<NewsComponent />} />
            <Route path="/trac-nghiem" element={<QuizComponent />} />
            <Route path="/kien-nghi" element={<FeedbackComponent />} />
          </Routes>
        </div>
        {/* Thanh điều hướng dưới luôn hiển thị ở mọi trang */}
        <BottomNav />
      </div>
    </HashRouter>
  );
}
