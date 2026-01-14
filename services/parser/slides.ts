/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { ParsedBlock, BlockType } from "../types";

export interface SlideData {
  blocks: ParsedBlock[];
  metadata?: {
    bg?: string;
    layout?: string;
    [key: string]: any;
  };
}

/**
 * Splits the flat list of parsed blocks into groups, each representing a single slide.
 */
export const splitBlocksToSlides = (blocks: ParsedBlock[]): SlideData[] => {
  const slides: SlideData[] = [];
  let currentSlideBlocks: ParsedBlock[] = [];
  let currentSlideMetadata: any = {};

  const flushCurrentSlide = (nextMetadata: any = {}) => {
    slides.push({ 
      blocks: currentSlideBlocks,
      metadata: { ...currentSlideMetadata }
    });
    currentSlideBlocks = [];
    currentSlideMetadata = nextMetadata;
  };

  for (const block of blocks) {
    const isHeading1or2 = block.type === BlockType.HEADING_1 || block.type === BlockType.HEADING_2;
    const isHorizontalRule = block.type === BlockType.HORIZONTAL_RULE;

    if (isHorizontalRule) {
      flushCurrentSlide(block.metadata || {});
      continue;
    }

    if (isHeading1or2 && currentSlideBlocks.length > 0) {
      flushCurrentSlide();
    }

    currentSlideBlocks.push(block);
  }

  flushCurrentSlide();
  return slides;
};