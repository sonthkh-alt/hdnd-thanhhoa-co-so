// ============================================================
// PHÂN HỆ 3: GỬI KIẾN NGHỊ & VƯỚNG MẮC
// Biểu mẫu cho cán bộ xã/phường gửi phản ánh tới HĐND tỉnh.
// Có kiểm tra dữ liệu (validation) trước khi gửi.
// ============================================================
import React, { useEffect, useState } from "react";
import { Page, Header, Input, Select, Button, Box, useSnackbar } from "zmp-ui";
import { fetchDepartments, submitFeedback } from "../services/api";

const { Option } = Select;
const { TextArea } = Input;

export default function FeedbackComponent() {
  const { openSnackbar } = useSnackbar(); // hiện thông báo dạng toast

  const [departments, setDepartments] = useState([]); // danh mục các Ban
  const [form, setForm] = useState({
    title: "",
    content: "",
    department: "",
    sender: "",
  });
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
    // --- Kiểm tra dữ liệu bắt buộc ---
    if (!form.title.trim() || !form.content.trim() || !form.department) {
      openSnackbar({
        type: "warning",
        text: "Vui lòng nhập đủ Tiêu đề, Nội dung và chọn Ban chuyên trách.",
      });
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
      openSnackbar({ type: "error", text: "Gửi thất bại, vui lòng thử lại." });
    } finally {
      setSubmitting(false);
    }
  };

  // Soạn kiến nghị mới (reset form).
  const resetForm = () => {
    setForm({ title: "", content: "", department: "", sender: "" });
    setDone(false);
  };

  // ----- MÀN HÌNH XÁC NHẬN ĐÃ GỬI -----
  if (done) {
    return (
      <Page className="bg-gray-50">
        <Header title="Gửi thành công" />
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
      </Page>
    );
  }

  // ----- MÀN HÌNH BIỂU MẪU -----
  return (
    <Page className="bg-gray-50">
      <Header title="✍️ Gửi Kiến Nghị & Vướng Mắc" />
      <Box className="p-4 space-y-4">
        {/* Tiêu đề */}
        <Input
          label="Tiêu đề kiến nghị *"
          placeholder="VD: Vướng mắc trong cấp Giấy chứng nhận QSDĐ"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />

        {/* Nội dung chi tiết */}
        <TextArea
          label="Nội dung vướng mắc *"
          placeholder="Mô tả chi tiết vướng mắc về đất đai, ngân sách, tư pháp..."
          rows={5}
          value={form.content}
          onChange={(e) => updateField("content", e.target.value)}
        />

        {/* Chọn Ban chuyên trách */}
        <Select
          label="Gửi tới Ban chuyên trách *"
          placeholder="Chọn Ban tiếp nhận"
          value={form.department}
          onChange={(value) => updateField("department", value)}
        >
          {departments.map((d) => (
            <Option key={d.value} value={d.value} title={d.label} />
          ))}
        </Select>

        {/* Người gửi (không bắt buộc) */}
        <Input
          label="Người gửi / Đơn vị (không bắt buộc)"
          placeholder="VD: Nguyễn Văn A - UBND xã Đông Sơn"
          value={form.sender}
          onChange={(e) => updateField("sender", e.target.value)}
        />

        {/* Nút gửi */}
        <Button
          fullWidth
          loading={submitting}
          onClick={handleSubmit}
          className="mt-2"
        >
          📨 Gửi kiến nghị
        </Button>

        <p className="text-xs text-gray-400 text-center">
          Thông tin được gửi trực tiếp tới Văn phòng Đoàn ĐBQH và HĐND tỉnh.
        </p>
      </Box>
    </Page>
  );
}
