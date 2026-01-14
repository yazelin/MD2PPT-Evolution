import React, { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  icon?: ReactNode;
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  children, 
  icon,
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  // 將背景與邊框樣式移至 container，並允許外層覆蓋
  const isCustomContainer = containerClassName.includes('bg-') || containerClassName.includes('border-');
  const defaultContainer = "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700";

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${isCustomContainer ? containerClassName : `${defaultContainer} ${containerClassName}`}`}>
      {icon && <span className="flex items-center justify-center opacity-70 shrink-0">{icon}</span>}
      <select 
        className={`bg-transparent text-sm font-bold focus:outline-none cursor-pointer w-full ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};