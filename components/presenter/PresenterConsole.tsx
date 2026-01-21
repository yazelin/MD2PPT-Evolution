/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { SlideContent } from '../editor/PreviewPane';
import { SlideData } from '../../services/parser/slides';
import { PRESET_THEMES, DEFAULT_THEME_ID } from '../../constants/themes';
import { PresenterTimer } from './PresenterTimer';

interface PresenterConsoleProps {
  slides: SlideData[];
  currentIndex: number;
}

export const PresenterConsole: React.FC<PresenterConsoleProps> = ({ slides, currentIndex }) => {
  const currentSlide = slides[currentIndex];
  const nextSlide = slides[currentIndex + 1];
  
  // Use a default theme for preview if none specified in slide
  const theme = PRESET_THEMES[DEFAULT_THEME_ID];

  const note = currentSlide?.config?.note || currentSlide?.metadata?.note;

  return (
    <div className="flex flex-col h-screen w-screen bg-stone-900 text-white overflow-hidden">
      {/* Top Bar: Timer & Progress */}
      <div className="h-14 border-b border-stone-700 flex items-center justify-between px-6 bg-stone-950">
        <div className="font-bold text-lg tracking-widest text-[#EA580C]">PRESENTER VIEW</div>
        <PresenterTimer />
        <div className="font-mono text-xl font-bold text-stone-400">
          Slide <span className="text-white">{currentIndex + 1}</span> <span className="text-stone-600">/</span> {slides.length}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main View: Current Slide */}
        <div className="flex-1 flex flex-col p-6 border-r border-stone-700">
          <h2 className="text-xs font-black text-stone-500 mb-3 uppercase tracking-[0.2em]">Current Slide</h2>
          <div className="flex-1 bg-black relative rounded-xl overflow-hidden flex items-center justify-center shadow-2xl ring-1 ring-white/10" data-testid="current-slide-view">
            {currentSlide ? (
               <div className="scale-[0.8] origin-center">
                 <SlideContent slide={currentSlide} theme={theme} />
               </div>
            ) : (
              <p className="text-stone-500">No content</p>
            )}
          </div>
        </div>

        {/* Sidebar: Next Slide & Notes */}
        <div className="w-[400px] flex flex-col p-6 bg-stone-900 gap-6">
          {/* Next Slide Preview */}
          <div className="flex-none aspect-video flex flex-col">
            <h2 className="text-xs font-black text-stone-500 mb-3 uppercase tracking-[0.2em]">Next Slide</h2>
            <div className="flex-1 bg-black relative rounded-xl overflow-hidden flex items-center justify-center border border-stone-700 shadow-lg" data-testid="next-slide-view">
              {nextSlide ? (
                 <div className="scale-[0.35] origin-center">
                   <SlideContent slide={nextSlide} theme={theme} />
                 </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-stone-500 h-full w-full">
                  <span className="font-bold uppercase tracking-widest text-xs">End of Presentation</span>
                </div>
              )}
            </div>
          </div>

          {/* Speaker Notes */}
          <div className="flex-1 flex flex-col min-h-0">
            <h2 className="text-xs font-black text-stone-500 mb-3 uppercase tracking-[0.2em]">Speaker Notes</h2>
            <div className="flex-1 bg-stone-800/50 rounded-xl p-5 border border-stone-700/50 overflow-y-auto custom-scrollbar">
              {note ? (
                <div className="text-stone-200 text-lg leading-relaxed whitespace-pre-wrap font-medium font-sans">
                  {note}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-stone-600 text-sm italic">
                  No notes for this slide.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
