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
      bg: 'bg-[#147D83]/10',
      border: 'border-[#147D83]/30',
      text: 'text-[#102A43]',
      icon: Info,
      iconColor: 'text-[#147D83]',
    },
    success: {
      bg: 'bg-[#14804A]/10',
      border: 'border-[#14804A]/30',
      text: 'text-[#10683D]',
      icon: CheckCircle2,
      iconColor: 'text-[#14804A]',
    },
    warning: {
      bg: 'bg-[#F59E0B]/10',
      border: 'border-[#F59E0B]/30',
      text: 'text-[#92400E]',
      icon: AlertTriangle,
      iconColor: 'text-[#D97706]',
    },
    danger: {
      bg: 'bg-[#DC2626]/10',
      border: 'border-[#DC2626]/30',
      text: 'text-[#991B1B]',
      icon: AlertCircle,
      iconColor: 'text-[#DC2626]',
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
