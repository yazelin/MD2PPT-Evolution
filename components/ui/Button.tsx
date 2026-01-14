import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline-white' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  isLoading,
  disabled,
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200 active:scale-95 disabled:active:scale-100 disabled:cursor-not-allowed disabled:opacity-50";
  
  const variants = {
    // 預設品牌色按鈕
    primary: "bg-[#D24726] hover:bg-[#B7472A] text-white shadow-sm",
    // 淺灰色次要按鈕
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    // 專門用於 Header (橘紅背景) 的半透明白色按鈕
    "outline-white": "bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm",
    // 危險操作
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};
