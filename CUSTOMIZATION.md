# 進階客製化指南 (Customization Guide)

歡迎使用 **MD2PPT-EVOLUTION**！本指南將協助您掌握 v0.5.0 版本引入的強大配置系統，讓您能透過簡單的 YAML 設定與指令，創作出獨一無二的專業簡報。

## 🎯 目錄

1. [YAML 配置系統詳解](#1-yaml-配置系統詳解)
2. [專業佈局圖鑑 (Layout Gallery)](#2-專業佈局圖鑑-layout-gallery)
3. [進階樣式指令](#3-進階樣式指令)
4. [開發者指南：修改核心設計](#4-開發者指南修改核心設計)

---

## 1. YAML 配置系統詳解

在每一張投影片的頂部（即 `===` 分頁符號之後），您可以插入一個 YAML 區塊來控制該頁的視覺表現。

### 基礎語法
```markdown
===
---
layout: center
background: "#1e293b"
transition: fade
---
# 您的標題
```

### 完整參數列表

| 參數 | 類型 | 預設值 | 說明 |
| :--- | :--- | :--- | :--- |
| **`layout`** | `string` | `default` | 版面配置模式。支援：`grid`, `center`, `quote`, `alert`, `two-column`, `impact`, `full-bg`。 |
| **`background`** | `string` | `#FFFFFF` | 背景顏色，支援 Hex 色碼 (如 `#FF5500`)。 |
| **`bgImage`** | `string` | `undefined` | 背景圖片網址或 Base64 字串。支援透過拖放自動設定。 |
| **`transition`** | `string` | `none` | 投影片過場動畫。支援：`fade` (淡入), `slide` (滑入), `zoom` (縮放)。 |
| **`columns`** | `number` | `2` | 僅適用於 `layout: grid`，指定網格的欄位數量。 |
| **`note`** | `string` | `undefined` | 演講者備忘錄內容 (Speaker Notes)。 |

---

## 2. 專業佈局圖鑑 (Layout Gallery)

我們內建了多種經過設計師調校的佈局，滿足不同場景需求。

### 1. `center` (居中佈局)
- **用途**: 轉場頁、大標題頁、金句強調。
- **特性**: 內容垂直且水平完全居中。
- **範例**:
  ```markdown
  layout: center
  background: "#000000"
  ```

### 2. `quote` (引用佈局)
- **用途**: 展示名人名言或客戶證言。
- **特性**: 自動添加裝飾性的大引號，字體放大且套用襯線體 (Serif) 風格。
- **範例**:
  ```markdown
  layout: quote
  ```

### 3. `grid` (網格佈局)
- **用途**: 展示產品特點、團隊成員或多點比較。
- **特性**: 自動將內容依序填入欄位。可透過 `columns` 參數自定義欄數 (預設 2 欄，支援 3, 4 欄)。
- **範例**:
  ```markdown
  layout: grid
  columns: 3
  ```

### 4. `alert` (告警佈局)
- **用途**: 提示注意事項、警告或核心結論。
- **特性**: 帶有醒目的邊框與圖示，背景呈現半透明強調色。
- **範例**:
  ```markdown
  layout: alert
  ```

### 5. `two-column` (雙欄佈局)
- **用途**: 左圖右文、對照比較。
- **特性**: 經典的 50/50 分割。標題橫跨頂部，其餘內容自動分為左右兩欄。

---

## 3. 進階樣式指令

### 現代化表格 (Modern Table)
將標準 Markdown 表格轉換為具備專業配色的 PPT 原生表格。

**語法**:
```markdown
::: table-modern
| 標題 1 | 標題 2 |
| :--- | :--- |
| 資料 A | 資料 B |
:::
```

**效果**:
- 標題列套用主題色 (如琥珀橘)。
- 資料列採用交錯底色 (Zebra striping)，提升易讀性。
- 表格線條細緻化。

---

## 4. 開發者指南：修改核心設計

如果您是開發者，希望從程式碼層面修改預設值，請參考以下檔案：

### 全局主題配置
**檔案路徑**: `constants/theme.ts`
- 修改 `PPT_THEME` 可調整全域字體大小、預設顏色與間距。

### 預覽渲染邏輯
**檔案路徑**: `components/editor/PreviewPane.tsx`
- 所有的佈局邏輯 (Grid, Center, etc.) 都定義在 `SlideCard` 與 `SlideContent` 元件中。

### PPT 生成邏輯
**檔案路徑**: `services/pptGenerator.ts`
- 這裡定義了如何將 Markdown AST 轉換為 `pptxgenjs` 的 API 呼叫。

---

Happy Presenting!