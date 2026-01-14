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
  
  // 正常背景下的樣式
  const defaultStyles = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200";
  const activeStyles = "bg-orange-100 text-orange-600 border border-orange-200";
  
  // 在品牌色 (橘紅) 背景下的樣式
  const brandStyles = "text-white/80 hover:text-white hover:bg-white/10";
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
