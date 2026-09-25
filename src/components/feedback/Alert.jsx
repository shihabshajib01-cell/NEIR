import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const Alert = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const { t } = usePreferences();
  const configs = {
    info: {
      bg: 'bg-[rgba(1,173,193,0.08)]',
      border: 'border-[rgba(1,173,193,0.25)]',
      text: 'text-[var(--color-text-primary)]',
      icon: Info,
      iconColor: 'text-[var(--color-primary-dark)]',
    },
    success: {
      bg: 'bg-[rgba(46,125,50,0.08)]',
      border: 'border-[rgba(46,125,50,0.25)]',
      text: 'text-[#1B5E20]',
      icon: CheckCircle2,
      iconColor: 'text-[var(--color-success)]',
    },
    warning: {
      bg: 'bg-[rgba(239,143,34,0.10)]',
      border: 'border-[rgba(239,143,34,0.30)]',
      text: 'text-[#92400E]',
      icon: AlertTriangle,
      iconColor: 'text-[var(--color-warning)]',
    },
    danger: {
      bg: 'bg-[rgba(198,40,40,0.08)]',
      border: 'border-[rgba(198,40,40,0.25)]',
      text: 'text-[#8F1D20]',
      icon: AlertCircle,
      iconColor: 'text-[var(--color-error)]',
    },
  };

  const config = configs[variant] || configs.info;
  const Icon = config.icon;

  return (
    <div className={'p-3.5 rounded-xl border flex items-start gap-3 ' + config.bg + ' ' + config.border + ' ' + className} role={variant === 'danger' ? 'alert' : 'status'}>
      <Icon className={'w-5 h-5 shrink-0 mt-0.5 ' + config.iconColor} />
      <div className="flex-1 min-w-0">
        {title && <h5 className={'text-sm font-semibold leading-tight ' + config.text}>{t(title)}</h5>}
        {typeof children === 'string'
          ? <p className={'text-xs mt-1 leading-relaxed ' + config.text + ' opacity-90'}>{t(children)}</p>
          : <div className={'text-xs mt-1 leading-relaxed ' + config.text + ' opacity-90'}>{children}</div>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className="w-9 h-9 -m-1 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/60" aria-label={t('Close')}>
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
