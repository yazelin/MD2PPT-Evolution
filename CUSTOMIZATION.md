# 使用者手冊與客製化指南

本文件將引導您掌握 **MD2PPT-Evolution (v0.16.1)** 的所有進階功能。透過靈活的 YAML 配置、主題管理器與特殊指令，您可以製作出媲美專業設計師的簡報。

## 📚 目錄

1.  [全域主題管理器 (Theme Manager)](#1-全域主題管理器-theme-manager)
2.  [投影片結構與 YAML 配置](#2-投影片結構與-yaml-配置)
3.  [生成式背景 (Generative Mesh)](#3-生成式背景-generative-mesh)
4.  [專業佈局圖鑑 (Layouts)](#4-專業佈局圖鑑-layouts)
5.  [原生圖表指南 (Native Charts)](#5-原生圖表指南-native-charts)
6.  [進階編輯工具 (Tweaker & Commands)](#6-進階編輯工具-tweaker--commands)

---

## 1. 全域主題管理器 (Theme Manager)

系統內建強大的主題管理系統，讓您無需修改 Markdown 即可一鍵變更整份簡報的風格。

### 如何使用
1.  **側欄面板**: 點擊左側快捷列最上方的 **調色盤圖示 (Palette)** 開啟面板。
2.  **主題切換**: 提供 4 種專業預設風格：
    - `Amber Graphite`: 溫潤商務 (預設)
    - `Midnight Cyber`: 科技深夜霓虹
    - `Academic Clean`: 簡約學術
    - `Material Teal`: 現代翠綠
3.  **配色盤**: 面板提供常用色號，點擊即可將 HEX 色碼插入游標處。

---

## 2. 投影片結構與 YAML 配置

### 分頁符號 `===`
MD2PPT 使用三個等號 `===` 作為投影片的邊界。**請務必在 `===` 前後保留空行**。

### YAML 配置區塊 `---`
在每張投影片的頂部（緊接在 `===` 之後），您可以插入一個 YAML 區塊。

**完整參數列表：**

| 參數 | 類型 | 預設值 | 說明 |
| :--- | :--- | :--- | :--- |
| **`layout`** | `string` | `default` | 版面模式。可選值：`grid`, `center`, `quote`, `alert`, `two-column`, `impact`, `full-bg`。 |
| **`theme`** | `string` | - | 指定此份簡報的主題。例如 `theme: midnight-cyber`。 |
| **`bg`** | `string` | `#FFFFFF` | 背景顏色 (Hex) 或 `mesh` (生成式背景)。 |
| **`bgImage`** | `string` | - | 背景圖片 URL 或 Base64。支援拖放設定。 |
| **`transition`** | `string` | `none` | 過場動畫。可選值：`fade`, `slide`, `zoom`。 |
| **`columns`** | `number` | `2` | 僅適用於 `layout: grid`，指定欄位數量 (2~4)。 |
| **`note`** | `string` | - | 演講者備忘錄內容。 |

---

## 3. 生成式背景 (Generative Mesh)

v0.10.0+ 支援自動生成獨一無二的 Mesh Gradient 背景。

**啟用方式：**
```yaml
bg: mesh
mesh:
  colors: ["#0F172A", "#3B82F6", "#DB2777"]
  seed: 12345
```

- **`colors`**: 定義漸層的主色調。
- **`seed`**: 改變隨機種子以獲得不同的流動紋理。

💡 **小技巧**：您可以直接點擊預覽區的背景，使用 **Visual Tweaker** 來隨機生成 (Re-roll) 或調整顏色。

---

## 4. 專業佈局圖鑑 (Layouts)

### `grid` (網格佈局)
- **參數**: `columns: 2` (預設), `3`, `4`
- **行為**: 採用「順序填充」邏輯，確保標題與其內容保持在一起。

### `two-column` (雙欄佈局)
- **行為**: 標題橫跨頂部，其餘內容自動平分為左右兩欄。
- **強制分欄**: 使用 `:: right ::` 指令強制換到右欄。

### `quote` (引用佈局)
- **樣式**: 自動添加裝飾性大引號，字體放大並套用襯線體。

### `alert` (告警佈局)
- **樣式**: 帶有醒目的邊框與背景色塊，適合強調重點。

---

## 5. 原生圖表指南 (Native Charts)

MD2PPT 支援將 Markdown 表格轉換為 **PowerPoint 原生圖表**（可編輯數據）。

**語法範例：**
```markdown
::: chart-pie { "title": "營收分析", "showLegend": true }

| 產品 | 佔比 |
| :--- | :--- |
| A    | 60   |
| B    | 40   |

:::
```

### 支援圖表類型
- `chart-bar`: 數據比較。
- `chart-line`: 趨勢分析。
- `chart-pie`: 佔比分析。
- `chart-area`: 累積趨勢。

---

## 6. 進階編輯工具 (Tweaker & Commands)

### 🔮 Visual Tweaker (視覺化調整)
無需修改 Markdown，直接點擊預覽區的元素即可：
- **編輯文字**: 即時修改標題或內文。
- **調整字體大小**: 使用 `+` / `-` 按鈕微調字級，系統會自動插入 `{size=24}` 標籤。
- **更換圖片**: 貼上新的 URL 或 Alt 文字。
- **修改圖表**: 編輯 JSON 配置或數據表格。

所有變更都會**自動回寫**至左側的 Markdown 編輯器中。

### ⌨️ Command Palette (指令面板)
按下 `Ctrl + K` (或是 macOS 的 `Cmd + K`) 喚起指令中心：
- **跳轉**: 搜尋並快速切換至特定投影片。
- **插入**: 快速插入圖表模板、佈局結構或 Lorem Ipsum 假文。
- **匯出**: 執行 PPTX 下載或圖片包匯出。

---

Happy Presenting!
