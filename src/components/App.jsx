// ============================================================
// COMPONENT GỐC: ĐIỀU HƯỚNG (ROUTER) GIỮA CÁC PHÂN HỆ
// Dùng bộ component App + ZMPRouter của thư viện zmp-ui để
// có hiệu ứng chuyển trang mượt mà chuẩn Zalo Mini App.
// ============================================================
import React from "react";
import { App, ZMPRouter, AnimationRoutes, Route, SnackbarProvider } from "zmp-ui";

import HomePage from "./HomePage";
import NewsComponent from "./NewsComponent";
import QuizComponent from "./QuizComponent";
import FeedbackComponent from "./FeedbackComponent";

export default function MyApp() {
  return (
    // App: bao bọc toàn bộ ứng dụng, cung cấp theme của Zalo.
    <App>
      {/* SnackbarProvider: cho phép hiện thông báo (toast) ở mọi nơi */}
      <SnackbarProvider>
        {/* ZMPRouter: quản lý lịch sử điều hướng (back/forward) */}
        <ZMPRouter>
          {/* AnimationRoutes: khai báo các đường dẫn (route) của app */}
          <AnimationRoutes>
            {/* Trang chủ - 3 phân hệ */}
            <Route path="/" element={<HomePage />} />
            {/* Phân hệ 1: Điểm tin pháp luật */}
            <Route path="/tin-tuc" element={<NewsComponent />} />
            {/* Phân hệ 2: Thử tài đại biểu (Quiz) */}
            <Route path="/trac-nghiem" element={<QuizComponent />} />
            {/* Phân hệ 3: Gửi kiến nghị & vướng mắc */}
            <Route path="/kien-nghi" element={<FeedbackComponent />} />
          </AnimationRoutes>
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
}
