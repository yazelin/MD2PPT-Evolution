/**
 * MD2PPT-Evolution
 * Brand Settings Modal
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { X, Palette, Type, Image, Database, Upload, Download } from 'lucide-react';
import { BrandConfig } from '../../services/types';

interface BrandSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BrandConfig;
  onUpdate: (updates: Partial<BrandConfig>) => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export const BrandSettingsModal: React.FC<BrandSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdate,
  onExport,
  onImport
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white dark:bg-[#1C1917] w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#E7E5E4] dark:border-[#44403C]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E7E5E4] dark:border-[#44403C]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg text-orange-600">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">品牌設定 (Brand Settings)</h2>
              <p className="text-xs text-stone-500">定義您的公司企業識別規範</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close"
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <p className="text-sm text-stone-600 dark:text-stone-400">
            這些設定將作為簡報的預設值，確保輸出的 PPT 具備一致的專業外觀。
          </p>
          
          {/* Placeholder for tabs/sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Left Section Placeholder */}
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                  <Palette size={12} /> 品牌色票
                </label>
                <div className="h-20 bg-stone-50 dark:bg-white/5 rounded-xl border border-dashed border-stone-200 dark:border-white/10 flex items-center justify-center text-xs text-stone-400">
                  色票選擇器實作中...
                </div>
             </div>

             {/* Right Section Placeholder */}
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                  <Type size={12} /> 字體選擇
                </label>
                <div className="h-20 bg-stone-50 dark:bg-white/5 rounded-xl border border-dashed border-stone-200 dark:border-white/10 flex items-center justify-center text-xs text-stone-400">
                  字體選單實作中...
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-stone-50/50 dark:bg-stone-900/50 border-t border-[#E7E5E4] dark:border-[#44403C] flex items-center justify-between">
          <div className="flex gap-2">
            <button 
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 transition-colors"
            >
              <Download size={14} /> 匯出 JSON
            </button>
            <label className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
              <Upload size={14} /> 匯入 JSON
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                onChange={(e) => e.target.files && onImport(e.target.files[0])}
              />
            </label>
          </div>
          
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-orange-600/20 transition-all active:scale-95"
          >
            完成設定
          </button>
        </div>
      </div>
    </div>
  );
};
