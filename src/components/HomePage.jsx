// ============================================================
// TRANG CHỦ — Phong cách "HĐND số": hero sang trọng, tin nổi bật,
// lưới phân hệ hiện đại. Viết bằng React + TailwindCSS thuần.
// ============================================================
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchNews } from "../services/api";

// Dữ liệu 3 phân hệ chính.
const MODULES = [
  {
    path: "/tin-tuc",
    icon: "📰",
    title: "Điểm Tin Pháp Luật",
    desc: "Infographic luật & nghị quyết mới",
    grad: "from-rose-500 to-primary",
  },
  {
    path: "/trac-nghiem",
    icon: "🎯",
    title: "Thử Tài Đại Biểu",
    desc: "Trắc nghiệm nhanh, có chấm điểm",
    grad: "from-blue-500 to-indigo-600",
  },
  {
    path: "/kien-nghi",
    icon: "✍️",
    title: "Gửi Kiến Nghị",
    desc: "Phản ánh tới các Ban chuyên trách",
    grad: "from-emerald-500 to-teal-600",
  },
];

// Lời chào theo buổi trong ngày.
function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return "Chào buổi sáng";
  if (h < 13) return "Chào buổi trưa";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export default function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState(null); // 1 tin nổi bật để preview

  // Lấy tin mới nhất làm "tin nổi bật" trên trang chủ.
  useEffect(() => {
    fetchNews()
      .then((list) => list?.length && setFeatured(list[0]))
      .catch((e) => console.error(e));
  }, []);

  // Ngày hôm nay dạng tiếng Việt.
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ----- HERO ----- */}
      <div className="relative bg-gradient-to-br from-primary-dark via-primary to-primary-dark text-white px-5 pt-8 pb-16 rounded-b-[2.5rem] overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute -top-10 -right-8 w-44 h-44 bg-gold/30 rounded-full blur-3xl" />

        {/* Dòng huy hiệu + cơ quan */}
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gold flex items-center justify-center text-2xl shadow-gold animate-float">
            ★
          </div>
          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-wider text-white/80">
              Thường trực HĐND tỉnh Thanh Hóa
            </p>
            <p className="font-bold">HĐND số — Đồng hành với Cơ Sở</p>
          </div>
        </div>

        {/* Lời chào + ngày */}
        <div className="relative mt-7">
          <h1 className="text-2xl font-extrabold leading-snug">
            {getGreeting()}, <br /> đại biểu &amp; cán bộ cơ sở 👋
          </h1>
          <p className="text-sm text-white/80 mt-1.5 capitalize">📅 {today}</p>
        </div>
      </div>

      {/* ----- TIN NỔI BẬT (đè lên hero) ----- */}
      {featured && (
        <div className="px-4 -mt-10 relative z-10">
          <button
            onClick={() => navigate("/tin-tuc")}
            className="w-full text-left bg-white rounded-3xl shadow-card p-4 flex gap-4 items-center active:scale-[0.98] transition animate-fadeUp"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{
                backgroundImage: `linear-gradient(140deg, ${featured.theme.c1}, ${featured.theme.c2})`,
              }}
            >
              {featured.icon}
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                🔥 Tin nổi bật
              </span>
              <h3 className="font-bold text-ink text-sm mt-1.5 line-clamp-2">
                {featured.title}
              </h3>
            </div>
          </button>
        </div>
      )}

      {/* ----- 3 PHÂN HỆ ----- */}
      <div className="px-4 mt-6">
        <h2 className="font-bold text-ink text-base mb-3 px-1">Tiện ích chính</h2>
        <div className="space-y-3">
          {MODULES.map((m, i) => (
            <button
              key={m.path}
              onClick={() => navigate(m.path)}
              style={{ animationDelay: `${i * 80}ms` }}
              className="w-full flex items-center gap-4 p-4 rounded-3xl bg-white shadow-soft active:scale-[0.98] transition text-left animate-fadeUp"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.grad} flex items-center justify-center text-2xl shadow-soft shrink-0`}
              >
                {m.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-ink text-[15px]">{m.title}</h3>
                <p className="text-ink-soft text-[13px] mt-0.5">{m.desc}</p>
              </div>
              <span className="text-gray-300 text-2xl">›</span>
            </button>
          ))}
        </div>
      </div>

      {/* ----- CÂU KHẨU HIỆU ----- */}
      <div className="px-4 mt-6">
        <div className="rounded-3xl bg-gradient-to-r from-gold-light to-amber-50 border border-gold/30 p-4 flex items-center gap-3">
          <span className="text-2xl">💬</span>
          <p className="text-[13px] text-ink-soft font-medium leading-snug">
            "Gần dân — Sát cơ sở — Lắng nghe và hành động vì lợi ích nhân dân."
          </p>
        </div>
      </div>

      <p className="text-center text-[11px] text-gray-400 mt-6 px-6">
        Phiên bản thử nghiệm • Dữ liệu minh họa
      </p>
    </div>
  );
}
