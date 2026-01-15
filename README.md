# MD2PPT-EVOLUTION

![Version](https://img.shields.io/badge/version-0.5.0-orange.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg)

**MD2PPT-EVOLUTION** 是一個專為技術講者、開發者與教育工作者打造的現代化工具。它能將您的 **Markdown** 筆記瞬間轉換為專業級的 **PowerPoint (PPTX)** 簡報，讓您專注於內容創作，而非排版微調。

---

## 🚀 核心功能 (v0.5.0)

### ✍️ 極致寫作體驗
- **快捷動作側欄 (Quick Actions)**: 左側懸浮工具列，一鍵插入投影片、佈局模版與常用元件，無需記憶語法。
- **拖放式資產管理 (Drag & Drop)**: 
    - **插入圖片**: 直接將圖片拖入編輯器，自動轉為 Base64 格式。
    - **設定背景**: 將圖片拖至右側預覽區的投影片上，自動設為該頁背景。
- **所見即所得 (WYSIWYG)**: 獨家的 1:1 動態縮放預覽系統，確保網頁看到的畫面與匯出的 PPTX 完全一致。

### 🎨 專業排版系統
- **分層配置架構**: 採用 `===` 作為分頁符號，並支援每頁獨立的 YAML 配置區塊 (`---`)。
- **多樣化佈局支援**:
    - **Grid**: 網格佈局，支援自定義欄數。
    - **Quote**: 藝術化的大字體引用佈局。
    - **Center**: 垂直水平居中的轉場頁佈局。
    - **Alert**: 醒目的告警與提示佈局。
    - **Two-Column**: 經典的圖文雙欄佈局。
- **現代化表格**: 支援 `::: table-modern` 指令，生成具備主題色標題與交錯列底色的原生表格。

### 🛡️ 企業級設計
- **琥珀與石墨主題**: 內建高對比度的深色/淺色模式，兼具護眼與商務專業感。
- **隱私優先**: 全靜態 Web 應用，所有轉換皆在瀏覽器端完成，資料絕不上傳伺服器。

---

## 📝 語法速查表 (Cheat Sheet)

### 基礎結構
```markdown
# 第一頁標題
內容...

===
---
layout: two-column
---

# 第二頁標題
這頁使用了雙欄佈局。
```

### YAML 配置參數
在 `---` 區塊中可設定以下參數：

| 參數 | 說明 | 範例 |
| :--- | :--- | :--- |
| `layout` | 版面類型 | `grid`, `center`, `quote`, `alert`, `impact` |
| `background` | 背景顏色 (Hex) | `"#1e293b"` |
| `bgImage` | 背景圖片 (Base64/URL) | `data:image/...` |
| `columns` | Grid 佈局欄位數 | `3` |
| `transition` | 過場動畫 | `fade`, `slide`, `zoom` |

### 特殊指令
- **現代化表格**:
  ```markdown
  ::: table-modern
  | 標題 1 | 標題 2 |
  | :--- | :--- |
  | 內容 A | 內容 B |
  :::
  ```

---

## 🛠️ 技術堆疊

- **核心框架**: React 19, TypeScript, Vite 6
- **狀態管理**: React Hooks (Context API)
- **樣式系統**: Tailwind CSS (Dark Mode 支援)
- **PPT 引擎**: `pptxgenjs` (Client-side Generation)
- **解析引擎**: `marked` (AST) + `js-yaml` (Frontmatter)

---

## 📦 快速開始

### 開發環境設置
```bash
# 1. 安裝依賴
npm install

# 2. 啟動開發伺服器
npm run dev
```

### 建置專案
```bash
# 建置生產版本
npm run build

# 預覽建置結果
npm run preview
```

---

## 🤝 參與貢獻

我們歡迎任何形式的貢獻！無論是回報 Bug、建議新功能或提交 PR，請參考 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 📄 授權條款

MIT © 2026 EricHuang