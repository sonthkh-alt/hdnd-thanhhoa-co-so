// ============================================================
// PHÂN HỆ 3: GỬI KIẾN NGHỊ & VƯỚNG MẮC
// Biểu mẫu cho cán bộ xã/phường gửi phản ánh tới HĐND tỉnh.
// Chọn Ban chuyên trách bằng thẻ có biểu tượng (đẹp, dễ bấm).
// React + TailwindCSS thuần.
// ============================================================
import React, { useEffect, useState } from "react";
import { AppHeader } from "./common";
import { fetchDepartments, submitFeedback } from "../services/api";

export default function FeedbackComponent() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    department: "",
    sender: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetchDepartments().then(setDepartments);
  }, []);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Gửi kiến nghị (có kiểm tra dữ liệu bắt buộc).
  const handleSubmit = async () => {
    setError("");
    if (!form.title.trim() || !form.content.trim() || !form.department) {
      setError("Vui lòng nhập Tiêu đề, Nội dung và chọn Ban chuyên trách.");
      return;
    }
    try {
      setSubmitting(true);
      await submitFeedback({
        ...form,
        createdAt: new Date().toISOString(),
        status: "Mới tiếp nhận",
      });
      setDone(true);
    } catch {
      setError("Gửi thất bại, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ title: "", content: "", department: "", sender: "" });
    setError("");
    setDone(false);
  };

  // ----- MÀN HÌNH XÁC NHẬN -----
  if (done) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AppHeader title="Gửi thành công" />
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="text-7xl mb-4 animate-float">✅</div>
          <h2 className="text-xl font-extrabold text-ink">
            Đã gửi kiến nghị thành công!
          </h2>
          <p className="text-ink-soft mt-2 leading-relaxed">
            Thường trực HĐND tỉnh sẽ chuyển nội dung tới Ban chuyên trách phù
            hợp để xử lý và phản hồi.
          </p>
          <button
            onClick={resetForm}
            className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3 rounded-full font-bold mt-8 shadow-glow active:scale-95 transition"
          >
            ✍️ Gửi kiến nghị khác
          </button>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";
  const labelClass = "block text-sm font-bold text-ink mb-1.5";

  // ----- BIỂU MẪU -----
  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader
        title="✍️ Gửi Kiến Nghị"
        subtitle="Phản ánh từ cơ sở tới HĐND tỉnh"
      />
      <div className="p-4 space-y-5">
        {/* Tiêu đề */}
        <div>
          <label className={labelClass}>Tiêu đề kiến nghị *</label>
          <input
            className={inputClass}
            placeholder="VD: Vướng mắc cấp Giấy chứng nhận QSDĐ"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        {/* Nội dung */}
        <div>
          <label className={labelClass}>Nội dung vướng mắc *</label>
          <textarea
            className={inputClass}
            rows={5}
            placeholder="Mô tả chi tiết vướng mắc về đất đai, ngân sách, tư pháp..."
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
          />
        </div>

        {/* Chọn Ban chuyên trách bằng thẻ */}
        <div>
          <label className={labelClass}>Gửi tới Ban chuyên trách *</label>
          <div className="grid grid-cols-1 gap-2.5">
            {departments.map((d) => {
              const active = form.department === d.value;
              return (
                <button
                  key={d.value}
                  onClick={() => updateField("department", d.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition ${
                    active
                      ? "border-primary bg-primary-light"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span className="text-2xl">{d.icon}</span>
                  <span
                    className={`flex-1 font-semibold text-sm ${
                      active ? "text-primary" : "text-ink"
                    }`}
                  >
                    {d.label}
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      active ? "border-primary bg-primary" : "border-gray-300"
                    }`}
                  >
                    {active && <span className="text-white text-xs">✓</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Người gửi */}
        <div>
          <label className={labelClass}>Người gửi / Đơn vị (không bắt buộc)</label>
          <input
            className={inputClass}
            placeholder="VD: Nguyễn Văn A - UBND xã Đông Sơn"
            value={form.sender}
            onChange={(e) => updateField("sender", e.target.value)}
          />
        </div>

        {/* Lỗi */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3">
            ⚠️ {error}
          </div>
        )}

        {/* Nút gửi */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3.5 rounded-full font-bold shadow-glow active:scale-95 transition disabled:opacity-60"
        >
          {submitting ? "Đang gửi..." : "📨 Gửi kiến nghị"}
        </button>

        <p className="text-[12px] text-gray-400 text-center leading-relaxed">
          Thông tin gửi tới Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa.
        </p>
      </div>
    </div>
  );
}
