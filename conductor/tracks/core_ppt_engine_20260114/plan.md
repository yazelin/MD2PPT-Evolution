# 開發計畫: 核心 PPT 生成引擎實作 (MVP 功能)

## 階段 1: 基礎設施與投影片分割邏輯
- [x] Task: 編寫投影片分割邏輯的測試案例 (H1/H2/--- 分割)
- [x] Task: 實作 `pptGenerator.ts` 中的區塊分組邏輯，將 `ParsedBlock[]` 轉換為 `SlideData[]`
- [x] Task: 實作基本的投影片建立與標題/文字渲染
- [x] Task: Conductor - User Manual Verification '階段 1: 基礎設施與投影片分割邏輯' (Protocol in workflow.md) [checkpoint: 9217120]

## 階段 2: 樣式整合與品牌化
- [x] Task: 編寫主題樣式與字體配置的測試
- [x] Task: 整合 `constants/theme.ts` 與 `constants/meta.ts` 的配置至 PPT 生成流程
- [x] Task: 實作橘紅品牌色 (Orange-Red) 的視覺應用
- [x] Task: Conductor - User Manual Verification '階段 2: 樣式整合與品牌化' (Protocol in workflow.md) [checkpoint: b2fbe83]

## 階段 3: 技術內容渲染 (程式碼與圖片)
- [x] Task: 編寫程式碼區塊渲染的測試案例 (語法模擬與佈局)
- [x] Task: 實作程式碼區塊在 PPT 中的高亮與排版邏輯
- [x] Task: 實作 Base64 圖片嵌入功能
- [x] Task: Conductor - User Manual Verification '階段 3: 技術內容渲染 (程式碼與圖片)' (Protocol in workflow.md) [checkpoint: 81b03f7]

## 階段 4: 特殊語法支援與最終整合
- [x] Task: 編寫角色對話模式的轉換測試
- [x] Task: 實作角色對話區塊的 PPT 佈局 (左/中/右對齊)
- [x] Task: 最終整合測試：從 Markdown 匯出完整 Demo 檔案
- [x] Task: Conductor - User Manual Verification '階段 4: 特殊語法支援與最終整合' (Protocol in workflow.md) [checkpoint: 81b03f7]
