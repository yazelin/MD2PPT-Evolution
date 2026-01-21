/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState, useEffect } from 'react';
import { ParsedBlock, BlockType, PptTheme } from '../../services/types';
import { parseInlineElements, InlineStyleType } from '../../utils/styleParser';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';
import MermaidRenderer from './MermaidRenderer';
import { ChartPreview } from './ChartPreview';
import { highlighterService } from '../../services/ppt/HighlighterService';

export const RenderRichText: React.FC<{ text: string, theme?: PptTheme }> = ({ text, theme }) => {
  const segments = parseInlineElements(text);
  const linkColor = theme ? `#${theme.colors.primary}` : '#EA580C';
  
  return (
    <>
      {segments.map((segment, i) => {
        switch (segment.type) {
          case InlineStyleType.BOLD: return <strong key={i} className="font-bold">{segment.content}</strong>;
          case InlineStyleType.ITALIC: return <span key={i} className="italic opacity-90">{segment.content}</span>;
          case InlineStyleType.CODE: return <code key={i} className="bg-slate-200/50 dark:bg-black/20 px-1.5 py-0.5 rounded font-mono text-[0.9em]">{segment.content}</code>;
          case InlineStyleType.LINK: return <span key={i} className="underline underline-offset-4" style={{ color: linkColor }}>{segment.content}</span>;
          case InlineStyleType.TEXT:
          default: return <span key={i}>{segment.content}</span>;
        }
      })}
    </>
  );
};

const CodeBlockPreview: React.FC<{ content: string, metadata?: any, isDark?: boolean }> = ({ content, metadata, isDark }) => {
  const [html, setHtml] = useState<string | null>(null);
  const language = metadata?.language || 'text';

  useEffect(() => {
    let isMounted = true;
    const highlight = async () => {
      try {
        await highlighterService.init();
        const highlighter = highlighterService.getHighlighter();
        if (highlighter && isMounted) {
          const theme = isDark ? 'github-dark' : 'github-light';
          
          // Use a simple fallback if language is not supported
          let lang = language;
          const supportedLangs = ['javascript', 'typescript', 'html', 'css', 'json', 'markdown', 'python', 'java', 'bash', 'sql'];
          if (!supportedLangs.includes(lang.toLowerCase())) {
            lang = 'text';
          }

          const highlighted = highlighter.codeToHtml(content, {
            lang,
            theme
          });
          setHtml(highlighted);
        }
      } catch (e) {
        console.warn("Highlighting failed in preview", e);
      }
    };
    highlight();
    return () => { isMounted = false; };
  }, [content, language, isDark]);

  if (!html) {
    return (
      <div className="p-6 rounded-lg bg-slate-100 dark:bg-black/30 border border-slate-300 dark:border-slate-700 font-mono text-lg shadow-inner overflow-hidden">
        <pre className="whitespace-pre-wrap break-all">{content}</pre>
      </div>
    );
  }

  return (
    <div 
      className="shiki-preview my-6 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 shadow-inner text-lg"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};

export const PreviewBlock: React.FC<{ block: ParsedBlock, isDark?: boolean, theme: PptTheme }> = ({ block, isDark, theme }) => {
  const [imgError, setImgError] = useState(false);
  const primaryColor = `#${theme.colors.primary}`;
  const accentColor = `#${theme.colors.accent}`;
  
  // High contrast adjustments for headers on light backgrounds
  const safeAccentColor = !isDark && (theme.name === 'midnight' || theme.name === 'dark-matter') 
    ? primaryColor // Fallback to primary if accent is too light (like pink/blue on white)
    : accentColor;

  const commonProps = {
    'data-source-line': block.sourceLine,
    'data-block-type': block.type
  };

  switch (block.type) {
    case BlockType.CHART:
      return <div {...commonProps}><ChartPreview block={block} isDark={isDark} theme={theme} /></div>;
    case BlockType.HEADING_1:
      return <h1 {...commonProps} className="text-5xl font-black mb-6 border-l-[10px] pl-6 leading-tight uppercase tracking-tighter" style={{ borderColor: primaryColor, color: 'inherit' }}><RenderRichText text={block.content} theme={theme} /></h1>;
    case BlockType.HEADING_2:
      return <h2 {...commonProps} className="text-3xl font-bold mb-4 tracking-tight" style={{ color: isDark ? '#E2E8F0' : safeAccentColor }}><RenderRichText text={block.content} theme={theme} /></h2>;
    case BlockType.HEADING_3:
      return <h3 {...commonProps} className="text-2xl font-semibold mb-3 opacity-80 underline underline-offset-4" style={{ textDecorationColor: `${primaryColor}40`, color: 'inherit' }}><RenderRichText text={block.content} theme={theme} /></h3>;
    case BlockType.CODE_BLOCK:
      return <CodeBlockPreview content={block.content} metadata={block.metadata} isDark={isDark} />;
    case BlockType.MERMAID:
      return <div {...commonProps} className="my-6 scale-110 flex justify-center"><MermaidRenderer chart={block.content} /></div>;
    case BlockType.CHAT_CUSTOM:
      const align = block.alignment || 'left';
      return (
        <div {...commonProps} className={`flex ${align === 'right' ? 'justify-end pl-12' : align === 'center' ? 'justify-center px-6' : 'justify-start pr-12'} my-4`}>
          <div className={`p-4 relative rounded-2xl shadow-lg border-2`} style={{ 
            backgroundColor: align === 'right' ? `${primaryColor}10` : align === 'center' ? '#EEF2FF' : '#ECFDF5',
            borderColor: align === 'right' ? `${primaryColor}30` : align === 'center' ? '#E0E7FF' : '#D1FAE5'
          }}>
            <div className={`absolute -top-3 ${align === 'right' ? 'right-4' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-4'} px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md text-white`} style={{ 
              backgroundColor: align === 'right' ? primaryColor : align === 'center' ? '#6366F1' : '#10B981'
            }}>
              {block.role}
            </div>
            <div className="text-lg leading-relaxed text-slate-800"><RenderRichText text={block.content} theme={theme} /></div>
          </div>
        </div>
      );
    case BlockType.IMAGE:
      return (
        <div {...commonProps} className="flex flex-col items-center justify-center my-8 w-full">
          {imgError ? (
            <div className="w-full h-48 bg-slate-100 rounded-xl border-4 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-4">
              <AlertCircle size={32} />
              <p className="text-lg font-bold">圖片載入失敗 (可能存在 CORS 限制)</p>
              <p className="text-xs opacity-60">{block.content}</p>
            </div>
          ) : (
            <div className="relative group w-full flex justify-center">
              <img 
                src={block.content} 
                alt={block.metadata?.alt || "Slide Content"} 
                className="max-w-[90%] max-h-[450px] object-contain shadow-[0_15px_40px_rgba(0,0,0,0.15)] rounded-xl border-4 border-white"
                onError={() => setImgError(true)}
              />
              <div className="absolute top-3 right-3 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon size={16} />
              </div>
            </div>
          )}
          {block.metadata?.alt && (
            <p className="mt-3 text-base text-slate-400 italic font-medium">{block.metadata.alt}</p>
          )}
        </div>
      );
    case BlockType.TABLE:
      return (
        <div {...commonProps} className="my-4 overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xl">
          <table className="w-full border-collapse text-lg">
            <thead>
              <tr className="text-white" style={{ backgroundColor: primaryColor }}>
                {block.tableRows?.[0].map((cell, idx) => (
                  <th key={idx} className="p-3 text-left font-black tracking-widest uppercase">{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.tableRows?.slice(1).map((row, rIdx) => (
                <tr key={rIdx} className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 last:border-0 hover:bg-slate-50 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2 px-4 text-slate-700 dark:text-slate-300"><RenderRichText text={cell} theme={theme} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case BlockType.CALLOUT_TIP:
    case BlockType.CALLOUT_NOTE:
    case BlockType.CALLOUT_WARNING:
      const isWarn = block.type === BlockType.CALLOUT_WARNING;
      return (
        <div {...commonProps} className={`my-8 p-8 border-l-[12px] rounded-r-2xl shadow-xl ${isWarn ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'}`}>
          <div className={`text-lg font-black uppercase mb-3 tracking-tighter ${isWarn ? 'text-red-600' : 'text-blue-600'}`}>{block.type.split('_')[1]}</div>
          <div className="text-2xl italic leading-relaxed text-slate-800"><RenderRichText text={block.content} theme={theme} /></div>
        </div>
      );
    case BlockType.QUOTE_BLOCK:
      const cleanQuote = block.content.replace(/^>\s*/gm, '').trim();
      return <p {...commonProps} className="text-3xl leading-relaxed mb-8 text-center italic opacity-90" style={{ fontFamily: 'Georgia, serif' }}><RenderRichText text={cleanQuote} theme={theme} /></p>;
    default:
      return <p {...commonProps} className="text-2xl leading-relaxed mb-8 text-justify tracking-tight opacity-90"><RenderRichText text={block.content} theme={theme} /></p>;
  }
};
