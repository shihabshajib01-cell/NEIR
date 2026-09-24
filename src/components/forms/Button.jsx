import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
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
    sm: 'h-[30px] px-3 text-xs gap-1.5 rounded-lg font-semibold',
    md: 'h-9 px-4 text-sm gap-2 rounded-lg font-semibold',
    lg: 'h-11 px-5 text-base gap-2.5 rounded-xl font-semibold',
  };

  const variantClasses = {
    primary: 'bg-[#4B5694] hover:bg-[#343D73] active:bg-[#2D345F] text-white border border-transparent shadow-[0_1px_3px_rgba(75,86,148,0.24)] focus-visible:ring-2 focus-visible:ring-[#4B5694]/30',
    secondary: 'bg-[#EEF0FA] hover:bg-[#E2E5F0] active:bg-[#D8DCEC] text-[#4B5694] border border-[#4B5694]/10 focus-visible:ring-2 focus-visible:ring-[#4B5694]/25',
    outline: 'bg-white hover:bg-[#EEF0FA] active:bg-[#E2E5F0] text-[#626981] hover:text-[#4B5694] border border-[#E2E5F0] focus-visible:ring-2 focus-visible:ring-[#4B5694]/20',
    danger: 'bg-[#C62828] hover:bg-[#A91F22] active:bg-[#8F1D20] text-white border border-transparent shadow-[0_1px_3px_rgba(198,40,40,0.22)] focus-visible:ring-2 focus-visible:ring-[#C62828]/30',
    ghost: 'bg-transparent hover:bg-[#EEF0FA] active:bg-[#E2E5F0] text-[#626981] hover:text-[#4B5694] border border-transparent focus-visible:ring-2 focus-visible:ring-[#4B5694]/20',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={'inline-flex items-center justify-center transition-colors select-none cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap outline-none focus-visible:outline-none ' + sizeClasses[size] + ' ' + variantClasses[variant] + ' ' + className}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
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
    sm: 'w-7 h-7 p-1 rounded-lg text-xs',
    md: 'w-8 h-8 p-1.5 rounded-lg text-sm',
    lg: 'w-10 h-10 p-2 rounded-lg text-base',
  };

  const variantClasses = {
    primary: 'bg-[#4B5694] hover:bg-[#343D73] text-white shadow-sm',
    secondary: 'bg-[#EEF0FA] hover:bg-[#E2E5F0] text-[#4B5694]',
    outline: 'bg-white hover:bg-[#EEF0FA] text-[#626981] hover:text-[#4B5694] border border-[#E2E5F0]',
    danger: 'bg-[#C62828]/10 hover:bg-[#C62828]/15 text-[#C62828]',
    ghost: 'bg-transparent hover:bg-[#EEF0FA] text-[#626981] hover:text-[#4B5694]',
  };

  return (
    <button
      type="button"
      title={title}
      aria-label={ariaLabel || title}
      disabled={disabled}
      onClick={onClick}
      className={'inline-flex items-center justify-center transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-[#4B5694]/25 ' + sizeClasses[size] + ' ' + variantClasses[variant] + ' ' + className}
      {...props}
    >
      <Icon className="w-4 h-4 shrink-0" />
    </button>
  );
};

export const ButtonGroup = ({ children, className = '' }) => (
  <div className={'inline-flex items-center rounded-lg isolate -space-x-px ' + className}>{children}</div>
);
