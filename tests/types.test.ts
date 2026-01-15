import { describe, it, expect } from 'vitest';
import { BlockType } from '../services/types';

describe('Slide Types', () => {
  it('should have basic slide types defined', () => {
    expect(BlockType.PARAGRAPH).toBe('PARAGRAPH');
  });
});
