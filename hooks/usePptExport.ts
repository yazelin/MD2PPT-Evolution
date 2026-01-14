import { useState } from 'react';
import { generatePpt, PptConfig } from '../services/pptGenerator';
import { ParsedBlock } from '../services/types';

export const usePptExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToPpt = async (blocks: ParsedBlock[], config: PptConfig = {}) => {
    setIsExporting(true);
    setError(null);
    try {
      await generatePpt(blocks, config);
    } catch (err) {
      console.error('Export failed:', err);
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToPpt, isExporting, error };
};