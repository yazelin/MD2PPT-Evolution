/**
 * MD2PPT-Evolution
 * Chart Data Transformer
 */

export interface ChartDataset {
  name: string;
  values: number[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export const transformTableToChartData = (rows: string[][]): ChartData => {
  if (!rows || rows.length < 2) {
    return { labels: [], datasets: [] };
  }

  // Row 0 is header
  const header = rows[0];
  const dataRows = rows.slice(1);

  // Column 0 is labels (Categories)
  const labels = dataRows.map(row => row[0]);

  // Columns 1..N are datasets
  const datasets: ChartDataset[] = [];

  for (let colIdx = 1; colIdx < header.length; colIdx++) {
    const seriesName = header[colIdx];
    const values = dataRows.map(row => {
      const val = parseFloat(row[colIdx]);
      return isNaN(val) ? 0 : val;
    });

    datasets.push({
      name: seriesName,
      values: values
    });
  }

  return { labels, datasets };
};
