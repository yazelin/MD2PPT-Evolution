/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useRef, useLayoutEffect, useState } from 'react';

interface ScaledSlideContainerProps {
  children: React.ReactNode;
  designWidth?: number;
  designHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ScaledSlideContainer: React.FC<ScaledSlideContainerProps> = ({ 
  children, 
  designWidth = 1200, 
  designHeight = 675,
  className = "",
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Start with 0 scale to prevent overflow before calculation
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parent = containerRef.current.parentElement;
        if (parent) {
          const availableWidth = parent.clientWidth;
          const availableHeight = parent.clientHeight;
          
          if (availableWidth === 0 || availableHeight === 0) return;

          const scaleX = availableWidth / designWidth;
          const scaleY = availableHeight / designHeight;
          
          setScale(Math.min(scaleX, scaleY));
        }
      }
    };

    // Immediate update for initial render
    // We use setTimeout to ensure layout has settled (sometimes parent dimensions are 0 inside useLayoutEffect)
    const timer = setTimeout(updateScale, 0);

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current?.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }
    
    window.addEventListener('resize', updateScale);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [designWidth, designHeight]);

  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      <div 
        style={{
          width: designWidth,
          height: designHeight,
          // If scale is 0, we hide it to avoid glitches
          opacity: scale === 0 ? 0 : 1,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative', 
          overflow: 'hidden' 
        }}
      >
        {children}
      </div>
    </div>
  );
};
