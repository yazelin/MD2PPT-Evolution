### 📄 企業級品牌系統 (Enterprise Brand System) 規格書

#### 1. 概述 (Overview)
本功能旨在提供一套專業的品牌設定機制，允許使用者定義公司專屬的 CI (Corporate Identity) 規範。透過「事前預設」的邏輯，將品牌顏色、字體與 Logo 自動套用至全份簡報與 PPTX 母片中，確保輸出的專業性與一致性。

#### 2. 功能需求 (Functional Requirements)
*   **品牌設定視窗 (GUI Modal)**：
    *   提供一個獨立的對話視窗供使用者輸入品牌設定。
    *   支援匯入/匯出 `brand.json` 功能，以便快速套用預設配置。
*   **品牌色票系統**：
    *   使用者可定義「主色 (Primary)」、「輔助色 (Secondary)」與「強調色 (Accent)」。
    *   系統應自動將這些顏色注入 CSS 變數，並成為圖表 (Charts) 與標題的預設配色。
*   **共通安全字體選擇**：
    *   字體選單限制為 PPT 共通字體（微軟正黑體、標楷體、新細明體、Arial、Times New Roman 等）。
    *   預覽區與匯出 PPT 需同步套用選定字體。
*   **全域 Logo 管理**：
    *   支援上傳單一 Logo 檔案（儲存為 Base64）。
    *   設定 Logo 顯示位置（如：右上角）。
    *   匯出 PPTX 時，Logo 應被放置在母片 (Master Slide) 中。

#### 3. 非功能需求 (Non-Functional Requirements)
*   **效能**：設定視窗開啟應流暢，JSON 匯入應即時反應。
*   **相容性**：產出的字體應在未安裝特殊字體的 Windows/Mac 環境下正常顯示。

#### 4. 驗收標準 (Acceptance Criteria)
*   [ ] 使用者可透過 GUI 設定主色，且所有投影片標題自動變色。
*   [ ] 匯入 `brand.json` 後，字體與顏色設定能立即更新。
*   [ ] 匯出的 PPTX 檔案中，每張投影片的固定位置皆出現上傳的 Logo。
*   [ ] 圖表元件預設使用品牌主色而非隨機顏色。
