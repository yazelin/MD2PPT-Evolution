import { describe, it, expect } from 'vitest';
import { SlideData } from '../services/parser/slides';

describe('Slide Object Model (SOM) Structure', () => {
  it('should support the new config structure in SlideData', () => {
    const slide: SlideData = {
      blocks: [],
      config: {
        layout: 'grid',
        background: '#ff0000',
        transition: 'fade'
      }
    };

    expect(slide.config).toBeDefined();
    expect(slide.config?.layout).toBe('grid');
    expect(slide.config?.background).toBe('#ff0000');
    expect(slide.config?.transition).toBe('fade');
  });

  it('should allow optional config fields', () => {
    const slide: SlideData = {
      blocks: [],
      config: {
        layout: 'default'
      }
    };

    expect(slide.config?.layout).toBe('default');
    expect(slide.config?.background).toBeUndefined();
    expect(slide.config?.transition).toBeUndefined();
  });
});
