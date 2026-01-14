import React, { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  onBrand?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  children, 
  className = '', 
  active,
  onBrand,
  ...props 
}) => {
  const baseStyles = "p-2 rounded-lg transition-all flex items-center justify-center";
  
  // 正常背景
  const defaultStyles = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700";
  const activeStyles = "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900";
  
  // 品牌色 (橘紅) 背景下
  const brandStyles = "text-white/70 hover:text-white hover:bg-white/10";
  const brandActiveStyles = "bg-white/20 text-white shadow-inner";

  const appliedStyles = onBrand 
    ? (active ? brandActiveStyles : brandStyles)
    : (active ? activeStyles : defaultStyles);

  return (
    <button 
      className={`${baseStyles} ${appliedStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};