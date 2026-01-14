/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { Settings2, Download, Sun, Moon, RotateCcw, Languages, FileText } from 'lucide-react';
import { useEditor } from '../../contexts/EditorContext';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Select } from '../ui/Select';

export const EditorHeader: React.FC = () => {
  const {
    pageSizes,
    selectedSizeIndex,
    setSelectedSizeIndex,
    handleDownload,
    handleExportMarkdown,
    resetToDefault,
    language,
    toggleLanguage,
    t,
    isGenerating,
    parsedBlocks,
    isDark,
    toggleDarkMode
  } = useEditor();

  const logoPath = `${import.meta.env.BASE_URL}logo.svg`;
  const hasContent = parsedBlocks.length > 0;

  return (
    <header className="bg-[#D24726] px-8 py-3.5 flex justify-between items-center z-20 shadow-[0_4px_20px_rgba(0,0,0,0.15)] relative">
      {/* Left: Brand & Title */}
      <div className="flex items-center gap-5">
        <div className="bg-white p-1.5 rounded-lg shadow-inner ring-1 ring-black/5">
          <img src={logoPath} alt="Logo" className="w-7 h-7" style={{ filter: 'invert(31%) sepia(84%) saturate(1415%) hue-rotate(345deg) brightness(88%) contrast(93%)' }} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-black text-white leading-none tracking-tight">
            {t('title')} <span className="text-orange-200/80 font-bold ml-1">Evolution</span>
          </h1>
          <p className="text-[9px] text-white/60 font-black uppercase tracking-[0.25em] mt-1.5">
            {t('subtitle')}
          </p>
        </div>
      </div>
      
      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-black/10 p-1 rounded-xl mr-2">
          <IconButton
            onClick={resetToDefault}
            title={t('reset')}
            onBrand
          >
            <RotateCcw className="w-4 h-4" />
          </IconButton>

          <div className="w-[1px] h-4 bg-white/10 mx-1" />

          <IconButton
            onClick={toggleLanguage}
            className="gap-2 px-3 w-auto"
            title="Switch Language"
            onBrand
          >
            <Languages className="w-4 h-4" />
            <span className="text-[10px] font-black">{language === 'zh' ? 'EN' : 'ZH'}</span>
          </IconButton>

          <IconButton
            onClick={toggleDarkMode}
            title={isDark ? t('theme.light') : t('theme.dark')}
            onBrand
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </IconButton>
        </div>

        <Select 
          icon={<Settings2 className="w-4 h-4" />}
          value={selectedSizeIndex}
          onChange={(e) => setSelectedSizeIndex(Number(e.target.value))}
          className="bg-white/10 text-white border-white/20 text-xs font-bold"
        >
            {pageSizes.map((size, index) => (
              <option key={index} value={index} className="text-slate-900 bg-white">
                {t(`sizes.${size.name}`)}
              </option>
            ))}
        </Select>

        <Button
          onClick={handleExportMarkdown}
          disabled={!hasContent}
          variant="outline-white"
          className="h-9 px-4"
        >
          <FileText className="w-4 h-4" />
          <span>{t('exportMD')}</span>
        </Button>

        <Button
          onClick={handleDownload}
          disabled={!hasContent}
          isLoading={isGenerating}
          className="bg-white text-[#D24726] hover:bg-orange-50 border-none shadow-xl h-9 px-6 ring-1 ring-black/5"
        >
          <Download className="w-4 h-4" />
          <span className="font-black uppercase tracking-wider">{isGenerating ? t('exporting') : t('export')}</span>
        </Button>
      </div>
    </header>
  );
};
