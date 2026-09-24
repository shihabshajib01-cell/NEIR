import React from 'react';
import { Loader2 } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

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
  const { t } = usePreferences();

  const sizeClasses = {
    sm: 'min-h-8 px-3 type-button-sm gap-1.5 rounded-lg',
    md: 'min-h-10 px-4 type-button gap-2 rounded-lg',
    lg: 'min-h-11 px-5 type-button-lg gap-2.5 rounded-xl',
  };

  const variantClasses = {
    primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] active:bg-[var(--color-primary-deep)] text-white border border-transparent shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-[rgba(1,173,193,0.30)]',
    secondary: 'bg-[var(--color-primary-light)] hover:bg-[var(--color-surface-hover)] text-[var(--color-primary-dark)] border border-[rgba(1,173,193,0.18)]',
    outline: 'bg-white hover:bg-[var(--color-primary-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] border border-[var(--color-border)]',
    danger: 'bg-[var(--color-error)] hover:bg-[#A91F22] text-white border border-transparent shadow-[var(--shadow-sm)]',
    ghost: 'bg-transparent hover:bg-[var(--color-primary-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] border border-transparent',
  };

  const label = typeof children === 'string' ? t(children) : children;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={'inline-flex items-center justify-center transition-colors select-none cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap ' + sizeClasses[size] + ' ' + variantClasses[variant] + ' ' + className}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{label}</span>
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
  const { t } = usePreferences();
  const sizeClasses = {
    sm: 'w-8 h-8 p-1 rounded-lg',
    md: 'w-10 h-10 p-1.5 rounded-lg',
    lg: 'w-11 h-11 p-2 rounded-lg',
  };
  const variantClasses = {
    primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white shadow-[var(--shadow-sm)]',
    secondary: 'bg-[var(--color-primary-light)] hover:bg-[var(--color-surface-hover)] text-[var(--color-primary-dark)]',
    outline: 'bg-white hover:bg-[var(--color-primary-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] border border-[var(--color-border)]',
    danger: 'bg-red-50 hover:bg-red-100 text-[var(--color-error)]',
    ghost: 'bg-transparent hover:bg-[var(--color-primary-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)]',
  };

  return (
    <button
      type="button"
      title={typeof title === 'string' ? t(title) : title}
      aria-label={t(ariaLabel || title || '')}
      disabled={disabled}
      onClick={onClick}
      className={'inline-flex items-center justify-center transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ' + sizeClasses[size] + ' ' + variantClasses[variant] + ' ' + className}
      {...props}
    >
      <Icon className="w-4 h-4 shrink-0" />
    </button>
  );
};

export const ButtonGroup = ({ children, className = '' }) => (
  <div className={'inline-flex items-center rounded-lg isolate -space-x-px ' + className}>{children}</div>
);
