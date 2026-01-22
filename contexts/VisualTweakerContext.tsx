/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { BlockType } from '../services/types';

interface TweakerState {
  isVisible: boolean;
  selectedElement: HTMLElement | null;
  sourceLine: number | null;
  startIndex: number | null;
  endIndex: number | null;
  blockType: BlockType | null;
  position: { top: number; left: number };
}

interface VisualTweakerContextType extends TweakerState {
  openTweaker: (element: HTMLElement, type: BlockType, sourceLine: number, range?: { start: number, end: number }) => void;
  closeTweaker: () => void;
  updatePosition: () => void;
  updateContent: (newContent: string, lineOverride?: number) => void;
  getLineContent: (line: number) => string;
}

const VisualTweakerContext = createContext<VisualTweakerContextType | undefined>(undefined);

export const VisualTweakerProvider: React.FC<{ 
  children: ReactNode; 
  onUpdateContent: (line: number, content: string, range?: { start: number, end: number }) => void;
  onGetLineContent: (line: number) => string;
}> = ({ children, onUpdateContent, onGetLineContent }) => {
  const [state, setState] = useState<TweakerState>({
    isVisible: false,
    selectedElement: null,
    sourceLine: null,
    startIndex: null,
    endIndex: null,
    blockType: null,
    position: { top: 0, left: 0 }
  });

  const updateContent = useCallback((newContent: string, lineOverride?: number) => {
    const line = lineOverride !== undefined ? lineOverride : state.sourceLine;
    if (line !== null) {
      const range = (state.startIndex !== null && state.endIndex !== null) 
        ? { start: state.startIndex, end: state.endIndex } 
        : undefined;
      onUpdateContent(line, newContent, range);
    }
  }, [state.sourceLine, state.startIndex, state.endIndex, onUpdateContent]);
  
  const getLineContent = useCallback((line: number) => {
    return onGetLineContent(line);
  }, [onGetLineContent]);

  const updatePosition = useCallback(() => {
    if (!state.selectedElement) return;
    
    const rect = state.selectedElement.getBoundingClientRect();
    const OVERLAY_WIDTH = 300; 
    const VIEWPORT_MARGIN = 20;
    
    let left = rect.right + VIEWPORT_MARGIN;
    
    if (left + OVERLAY_WIDTH > window.innerWidth) {
      left = rect.left - OVERLAY_WIDTH - VIEWPORT_MARGIN;
      if (left < 0) {
        left = window.innerWidth - OVERLAY_WIDTH - VIEWPORT_MARGIN;
      }
    }

    setState(prev => ({
      ...prev,
      position: {
        top: rect.top,
        left: left
      }
    }));
  }, [state.selectedElement]);

  const openTweaker = useCallback((element: HTMLElement, type: BlockType, sourceLine: number, range?: { start: number, end: number }) => {
    const rect = element.getBoundingClientRect();
    const OVERLAY_WIDTH = 300; 
    const VIEWPORT_MARGIN = 20;
    
    let left = rect.right + VIEWPORT_MARGIN;
    
    if (left + OVERLAY_WIDTH > window.innerWidth) {
      left = rect.left - OVERLAY_WIDTH - VIEWPORT_MARGIN;
      if (left < 0) {
        left = window.innerWidth - OVERLAY_WIDTH - VIEWPORT_MARGIN;
      }
    }

    setState({
      isVisible: true,
      selectedElement: element,
      blockType: type,
      sourceLine: sourceLine,
      startIndex: range?.start ?? null,
      endIndex: range?.end ?? null,
      position: {
        top: rect.top,
        left: left
      }
    });
  }, []);

  const closeTweaker = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: false, selectedElement: null }));
  }, []);

  return (
    <VisualTweakerContext.Provider value={{ ...state, openTweaker, closeTweaker, updatePosition, updateContent, getLineContent }}>
      {children}
    </VisualTweakerContext.Provider>
  );
};

export const useVisualTweaker = () => {
  const context = useContext(VisualTweakerContext);
  if (!context) {
    throw new Error('useVisualTweaker must be used within a VisualTweakerProvider');
  }
  return context;
};