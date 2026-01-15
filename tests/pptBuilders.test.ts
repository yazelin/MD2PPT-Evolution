import { describe, it, expect } from 'vitest';
import { BlockRenderer, RenderContext } from '../services/ppt/builders/types';
import { RendererRegistry } from '../services/ppt/builders/registry';
import { BlockType } from '../services/types';

describe('RendererRegistry', () => {
  it('should register and retrieve a renderer', () => {
    const registry = new RendererRegistry();
    const mockRenderer: BlockRenderer = {
      type: BlockType.TOC, // Use TOC as it might not be in default yet, or override
      render: (block, ctx) => ctx.y + 1
    };

    registry.register(mockRenderer);
    expect(registry.getRenderer(BlockType.TOC)).toBe(mockRenderer);
  });

  it('should have default renderers registered automatically', () => {
    const registry = new RendererRegistry();
    const renderer = registry.getRenderer(BlockType.HEADING_1);
    expect(renderer).toBeDefined();
    expect(renderer?.type).toBe(BlockType.HEADING_1);
  });
});

describe('BlockRenderer Interface', () => {
  it('should allow implementing a mock renderer', () => {
    const mockRenderer: BlockRenderer = {
      type: BlockType.PARAGRAPH,
      render: (block: any, ctx: RenderContext) => {
        return ctx.y + 0.5;
      }
    };

    expect(mockRenderer.type).toBe(BlockType.PARAGRAPH);
    expect(mockRenderer.render).toBeDefined();
  });
});
