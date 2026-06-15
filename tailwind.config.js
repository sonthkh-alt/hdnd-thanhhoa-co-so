/** @type {import('tailwindcss').Config} */
// Cấu hình TailwindCSS - hệ thiết kế "HĐND số": đỏ cờ + vàng sao + mực navy.
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        // Đỏ chủ đạo (đỏ cờ) - dùng cho thương hiệu cơ quan nhà nước.
        primary: {
          DEFAULT: "#C8102E",
          dark: "#9B0E22",
          light: "#FFF1F2",
        },
        // Vàng sao - màu nhấn sang trọng (huy hiệu, điểm nhấn).
        gold: {
          DEFAULT: "#F4B400",
          dark: "#C99700",
          light: "#FFF8E1",
        },
        // Mực navy - màu chữ và nền tối.
        ink: {
          DEFAULT: "#0F172A",
          soft: "#334155",
        },
      },
      fontFamily: {
        // Font Be Vietnam Pro hiển thị tiếng Việt rất đẹp (nạp trong index.html).
        sans: ["'Be Vietnam Pro'", "system-ui", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px -6px rgba(15,23,42,0.12)",
        soft: "0 2px 12px -4px rgba(15,23,42,0.10)",
        glow: "0 10px 34px -8px rgba(200,16,46,0.45)",
        gold: "0 10px 30px -8px rgba(244,180,0,0.5)",
      },
      borderRadius: {
        "2.5xl": "1.25rem",
        "4xl": "2rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease-out both",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};
