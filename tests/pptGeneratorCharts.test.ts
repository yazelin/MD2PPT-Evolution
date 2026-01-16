import { describe, it, expect, vi } from 'vitest';
import { ChartRenderer } from '../services/ppt/builders/ChartRenderer';
import { BlockType } from '../services/types';

describe('ChartRenderer', () => {
  it('should call slide.addChart with transformed data', () => {
    const mockAddChart = vi.fn();
    const context: any = {
      pptx: { ChartType: { bar: 'bar' } },
      slide: { addChart: mockAddChart },
      x: 1, y: 1, w: 8,
      options: { isDark: false }
    };

    const block = {
      type: BlockType.CHART,
      content: '',
      metadata: { chartType: 'bar', title: 'Test' },
      tableRows: [
        ['Cat', 'Val'],
        ['A', '10']
      ]
    };

    ChartRenderer.render(block, context);

    expect(mockAddChart).toHaveBeenCalledWith(
      'bar',
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Val',
          labels: ['A'],
          values: [10]
        })
      ]),
      expect.objectContaining({
        title: 'Test',
        showTitle: true
      })
    );
  });
});
