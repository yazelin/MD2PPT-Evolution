import { describe, it, expect } from 'vitest';
import { parseMarkdownWithAST } from '../services/parser/ast';
import { BlockType } from '../services/types';

describe('Chart Parser Logic', () => {
  it('should parse ::: chart-bar block as CHART type', () => {
    const markdown = `
::: chart-bar { "title": "Sales", "showLegend": true }

| Month | Sales |
| :--- | :--- |
| Jan | 100 |
| Feb | 120 |

:::
    `;
    
    const blocks = parseMarkdownWithAST(markdown);
    const chartBlock = blocks.find(b => b.type === BlockType.CHART);
    
    expect(chartBlock).toBeDefined();
    expect(chartBlock?.metadata).toEqual(expect.objectContaining({
      chartType: 'bar',
      title: 'Sales',
      showLegend: true
    }));
    // We expect the content or tableRows to contain the table data
    expect(chartBlock?.tableRows).toHaveLength(3); // Header + 2 data rows
  });

  it('should handle chart-pie and other types', () => {
    const markdown = `
::: chart-pie

| Cat | Val |
| :-- | :-- |
| A | 10 |

:::
    `;
    const blocks = parseMarkdownWithAST(markdown);
    const chartBlock = blocks[0];
    expect(chartBlock.type).toBe(BlockType.CHART);
    expect(chartBlock.metadata?.chartType).toBe('pie');
  });

  it('should parse chart without explicit config', () => {
    const markdown = `
::: chart-line

| X | Y |
| - | - |
| 1 | 2 |

:::
    `;
    const blocks = parseMarkdownWithAST(markdown);
    expect(blocks[0].metadata?.chartType).toBe('line');
  });
});
