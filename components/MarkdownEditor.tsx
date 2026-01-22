/**
 * BookPublisher MD2Docx
 * Copyright (c) 2025 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { KBarProvider, Action } from 'kbar';
import { useEditorController } from '../hooks/useEditorController';
import { EditorProvider } from '../contexts/EditorContext';
import { VisualTweakerProvider } from '../contexts/VisualTweakerContext';

// Components
import { EditorHeader } from './editor/EditorHeader';
import { EditorPane } from './editor/EditorPane';
import { PreviewPane } from './editor/PreviewPane';
import { QuickActionSidebar } from './editor/QuickActionSidebar';
import { ThemePanel } from './editor/ThemePanel';
import { BrandSettingsModal } from './editor/BrandSettingsModal';
import { AiPromptModal } from './editor/AiPromptModal';
import { TweakerOverlay } from './tweaker/TweakerOverlay';
import { CommandPalette } from './editor/CommandPalette';
import Footer from './Footer';

import { CURATED_PALETTES } from '../constants/palettes';
import { transformToSOM } from '../services/parser/som';
import { 
  Palette, 
  Presentation, 
  FileText, 
  Download, 
  Languages, 
  Moon, 
  Sun, 
  StickyNote, 
  Plus, 
  LayoutGrid,
  Columns,
  AlignCenter,
  Quote as QuoteIcon,
  AlertTriangle,
  Table as TableIcon,
  BarChart,
  PieChart,
  LineChart,
  AreaChart,
  Image as ImageIcon,
  MessageSquare,
  Search
} from 'lucide-react';

const MarkdownEditor: React.FC = () => {
  const {
    editorState,
    darkModeState,
    uiState,
    handlers
  } = useEditorController();
  
  const {
    content,
    setContent,
    parsedBlocks,
    wordCount,
    textareaRef,
    previewRef,
    brandConfig,
    updateBrandConfig,
    saveBrandConfigToFile,
    loadBrandConfigFromFile
  } = editorState;

  const {
    isThemePanelOpen,
    setIsThemePanelOpen,
    isBrandModalOpen,
    setIsBrandModalOpen,
    isAiModalOpen,
    setIsAiModalOpen
  } = uiState;

  const {
    handleAction,
    handleEditorDrop,
    handleUpdateSlideConfig,
    handleInsertColor,
    handleApplyPalette,
    handleReorderSlides,
    handleTweakerUpdate,
    handleGetLineContent
  } = handlers;

  const {
    isDark,
    toggleDarkMode
  } = darkModeState;

  const {
    toggleNotes,
    resetToDefault,
    toggleLanguage,
    handleDownload,
    handleExportMarkdown,
    handleExportImages
  } = editorState;

  const { startPresentation } = useEditorController() as any; // Hook provided by controller

  // Prepare dynamic slide jump actions
  const slides = transformToSOM(parsedBlocks);
  const slideJumpActions: Action[] = slides.map((slide, idx) => ({
    id: `jump-to-slide-${idx}`,
    name: `跳轉至第 ${idx + 1} 頁`,
    parent: "search",
    keywords: `slide ${idx + 1} jump ${slide.config?.layout || ""}`,
    perform: () => {
      if (previewRef.current) {
        const elements = previewRef.current.querySelectorAll('[data-slide-capture]');
        if (elements[idx]) {
          elements[idx].scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
  }));

  // Prepare theme switching actions
  const themeActions: Action[] = CURATED_PALETTES.map((palette) => ({
    id: `theme-${palette.id}`,
    name: `切換主題：${palette.label}`,
    parent: "themes",
    keywords: `${palette.name} ${palette.description} color skin`,
    perform: () => handleApplyPalette(palette),
  }));

  const actions: Action[] = [
    { id: "search", name: "搜尋與跳轉投影片", shortcut: ["s"], keywords: "find search slide jump navigate", section: "導航與跳轉", icon: <Search size={18} /> },
    ...slideJumpActions,
    { id: "themes", name: "更換配色與主題", shortcut: ["t"], keywords: "change theme skin color palette", section: "樣式與設定", icon: <Palette size={18} /> },
    ...themeActions,
    { id: "layouts", name: "插入投影片佈局", shortcut: ["b"], keywords: "insert layout template block", section: "內容插入", icon: <LayoutGrid size={18} /> },
    { id: "insert-slide", name: "插入新投影片 (Standard)", parent: "layouts", perform: () => handleAction({ type: 'INSERT_SLIDE' }) },
    { id: "insert-grid", name: "套用網格佈局 (Grid)", parent: "layouts", perform: () => handleAction({ type: 'LAYOUT_GRID' }) },
    { id: "insert-two-col", name: "套用雙欄佈局 (Two Column)", parent: "layouts", perform: () => handleAction({ type: 'LAYOUT_TWO_COLUMN' }) },
    { id: "insert-center", name: "套用置中佈局 (Center)", parent: "layouts", perform: () => handleAction({ type: 'LAYOUT_CENTER' }) },
    { id: "insert-quote", name: "套用引用佈局 (Quote)", parent: "layouts", perform: () => handleAction({ type: 'LAYOUT_QUOTE' }) },
    { id: "insert-alert", name: "套用告警佈局 (Alert)", parent: "layouts", perform: () => handleAction({ type: 'LAYOUT_ALERT' }) },
    { id: "components", name: "插入多媒體元件", shortcut: ["i"], keywords: "insert component chart image table", section: "內容插入", icon: <Plus size={18} /> },
    { id: "comp-table", name: "插入數據表格", parent: "components", perform: () => handleAction({ type: 'INSERT_TABLE' }), icon: <TableIcon size={16} /> },
    { id: "comp-bar", name: "插入長條圖 (Bar Chart)", parent: "components", perform: () => handleAction({ type: 'INSERT_CHART_BAR' }), icon: <BarChart size={16} /> },
    { id: "comp-line", name: "插入折線圖 (Line Chart)", parent: "components", perform: () => handleAction({ type: 'INSERT_CHART_LINE' }), icon: <LineChart size={16} /> },
    { id: "comp-pie", name: "插入圓餅圖 (Pie Chart)", parent: "components", perform: () => handleAction({ type: 'INSERT_CHART_PIE' }), icon: <PieChart size={16} /> },
    { id: "comp-area", name: "插入面積圖 (Area Chart)", parent: "components", perform: () => handleAction({ type: 'INSERT_CHART_AREA' }), icon: <AreaChart size={16} /> },
    { id: "comp-img", name: "插入圖片 (Image)", parent: "components", perform: () => handleAction({ type: 'INSERT_IMAGE' }), icon: <ImageIcon size={16} /> },
    { id: "comp-note", name: "插入演講者備忘錄", parent: "components", perform: () => handleAction({ type: 'INSERT_NOTE' }), icon: <StickyNote size={16} /> },
    { id: "comp-chat", name: "插入角色對話 (Chat)", parent: "components", perform: () => handleAction({ type: 'INSERT_CHAT' }), icon: <MessageSquare size={16} /> },
    { id: "toggle-dark-mode", name: "切換深淺模式", shortcut: ["d", "m"], keywords: "dark light theme mode", section: "系統設定", icon: isDark ? <Sun size={18} /> : <Moon size={18} />, perform: () => toggleDarkMode() },
    { id: "toggle-language", name: "切換介面語系", shortcut: ["g", "l"], keywords: "language switch translate", section: "系統設定", icon: <Languages size={18} />, perform: () => toggleLanguage() },
    { id: "toggle-notes", name: "顯示/隱藏備忘錄", shortcut: ["g", "n"], keywords: "toggle hide show notes speaker", section: "系統設定", icon: <StickyNote size={18} />, perform: () => toggleNotes() },
    { id: "export-pptx", name: "下載 PowerPoint (PPTX)", shortcut: ["e", "p"], keywords: "download pptx powerpoint save", section: "檔案與匯出", icon: <Download size={18} />, perform: () => handleDownload() },
    { id: "export-images", name: "下載圖片包 (ZIP)", shortcut: ["e", "i"], keywords: "download images bundle zip", section: "檔案與匯出", icon: <ImageIcon size={18} />, perform: () => handleExportImages() },
    { id: "export-markdown", name: "匯出 Markdown 源碼", shortcut: ["e", "m"], keywords: "download source text md", section: "檔案與匯出", icon: <FileText size={18} />, perform: () => handleExportMarkdown() },
  ];

  const extendedEditorState = {
    ...editorState,
    isThemePanelOpen,
    toggleThemePanel: () => setIsThemePanelOpen(!isThemePanelOpen),
    isBrandModalOpen,
    openBrandModal: () => setIsBrandModalOpen(true),
    closeBrandModal: () => setIsBrandModalOpen(false),
    isAiModalOpen,
    openAiModal: () => setIsAiModalOpen(true),
    closeAiModal: () => setIsAiModalOpen(false)
  };

  return (
    <KBarProvider actions={actions}>
      <CommandPalette />
      <EditorProvider editorState={extendedEditorState as any} darkModeState={darkModeState}>
        <VisualTweakerProvider onUpdateContent={handleTweakerUpdate} onGetLineContent={handleGetLineContent}>
          <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors relative font-sans">
            <EditorHeader />
            <main className="flex flex-1 overflow-hidden relative">
              <QuickActionSidebar onAction={handleAction} onReorderSlides={handleReorderSlides} />
              <TweakerOverlay />
              {isThemePanelOpen && <ThemePanel onClose={() => setIsThemePanelOpen(false)} onInsertColor={handleInsertColor} onApplyPalette={handleApplyPalette} />}
              <BrandSettingsModal isOpen={isBrandModalOpen} onClose={() => setIsBrandModalOpen(false)} config={brandConfig} onUpdate={updateBrandConfig} onExport={saveBrandConfigToFile} onImport={loadBrandConfigFromFile} />
              <AiPromptModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
              <div className="flex flex-1 overflow-hidden">
                <div className="w-[45%] flex flex-col" onDragOver={(e) => e.preventDefault()} onDrop={handleEditorDrop}>
                  <EditorPane content={content} setContent={setContent} wordCount={wordCount} textareaRef={textareaRef} onScroll={editorState.handleScroll} />
                </div>
                <PreviewPane parsedBlocks={parsedBlocks} previewRef={previewRef} onUpdateSlideConfig={handleUpdateSlideConfig} onReorderSlides={handleReorderSlides} />
              </div>
            </main>
            <Footer />
          </div>
        </VisualTweakerProvider>
      </EditorProvider>
    </KBarProvider>
  );
};

export default MarkdownEditor;