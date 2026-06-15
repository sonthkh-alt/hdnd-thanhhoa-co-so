// ============================================================
// PHÂN HỆ 2: THỬ TÀI ĐẠI BIỂU (TRẮC NGHIỆM)
//   1. Tải bộ câu hỏi từ API.
//   2. Hiện từng câu; chọn xong tô màu Đúng/Sai + hiện lời giải thích.
//   3. Hết câu -> màn hình chúc mừng kèm tổng điểm.
// React + TailwindCSS thuần, phong cách "HĐND số".
// ============================================================
import React, { useEffect, useState } from "react";
import { AppHeader, Spinner } from "./common";
import { fetchQuiz } from "../services/api";

export default function QuizComponent() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetchQuiz()
      .then((data) => setQuestions(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Chọn 1 đáp án (khóa lại sau khi chọn).
  const handleSelect = (index) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === questions[current].correctIndex) setScore((s) => s + 1);
  };

  // Sang câu tiếp / kết thúc.
  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AppHeader title="🎯 Thử Tài Đại Biểu" />
        <Spinner label="Đang tải câu hỏi..." />
      </div>
    );
  }

  // ----- MÀN HÌNH CHÚC MỪNG -----
  if (finished) {
    const total = questions.length;
    const percent = Math.round((score / total) * 100);
    const passed = score >= Math.ceil(total / 2);
    return (
      <div className="min-h-screen bg-gray-100">
        <AppHeader title="Kết quả" />
        <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
          <div className="text-7xl mb-3 animate-float">
            {passed ? "🎉" : "💪"}
          </div>
          <h2 className="text-2xl font-extrabold text-ink">
            {passed ? "Xuất sắc!" : "Cố gắng thêm nhé!"}
          </h2>
          <p className="text-ink-soft mt-2">
            Bạn trả lời đúng{" "}
            <span className="font-bold text-primary">{score}/{total}</span> câu.
          </p>

          {/* Vòng tròn điểm số có viền vàng */}
          <div className="my-8 relative w-40 h-40">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-primary-dark shadow-glow" />
            <div className="absolute inset-2 rounded-full bg-white flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-primary">
                {percent}%
              </span>
              <span className="text-xs text-ink-soft">chính xác</span>
            </div>
          </div>

          <button
            onClick={restart}
            className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3 rounded-full font-bold shadow-glow active:scale-95 transition"
          >
            🔄 Làm lại
          </button>
        </div>
      </div>
    );
  }

  // ----- MÀN HÌNH LÀM BÀI -----
  const q = questions[current];
  const answered = selected !== null;

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader title="🎯 Thử Tài Đại Biểu" />
      <div className="p-4">
        {/* Thẻ tiến độ */}
        <div className="bg-white rounded-2xl p-4 shadow-soft mb-4">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-ink-soft font-medium">
              Câu {current + 1}/{questions.length}
            </span>
            <span className="font-bold text-primary">⭐ {score} điểm</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-500"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Câu hỏi */}
        <h3 className="font-bold text-lg text-ink mb-4 leading-snug px-1">
          {q.question}
        </h3>

        {/* Đáp án */}
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let style = "bg-white border-gray-200 text-ink";
            if (answered) {
              if (i === q.correctIndex)
                style = "bg-emerald-50 border-emerald-500 text-emerald-700";
              else if (i === selected)
                style = "bg-red-50 border-red-500 text-red-700";
              else style = "bg-white border-gray-100 text-gray-400";
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 font-medium transition flex items-center gap-3 ${style}`}
              >
                <span className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-sm font-bold shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{opt}</span>
                {answered && i === q.correctIndex && <span>✅</span>}
                {answered && i === selected && i !== q.correctIndex && (
                  <span>❌</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Giải thích */}
        {answered && (
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-2xl animate-fadeUp">
            <p className="text-sm font-bold text-blue-800 mb-1">💡 Giải thích</p>
            <p className="text-sm text-blue-700 leading-relaxed">
              {q.explanation}
            </p>
          </div>
        )}

        {/* Nút chuyển câu */}
        {answered && (
          <button
            onClick={nextQuestion}
            className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3.5 rounded-full font-bold mt-5 shadow-glow active:scale-95 transition animate-fadeUp"
          >
            {current + 1 < questions.length
              ? "Câu tiếp theo →"
              : "Xem kết quả 🏁"}
          </button>
        )}
      </div>
    </div>
  );
}
