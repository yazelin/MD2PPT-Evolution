# MD2PPT-EVOLUTION 🚀

![Version](https://img.shields.io/badge/version-0.10.0-orange.svg)
...
### 🎨 專業排版系統
- **動態背景生成器 (Generative Backgrounds) (v0.10+)**: 引入輕量級生成藝術算法（如 Mesh Gradients），讓每頁背景都是獨一無二的，擺脫死板的 PPT 背景圖。
- **視覺化即時調整 (Visual Tweaker)**: 點擊預覽區元素即可喚起調整視窗，即時修改文字、圖片與圖表數據，並同步回寫至 Markdown。
- **斜線指令 (Slash Commands)**: 輸入 `/` 喚起懸浮選單，快速插入圖表、佈局與元件，支援鍵盤導航與智慧游標定位。
- **全域主題管理器 (Theme Manager)**: 左側新增配色面板，支援 4 種預設主題（琥珀石墨、科技深夜、簡約學術、現代翠綠）一鍵切換，並支援客製化字體與背景。
- **演講者備忘錄 (Speaker Notes)**: 支援 `<!-- note: ... -->` 語法，可在預覽中切換顯示，並同步匯出至 PPTX 備忘錄欄位。
- **分層配置 (YAML)**: 使用 `===` 分頁，並透過每頁頂部的 YAML 區塊 (`---`) 獨立控制佈局、背景與轉場。
- **專業佈局庫**: 內建 `Grid` (網格)、`Quote` (引用)、`Center` (居中)、`Alert` (告警) 等多種響應式版面。
- **現代化表格**: 自動將 Markdown 表格轉換為具備主題色與斑馬紋 (Zebra striping) 的專業表格。

### 4. 隱私優先 (Privacy First)
- **100% 用戶端運算**: 所有解析與生成皆在您的瀏覽器中完成。
- **資料不落地**: 您的筆記與圖片**絕不會**上傳至任何伺服器。

---

## ⚡ 快速上手 (Quick Start)

### 基礎語法範例

```markdown
---
title: "我的簡報"
author: "Presenter"
---

# 第一頁：標題頁
這是簡報的開場白。

===
---
layout: two-column
---

# 第二頁：雙欄佈局

### 左邊內容
- 重點 1
- 重點 2

### 右邊內容
這裡會自動分到右側欄位。

===
---
layout: center
background: "#1e293b"
transition: zoom
---

# 第三頁：轉場頁
垂直居中 + 深色背景 + 縮放特效

<!-- note: 這是演講者備忘錄，只會出現在預覽與 PPTX 備忘錄欄位。 -->
```

### 圖表語法範例

```markdown
::: chart-bar { "title": "季度營收", "showValues": true }

| 季度 | 2024 | 2025 |
| :--- | :--- | :--- |
| Q1   | 100  | 150  |
| Q2   | 120  | 180  |

:::
```

👉 **更多進階語法與 YAML 參數，請參閱 [客製化指南 (CUSTOMIZATION.md)](CUSTOMIZATION.md)。**

---

## 🤖 AI 輔助生成 (AI Assistant)

想要快速將手邊的筆記轉為簡報嗎？您可以複製以下 Prompt 給 ChatGPT、Claude 或 Gemini，讓 AI 幫您自動排版並套用設計風格：

```text
你現在是一位精通「MD2PPT-Evolution v0.10+」的專業簡報設計師。
專案位置：https://github.com/eric861129/MD2PPT-Evolution
詳細規範：https://github.com/eric861129/MD2PPT-Evolution/docs/AI_GENERATION_GUIDE.md

請根據我提供的【內容】與【風格需求】，將其轉換為嚴格符合以下規範的 Markdown 代碼。

### ⚠️ 致命錯誤預防 (Critical Rules)

1. **圖表空行 (Chart Newlines)**
   - `::: chart-xxx {json}` 與表格之間**必須**有一個空行。
   - 表格與結尾的 `:::` 之間**必須**有一個空行。
   - **正確結構**：
     ```
     ::: chart-bar { ... }
     (空行)
     | 表格內容 |
     (空行)
     :::
     ```

2. **分頁 (Structure)**
   - 使用 `===` 作為分頁符號，**前後必須有空行**。
   - 第一頁必須是全域設定 (`theme`, `transition`)。

3. **雙欄 (Two-Column)**
   - 使用 `:: right ::` (前後有空格) 來分隔。

### 🎨 配色與風格策略 (Design Strategy)

**如果我指定了【風格需求】或【色系】，請嚴格遵守以下規則：**

1. **全域主題 (theme)**:
   - 商務/橘色系 -> `amber`
   - 科技/深色系 -> `midnight`
   - 簡約/灰色系 -> `academic`
   - 現代/綠色系 -> `material`

2. **動態背景 (Mesh Gradient)**:
   - **預設開啟**：除非我特別說「不要背景」，否則請在標題頁 (`layout: impact`) 或重點頁 (`layout: quote/alert`) 加入 `bg: mesh`。
   - **配色規範**：**嚴禁隨機亂配色！** 請從以下「專業配色盤」中選擇最接近我需求的一組填入 `colors`：
     - **科技藍 (Cyber)**: `["#0F172A", "#312E81", "#4338CA"]`
     - **霓虹紫 (Neon)**: `["#111827", "#7C3AED", "#DB2777"]`
     - **暖陽橘 (Sunset)**: `["#FFF7ED", "#FB923C", "#EA580C"]`
     - **清新綠 (Nature)**: `["#F0FDF4", "#4ADE80", "#16A34A"]`
     - **專業藍 (Ocean)**: `["#F0F9FF", "#38BDF8", "#0284C7"]`

---

### ✅ 輸出範本 (Example Output)

---
theme: midnight
transition: fade
title: 簡報標題
---

===

---
layout: impact
bg: mesh
mesh:
  colors: ["#0F172A", "#312E81", "#4338CA"]
  seed: 888
---

# 標題
## 副標題

===

---
layout: two-column
---

## 左側重點
- 重點 A

:: right ::

## 右側圖表

::: chart-pie { "title": "分佈圖", "showLegend": true }

| 項目 | 佔比 |
| :--- | :--- |
| A    | 60   |
| B    | 40   |

:::

===

---

**現在，請將以下內容轉換為 MD2PPT 格式：**

【風格需求】：[在此輸入風格，例如：科技藍色系、溫暖橘色系]
【內容】：
[在此貼上內容]
```

---

## 🛠️ 開發與部署

### 本地開發 (Local Development)

本專案基於 **React 19**, **TypeScript** 與 **Vite** 構建。

```bash
# 1. Clone 專案
git clone https://github.com/your-username/MD2PPT-Evolution.git

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev
```

### 部署 (Deployment)

您可以將此專案部署至任何靜態網站託管服務 (GitHub Pages, Vercel, Netlify)。

```bash
# 建置生產版本
npm run build

# 產物將位於 dist/ 目錄
```

---

## 🗺️ 開發藍圖 (Roadmap)

- [x] **v0.5.0**: 快捷側欄、拖放圖片、YAML 配置系統。
- [x] **v0.6.0**: 原生圖表 (Native Charts) 支援。
- [x] **v0.7.0**: 演講者備忘錄 (Speaker Notes)。
- [x] **v0.8.0**: 全域主題管理器 (Theme Manager)。
- [x] **v0.9.0**: 斜線指令系統 (Slash Commands)。

## 🤝 貢獻 (Contributing)

我們非常歡迎社群貢獻！如果您想新增佈局或修復 Bug，請查看 [CONTRIBUTING.md](CONTRIBUTING.md) (Coming Soon)。

## 📄 授權 (License)

MIT © 2026 EricHuang
