/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { UI_THEME } from '../../constants/theme';

interface EditorPaneProps {
  content: string;
  setContent: (content: string) => void;
  wordCount: number;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onScroll: () => void;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  content,
  setContent,
  wordCount,
  textareaRef,
  onScroll
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newContent = content.substring(0, start) + "  " + content.substring(end);
      setContent(newContent);
      setTimeout(() => { target.selectionStart = target.selectionEnd = start + 2; }, 0);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col border-r border-[#E7E5E4] dark:border-[#44403C] bg-[#FDFCFB] dark:bg-[#1C1917] transition-colors duration-500">
      <div className="bg-white dark:bg-[#292524] px-6 py-2.5 border-b border-[#E7E5E4] dark:border-[#44403C] flex justify-between items-center">
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Editor</span>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{wordCount} Words</span>
      </div>
      <textarea
        ref={textareaRef}
        onScroll={onScroll}
        className="flex-1 w-full p-12 resize-none focus:outline-none text-lg leading-relaxed text-stone-800 dark:text-stone-200 bg-transparent selection:bg-[#FED7AA] dark:selection:bg-[#7C2D12]/50"
        style={{ fontFamily: UI_THEME.FONTS.PREVIEW }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        placeholder="在此輸入您的 Markdown..."
      />
    </div>
  );
};
