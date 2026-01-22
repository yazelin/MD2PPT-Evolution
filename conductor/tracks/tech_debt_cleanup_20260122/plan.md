# 執行計畫 (plan.md) - 技術債清理：移除舊解析器與修復測試 (Technical Debt Cleanup)

## 第一階段：代碼清理與環境重整 (Cleanup & Red Phase)
立即移除過時代碼，並建立新的 AST 測試基準。

- [ ] **Task: 移除舊解析器檔案**
    - [ ] 永久刪除 `services/markdownParser.ts`。
    - [ ] 執行 `npm test` 確認受影響的測試範圍（預期會大幅失敗）。
- [ ] **Task: 建立新的 AST 整合測試檔**
    - [ ] 建立 `tests/astParserIntegration.test.ts` 作為遷移後的集中測試地。
- [ ] **Task: Conductor - User Manual Verification '第一階段：代碼清理' (Protocol in workflow.md)**

## 第二階段：核心測試遷移 (Core Test Migration)
將原本分散在各處的解析測試，以 AST 架構重新實作並整併。

- [ ] **Task: 遷移基礎與分頁測試**
    - [ ] 從 `markdownParser.test.ts` 與 `remarkSplitter.test.ts` 遷移基礎語法與 `===` 切分案例。
    - [ ] 從 `yamlParsing.test.ts` 遷移配置提取案例。
- [ ] **Task: 遷移邊界情況測試**
    - [ ] 從 `boundaryCases.test.ts` 遷移長內容、空分頁與圖表標籤閉合失敗案例。
- [ ] **Task: 刪除過時測試檔**
    - [ ] 刪除已遷移完成的 `markdownParser.test.ts`, `boundaryCases.test.ts`, `yamlParsing.test.ts`, `remarkSplitter.test.ts`。
- [ ] **Task: Conductor - User Manual Verification '第二階段：測試遷移' (Protocol in workflow.md)**

## 第三階段：整合與 UI 測試修復 (Integration Fixes)
修正因內部邏輯或 DOM 結構改變而失敗的視覺與整合測試。

- [ ] **Task: 修正 Tweaker 相關測試**
    - [ ] 更新 `ChartTweaker.test.tsx` 與 `ImageTweaker.test.tsx` 的 Mock 預期（處理 undefined range）。
    - [ ] 更新 `VisualTweakerContext.test.tsx` 以符合新的更新邏輯。
- [ ] **Task: 修復演講者主控台測試**
    - [ ] 修改 `PresenterConsole.test.tsx`，確保 `data-testid` 或元素選取符合最新 UI。
- [ ] **Task: Conductor - User Manual Verification '第三階段：整合修復' (Protocol in workflow.md)**

## 第四階段：最終品質驗證 (Final Quality Gate)
確保系統在完全移除技術債後，依然穩定且可建置。

- [ ] **Task: 執行全量測試與建置**
    - [ ] 執行 `npm test` 並確認 **0 failures**。
    - [ ] 執行 `npm run build` 確認生產環境建置正常。
- [ ] **Task: 版本與文件同步**
    - [ ] 在 `CHANGELOG.md` 紀錄技術債清理與測試強化工作。
- [ ] **Task: Conductor - User Manual Verification '第四階段：最終驗證' (Protocol in workflow.md)**
