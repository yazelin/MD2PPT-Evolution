import React, { useState, useEffect } from 'react';
import { useVisualTweaker } from '../../contexts/VisualTweakerContext';

export const ImageTweaker: React.FC = () => {
  const { sourceLine, getLineContent, updateContent, closeTweaker } = useVisualTweaker();
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');

  // Example: ![alt](url)
  useEffect(() => {
    if (sourceLine !== null) {
      const raw = getLineContent(sourceLine);
      const match = raw.match(/!\[(.*?)\]\((.*?)\)/);
      if (match) {
        setAlt(match[1]);
        setUrl(match[2]);
      }
    }
  }, [sourceLine, getLineContent]);

  const handleApply = () => {
    const newMarkdown = `![${alt}](${url})`;
    updateContent(newMarkdown);
    closeTweaker();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="image-url" className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
          Image URL / Base64
        </label>
        <input
          id="image-url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="image-alt" className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
          Alt Text (Caption)
        </label>
        <input
          id="image-alt"
          type="text"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className="w-full p-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <button
        onClick={handleApply}
        className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded shadow-md transition-colors"
      >
        Apply Changes
      </button>
    </div>
  );
};
