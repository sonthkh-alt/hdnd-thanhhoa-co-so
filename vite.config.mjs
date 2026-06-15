import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import zmp from "zmp-vite-plugin";

// Cấu hình build cho Zalo Mini App.
// zmp-vite-plugin đóng gói ứng dụng theo chuẩn của nền tảng Zalo,
// react() cho phép dùng cú pháp JSX của ReactJS.
export default defineConfig({
  root: "./src",
  base: "",
  plugins: [zmp(), react()],
});
