import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../services/markdownParser';
import { BlockType } from '../services/types';

describe('Markdown Source Mapping', () => {
  it('should assign correct line numbers across multiple slides', () => {
    const markdown = `---
title: Test
---

# Slide 1 (Line 5)
Content 1 (Line 6)

===
---
layout: grid
---

# Slide 2 (Line 13)
Content 2 (Line 14)
`;

    const result = parseMarkdown(markdown);
    
    // Filter out HR blocks (slide separators) to focus on content
    const contentBlocks = result.blocks.filter(b => b.type !== BlockType.HORIZONTAL_RULE);

    // Block 0: Heading 1 "Slide 1" -> Should be around line 5 (0-based: 4)
    // YAML (3 lines) + empty line = 4 lines. Line 5 is index 4.
    expect(contentBlocks[0].content).toContain('Slide 1');
    expect(contentBlocks[0].sourceLine).toBe(4);

    // Block 1: Paragraph "Content 1" -> Line 6 (index 5)
    expect(contentBlocks[1].content).toContain('Content 1');
    expect(contentBlocks[1].sourceLine).toBe(5);

    // Slide 2
    // Separator (===) + YAML (3 lines) + empty line = 5 lines gap
    // Previous content ended at line 6. 
    // === (7)
    // --- (8)
    // layout (9)
    // --- (10)
    // (11) empty
    // # Slide 2 (12) -> Index 11? Or 12 depending on split handling.
    
    // Let's just check relative order and approx values first, then precise.
    const slide2Heading = contentBlocks.find(b => b.content.includes('Slide 2'));
    expect(slide2Heading).toBeDefined();
    // Assuming 0-based index:
    // 0: ---
    // 1: title: Test
    // 2: ---
    // 3: 
    // 4: # Slide 1
    // 5: Content 1
    // 6: 
    // 7: ===
    // 8: ---
    // 9: layout: grid
    // 10: ---
    // 11: 
    // 12: # Slide 2
    
    expect(slide2Heading?.sourceLine).toBe(12);
  });
});
