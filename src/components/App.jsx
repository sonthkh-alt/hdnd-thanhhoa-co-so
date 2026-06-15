// ============================================================
// COMPONENT GỐC: ĐIỀU HƯỚNG (ROUTER) GIỮA CÁC PHÂN HỆ
// Dùng HashRouter của react-router-dom (đường dẫn dạng /#/...).
// Lý do chọn HashRouter:
//   - Chạy tốt trên GitHub Pages mà KHÔNG bị lỗi 404 khi tải lại trang.
//   - Chạy tốt cả trong môi trường webview của Zalo.
//   - Không phụ thuộc môi trường Zalo nên không bị "màn hình trắng".
// ============================================================
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import HomePage from "./HomePage";
import NewsComponent from "./NewsComponent";
import QuizComponent from "./QuizComponent";
import FeedbackComponent from "./FeedbackComponent";

export default function MyApp() {
  return (
    <HashRouter>
      {/* Khai báo các đường dẫn (route) tương ứng từng phân hệ */}
      <Routes>
        {/* Trang chủ - 3 phân hệ */}
        <Route path="/" element={<HomePage />} />
        {/* Phân hệ 1: Điểm tin pháp luật */}
        <Route path="/tin-tuc" element={<NewsComponent />} />
        {/* Phân hệ 2: Thử tài đại biểu (Quiz) */}
        <Route path="/trac-nghiem" element={<QuizComponent />} />
        {/* Phân hệ 3: Gửi kiến nghị & vướng mắc */}
        <Route path="/kien-nghi" element={<FeedbackComponent />} />
      </Routes>
    </HashRouter>
  );
}
