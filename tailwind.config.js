/** @type {import('tailwindcss').Config} */
// Cấu hình TailwindCSS - quét toàn bộ file jsx trong thư mục src để sinh ra class.
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        // Bộ màu chủ đạo: đỏ cờ (thể hiện cơ quan nhà nước) + xám trung tính.
        primary: {
          DEFAULT: "#b91c1c", // Đỏ chủ đạo
          dark: "#991b1b",
          light: "#fef2f2",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
