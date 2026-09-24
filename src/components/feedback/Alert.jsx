import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const Alert = ({
  variant = 'info', // 'info' | 'success' | 'warning' | 'danger'
  title,
  children,
  onClose,
  className = '',
}) => {
  const configs = {
    info: {
      bg: 'bg-[#01ADC1]/10',
      border: 'border-[#01ADC1]/30',
      text: 'text-[#202338]',
      icon: Info,
      iconColor: 'text-[#01ADC1]',
    },
    success: {
      bg: 'bg-[#01ADC1]/10',
      border: 'border-[#01ADC1]/30',
      text: 'text-[#028A97]',
      icon: CheckCircle2,
      iconColor: 'text-[#01ADC1]',
    },
    warning: {
      bg: 'bg-[#EF8F22]/10',
      border: 'border-[#EF8F22]/30',
      text: 'text-[#92400E]',
      icon: AlertTriangle,
      iconColor: 'text-[#EF8F22]',
    },
    danger: {
      bg: 'bg-[#C62828]/10',
      border: 'border-[#C62828]/30',
      text: 'text-[#8F1D20]',
      icon: AlertCircle,
      iconColor: 'text-[#C62828]',
    },
  };

  const config = configs[variant] || configs.info;
  const Icon = config.icon;

  return (
    <div className={`p-3.5 rounded-lg border flex items-start gap-3 ${config.bg} ${config.border} ${className}`}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        {title && <h5 className={`text-sm font-semibold leading-tight ${config.text}`}>{title}</h5>}
        <div className={`text-xs mt-1 leading-relaxed ${config.text} opacity-90`}>{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
