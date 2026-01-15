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
    bgImage?: string;
    layout?: string;
    [key: string]: any;
  };
}

/**
 * Splits the flat list of parsed blocks into groups.
 * Uses HORIZONTAL_RULE as the primary splitter and extracts metadata.
 */
export const splitBlocksToSlides = (blocks: ParsedBlock[]): SlideData[] => {
  const slides: SlideData[] = [];
  let currentSlideBlocks: ParsedBlock[] = [];
  let currentSlideMetadata: any = {};
  let hasContentInCurrentSlide = false;

  for (const block of blocks) {
    if (block.type === BlockType.HORIZONTAL_RULE) {
      // Finish current slide (even if empty, to support multiple ===)
      slides.push({ 
        blocks: [...currentSlideBlocks],
        metadata: { ...currentSlideMetadata }
      });
      // Start new slide
      currentSlideBlocks = [];
      currentSlideMetadata = block.metadata || {};
      hasContentInCurrentSlide = false;
    } else {
      currentSlideBlocks.push(block);
      hasContentInCurrentSlide = true;
    }
  }

  // Final slide flush: 
  // Always push the last slide if we had any blocks or if it's the only slide
  if (hasContentInCurrentSlide || currentSlideBlocks.length > 0 || slides.length > 0 || blocks.length > 0) {
    slides.push({ 
      blocks: [...currentSlideBlocks],
      metadata: { ...currentSlideMetadata }
    });
  }

  // Safety cleanup: Ensure we don't return an empty array
  return slides.length > 0 ? slides : [{ blocks: [], metadata: {} }];
};