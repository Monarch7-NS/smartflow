import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-3 px-6 md:py-4 md:px-8 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
  
  const variants = {
    primary: "bg-clinic-blue dark:bg-clinic-blue text-white hover:bg-blue-800 dark:hover:bg-blue-600 focus:ring-clinic-blue shadow-blue-500/20",
    secondary: "bg-white dark:bg-transparent text-clinic-blue dark:text-clinic-accent border border-clinic-blue dark:border-clinic-accent hover:bg-clinic-light dark:hover:bg-slate-800 focus:ring-clinic-blue",
    danger: "bg-clinic-alert text-white hover:bg-red-600 focus:ring-red-500",
    ghost: "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-none"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};