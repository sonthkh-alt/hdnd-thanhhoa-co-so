// ============================================================
// ĐIỂM KHỞI ĐỘNG (ENTRY POINT) CỦA ỨNG DỤNG
// File này có nhiệm vụ "gắn" component App gốc vào trang HTML.
// ============================================================
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./components/App";
import "./css/app.css";

// Tìm thẻ <div id="app"> trong index.html và render ứng dụng React vào đó.
const root = createRoot(document.getElementById("app"));
root.render(<App />);
