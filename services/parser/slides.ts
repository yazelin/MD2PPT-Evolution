/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { ParsedBlock, BlockType } from "../types";

export interface SlideConfig {
  layout?: string;
  background?: string;
  transition?: string;
  [key: string]: any;
}

export interface SlideData {
  blocks: ParsedBlock[];
  config?: SlideConfig;
  /** @deprecated Use config instead */
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
  let currentSlideConfig: SlideConfig = {};

  for (const block of blocks) {
    if (block.type === BlockType.HORIZONTAL_RULE) {
      // Only push if there's actual content or if this isn't the very first HR
      if (currentSlideBlocks.length > 0 || slides.length > 0) {
        slides.push({ 
          blocks: [...currentSlideBlocks],
          config: { ...currentSlideConfig },
          metadata: { ...currentSlideConfig } // For backward compatibility
        });
        currentSlideBlocks = [];
      }
      
      // Set config for the upcoming slide
      currentSlideConfig = block.metadata || {};
    } else {
      currentSlideBlocks.push(block);
    }
  }

  // Final slide flush: 
  // Push if we have blocks, or if it's the only slide (even if empty but has metadata)
  if (currentSlideBlocks.length > 0 || slides.length > 0 || Object.keys(currentSlideConfig).length > 0) {
    slides.push({ 
      blocks: [...currentSlideBlocks],
      config: { ...currentSlideConfig },
      metadata: { ...currentSlideConfig } // For backward compatibility
    });
  }

  // Safety cleanup: Ensure we don't return an empty array
  return slides.length > 0 ? slides : [{ blocks: [], config: {}, metadata: {} }];
};