import { describe, it, expect } from 'vitest';
import { BlockType } from '../services/types';
import { BlockRenderer, RenderContext } from '../services/ppt/builders/types';

describe('Slide Types', () => {
  it('should have basic slide types defined', () => {
    expect(BlockType.PARAGRAPH).toBe('PARAGRAPH');
  });
});

describe('BlockRenderer Interface', () => {
  it('should allow implementing a mock renderer synchronously', () => {
    const mockRenderer: BlockRenderer = {
      type: BlockType.PARAGRAPH,
      render: (block: any, ctx: RenderContext) => {
        return ctx.y + 0.5; // Must return number, not Promise
      }
    };
    expect(mockRenderer.type).toBe(BlockType.PARAGRAPH);
  });
});

