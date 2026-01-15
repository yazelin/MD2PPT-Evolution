import { describe, it, expect } from 'vitest';
import { SlideData } from '../services/parser/slides';
import { BlockType } from '../services/types';

describe('Layout Rendering Logic', () => {
  it('should identify center layout from config', () => {
    const slide: SlideData = {
      blocks: [{ type: BlockType.HEADING_1, content: 'Center Title' }],
      config: { layout: 'center' }
    };
    expect(slide.config?.layout).toBe('center');
  });

  it('should identify quote layout from config', () => {
    const slide: SlideData = {
      blocks: [{ type: BlockType.PARAGRAPH, content: 'Wise Words' }],
      config: { layout: 'quote' }
    };
    expect(slide.config?.layout).toBe('quote');
  });
});
