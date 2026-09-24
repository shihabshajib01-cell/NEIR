import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  type = 'button',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5 rounded-md font-medium',
    md: 'h-9 px-4 text-sm gap-2 rounded-md font-medium',
    lg: 'h-11 px-5 text-base gap-2.5 rounded-md font-semibold',
  };

  const variantClasses = {
    primary: 'bg-[#14804A] hover:bg-[#10683D] active:bg-[#0D5230] text-white border border-transparent shadow-xs focus-visible:ring-2 focus-visible:ring-[#14804A]/40',
    secondary: 'bg-[#173F5F] hover:bg-[#102A43] active:bg-[#0B1E30] text-white border border-transparent shadow-xs focus-visible:ring-2 focus-visible:ring-[#173F5F]/40',
    outline: 'bg-white hover:bg-[#F4F7FA] active:bg-[#EAEFF5] text-[#172B4D] border border-[#D8E0E8] shadow-xs focus-visible:ring-2 focus-visible:ring-[#173F5F]/20',
    danger: 'bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white border border-transparent shadow-xs focus-visible:ring-2 focus-visible:ring-[#DC2626]/40',
    ghost: 'bg-transparent hover:bg-[#EAEFF5] active:bg-[#D8E0E8] text-[#172B4D] border border-transparent focus-visible:ring-2 focus-visible:ring-[#173F5F]/20',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-colors select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap outline-hidden focus-visible:outline-hidden ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0" />
      )}
    </button>
  );
};

export const IconButton = ({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  title,
  ariaLabel,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 p-1 rounded-md text-xs',
    md: 'w-8 h-8 p-1.5 rounded-md text-sm',
    lg: 'w-10 h-10 p-2 rounded-md text-base',
  };

  const variantClasses = {
    primary: 'bg-[#14804A] hover:bg-[#10683D] text-white shadow-xs',
    secondary: 'bg-[#173F5F] hover:bg-[#102A43] text-white shadow-xs',
    outline: 'bg-white hover:bg-[#F4F7FA] text-[#172B4D] border border-[#D8E0E8] shadow-xs',
    danger: 'bg-[#DC2626]/10 hover:bg-[#DC2626]/20 text-[#DC2626]',
    ghost: 'bg-transparent hover:bg-[#EAEFF5] text-[#52677A] hover:text-[#172B4D]',
  };

  return (
    <button
      type="button"
      title={title}
      aria-label={ariaLabel || title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-hidden focus-visible:ring-2 focus-visible:ring-[#173F5F]/30 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <Icon className="w-4 h-4 shrink-0" />
    </button>
  );
};

export const ButtonGroup = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex items-center rounded-md shadow-xs isolate -space-x-px ${className}`}>
      {children}
    </div>
  );
};
