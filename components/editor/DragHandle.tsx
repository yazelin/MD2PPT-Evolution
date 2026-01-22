/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';

interface DragHandleProps {
  id: string;
  className?: string;
  contrastColor?: string;
}

export const DragHandle: React.FC<DragHandleProps> = ({ id, className = "", contrastColor }) => {
  const { attributes, listeners, setNodeRef } = useSortable({ id });

  const dynamicStyles = contrastColor ? {
    color: contrastColor,
    backgroundColor: contrastColor === '#FFFFFF' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
    borderColor: contrastColor === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
  } : {};

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={dynamicStyles}
      className={`cursor-grab active:cursor-grabbing p-1.5 rounded shadow-sm border transition-colors z-30 ${className}`}
      title="拖拽以重新排列投影片"
    >
      <GripVertical size={16} />
    </div>
  );
};
