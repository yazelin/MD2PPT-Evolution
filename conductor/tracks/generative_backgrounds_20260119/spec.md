# 規格書: 動態背景生成器 (Generative Backgrounds) - `generative_backgrounds_20260119`

## 1. 概述 (Overview)
本功能旨在引入生成藝術算法，讓簡報擺脫單調的純色或靜態圖片背景。初始版本將專注於 **Mesh Gradients (網格漸層)**，透過演算法生成平滑流動的多色漸層背景，並確保預覽區與 PPT 導出效果高度一致。

## 2. 功能需求 (Functional Requirements)

### 2.1 語法與觸發
- **YAML 配置**: 支援在投影片 Frontmatter 中設定 `background: mesh` 或 `bg: mesh`。可進一步指定顏色參數（如 `colors: [#FF5733, #33FF57]`）或隨機種子。
- **斜線指令 (Slash Command)**: 新增 `/bg-mesh` 指令，快速插入預設的網格漸層配置模板。
- **Visual Tweaker 整合**:
    - 在預覽區點擊背景空白處可觸發背景 Tweaker。
    - 提供介面調整漸層顏色、混合模式 (Blur/Opacity) 與隨機重新生成。

### 2.2 渲染引擎
- **SVG 生成器**: 核心邏輯將採用 SVG 格式繪製網格漸層。
- **雙向同步**: 
    - **預覽**: 直接將生成的 SVG 注入 HTML 作為投影片背景層。
    - **匯出**: 將 SVG 轉換為高解析度 Base64 圖片，利用 `pptxgenjs` 的背景圖功能嵌入投影片。

## 3. 非功能需求 (Non-Functional Requirements)
- **視覺一致性**: 確保瀏覽器預覽的漸層效果與 PowerPoint 開啟時的靜態背景圖在構圖與色調上完全吻合。
- **效能**: 背景生成算法應在 100ms 內完成，避免造成編輯器卡頓。

## 4. 驗收標準 (Acceptance Criteria)
- [ ] 透過 YAML 設定 `bg: mesh` 能在預覽區看到動態生成的漸層。
- [ ] 透過 `/bg-mesh` 插入指令後，內容能正確渲染。
- [ ] 點擊預覽區背景能喚起 Visual Tweaker 並即時變更顏色。
- [ ] 匯出的 PPTX 檔案中，投影片背景正確顯示為生成的漸層圖案（靜態）。

## 5. 超出範圍 (Out of Scope)
- 匯出至 PPTX 的背景動畫（PowerPoint 限制，僅維持靜態圖片）。
- 複雜的 3D 粒子物理模擬。
