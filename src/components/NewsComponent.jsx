// ============================================================
// PHÂN HỆ 1: ĐIỂM TIN PHÁP LUẬT
// - Lọc tin theo danh mục (chính quyền 2 cấp, HĐND cấp xã...).
// - Mỗi tin mở ra infographic nhiều trang để lật xem (dựng từ dữ liệu).
// ============================================================
import React, { useEffect, useMemo, useState } from "react";
import { AppHeader, Spinner } from "./common";
import InfographicPanel, { panelKeys } from "./Infographic";
import { fetchNews } from "../services/api";

export default function NewsComponent() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tất cả"); // danh mục đang lọc
  const [selected, setSelected] = useState(null); // tin đang xem infographic
  const [panel, setPanel] = useState(0); // trang infographic đang hiển thị

  useEffect(() => {
    fetchNews()
      .then((data) => setNews(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Tạo danh sách danh mục từ dữ liệu (tự động, không cần khai báo tay).
  const categories = useMemo(
    () => ["Tất cả", ...new Set(news.map((n) => n.category))],
    [news]
  );

  // Lọc tin theo danh mục đang chọn.
  const visible =
    filter === "Tất cả" ? news : news.filter((n) => n.category === filter);

  // Mở 1 tin -> về trang đầu của infographic.
  const openNews = (item) => {
    setSelected(item);
    setPanel(0);
  };

  // ----- CHẾ ĐỘ XEM INFOGRAPHIC (LẬT TRANG) -----
  if (selected) {
    const keys = panelKeys(selected); // các trang có dữ liệu
    const total = keys.length;
    const go = (step) => setPanel((p) => (p + step + total) % total);

    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage: `linear-gradient(160deg, ${selected.theme.c2}, #0b0b13)`,
        }}
      >
        {/* Thanh trên: đóng + tiến độ trang */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-2 text-white">
          <button
            onClick={() => setSelected(null)}
            className="w-9 h-9 rounded-full glass flex items-center justify-center text-xl active:scale-90 transition"
          >
            ✕
          </button>
          {/* Vạch tiến độ từng trang (kiểu story) */}
          <div className="flex-1 flex gap-1.5">
            {keys.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition ${
                  i <= panel ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Poster infographic */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm animate-fadeUp" key={panel}>
            <InfographicPanel item={selected} panel={keys[panel]} />
          </div>
        </div>

        {/* Điều khiển lật trang */}
        <div className="flex items-center justify-between px-6 py-5">
          <button
            onClick={() => go(-1)}
            className="text-white glass rounded-full w-12 h-12 text-xl active:scale-90 transition"
          >
            ‹
          </button>
          <span className="text-white/80 text-sm">
            Trang {panel + 1}/{total}
          </span>
          <button
            onClick={() => go(1)}
            className="text-white glass rounded-full w-12 h-12 text-xl active:scale-90 transition"
          >
            ›
          </button>
        </div>
      </div>
    );
  }

  // ----- CHẾ ĐỘ DANH SÁCH TIN -----
  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader
        title="📰 Điểm Tin Pháp Luật"
        subtitle="Cập nhật chính quyền 2 cấp • HĐND cơ sở"
      />

      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Thanh lọc danh mục (cuộn ngang) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3 sticky top-[68px] z-10 bg-gray-100/80 backdrop-blur">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-semibold transition ${
                  filter === c
                    ? "bg-primary text-white shadow-soft"
                    : "bg-white text-ink-soft"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Cảnh báo minh bạch: đây là dữ liệu mẫu, không phải tin chính thống */}
          <div className="mx-4 mb-3 flex gap-2 items-start bg-amber-50 border border-amber-200 rounded-2xl px-3.5 py-2.5">
            <span className="text-base leading-none mt-0.5">ℹ️</span>
            <p className="text-[12px] text-amber-800 leading-snug">
              Đây là <b>dữ liệu mẫu</b> về kiến thức pháp luật. Tin thời sự sẽ
              được cập nhật từ <b>nguồn chính thống</b> trước khi công bố.
            </p>
          </div>

          {/* Danh sách thẻ tin */}
          <div className="px-4 pb-4 space-y-4">
            {visible.map((item) => (
              <div
                key={item.id}
                onClick={() => openNews(item)}
                className="bg-white rounded-3xl overflow-hidden shadow-soft active:scale-[0.98] transition cursor-pointer animate-fadeUp"
              >
                {/* "Ảnh bìa" infographic dựng bằng gradient + biểu tượng */}
                <div
                  className="relative h-32 flex items-center justify-center"
                  style={{
                    backgroundImage: `linear-gradient(140deg, ${item.theme.c1}, ${item.theme.c2})`,
                  }}
                >
                  <div className="absolute inset-0 dot-grid opacity-40" />
                  <span className="text-5xl drop-shadow-lg">{item.icon}</span>
                  <span
                    className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: item.theme.accent, color: item.theme.c2 }}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-ink leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-ink-soft text-[13px] mt-1 line-clamp-2">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between mt-3 text-[12px] text-gray-400">
                    <span>🗓 {item.publishedAt}</span>
                    <span className="text-primary font-semibold">
                      Xem infographic ›
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
