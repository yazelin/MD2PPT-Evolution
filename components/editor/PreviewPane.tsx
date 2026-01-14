/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { Sparkles } from 'lucide-react';
import { ParsedBlock, BlockType } from '../../services/types';
import { PreviewBlock, RenderRichText } from './PreviewRenderers';
import { UI_THEME } from '../../constants/theme';
import { splitBlocksToSlides } from '../../services/parser/slides';
import { useEditor } from '../../contexts/EditorContext';

interface PreviewPaneProps {
  parsedBlocks: ParsedBlock[];
  previewRef: React.RefObject<HTMLDivElement>;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  parsedBlocks,
  previewRef
}) => {
  const { pageSizes, selectedSizeIndex, documentMeta } = useEditor();
  const selectedLayout = pageSizes[selectedSizeIndex];
  const slides = splitBlocksToSlides(parsedBlocks);

  const renderSlideContent = (slideBlocks: ParsedBlock[], layout?: string) => {
    const renderBlocks = (blocks: ParsedBlock[]) => {
      const elements: JSX.Element[] = [];
      let i = 0;
      while (i < blocks.length) {
        const block = blocks[i];
        if (block.type === BlockType.BULLET_LIST) {
          const listItems: ParsedBlock[] = [];
          while (i < blocks.length && blocks[i].type === BlockType.BULLET_LIST) {
            listItems.push(blocks[i]);
            i++;
          }
          elements.push(
            <ul key={`bullet-list-${i}`} className="ml-8 mb-8">
              {listItems.map((item, idx) => (
                <li key={idx} className="relative mb-2 pl-4 leading-[1.8] list-none before:content-[''] before:absolute before:left-0 before:top-[0.7em] before:w-2 before:h-2 before:bg-current before:opacity-40 before:rounded-full">
                   <RenderRichText text={item.content} />
                </li>
              ))}
            </ul>
          );
        } else if (block.type === BlockType.NUMBERED_LIST) {
          const listItems: ParsedBlock[] = [];
          while (i < blocks.length && blocks[i].type === BlockType.NUMBERED_LIST) {
            listItems.push(blocks[i]);
            i++;
          }
          elements.push(
            <ol key={`numbered-list-${i}`} className="ml-8 mb-8 list-decimal">
              {listItems.map((item, idx) => (
                <li key={idx} className="mb-2 pl-2 leading-[1.8]">
                   <RenderRichText text={item.content} />
                </li>
              ))}
            </ol>
          );
        } else {
          elements.push(<PreviewBlock key={i} block={block} />);
          i++;
        }
      }
      return elements;
    };

    if (layout === 'full-bg') {
      const firstImg = slideBlocks.find(b => b.type === BlockType.IMAGE);
      const otherBlocks = slideBlocks.filter(b => b !== firstImg);
      
      return (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-16 bg-cover bg-center"
          style={firstImg ? { backgroundImage: `url(${firstImg.content})` } : {}}
        >
          {/* Overlay to ensure readability */}
          <div className="absolute inset-0 bg-black/40 z-0"></div>
          <div className="relative z-10 text-white scale-110">
            {renderBlocks(otherBlocks)}
          </div>
        </div>
      );
    }

    if (layout === 'impact') {
      return (
        <div className="flex flex-col h-full items-center justify-center text-center scale-110">
          {renderBlocks(slideBlocks)}
        </div>
      );
    }

    if (layout === 'two-column') {
      const titleBlocks = slideBlocks.filter(b => b.type === BlockType.HEADING_1 || b.type === BlockType.HEADING_2);
      const otherBlocks = slideBlocks.filter(b => b.type !== BlockType.HEADING_1 && b.type !== BlockType.HEADING_2);
      const mid = Math.ceil(otherBlocks.length / 2);
      const leftBlocks = otherBlocks.slice(0, mid);
      const rightBlocks = otherBlocks.slice(mid);

      return (
        <div className="flex flex-col h-full">
          {titleBlocks.length > 0 && <div className="mb-8">{renderBlocks(titleBlocks)}</div>}
          <div className="flex-1 grid grid-cols-2 gap-12">
            <div>{renderBlocks(leftBlocks)}</div>
            <div>{renderBlocks(rightBlocks)}</div>
          </div>
        </div>
      );
    }

    return renderBlocks(slideBlocks);
  };

  return (
    <div className="w-1/2 flex flex-col bg-slate-100/50 dark:bg-slate-900/50 transition-colors">
      <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-2 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        Slide Deck Preview (WYSIWYG)
      </div>
      <div 
        ref={previewRef}
        className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth bg-slate-200 dark:bg-slate-950"
      >
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
          {slides.length > 0 && slides.some(s => s.blocks.length > 0) ? (
            slides.map((slide, index) => {
              const bgColor = slide.metadata?.bg || documentMeta.bg || '#ffffff';
              const isDarkBg = bgColor.startsWith('#') && parseInt(bgColor.slice(1), 16) < 0x888888; // Simple brightness check

              return (
                <div 
                  key={index}
                  className={`shadow-2xl p-12 lg:p-16 rounded-sm border border-slate-200 dark:border-slate-800 transition-colors relative overflow-hidden flex flex-col ${isDarkBg ? 'text-white' : 'text-slate-900'}`}
                  style={{ 
                    fontFamily: UI_THEME.FONTS.PREVIEW,
                    aspectRatio: `${selectedLayout.width} / ${selectedLayout.height}`,
                    backgroundColor: bgColor
                  }}
                >
                  {/* Slide Number / Label */}
                  <div className={`absolute top-4 right-6 text-[10px] font-bold uppercase tracking-widest select-none ${isDarkBg ? 'text-white/20' : 'text-slate-300'}`}>
                    Slide {index + 1}
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    {renderSlideContent(slide.blocks, slide.metadata?.layout)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 mt-20 opacity-30">
              <Sparkles className="w-12 h-12 mb-4" />
              <p className="font-bold tracking-widest">等待輸入內容...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
