/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { useState, useEffect } from 'react';
import { BrandConfig } from '../services/types';

const DEFAULT_BRAND_CONFIG: BrandConfig = {
  primaryColor: '#3b82f6',
  secondaryColor: '#64748b',
  accentColor: '#f59e0b',
  font: '微軟正黑體',
  logoPosition: 'top-right'
};

export const useBrandSettings = () => {
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(() => {
    const saved = localStorage.getItem('brand_config');
    return saved ? JSON.parse(saved) : DEFAULT_BRAND_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('brand_config', JSON.stringify(brandConfig));
  }, [brandConfig]);

  const updateBrandConfig = (updates: Partial<BrandConfig>) => {
    setBrandConfig(prev => ({ ...prev, ...updates }));
  };

  const exportConfig = () => {
    return JSON.stringify(brandConfig, null, 2);
  };

  const importConfig = (json: string) => {
    try {
      const parsed = JSON.parse(json);
      // Basic validation
      if (typeof parsed === 'object' && parsed !== null) {
        setBrandConfig(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error("Invalid brand config JSON:", e);
    }
  };

  return {
    brandConfig,
    updateBrandConfig,
    exportConfig,
    importConfig
  };
};
