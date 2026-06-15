/*************************************************************
 * HĐND THANH HÓA — BACKEND BẰNG GOOGLE APPS SCRIPT
 * Một file này làm 3 việc, hoàn toàn MIỄN PHÍ trên Google:
 *
 *   1) doGet  — Biến Google Sheet thành API JSON để app đọc
 *               (thay cho SheetDB). VD: ...?sheet=TinTuc
 *   2) doPost — Nhận kiến nghị từ app, ghi vào sheet "KienNghi".
 *   3) capNhatTinBangAI — Lấy tin RSS, nhờ Claude TÓM TẮT thành
 *               dữ liệu infographic, ghi vào "TinTuc" ở trạng thái
 *               "Chờ duyệt" để cán bộ kiểm tra trước khi công bố.
 *
 * NGUYÊN TẮC CHỐNG BỊA ĐẶT (rất quan trọng):
 *   - AI chỉ được tóm tắt TỪ NỘI DUNG bài báo được đưa vào.
 *   - TUYỆT ĐỐI không thêm số liệu/tỷ lệ không có trong bài.
 *   - Nguồn (source) luôn là đường link bài gốc.
 *   - Tin mới luôn ở trạng thái "Chờ duyệt"; chỉ tin do cán bộ
 *     đổi sang "Đã duyệt" mới hiển thị công khai trên app.
 *************************************************************/

// ====================== CẤU HÌNH ======================
// API key KHÔNG ghi thẳng vào code. Lưu an toàn trong:
//   Project Settings → Script properties → thêm khóa CLAUDE_API_KEY
function layApiKey_() {
  const key = PropertiesService.getScriptProperties().getProperty("CLAUDE_API_KEY");
  if (!key) throw new Error("Chưa thiết lập CLAUDE_API_KEY trong Script properties.");
  return key;
}

const CAU_HINH = {
  // Endpoint API. Mặc định là Anthropic chính thức.
  // Nếu dùng proxy tương thích Anthropic (vd shopaikey.com) thì đổi tại đây.
  // KHÔNG thêm đuôi /v1/messages — script tự nối.
  apiBaseUrl: "https://api.shopaikey.com",

  // Mặc định dùng Claude Opus 4.8 (chất lượng cao nhất).
  // Muốn tiết kiệm chi phí cho việc tóm tắt hàng loạt, đổi sang
  // "claude-haiku-4-5". Lưu ý: tên model phải khớp danh sách model
  // mà endpoint hỗ trợ (xem "Bảng giá model" trên trang dịch vụ).
  model: "claude-opus-4-8",

  // (a) Nguồn RSS (nếu trang có RSS). Để trống nếu không dùng.
  nguonRss: [
    // "https://vi-du-rss/feed.xml",
  ],

  // (b) Nguồn PORTAL HTML — dùng cho trang KHÔNG có RSS (đọc thẳng HTML).
  // Đã cắm sẵn Cổng thông tin Đoàn ĐBQH & HĐND tỉnh Thanh Hóa.
  // 'listing' = trang danh sách tin; 'base' = tên miền gốc để ghép link.
  nguonPortal: [
    {
      listing: "https://dbndthanhhoa.gov.vn/portal/KenhTin/Hoi-dong-nhan-dan-tinh.aspx",
      base: "https://dbndthanhhoa.gov.vn",
    },
  ],

  soTinToiDaMoiLan: 5, // mỗi lần chạy chỉ xử lý tối đa 5 tin mới
};

// ====================== 1) API ĐỌC DỮ LIỆU (doGet) ======================
function doGet(e) {
  const tenSheet = (e && e.parameter && e.parameter.sheet) || "TinTuc";
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(tenSheet);
  if (!sheet) return traVeJson_({ error: "Không tìm thấy sheet: " + tenSheet });

  let duLieu = docSheetThanhJson_(sheet);

  // Riêng bảng TinTuc: chỉ trả về các tin đã được cán bộ DUYỆT,
  // tránh để tin AID tự sinh hiện công khai khi chưa kiểm chứng.
  if (tenSheet === "TinTuc") {
    duLieu = duLieu.filter(function (h) {
      return String(h.status || "").toLowerCase().indexOf("duyệt") >= 0 &&
        String(h.status || "").toLowerCase().indexOf("chờ") < 0;
    });
  }
  return traVeJson_(duLieu);
}

// ====================== 2) NHẬN KIẾN NGHỊ (doPost) ======================
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    // App có thể gửi payload trực tiếp, hoặc bọc trong {data: ...} (kiểu SheetDB).
    const kn = body.data || body;

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = layHoacTaoSheet_(ss, "KienNghi", [
      "id", "title", "content", "department", "sender", "createdAt", "status",
    ]);

    const id = "KN" + new Date().getTime();
    sheet.appendRow([
      id,
      kn.title || "",
      kn.content || "",
      kn.department || "",
      kn.sender || "",
      kn.createdAt || new Date().toISOString(),
      kn.status || "Mới tiếp nhận",
    ]);
    return traVeJson_({ success: true, id: id });
  } catch (err) {
    return traVeJson_({ success: false, error: String(err) });
  }
}

// ====================== 3) LUỒNG AI TÓM TẮT TIN ======================
// Đặt lịch chạy tự động: Triggers → Add Trigger → capNhatTinBangAI → Time-driven.
function capNhatTinBangAI() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = layHoacTaoSheet_(ss, "TinTuc", [
    "id", "category", "title", "summary", "source",
    "publishedAt", "icon", "theme", "infographic", "status",
  ]);

  // Tập hợp các link đã có để không xử lý trùng.
  const daCo = docSheetThanhJson_(sheet).map(function (h) { return h.source; });

  // Gom tin từ cả 2 loại nguồn về một danh sách { link, title, description, pubDate }.
  let tinTongHop = [];

  // (a) Nguồn RSS
  CAU_HINH.nguonRss.forEach(function (urlRss) {
    tinTongHop = tinTongHop.concat(layTinTuRss_(urlRss));
  });

  // (b) Nguồn portal HTML: lấy link bài rồi tải nội dung từng bài.
  CAU_HINH.nguonPortal.forEach(function (ng) {
    const links = layLinkTuPortal_(ng.listing, ng.base)
      .filter(function (url) { return daCo.indexOf(url) < 0; }) // bỏ link đã có
      .slice(0, CAU_HINH.soTinToiDaMoiLan + 3); // chỉ tải vài bài mới nhất
    links.forEach(function (url) {
      const bai = taiNoiDungBai_(url);
      if (bai) tinTongHop.push(bai);
    });
  });

  // Xử lý tóm tắt từng tin mới (giới hạn số lượng mỗi lần chạy).
  let demNew = 0;
  tinTongHop.forEach(function (tin) {
    if (demNew >= CAU_HINH.soTinToiDaMoiLan) return;
    if (!tin.link || daCo.indexOf(tin.link) >= 0) return; // đã có rồi
    daCo.push(tin.link); // chống trùng trong cùng lần chạy

    const kq = tomTatBangClaude_(tin);
    if (!kq || kq.category === "BỎ QUA") return; // tin không liên quan

    // Ghi tin mới ở trạng thái "Chờ duyệt" — cán bộ kiểm tra rồi mới công bố.
    sheet.appendRow([
      "TT" + new Date().getTime(),
      kq.category,
      kq.title,
      kq.summary,
      tin.link, // nguồn luôn là link bài gốc
      tin.pubDate || new Date().toISOString().slice(0, 10),
      kq.icon || "📰",
      JSON.stringify(kq.theme || {}),
      JSON.stringify(kq.infographic || {}),
      "Chờ duyệt",
    ]);
    demNew++;
  });
  Logger.log("Đã thêm " + demNew + " tin (trạng thái Chờ duyệt).");
}

// Gọi Claude (Messages API) để tóm tắt 1 bài thành dữ liệu infographic.
function tomTatBangClaude_(tin) {
  // ----- LỜI NHẮC HỆ THỐNG: ràng buộc chống bịa đặt -----
  const system =
    "Bạn là biên tập viên của HĐND tỉnh Thanh Hóa. Nhiệm vụ: tóm tắt bài báo " +
    "thành dữ liệu infographic cho cán bộ cấp xã.\n" +
    "QUY TẮC BẮT BUỘC:\n" +
    "1. CHỈ dùng thông tin có trong bài báo được cung cấp. TUYỆT ĐỐI không " +
    "bịa thêm số liệu, tỷ lệ phần trăm, tên người hay sự kiện không có trong bài.\n" +
    "2. 'stats' chỉ ghi con số NẾU bài báo nêu rõ con số đó; nếu không có số, " +
    "hãy dùng cụm từ mô tả ngắn (không bịa %).\n" +
    "3. 'points' và 'summary' phải bám sát nội dung bài, ngắn gọn, trung lập.\n" +
    "4. Nếu bài KHÔNG liên quan tới chính quyền địa phương / HĐND / pháp luật / " +
    "hoạt động cơ sở, đặt category = 'BỎ QUA'.\n" +
    "Chỉ phục vụ chủ đề: chính quyền 2 cấp, HĐND cấp xã, hoạt động Thường trực " +
    "HĐND tỉnh Thanh Hóa, tin pháp luật mới cho cơ sở.";

  const noiDung =
    "TIÊU ĐỀ: " + tin.title + "\n\nNỘI DUNG:\n" + (tin.description || "");

  // Cấu trúc JSON bắt buộc model trả về (structured output).
  const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
      category: { type: "string" },
      title: { type: "string" },
      summary: { type: "string" },
      icon: { type: "string" },
      theme: {
        type: "object",
        additionalProperties: false,
        properties: {
          c1: { type: "string" },
          c2: { type: "string" },
          accent: { type: "string" },
        },
        required: ["c1", "c2", "accent"],
      },
      infographic: {
        type: "object",
        additionalProperties: false,
        properties: {
          badge: { type: "string" },
          headline: { type: "string" },
          stats: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: { v: { type: "string" }, l: { type: "string" } },
              required: ["v", "l"],
            },
          },
          points: { type: "array", items: { type: "string" } },
        },
        required: ["badge", "headline", "stats", "points"],
      },
    },
    required: ["category", "title", "summary", "icon", "theme", "infographic"],
  };

  const payload = {
    model: CAU_HINH.model,
    max_tokens: 1500,
    system: system,
    messages: [{ role: "user", content: noiDung }],
    // Ép model trả về đúng cấu trúc JSON (không kèm chữ thừa).
    output_config: { format: { type: "json_schema", schema: schema } },
  };

  const res = UrlFetchApp.fetch(CAU_HINH.apiBaseUrl + "/v1/messages", {
    method: "post",
    contentType: "application/json",
    muteHttpExceptions: true,
    headers: {
      "x-api-key": layApiKey_(),
      "anthropic-version": "2023-06-01",
    },
    payload: JSON.stringify(payload),
  });

  if (res.getResponseCode() !== 200) {
    Logger.log("Lỗi API: " + res.getContentText());
    return null;
  }

  // Lấy phần văn bản JSON trong khối content đầu tiên rồi parse.
  const data = JSON.parse(res.getContentText());
  const block = (data.content || []).find(function (b) { return b.type === "text"; });
  if (!block) return null;
  try {
    return JSON.parse(block.text);
  } catch (e2) {
    Logger.log("Không parse được JSON từ model: " + block.text);
    return null;
  }
}

// ====================== HÀM TIỆN ÍCH ======================

// Đọc RSS thành mảng { title, link, description, pubDate }.
function layTinTuRss_(urlRss) {
  try {
    const xml = UrlFetchApp.fetch(urlRss, { muteHttpExceptions: true }).getContentText();
    const doc = XmlService.parse(xml);
    const items = doc.getRootElement().getChild("channel").getChildren("item");
    return items.map(function (it) {
      return {
        title: layText_(it, "title"),
        link: layText_(it, "link"),
        description: layText_(it, "description"),
        pubDate: (layText_(it, "pubDate") || "").slice(0, 16),
      };
    });
  } catch (e) {
    Logger.log("Không đọc được RSS: " + urlRss + " — " + e);
    return [];
  }
}

function layText_(item, ten) {
  const child = item.getChild(ten);
  return child ? child.getText() : "";
}

// Đọc trang danh sách portal (HTML) -> mảng link bài tuyệt đối (không trùng).
// Dùng cho trang KHÔNG có RSS, ví dụ cổng HĐND tỉnh Thanh Hóa.
function layLinkTuPortal_(listingUrl, base) {
  try {
    const html = UrlFetchApp.fetch(listingUrl, { muteHttpExceptions: true }).getContentText();
    // Bắt mọi đường dẫn dạng /portal/pages/YYYY-MM-DD/...-ID.aspx
    const re = /\/portal\/pages\/\d{4}-\d{2}-\d{2}\/[^"'<> ]+?\.aspx/g;
    const set = {};
    let m;
    while ((m = re.exec(html)) !== null) set[base + m[0]] = true; // loại trùng
    return Object.keys(set);
  } catch (e) {
    Logger.log("Không đọc được trang danh sách: " + listingUrl + " — " + e);
    return [];
  }
}

// Tải 1 bài viết portal -> { link, title, description, pubDate }.
// Chỉ lấy phần thân bài (div.article-content) để tránh lẫn menu/giao diện.
function taiNoiDungBai_(url) {
  try {
    const html = UrlFetchApp.fetch(url, { muteHttpExceptions: true }).getContentText();

    // Tiêu đề: ưu tiên thẻ <h1>, nếu không có thì lấy từ slug trong URL.
    let title = "";
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1) title = boTag_(h1[1]);
    if (!title) {
      const slug = url.split("/").pop().replace(/-\d+\.aspx$/, "").replace(/-/g, " ");
      title = slug;
    }

    // Thân bài: cắt từ vị trí 'article-content' và lấy một đoạn đủ dài, rồi bỏ tag.
    let body = "";
    const idx = html.indexOf("article-content");
    if (idx >= 0) body = boTag_(html.substring(idx, idx + 9000));
    body = body.slice(0, 3500); // đủ cho model tóm tắt, tránh tốn token

    if (!body) return null;
    return { link: url, title: title, description: body, pubDate: layNgayTuUrl_(url) };
  } catch (e) {
    Logger.log("Không tải được bài: " + url + " — " + e);
    return null;
  }
}

// Lấy ngày YYYY-MM-DD nằm trong đường dẫn /portal/pages/YYYY-MM-DD/...
function layNgayTuUrl_(url) {
  const m = url.match(/\/(\d{4}-\d{2}-\d{2})\//);
  return m ? m[1] : new Date().toISOString().slice(0, 10);
}

// Bỏ thẻ HTML, script/style và gộp khoảng trắng -> văn bản thuần.
function boTag_(s) {
  return String(s)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Đọc toàn bộ sheet (dòng 1 là tiêu đề cột) thành mảng object.
function docSheetThanhJson_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const header = values[0];
  return values.slice(1).map(function (row) {
    const obj = {};
    header.forEach(function (h, i) { obj[h] = row[i]; });
    return obj;
  });
}

// Lấy sheet theo tên; nếu chưa có thì tạo và ghi dòng tiêu đề.
function layHoacTaoSheet_(ss, ten, header) {
  let sheet = ss.getSheetByName(ten);
  if (!sheet) {
    sheet = ss.insertSheet(ten);
    sheet.appendRow(header);
  }
  return sheet;
}

// Trả về JSON kèm header cho phép app gọi từ mọi nơi.
function traVeJson_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
