/**
 * BookPublisher MD2Docx
 * Copyright (c) 2025 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';

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

import Footer from './Footer';



import { KBarProvider, Action } from 'kbar';



import { CommandPalette } from './editor/CommandPalette';



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



...



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







  // Define KBar Actions



  const actions: Action[] = [



    // 1. Navigation



    {



      id: "search",



      name: "搜尋與跳轉",



      shortcut: ["s"],



      keywords: "find search slide jump",



      section: "導航",



      icon: <Search size={18} />,



    },



    // 2. Insert Layouts



    {



      id: "insert-slide",



      name: "插入新投影片",



      shortcut: ["n"],



      keywords: "new slide add",



      section: "插入與佈局",



      icon: <Plus size={18} />,



      perform: () => handleAction({ type: 'INSERT_SLIDE' }),



    },



    {



      id: "layout-grid",



      name: "套用網格佈局 (Grid)",



      keywords: "layout grid multi column",



      section: "插入與佈局",



      icon: <LayoutGrid size={18} />,



      perform: () => handleAction({ type: 'LAYOUT_GRID' }),



    },



    {



      id: "layout-two-col",



      name: "套用雙欄佈局 (Two Column)",



      keywords: "layout split side",



      section: "插入與佈局",



      icon: <Columns size={18} />,



      perform: () => handleAction({ type: 'LAYOUT_TWO_COLUMN' }),



    },



    // 3. System Controls



    {



      id: "toggle-dark-mode",



      name: "切換深淺模式",



      shortcut: ["d"],



      keywords: "dark light theme mode",



      section: "系統設定",



      icon: isDark ? <Sun size={18} /> : <Moon size={18} />,



      perform: () => toggleDarkMode(),



    },



    {



      id: "toggle-language",



      name: "切換介面語系",



      shortcut: ["l"],



      keywords: "language switch translate",



      section: "系統設定",



      icon: <Languages size={18} />,



      perform: () => toggleLanguage(),



    },



    {



      id: "toggle-notes",



      name: "顯示/隱藏備忘錄",



      shortcut: ["h"],



      keywords: "toggle hide show notes speaker",



      section: "系統設定",



      icon: <StickyNote size={18} />,



      perform: () => toggleNotes(),



    },



    // 4. Export



    {



      id: "export-pptx",



      name: "匯出為 PowerPoint (PPTX)",



      shortcut: ["e"],



      keywords: "download pptx powerpoint save",



      section: "檔案與匯出",



      icon: <Download size={18} />,



      perform: () => handleDownload(),



    },



    {



      id: "export-markdown",



      name: "匯出為 Markdown (MD)",



      keywords: "download source text md",



      section: "檔案與匯出",



      icon: <FileText size={18} />,



      perform: () => handleExportMarkdown(),



    },



    {



      id: "start-presenting",



      name: "開啟演講者模式",



      shortcut: ["p"],



      keywords: "present full screen console",



      section: "系統設定",



      icon: <Presentation size={18} />,



      perform: () => startPresentation(),



    },



  ];







  return (



    <KBarProvider actions={actions}>



      <CommandPalette />



      <EditorProvider editorState={extendedEditorState as any} darkModeState={darkModeState}>



...



      </EditorProvider>



    </KBarProvider>



  );



};



export default MarkdownEditor;
