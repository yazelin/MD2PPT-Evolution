/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

import PptxGenJS from "pptxgenjs";
import { ParsedBlock, BlockType } from "./types";
import { PPT_THEME } from "../constants/theme";
import { splitBlocksToSlides } from "./parser/slides";

export interface PptConfig {
  layoutName?: string; title?: string; author?: string; bg?: string;
}

const renderBlocksToArea = (slide: any, blocks: ParsedBlock[], x: number, y: number, w: number, pptx: PptxGenJS, globalOptions: any = {}) => {
  let currentY = y;
  for (const block of blocks) {
    if (currentY > 5.2) break;
    const align = globalOptions.align || 'left';
    switch (block.type) {
      case BlockType.HEADING_1:
        slide.addText(block.content, { x, y: currentY, w, h: 0.8, fontSize: globalOptions.big ? 44 : PPT_THEME.FONT_SIZES.TITLE, bold: true, color: globalOptions.color || PPT_THEME.COLORS.PRIMARY, fontFace: PPT_THEME.FONTS.HEADING, align });
        currentY += globalOptions.big ? 1.1 : 0.9; break;
      case BlockType.HEADING_2:
        slide.addText(block.content, { x, y: currentY, w, h: 0.6, fontSize: globalOptions.big ? 32 : PPT_THEME.FONT_SIZES.SUBTITLE, bold: true, color: globalOptions.color || PPT_THEME.COLORS.SECONDARY, fontFace: PPT_THEME.FONTS.HEADING, align });
        currentY += globalOptions.big ? 0.9 : 0.7; break;
      case BlockType.CODE_BLOCK:
        const codeHeight = Math.min(block.content.split('\n').length * 0.22 + 0.3, 4.5 - currentY);
        if (codeHeight <= 0.3) break;
        slide.addShape(pptx.ShapeType.rect, { x, y: currentY, w, h: codeHeight, fill: { color: PPT_THEME.COLORS.BG_CODE }, line: { color: PPT_THEME.COLORS.BORDER_CODE, width: 1 } });
        slide.addText(block.content, { x: x + 0.1, y: currentY + 0.1, w: w - 0.2, h: codeHeight - 0.2, fontSize: PPT_THEME.FONT_SIZES.CODE, color: PPT_THEME.COLORS.ACCENT, fontFace: PPT_THEME.FONTS.CODE, valign: 'top', wrap: true });
        currentY += codeHeight + 0.3; break;
      case BlockType.IMAGE:
        if (globalOptions.skipFirstImage) { globalOptions.skipFirstImage = false; break; }
        try {
          const imgOptions: any = { x: align === 'center' ? x + (w - 4) / 2 : x, y: currentY, w: Math.min(w, 4), h: 2.5, sizing: { type: 'contain', w: Math.min(w, 4), h: 2.5 } };
          if (block.content.startsWith('data:image')) imgOptions.data = block.content; else imgOptions.path = block.content;
          slide.addImage(imgOptions);
          currentY += 2.7;
        } catch (e) { currentY += 0.6; } break;
      case BlockType.CHAT_CUSTOM:
        const chatAlign = block.alignment || 'left';
        const chatColor = chatAlign === 'right' ? PPT_THEME.COLORS.SECONDARY : chatAlign === 'center' ? PPT_THEME.COLORS.ACCENT : PPT_THEME.COLORS.PRIMARY;
        slide.addText([{ text: `${block.role || 'System'}: `, options: { bold: true, color: chatColor } }, { text: block.content, options: { color: globalOptions.color || PPT_THEME.COLORS.TEXT_MAIN } }], { x, y: currentY, w, h: 0.5, fontSize: PPT_THEME.FONT_SIZES.BODY, fontFace: PPT_THEME.FONTS.MAIN, align: chatAlign as any });
        currentY += 0.6; break;
      case BlockType.BULLET_LIST:
      case BlockType.NUMBERED_LIST:
        const items = block.content.split('\n').filter(i => i.trim() !== '');
        const listHeight = Math.min(items.length * 0.35, 4.5 - currentY);
        if (listHeight <= 0) break;
        slide.addText(items.map(item => ({ text: item, options: { bullet: block.type === BlockType.BULLET_LIST ? true : { type: 'number' } } })), { x: x + 0.2, y: currentY, w: w - 0.2, h: listHeight, fontSize: globalOptions.big ? 22 : PPT_THEME.FONT_SIZES.BODY, color: globalOptions.color || PPT_THEME.COLORS.TEXT_MAIN, fontFace: PPT_THEME.FONTS.MAIN, valign: 'top', align });
        currentY += listHeight + 0.2; break;
      case BlockType.PARAGRAPH:
        slide.addText(block.content, { x, y: currentY, w, h: 0.5, fontSize: globalOptions.big ? 22 : PPT_THEME.FONT_SIZES.BODY, color: globalOptions.color || PPT_THEME.COLORS.TEXT_MAIN, fontFace: PPT_THEME.FONTS.MAIN, align });
        currentY += 0.5; break;
    }
  }
};

export const generatePpt = async (blocks: ParsedBlock[], config: PptConfig = {}): Promise<void> => {
  const pptx = new PptxGenJS();
  const layoutMap: Record<string, string> = { "16x9": "LAYOUT_16x9", "16x10": "LAYOUT_16x10", "4x3": "LAYOUT_4x3", "a4": "LAYOUT_WIDE" };
  pptx.layout = (config.layoutName && layoutMap[config.layoutName]) || "LAYOUT_16x9";
  if (config.title) pptx.title = config.title; if (config.author) pptx.author = config.author;
  const slidesData = splitBlocksToSlides(blocks);
  for (const slideData of slidesData) {
    const slide = pptx.addSlide();
    const layout = slideData.metadata?.layout;
    const margin = 0.6; const pageWidth = 10; const contentWidth = pageWidth - (margin * 2);
    if (layout === 'full-bg') {
      const firstImg = slideData.blocks.find(b => b.type === BlockType.IMAGE);
      if (firstImg) { if (firstImg.content.startsWith('data:image')) slide.background = { data: firstImg.content }; else slide.background = { path: firstImg.content }; }
      renderBlocksToArea(slide, slideData.blocks, margin, 1.5, contentWidth, pptx, { align: 'center', big: true, color: 'FFFFFF', skipFirstImage: true });
    } else {
      const bgColor = (slideData.metadata?.bg || config.bg || PPT_THEME.COLORS.BG_SLIDE).replace('#', '');
      slide.background = { fill: bgColor };
      const titleBlocks = slideData.blocks.filter(b => b.type === BlockType.HEADING_1 || b.type === BlockType.HEADING_2);
      const otherBlocks = slideData.blocks.filter(b => b.type !== BlockType.HEADING_1 && b.type !== BlockType.HEADING_2);
      if (titleBlocks.length > 0) { renderBlocksToArea(slide, titleBlocks, margin, 0.6, contentWidth, pptx); }
      const contentStartY = titleBlocks.length > 0 ? 1.6 : 0.8;
      if (layout === 'impact') { renderBlocksToArea(slide, slideData.blocks, margin, 1.8, contentWidth, pptx, { align: 'center', big: true }); }
      else if (layout === 'two-column') {
        const mid = Math.ceil(otherBlocks.length / 2); const colWidth = (contentWidth - 0.5) / 2;
        renderBlocksToArea(slide, otherBlocks.slice(0, mid), margin, contentStartY, colWidth, pptx);
        renderBlocksToArea(slide, otherBlocks.slice(mid), margin + colWidth + 0.5, contentStartY, colWidth, pptx);
      } else { renderBlocksToArea(slide, otherBlocks, margin, contentStartY, contentWidth, pptx); }
    }
  }
  await pptx.writeFile({ fileName: config.title ? `${config.title}.pptx` : "Presentation.pptx" });
};
