import { Action } from 'kbar';
import { useMemo } from 'react';
import { 
  Palette, 
  FileText, 
  Download, 
  Languages, 
  Moon, 
  Sun, 
  StickyNote, 
  Plus, 
  LayoutGrid,
  Table as TableIcon,
  BarChart,
  PieChart,
  LineChart,
  AreaChart,
  Image as ImageIcon,
  MessageSquare,
  Search
} from 'lucide-react';
import { CURATED_PALETTES, Palette as ThemePalette } from '../constants/palettes';
import { transformToSOM, SlideObject } from '../services/parser/som';
import { ParsedBlock } from '../services/types';

// Define minimal interfaces for the state we need
interface EditorState {
  parsedBlocks: ParsedBlock[];
  handleDownload: () => void;
  handleExportMarkdown: () => void;
  handleExportImages: () => void;
  toggleNotes: () => void;
  toggleLanguage: () => void;
  [key: string]: any; // Allow other props
}

interface DarkModeState {
  isDark: boolean;
  toggleDarkMode: () => void;
}

interface EditorHandlers {
  handleAction: (action: { type: string; payload?: any }) => void;
  handleApplyPalette: (palette: ThemePalette) => void;
  [key: string]: any;
}

export const useEditorKBarActions = (
  editorState: EditorState, 
  darkModeState: DarkModeState, 
  handlers: EditorHandlers,
  previewRef: React.RefObject<HTMLDivElement | null>
) => {
  const {
    parsedBlocks,
    handleDownload,
    handleExportMarkdown,
    handleExportImages,
    toggleNotes,
    toggleLanguage
  } = editorState;

  const {
    isDark,
    toggleDarkMode
  } = darkModeState;

  const {
    handleAction,
    handleApplyPalette,
  } = handlers;

  // Memoize the SOM transformation to avoid re-parsing on every render
  const slides = useMemo(() => transformToSOM(parsedBlocks), [parsedBlocks]);

  const actions = useMemo(() => {
    // Dynamic slide jump actions
    const slideJumpActions: Action[] = slides.map((slide: SlideObject, idx: number) => ({
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

    // Theme switching actions
    const themeActions: Action[] = CURATED_PALETTES.map((palette) => ({
      id: `theme-${palette.id}`,
      name: `切換主題：${palette.label}`,
      parent: "themes",
      keywords: `${palette.name} ${palette.description} color skin`,
      perform: () => handleApplyPalette(palette),
    }));

    return [
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
  }, [slides, parsedBlocks, isDark, handleAction, handleApplyPalette, handleDownload, handleExportImages, handleExportMarkdown, toggleDarkMode, toggleLanguage, toggleNotes, previewRef]);

  return actions;
};
