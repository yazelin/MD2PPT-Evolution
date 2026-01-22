# 規格說明書 (spec.md) - 遷移至 Remark/Unified 解析管線

## 1. 概述 (Overview)
目前的 `markdownParser.ts` 雖然效能良好，但內部混用了正則表達式來處理分頁 (`===`)、圖表 (`:::`) 與配置 (`---`)，這在處理巢狀結構（如列表內包含程式碼塊，或 Grid 內部的複雜表格）時存在解析邊界問題。本計畫旨在遷移至基於 **Remark/Unified** 的 AST 解析架構，實現真正的「內容即代碼」解析精度。

## 2. 功能需求 (Functional Requirements)

### 2.1 核心解析管線 (The Pipeline)
- **基礎解析**：整合 `remark-parse`、`remark-gfm` 與 `remark-frontmatter`。
- **分頁識別插件**：開發自定義 Remark 插件，識別 `===` (Thematic Break) 作為分頁邊界，將 MDAST 轉換為「投影片區塊」結構。
- **擴充語法支持**：使用 `remark-directive` 處理 `::: chart`、`::: alert`、`:: right` 等容器與葉子節點指令。

### 2.2 SOM 2.0 升級 (Slide Object Model Enhancement)
- **精確位置映射**：利用 MDAST 提供的 `position` 物件 (start/end offsets)，在 SOM 中為每個節點標註精確的原始碼位置。
- **強化回寫能力**：利用位置資訊，讓 Visual Tweaker 的修改能達成「原地更新」，不再依賴脆弱的行號計算。

### 2.3 配置系統整合
- **統一 YAML 處理**：透過 `remark-frontmatter` 自動提取全域與單頁配置，並將其解析為 SOM 屬性。

## 3. 技術規格 (Technical Specifications)
- **生態系組件**：`unified`, `remark-parse`, `remark-frontmatter`, `remark-directive`, `remark-gfm`。
- **兼容性**：必須 100% 兼容現有的 `reorderSlides`、`updateSlideYaml` 等功能，但內部改為 AST 操作。

## 4. 驗收標準 (Acceptance Criteria)
1. 所有現有的 Markdown 教學內容能被正確解析並渲染，視覺效果無退化。
2. 能夠解析巢狀結構（例如：在 `::: grid` 的欄位中放入一個包含三層層級的 Markdown 列表）。
3. 拖拽重排功能依然正常運作，且 Markdown 內容重組邏輯改為基於 AST 生成。
4. 在 `tests/markdownParser.test.ts` 中新增複雜巢狀語法的測試案例並通過。

## 5. 超出範圍 (Out of Scope)
- 更改 PPTX 導出的底層 API (`pptxgenjs`)。
- 引入新的 Markdown 語法（本計畫專注於現有語法的架構遷移）。
