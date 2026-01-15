import { describe, it, expect, vi } from 'vitest';
import { BlockType } from '../services/types';
import { heading1Renderer } from '../services/ppt/builders/Heading1Renderer';
import { paragraphRenderer } from '../services/ppt/builders/ParagraphRenderer';

describe('Core Renderers', () => {
  const mockSlide = { addText: vi.fn() };
  const mockCtx = {
    slide: mockSlide,
    x: 1, y: 1, w: 8,
    options: { big: false, isDark: false }
  };

  it('Heading1Renderer should render and return new Y', () => {
    const block = { type: BlockType.HEADING_1, content: 'Title' };
    const newY = heading1Renderer.render(block, mockCtx as any);
    expect(mockSlide.addText).toHaveBeenCalled();
    expect(newY).toBe(1.9); // 1 + 0.9
  });

  it('ParagraphRenderer should render and return new Y', () => {
    const block = { type: BlockType.PARAGRAPH, content: 'Text' };
    const newY = paragraphRenderer.render(block, mockCtx as any);
    expect(mockSlide.addText).toHaveBeenCalled();
    expect(newY).toBe(1.5); // 1 + 0.5
  });
});
