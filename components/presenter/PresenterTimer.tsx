/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const PresenterTimer: React.FC = () => {
  const [elapsed, setElapsed] = useState(0);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    // Current Time Update
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Elapsed Timer
    const start = Date.now();
    const elapsedInterval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(elapsedInterval);
    };
  }, []);

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4 text-stone-400 bg-black/30 px-4 py-2 rounded-full" data-testid="presenter-timer">
      <div className="flex items-center gap-2">
        <Clock size={16} />
        <span className="font-mono text-lg font-bold text-white">{formatElapsed(elapsed)}</span>
      </div>
      <div className="w-[1px] h-4 bg-stone-700" />
      <span className="font-medium text-sm">{timeString}</span>
    </div>
  );
};
