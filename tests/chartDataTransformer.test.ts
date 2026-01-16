import { describe, it, expect } from 'vitest';
import { transformTableToChartData } from '../utils/chartDataTransformer';

describe('Chart Data Transformer', () => {
  it('should transform standard table to chart data', () => {
    const tableRows = [
      ['Month', 'Sales', 'Cost'],
      ['Jan', '100', '50'],
      ['Feb', '120', '60']
    ];

    const result = transformTableToChartData(tableRows);

    expect(result.labels).toEqual(['Jan', 'Feb']);
    expect(result.datasets).toHaveLength(2);
    
    expect(result.datasets[0].name).toBe('Sales');
    expect(result.datasets[0].values).toEqual([100, 120]);
    
    expect(result.datasets[1].name).toBe('Cost');
    expect(result.datasets[1].values).toEqual([50, 60]);
  });

  it('should handle non-numeric values gracefully', () => {
    const tableRows = [
      ['Cat', 'Val'],
      ['A', '10'],
      ['B', 'NaN'], // Invalid
      ['C', '20']
    ];

    const result = transformTableToChartData(tableRows);
    
    expect(result.labels).toEqual(['A', 'B', 'C']);
    expect(result.datasets[0].values).toEqual([10, 0, 20]); // Should fallback to 0
  });

  it('should handle pie chart data structure (single series)', () => {
    const tableRows = [
      ['Segment', 'Value'],
      ['Mobile', '40'],
      ['Desktop', '60']
    ];
    
    const result = transformTableToChartData(tableRows);
    
    expect(result.labels).toEqual(['Mobile', 'Desktop']);
    expect(result.datasets).toHaveLength(1);
    expect(result.datasets[0].values).toEqual([40, 60]);
  });
});
