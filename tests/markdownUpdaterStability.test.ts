import { describe, it, expect } from 'vitest';
import { reorderSlides, updateSlideYaml } from '../services/markdownUpdater';

describe('markdownUpdater Stability', () => {
  const mixedSeparators = `
# Slide 1
Content 1

===

# Slide 2
Content 2

====

# Slide 3
Content 3
`;

  describe('updateSlideYaml', () => {
    it('should identify correct slide even with variable separator length', () => {
      // Slide 0: Slide 1
      // Slide 1: Slide 2 (after ===)
      // Slide 2: Slide 3 (after ====)
      
      const updated = updateSlideYaml(mixedSeparators, 1, 'bg', 'red');
      
      // Should find Slide 2 and add YAML
      expect(updated).toContain('# Slide 2');
      expect(updated).toMatch(/bg: "red"[\s\S]*# Slide 2/);
      
      // Should preserve Slide 3 content
      expect(updated).toContain('# Slide 3');
    });

    it('should handle updating the last slide', () => {
      const updated = updateSlideYaml(mixedSeparators, 2, 'layout', 'grid');
      expect(updated).toMatch(/layout: "grid"[\s\S]*# Slide 3/);
    });
  });

  describe('reorderSlides', () => {
    it('should reorder slides correctly despite mixed separators', () => {
      // Move Slide 3 (index 2) to position 0
      const result = reorderSlides(mixedSeparators, 2, 0);
      
      // Expected order: Slide 3, Slide 1, Slide 2
      const firstIndex = result.indexOf('# Slide 3');
      const secondIndex = result.indexOf('# Slide 1');
      const thirdIndex = result.indexOf('# Slide 2');
      
      expect(firstIndex).toBeLessThan(secondIndex);
      expect(secondIndex).toBeLessThan(thirdIndex);
      
      // It likely normalizes separators to ===, checking if content is preserved
      expect(result).toContain('Content 3');
      expect(result).toContain('Content 1');
    });
  });
});
