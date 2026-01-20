/**
 * MD2PPT-Evolution
 * ColorHighlighter.tsx
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState, useEffect } from 'react';
import { getBatchCaretCoordinates } from '../../utils/caretPosition';

interface ColorHighlighterProps {
  content: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  scrollTop: number;
}

export const ColorHighlighter: React.FC<ColorHighlighterProps> = ({ content, textareaRef, scrollTop }) => {
  const [swatches, setSwatches] = useState<{ top: number, left: number, color: string }[]>([]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const calculatePositions = () => {
      const regex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
      let match;
      const matches: { index: number, color: string }[] = [];
      const MAX_HIGHLIGHTS = 100;

      while ((match = regex.exec(content)) !== null) {
        if (matches.length >= MAX_HIGHLIGHTS) break;
        matches.push({ index: match.index, color: match[0] });
      }

      if (matches.length === 0) {
        setSwatches([]);
        return;
      }

      const rect = el.getBoundingClientRect();
      const currentScrollTop = el.scrollTop;

      // Use optimized batch processing
      const coords = getBatchCaretCoordinates(el, matches.map(m => m.index));
      
      const newSwatches = coords.map((c, i) => ({
        top: c.top - rect.top + currentScrollTop,
        left: c.left - rect.left,
        color: matches[i].color
      }));

      setSwatches(newSwatches);
    };

    // Debounce to 150ms to keep editor responsive
    const timer = setTimeout(calculatePositions, 150);
    return () => clearTimeout(timer);
  }, [content, textareaRef]);

  return (
    <div 
      className="absolute inset-0 pointer-events-none select-none overflow-hidden" 
      style={{ zIndex: 5 }}
    >
      <div 
        className="relative w-full h-full will-change-transform"
        style={{ 
          transform: `translateY(${-scrollTop}px)`
        }}
      >
        {swatches.map((swatch, i) => (
          <div 
            key={`${i}-${swatch.color}`}
            className="absolute w-4 h-4 rounded shadow-sm border border-stone-300 dark:border-stone-600"
            style={{ 
              top: swatch.top + 5, 
              left: swatch.left - 28, 
              backgroundColor: swatch.color 
            }}
          />
        ))}
      </div>
    </div>
  );
};
