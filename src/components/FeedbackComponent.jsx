// ============================================================
// PHÂN HỆ 3: GỬI KIẾN NGHỊ & VƯỚNG MẮC
// Biểu mẫu cho cán bộ xã/phường gửi phản ánh tới HĐND tỉnh.
// Có kiểm tra dữ liệu (validation) trước khi gửi.
// Viết bằng React + TailwindCSS thuần (input/select/textarea gốc HTML).
// ============================================================
import React, { useEffect, useState } from "react";
import { AppHeader } from "./common";
import { fetchDepartments, submitFeedback } from "../services/api";

export default function FeedbackComponent() {
  const [departments, setDepartments] = useState([]); // danh mục các Ban
  const [form, setForm] = useState({
    title: "",
    content: "",
    department: "",
    sender: "",
  });
  const [error, setError] = useState(""); // thông báo lỗi nhập liệu
  const [submitting, setSubmitting] = useState(false); // đang gửi
  const [done, setDone] = useState(false); // gửi thành công

  // Tải danh mục Ban chuyên trách cho dropdown.
  useEffect(() => {
    fetchDepartments().then(setDepartments);
  }, []);

  // Hàm cập nhật 1 trường trong form (dùng chung cho mọi ô nhập).
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Xử lý khi bấm nút Gửi.
  const handleSubmit = async () => {
    setError("");
    // --- Kiểm tra dữ liệu bắt buộc ---
    if (!form.title.trim() || !form.content.trim() || !form.department) {
      setError("Vui lòng nhập đủ Tiêu đề, Nội dung và chọn Ban chuyên trách.");
      return;
    }

    try {
      setSubmitting(true);
      // Gắn thêm thời gian gửi rồi đẩy lên API (ghi vào Google Sheet).
      await submitFeedback({
        ...form,
        createdAt: new Date().toISOString(),
        status: "Mới tiếp nhận",
      });
      setDone(true); // chuyển sang màn hình cảm ơn
    } catch (err) {
      setError("Gửi thất bại, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Soạn kiến nghị mới (reset form).
  const resetForm = () => {
    setForm({ title: "", content: "", department: "", sender: "" });
    setError("");
    setDone(false);
  };

  // ----- MÀN HÌNH XÁC NHẬN ĐÃ GỬI -----
  if (done) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <AppHeader title="Gửi thành công" />
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-800">
            Đã gửi kiến nghị thành công!
          </h2>
          <p className="text-gray-600 mt-2">
            Thường trực HĐND tỉnh sẽ chuyển nội dung tới Ban chuyên trách phù
            hợp để xử lý.
          </p>
          <button
            onClick={resetForm}
            className="bg-primary text-white px-8 py-3 rounded-full font-semibold mt-8 shadow active:scale-95 transition"
          >
            ✍️ Gửi kiến nghị khác
          </button>
        </div>
      </div>
    );
  }

  // Class dùng chung cho các ô nhập, gom lại cho gọn.
  const inputClass =
    "w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

  // ----- MÀN HÌNH BIỂU MẪU -----
  return (
    <div className="bg-gray-50 min-h-screen">
      <AppHeader title="✍️ Gửi Kiến Nghị & Vướng Mắc" />
      <div className="p-4 space-y-4">
        {/* Tiêu đề */}
        <div>
          <label className={labelClass}>Tiêu đề kiến nghị *</label>
          <input
            className={inputClass}
            placeholder="VD: Vướng mắc trong cấp Giấy chứng nhận QSDĐ"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        {/* Nội dung chi tiết */}
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

        {/* Chọn Ban chuyên trách */}
        <div>
          <label className={labelClass}>Gửi tới Ban chuyên trách *</label>
          <select
            className={inputClass}
            value={form.department}
            onChange={(e) => updateField("department", e.target.value)}
          >
            <option value="">-- Chọn Ban tiếp nhận --</option>
            {departments.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Người gửi (không bắt buộc) */}
        <div>
          <label className={labelClass}>Người gửi / Đơn vị (không bắt buộc)</label>
          <input
            className={inputClass}
            placeholder="VD: Nguyễn Văn A - UBND xã Đông Sơn"
            value={form.sender}
            onChange={(e) => updateField("sender", e.target.value)}
          />
        </div>

        {/* Thông báo lỗi (nếu có) */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg px-3 py-2">
            ⚠️ {error}
          </div>
        )}

        {/* Nút gửi */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-primary text-white py-3 rounded-full font-semibold shadow active:scale-95 transition disabled:opacity-60"
        >
          {submitting ? "Đang gửi..." : "📨 Gửi kiến nghị"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Thông tin được gửi trực tiếp tới Văn phòng Đoàn ĐBQH và HĐND tỉnh.
        </p>
      </div>
    </div>
  );
}
