import { describe, it, expect } from 'vitest';
import { reorderSlides } from '../services/markdownUpdater';

describe('Markdown Slide Reordering', () => {
  it('should swap two simple slides', () => {
    const content = `# Slide 1\n\n===\n\n# Slide 2`;
    // Move Slide 1 (index 1) to position 0
    const result = reorderSlides(content, 1, 0);
    expect(result).toContain('# Slide 2');
    expect(result).toContain('===');
    const parts = result.split(/===/);
    expect(parts[0].trim()).toBe('# Slide 2');
    expect(parts[1].trim()).toBe('# Slide 1');
  });

  it('should preserve global YAML at the top when moving a slide to position 0', () => {
    const content = `---\ntheme: midnight
title: Hello
---

# Slide 1

===

# Slide 2`;

    // Move Slide 2 (index 1) to position 0
    const result = reorderSlides(content, 1, 0);
    
    // Check if YAML is still at the top
    expect(result.startsWith('---\ntheme: midnight')).toBe(true);
    
    // Check if Slide 2 content is now under YAML
    const firstSlideContent = result.split('===')[0];
    expect(firstSlideContent).toContain('# Slide 2');
    expect(firstSlideContent).not.toContain('# Slide 1');
    
    // Check if Slide 1 is now at index 1
    const secondSlideContent = result.split('===')[1];
    expect(secondSlideContent.trim()).toBe('# Slide 1');
  });

  it('should handle moving the first slide with YAML to another position', () => {
    const content = `---\ntheme: academic
---

# Slide 1

===

# Slide 2

===

# Slide 3`;

    // Move Slide 1 (index 0) to position 2 (last)
    const result = reorderSlides(content, 0, 2);

    // Global YAML should STAY at the top
    expect(result.startsWith('---\ntheme: academic')).toBe(true);

    const parts = result.split('===');
    // New Slide 0 should be original Slide 2 content
    expect(parts[0]).toContain('# Slide 2');
    // New Slide 1 should be original Slide 3 content
    expect(parts[1]).toContain('# Slide 3');
    // New Slide 2 should be original Slide 1 content
    expect(parts[2]).toContain('# Slide 1');
  });

  it('should correctly handle triple-equals with different amounts of spacing', () => {
    const content = `# S1\n\n===\n# S2\n====\n# S3`;
    const result = reorderSlides(content, 2, 0); // Move S3 to start
    expect(result).toMatch(/# S3[\s\S]*===+[\s\S]*# S1[\s\S]*===+[\s\S]*# S2/);
  });
});
