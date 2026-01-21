/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { SlideData } from '../../services/parser/slides';
import { PptTheme } from '../../services/types';
import { generateMeshGradient } from '../../services/ppt/GenerativeBgService';
import { SlideContent } from '../editor/PreviewPane';
import { useEditor } from '../../contexts/EditorContext';

const DESIGN_WIDTH = 1200;

interface SlideRendererProps {
  slide: SlideData;
  theme: PptTheme;
  globalBg?: string;
  width?: number; // Optional override
  height?: number; // Optional override
  scale?: number; // Optional override
  className?: string;
  showNotes?: boolean; // Typically unused here but kept for compatibility if needed
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ 
  slide, 
  theme, 
  globalBg,
  width = DESIGN_WIDTH,
  height, // If undefined, calculated from aspect ratio or fixed
  scale = 1,
  className = ""
}) => {
  // We need brand config for Logo. 
  // In Presenter/Audience view, we might not have EditorContext available directly or it might be partial.
  // We'll try to use useEditor() context if available, otherwise default or passed props.
  // Actually, SlideRenderer is used inside EditorProvider in all cases now (PresenterPage wraps it).
  const { brandConfig } = useEditor();

  const bgImage = slide.config?.bgImage || slide.metadata?.bgImage;
  
  // Theme Overrides
  const themeBg = theme.colors.background.startsWith('#') ? theme.colors.background : `#${theme.colors.background}`;
  const themeText = theme.colors.text.startsWith('#') ? theme.colors.text : `#${theme.colors.text}`;
  
  const rawBg = slide.config?.background || slide.config?.bg || slide.metadata?.bg || globalBg || themeBg;
  
  // Generative Background Logic
  let finalBgStyle: React.CSSProperties = {};
  let isMesh = false;

  // Default height if not provided (assume 16:9)
  const finalHeight = height || (width * 9 / 16);

  if (rawBg === 'mesh' || (typeof rawBg === 'string' && rawBg.startsWith('mesh'))) {
    isMesh = true;
    const meshConfig = slide.config?.mesh || {};
    // Generate SVG data URI
    const svgString = generateMeshGradient({
      colors: meshConfig.colors,
      seed: meshConfig.seed,
      width: width,
      height: finalHeight
    });
    const svgBase64 = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
    finalBgStyle = { backgroundImage: `url(${svgBase64})`, backgroundSize: 'cover' };
  } else {
    const bgColor = rawBg.startsWith('#') ? rawBg : `#${rawBg}`;
    finalBgStyle = { backgroundColor: bgColor };
  }
  
  // Calculate brightness for auto-text-color
  const getBrightness = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  const meshColors = slide.config?.mesh?.colors || [];
  
  let isDark = false;
  if (bgImage) {
    isDark = true;
  } else if (isMesh && meshColors.length > 0) {
    isDark = getBrightness(meshColors[0]) < 160;
  } else {
    const bgColor = rawBg.startsWith('#') ? rawBg : `#${rawBg}`;
    if (/^#[0-9a-fA-F]{6}$/.test(bgColor)) {
      isDark = getBrightness(bgColor) < 128;
    }
  }
  
  const textColor = isDark ? '#FFFFFF' : themeText;
  
  // Logo Position Styles
  const getLogoPositionStyles = (): React.CSSProperties => {
    switch (brandConfig?.logoPosition) {
      case 'top-left': return { top: '40px', left: '40px' };
      case 'top-right': return { top: '40px', right: '40px' };
      case 'bottom-left': return { bottom: '40px', left: '40px' };
      case 'bottom-right': return { bottom: '40px', right: '40px' };
      default: return { top: '40px', right: '40px' };
    }
  };

  return (
    <div 
      className={`relative overflow-hidden flex flex-col ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${finalHeight}px`, 
        transform: `scale(${scale})`, 
        transformOrigin: 'top left', 
        ...finalBgStyle,
        color: textColor, 
        fontFamily: theme.fonts.main,
      }}
    >
      {bgImage && <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${bgImage})` }}><div className="absolute inset-0 bg-black/40"></div></div>}
      
      {/* Brand Logo */}
      {brandConfig?.logo && (
        <div className="absolute z-30" style={getLogoPositionStyles()}>
          <img src={brandConfig.logo} alt="Brand Logo" className="max-h-16 max-w-[200px] object-contain opacity-80" />
        </div>
      )}

      {/* Slide Number (Optional - usually hidden in preview/console to save space, or scaled) */}
      {/* <div className={`absolute top-6 right-10 text-xs font-black uppercase tracking-[0.3em] z-20 ${isDark ? 'text-white/20' : 'text-stone-400/20'}`}>Slide {slide.index + 1}</div> */}

      <div className="flex-1 relative z-10 flex flex-col p-[80px_100px]">
        <SlideContent slide={slide} isDark={isDark} theme={theme} />
      </div>
    </div>
  );
};
