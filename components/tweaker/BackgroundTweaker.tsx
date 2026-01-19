import React, { useState, useEffect } from 'react';
import { useVisualTweaker } from '../../contexts/VisualTweakerContext';
import { RefreshCw, Plus, X } from 'lucide-react';
import yaml from 'js-yaml';

export const BackgroundTweaker: React.FC = () => {
  const { sourceLine, getLineContent, updateContent } = useVisualTweaker();
  const [colors, setColors] = useState<string[]>(['#4158D0', '#C850C0', '#FFCC70']);
  const [seed, setSeed] = useState<number>(0);

  useEffect(() => {
    if (sourceLine !== null) {
      const raw = getLineContent(sourceLine);
      // Attempt to find YAML block
      const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
      if (fmMatch) {
        try {
          const meta = yaml.load(fmMatch[1]) as any;
          if (meta.mesh) {
            if (meta.mesh.colors) setColors(meta.mesh.colors);
            if (meta.mesh.seed) setSeed(meta.mesh.seed);
          }
        } catch (e) {
          console.warn("Tweaker YAML parse fail", e);
        }
      }
    }
  }, [sourceLine, getLineContent]);

  const updateMarkdown = (newColors: string[], newSeed: number) => {
    if (sourceLine === null) return;
    const raw = getLineContent(sourceLine);
    const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    
    let meta: any = {};
    let contentAfterFm = raw;

    if (fmMatch) {
      try {
        meta = yaml.load(fmMatch[1]) as any;
        contentAfterFm = raw.slice(fmMatch[0].length);
      } catch (e) {}
    }

    meta.bg = 'mesh';
    meta.mesh = {
      ...meta.mesh,
      colors: newColors,
      seed: newSeed
    };

    const newFm = `---\n${yaml.dump(meta)}---\n`;
    updateContent(newFm + (contentAfterFm.startsWith('\n') ? contentAfterFm.slice(1) : contentAfterFm));
  };

  const handleReroll = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    setSeed(newSeed);
    updateMarkdown(colors, newSeed);
  };

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
    updateMarkdown(newColors, seed);
  };

  const addColor = () => {
    const newColors = [...colors, '#ffffff'];
    setColors(newColors);
    updateMarkdown(newColors, seed);
  };

  const removeColor = (index: number) => {
    if (colors.length <= 1) return;
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
    updateMarkdown(newColors, seed);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
          Mesh Colors
        </label>
        <button 
          onClick={handleReroll}
          className="flex items-center gap-1 text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded hover:bg-orange-200 transition-colors font-bold"
        >
          <RefreshCw size={10} /> Re-roll
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {colors.map((color, i) => (
          <div key={i} className="relative group">
            <input 
              type="color" 
              value={color} 
              onChange={(e) => handleColorChange(i, e.target.value)}
              className="w-full h-8 rounded border border-stone-200 cursor-pointer"
            />
            <button 
              onClick={() => removeColor(i)}
              className="absolute -top-1 -right-1 bg-white text-stone-400 rounded-full shadow-sm opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
            >
              <X size={10} />
            </button>
          </div>
        ))}
        <button 
          onClick={addColor}
          className="flex items-center justify-center h-8 border-2 border-dashed border-stone-200 rounded text-stone-300 hover:border-orange-300 hover:text-orange-400 transition-all"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="text-[9px] text-stone-400 font-mono italic">
        Seed: {seed}
      </div>
    </div>
  );
};
