# 軌跡規格：原生可編輯圖表支援 (native_charts_v060)

## 1. 概述 (Overview)
此軌跡旨在將 Markdown 表格數據轉換為 PowerPoint (PPTX) 的原生可編輯圖表。使用者可以使用簡單的容器語法定義圖表類型與配置，並在網頁預覽中即時看到由 `Recharts` 渲染的效果，匯出後則為 PPT 內建的圖表物件。

## 2. 功能需求 (Functional Requirements)

### 2.1 圖表語法與解析
- **容器語法**：支援 `::: chart-bar`, `::: chart-line`, `::: chart-pie`, `::: chart-area` 指令包裹 Markdown 表格。
- **配置參數**：支援在指令後方使用 JSON 風格參數，例如 `{ "title": "業績報告", "showLegend": true, "showValues": true, "colors": "theme" }`。
- **數據映射**：
    - 表格第一直列 (Column 1) 映射為 **類別 (Categories/X-axis)**。
    - 表格其餘直列映射為 **數值序列 (Data Series)**。
    - 表格標題列 (Header Row) 映射為 **序列名稱 (Series Names)**。

### 2.2 Web 預覽實作
- **集成 Recharts**：引入 `recharts` 庫，根據解析後的表格數據渲染對應的 React 圖表組件。
- **即時同步**：在編輯器修改表格數據時，預覽圖表應即時更新。

### 2.3 PPTX 引擎整合
- **原生圖表導出**：調用 `pptxgenjs` 的 `slide.addChart()` 方法。
- **樣式同步**：確保 PPT 中的圖表顏色、標題與圖例設定盡可能與預覽保持一致。
- **可編輯性**：匯出後的圖表必須保留原始數據連結，允許使用者在 PowerPoint 中點擊「編輯數據」進行修改。

## 3. 非功能需求 (Non-Functional Requirements)
- **效能**：大數據表格解析時不應造成編輯器卡頓。
- **容錯處理**：若表格數據包含非數字字元，應跳過該單元格或顯示友善的錯誤提示。

## 4. 驗收標準 (Acceptance Criteria)
- [ ] 使用者能在 Markdown 中輸入 `::: chart-bar` 並在預覽中看到條形圖。
- [ ] 修改表格內的數值，預覽圖表會同步變動。
- [ ] 匯出的 PPTX 檔案中，圖表是原生的 PPT 物件而非圖片。
- [ ] 在 PPT 中點擊圖表「編輯數據」能看到與 Markdown 一致的原始數值。
- [ ] 支援 `bar`, `line`, `pie`, `area` 四種基礎類型。

## 5. 超出範圍 (Out of Scope)
- 複雜的 3D 圖表。
- 混合型圖表（例如長條圖加折線圖）。
- 動態數據源（如從外部 API 獲取數據）。
