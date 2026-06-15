import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ============================================================
// CẤU HÌNH BUILD RIÊNG CHO BẢN WEB (GitHub Pages)
// Khác với vite.config.mjs (dùng cho Zalo): bản này KHÔNG dùng
// zmp-vite-plugin, mà build ra trang web tĩnh thông thường để
// host trên GitHub Pages.
//
// "base" sẽ được GitHub Actions truyền vào qua cờ --base=/ten-repo/
// để các file tĩnh (js, css) nạp đúng đường dẫn.
// ============================================================
export default defineConfig({
  root: "./src",
  plugins: [react()],
  build: {
    outDir: "../dist", // kết quả build đặt ở thư mục /dist của dự án
    emptyOutDir: true,
  },
});
