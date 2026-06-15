// ============================================================
// PHÂN HỆ 1: ĐIỂM TIN PHÁP LUẬT
// - Hiển thị danh sách bản tin dạng thẻ.
// - Bấm vào 1 bản tin sẽ mở chế độ xem Infographic (slide ảnh lật).
// ============================================================
import React, { useEffect, useState } from "react";
import { Page, Header, Box, Spinner } from "zmp-ui";
import { fetchNews } from "../services/api";

export default function NewsComponent() {
  const [news, setNews] = useState([]); // danh sách tin
  const [loading, setLoading] = useState(true); // trạng thái đang tải
  const [selected, setSelected] = useState(null); // bản tin đang xem chi tiết
  const [slideIndex, setSlideIndex] = useState(0); // slide ảnh đang hiển thị

  // Tải dữ liệu tin tức 1 lần khi mở trang (useEffect chạy sau render đầu).
  useEffect(() => {
    fetchNews()
      .then((data) => setNews(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Mở 1 bản tin -> reset về slide đầu tiên.
  const openNews = (item) => {
    setSelected(item);
    setSlideIndex(0);
  };

  // Chuyển slide. step = +1 (tiếp) hoặc -1 (lùi).
  const changeSlide = (step) => {
    const total = selected.slides.length;
    // Dùng phép chia lấy dư để slide quay vòng (cuối -> đầu).
    setSlideIndex((prev) => (prev + step + total) % total);
  };

  // ----- CHẾ ĐỘ XEM CHI TIẾT (INFOGRAPHIC) -----
  if (selected) {
    return (
      <Page className="bg-black flex flex-col">
        <Header title={selected.title} showBackIcon={false} />
        {/* Ảnh infographic chiếm phần lớn màn hình */}
        <div className="flex-1 flex items-center justify-center px-2">
          <img
            src={selected.slides[slideIndex]}
            alt={`Slide ${slideIndex + 1}`}
            className="max-h-[70vh] w-auto rounded-lg object-contain"
          />
        </div>

        {/* Thanh điều khiển lật slide */}
        <div className="flex items-center justify-between px-6 py-4 bg-black">
          <button
            onClick={() => changeSlide(-1)}
            className="text-white bg-white/20 rounded-full w-12 h-12 text-xl"
          >
            ‹
          </button>
          <span className="text-white text-sm">
            {slideIndex + 1} / {selected.slides.length}
          </span>
          <button
            onClick={() => changeSlide(1)}
            className="text-white bg-white/20 rounded-full w-12 h-12 text-xl"
          >
            ›
          </button>
        </div>

        {/* Nút quay lại danh sách */}
        <button
          onClick={() => setSelected(null)}
          className="bg-primary text-white py-3 font-semibold"
        >
          ← Quay lại danh sách tin
        </button>
      </Page>
    );
  }

  // ----- CHẾ ĐỘ DANH SÁCH TIN -----
  return (
    <Page className="bg-gray-50">
      <Header title="📰 Điểm Tin Pháp Luật" />

      {/* Đang tải dữ liệu */}
      {loading ? (
        <Box className="flex justify-center py-16">
          <Spinner />
        </Box>
      ) : (
        <div className="p-4 space-y-4">
          {news.map((item) => (
            <div
              key={item.id}
              onClick={() => openNews(item)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
            >
              {/* Ảnh bìa */}
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                {/* Nhãn phân loại */}
                <span className="inline-block bg-primary-light text-primary text-xs font-semibold px-2 py-1 rounded-full mb-2">
                  {item.category}
                </span>
                <h3 className="font-bold text-gray-800 leading-snug">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {item.summary}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  🗓 {item.publishedAt} • {item.slides.length} trang
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}
