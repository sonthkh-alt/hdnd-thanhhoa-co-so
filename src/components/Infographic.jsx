// ============================================================
// "MÁY SINH INFOGRAPHIC" — dựng poster trực quan từ dữ liệu JSON.
// Mỗi bản tin được hiển thị thành nhiều "trang" (panel) để lật xem:
//   - bìa  : tiêu đề lớn + biểu tượng
//   - số liệu: 3 con số nổi bật
//   - điểm chính: danh sách gạch đầu dòng
// Toàn bộ vẽ bằng HTML/CSS nên LUÔN sắc nét, không phụ thuộc ảnh có sẵn.
//
// Đây mô phỏng đầu ra của luồng "AI infographic": AI tóm tắt tin thành
// dữ liệu có cấu trúc (badge, headline, stats, points) -> app dựng thành ảnh.
// ============================================================
import React from "react";

// Trả về danh sách các panel có dữ liệu để hiển thị (bỏ panel rỗng).
export function panelKeys(item) {
  const keys = ["cover"];
  if (item.infographic?.stats?.length) keys.push("stats");
  if (item.infographic?.points?.length) keys.push("points");
  return keys;
}

// Vẽ MỘT panel infographic. props: item (bản tin), panel ("cover"/"stats"/"points").
export default function InfographicPanel({ item, panel }) {
  const { theme, infographic: g } = item;

  // Nền gradient + lưới chấm trang trí dùng chung cho mọi panel.
  const bgStyle = {
    backgroundImage: `linear-gradient(150deg, ${theme.c1} 0%, ${theme.c2} 100%)`,
  };

  return (
    <div
      style={bgStyle}
      className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden text-white shadow-2xl flex flex-col"
    >
      {/* Lớp trang trí: lưới chấm + vầng sáng */}
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-2xl opacity-30"
        style={{ background: theme.accent }}
      />

      {/* Thanh thương hiệu trên cùng */}
      <div className="relative flex items-center gap-2 px-5 pt-5">
        <span
          className="text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full"
          style={{ background: theme.accent, color: theme.c2 }}
        >
          {g.badge}
        </span>
      </div>

      {/* ----- NỘI DUNG THEO TỪNG PANEL ----- */}
      {panel === "cover" && (
        <div className="relative flex-1 flex flex-col justify-center px-6">
          <div className="text-7xl mb-4 animate-float">{item.icon}</div>
          <h2 className="text-2xl font-extrabold leading-tight drop-shadow">
            {g.headline}
          </h2>
          <p className="mt-3 text-white/85 text-sm leading-relaxed">
            {item.summary}
          </p>
        </div>
      )}

      {panel === "stats" && (
        <div className="relative flex-1 flex flex-col justify-center px-6">
          <h3 className="text-lg font-bold mb-5 text-white/90">
            {g.headline}
          </h3>
          <div className="space-y-3">
            {g.stats.map((s, i) => (
              <div
                key={i}
                className="glass rounded-2xl px-4 py-3 flex items-center gap-4"
              >
                <span
                  className="text-3xl font-extrabold min-w-[64px]"
                  style={{ color: theme.accent }}
                >
                  {s.v}
                </span>
                <span className="text-sm text-white/90 font-medium">
                  {s.l}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {panel === "points" && (
        <div className="relative flex-1 flex flex-col justify-center px-6">
          <h3 className="text-lg font-bold mb-4 text-white/90">Điểm chính</h3>
          <ul className="space-y-3">
            {g.points.map((p, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span
                  className="mt-0.5 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0"
                  style={{ background: theme.accent, color: theme.c2 }}
                >
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-white/95">
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chân poster: nguồn + thương hiệu HĐND */}
      <div className="relative px-5 pb-5 pt-3 flex items-center justify-between text-[11px] text-white/75 border-t border-white/15">
        <span>🗓 {item.publishedAt} • {item.source}</span>
        <span className="font-semibold">HĐND Thanh Hóa</span>
      </div>
    </div>
  );
}
