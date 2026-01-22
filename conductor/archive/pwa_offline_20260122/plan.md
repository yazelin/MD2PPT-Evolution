# 執行計畫 (plan.md) - PWA 離線化與原生化 (Offline Support)

## 第一階段：基礎架構與 PWA 配置 (PWA Infrastructure)
建立 PWA 的核心設定與 Manifest。

- [x] **Task: 安裝並設定 `vite-plugin-pwa`** 0170c60
    - [x] 安裝 `vite-plugin-pwa` 依賴。 0170c60
    - [x] 修改 `vite.config.ts` 加入 PWA 插件配置。 0170c60
- [x] **Task: 建立 Web App Manifest** 0170c60
    - [x] 定義 `manifest.json`：包含名稱、簡稱、啟動 URL 與主題色。 0170c60
    - [x] 整合應用程式圖示 (Icons)。 0170c60
- [x] **Task: Conductor - User Manual Verification '第一階段：PWA 基礎' (Protocol in workflow.md)** 0170c60

## 第二階段：離線資源快取策略 (Caching Strategy)
優化 Workbox 設定，確保所有第三方資源與字體可離線存取。

- [x] **Task: 配置 Workbox 執行期快取** 0170c60
    - [x] 實作字體快取策略 (Google Fonts / 本地字體)。 0170c60
    - [x] 快取 `Shiki` (語法高亮) 資源檔案。 0170c60
    - [x] 快取 `Mermaid` 與 `Recharts` 相關依賴。 0170c60
- [x] **Task: 驗證資源預取 (Precaching)** 0170c60
    - [x] 確保主程式 JS/CSS 在離線時能正確加載。 0170c60
- [x] **Task: Conductor - User Manual Verification '第二階段：快取策略' (Protocol in workflow.md)** 0170c60

## 第三階段：UI 整合與更新邏輯 (UI & Update Flow)
實作安裝引導、離線提示與版本更新 UI。

- [x] **Task: 實作 PWA 管理 Hook (`usePWA`)** 0170c60
    - [x] 偵測安裝事件 (`beforeinstallprompt`)。 0170c60
    - [x] 監聽 Service Worker 更新狀態。 0170c60
- [x] **Task: 整合 UI 組件** 0170c60
    - [x] 在 `EditorHeader` 新增「安裝 App」按鈕（視偵測結果顯示）。 0170c60
    - [x] 在 `Footer` 或 Header 側邊加入「離線狀態」提示燈。 0170c60
    - [x] 建立「新版本發現」通知彈窗。 0170c60
- [x] **Task: Conductor - User Manual Verification '第三階段：UI 整合' (Protocol in workflow.md)** 0170c60

## 第四階段：版本升級與最終驗證 (Polish & Release)
完成版本更新並進行全面的離線測試。

- [x] **Task: 版本升級至 V0.14.2** 0170c60
    - [x] 更新 `package.json` 版本。 0170c60
    - [x] 更新 `README.md` 版本標記。 0170c60
    - [x] 在 `CHANGELOG.md` 紀錄 V0.14.2 變更。 0170c60
- [x] **Task: 最終品質檢查** 0170c60
    - [x] 執行 `npm run build` 驗證生產版本。 0170c60
    - [x] 於瀏覽器 DevTools 的 Application 面板驗證 Service Worker 註冊。 0170c60
    - [x] 離線環境下的功能全測試。 0170c60
- [x] **Task: Conductor - User Manual Verification '第四階段：最終優化' (Protocol in workflow.md)** 0170c60
