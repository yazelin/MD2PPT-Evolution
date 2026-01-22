/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 * 
 * Command Palette UI using kbar
 */

import React from 'react';
import {
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  KBarResults,
} from 'kbar';

export const CommandPalette: React.FC = () => {
  return (
    <KBarPortal>
      <KBarPositioner className="z-[100] backdrop-blur-sm bg-stone-900/20">
        <KBarAnimator className="w-full max-w-[600px] overflow-hidden rounded-2xl bg-[#1C1917] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
          <div className="p-4 border-b border-white/5">
            <KBarSearch 
              className="w-full bg-transparent text-white outline-none placeholder-stone-500 text-lg font-medium" 
              placeholder="輸入指令或搜尋投影片..."
            />
          </div>
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
};

function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 bg-stone-950/50">
            {item}
          </div>
        ) : (
          <div
            className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors duration-200 ${
              active 
                ? "bg-[#EA580C]/10 border-l-4 border-[#EA580C] text-white" 
                : "text-stone-400 hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight">{item.name}</span>
                {item.subtitle && (
                  <span className="text-[10px] opacity-60 font-medium truncate max-w-[300px]">
                    {item.subtitle}
                  </span>
                )}
              </div>
            </div>
            
            {item.shortcut?.length ? (
              <div className="flex gap-1">
                {item.shortcut.map((sc) => (
                  <kbd 
                    key={sc} 
                    className="px-2 py-1 rounded bg-stone-800 text-[10px] font-mono font-bold text-stone-500 border border-white/5"
                  >
                    {sc}
                  </kbd>
                ))}
              </div>
            ) : null}
          </div>
        )
      }
    />
  );
}
