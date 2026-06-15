// ============================================================
// PHÂN HỆ 2: THỬ TÀI ĐẠI BIỂU (TRẮC NGHIỆM)
// Luồng hoạt động:
//   1. Tải bộ câu hỏi từ API.
//   2. Hiện từng câu, người dùng chọn đáp án.
//   3. NGAY sau khi chọn: tô màu Đúng/Sai + hiện lời giải thích.
//   4. Hết câu -> màn hình chúc mừng kèm tổng điểm.
// ============================================================
import React, { useEffect, useState } from "react";
import { Page, Header, Box, Spinner } from "zmp-ui";
import { fetchQuiz } from "../services/api";

export default function QuizComponent() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0); // chỉ số câu hỏi hiện tại
  const [selected, setSelected] = useState(null); // đáp án người dùng vừa chọn
  const [score, setScore] = useState(0); // tổng số câu đúng
  const [finished, setFinished] = useState(false); // đã hoàn thành chưa

  // Tải bộ câu hỏi khi mở trang.
  useEffect(() => {
    fetchQuiz()
      .then((data) => setQuestions(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Xử lý khi người dùng bấm chọn 1 đáp án.
  const handleSelect = (index) => {
    if (selected !== null) return; // đã chọn rồi thì khóa, không cho đổi
    setSelected(index);
    // Nếu chọn đúng thì cộng điểm.
    if (index === questions[current].correctIndex) {
      setScore((s) => s + 1);
    }
  };

  // Sang câu tiếp theo (hoặc kết thúc nếu là câu cuối).
  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null); // reset lựa chọn cho câu mới
    } else {
      setFinished(true);
    }
  };

  // Làm lại từ đầu.
  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  // ----- TRẠNG THÁI ĐANG TẢI -----
  if (loading) {
    return (
      <Page className="bg-gray-50">
        <Header title="🎯 Thử Tài Đại Biểu" />
        <Box className="flex justify-center py-16">
          <Spinner />
        </Box>
      </Page>
    );
  }

  // ----- MÀN HÌNH CHÚC MỪNG (KHI HOÀN THÀNH) -----
  if (finished) {
    const total = questions.length;
    const passed = score >= Math.ceil(total / 2); // đạt nếu đúng >= 1 nửa
    return (
      <Page className="bg-gray-50">
        <Header title="Kết quả" />
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="text-6xl mb-4">{passed ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-bold text-gray-800">
            {passed ? "Chúc mừng!" : "Cố gắng thêm nhé!"}
          </h2>
          <p className="text-gray-600 mt-2">
            Bạn trả lời đúng{" "}
            <span className="font-bold text-primary text-lg">
              {score}/{total}
            </span>{" "}
            câu hỏi.
          </p>

          {/* Vòng tròn hiển thị điểm */}
          <div className="my-8 w-32 h-32 rounded-full border-8 border-primary flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">
              {Math.round((score / total) * 100)}%
            </span>
          </div>

          <button
            onClick={restart}
            className="bg-primary text-white px-8 py-3 rounded-full font-semibold shadow active:scale-95 transition"
          >
            🔄 Làm lại
          </button>
        </div>
      </Page>
    );
  }

  // ----- MÀN HÌNH LÀM BÀI -----
  const q = questions[current];
  const answered = selected !== null; // đã chọn đáp án chưa

  return (
    <Page className="bg-gray-50">
      <Header title="🎯 Thử Tài Đại Biểu" />
      <div className="p-4">
        {/* Thanh tiến độ */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            Câu {current + 1}/{questions.length}
          </span>
          <span className="text-sm font-semibold text-primary">
            Điểm: {score}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full mb-5">
          <div
            className="h-2 bg-primary rounded-full transition-all"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Nội dung câu hỏi */}
        <h3 className="font-bold text-lg text-gray-800 mb-4 leading-snug">
          {q.question}
        </h3>

        {/* Danh sách đáp án */}
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            // Xác định màu nền của từng đáp án sau khi người dùng chọn.
            let style = "bg-white border-gray-200 text-gray-700";
            if (answered) {
              if (i === q.correctIndex) {
                // Đáp án đúng -> luôn tô xanh.
                style = "bg-green-50 border-green-500 text-green-700";
              } else if (i === selected) {
                // Đáp án người dùng chọn sai -> tô đỏ.
                style = "bg-red-50 border-red-500 text-red-700";
              } else {
                style = "bg-white border-gray-200 text-gray-400";
              }
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition ${style}`}
              >
                <span className="font-bold mr-2">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
                {/* Ký hiệu đúng/sai */}
                {answered && i === q.correctIndex && " ✓"}
                {answered && i === selected && i !== q.correctIndex && " ✗"}
              </button>
            );
          })}
        </div>

        {/* Ô giải thích - chỉ hiện sau khi đã chọn */}
        {answered && (
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <p className="text-sm font-semibold text-blue-800 mb-1">
              💡 Giải thích
            </p>
            <p className="text-sm text-blue-700">{q.explanation}</p>
          </div>
        )}

        {/* Nút chuyển câu - chỉ hiện sau khi đã chọn */}
        {answered && (
          <button
            onClick={nextQuestion}
            className="w-full bg-primary text-white py-3 rounded-full font-semibold mt-5 shadow active:scale-95 transition"
          >
            {current + 1 < questions.length ? "Câu tiếp theo →" : "Xem kết quả 🏁"}
          </button>
        )}
      </div>
    </Page>
  );
}
