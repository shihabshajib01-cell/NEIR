import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  ShieldCheck,
  Ban,
  Activity,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const StatusBadge = ({
  status = 'Active',
  showIcon = true,
  size = 'md', // 'sm' | 'md'
  className = ''
}) => {
  const norm = (status || '').toLowerCase().trim();

  let config = {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    icon: HelpCircle,
    label: status,
  };

  if (norm.includes('approved') || norm.includes('accepted') || norm === 'white listed' || norm === 'found' || norm === 'active') {
    config = {
      bg: 'bg-[#14804A]/10',
      text: 'text-[#10683D]',
      border: 'border-[#14804A]/25',
      icon: CheckCircle2,
      label: status,
    };
  } else if (norm.includes('pending') || norm === 'in queue') {
    config = {
      bg: 'bg-[#F59E0B]/10',
      text: 'text-[#B45309]',
      border: 'border-[#F59E0B]/30',
      icon: Clock,
      label: status,
    };
  } else if (norm.includes('progress') || norm.includes('review') || norm.includes('gray')) {
    config = {
      bg: 'bg-[#147D83]/10',
      text: 'text-[#147D83]',
      border: 'border-[#147D83]/25',
      icon: Activity,
      label: status,
    };
  } else if (norm.includes('resolved')) {
    config = {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: CheckCircle,
      label: status,
    };
  } else if (norm.includes('rejected') || norm.includes('denied') || norm.includes('failed')) {
    config = {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: XCircle,
      label: status,
    };
  } else if (norm.includes('blocked') || norm.includes('black list')) {
    config = {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: Ban,
      label: status,
    };
  } else if (norm.includes('lost') || norm.includes('stolen')) {
    config = {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: ShieldAlert,
      label: status,
    };
  } else if (norm === 'inactive' || norm === 'disabled') {
    config = {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      icon: Clock,
      label: status,
    };
  }

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border leading-none shrink-0 ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};

export const PriorityBadge = ({ priority = 'Medium' }) => {
  const norm = (priority || '').toLowerCase();
  const colors = {
    high: 'bg-rose-50 text-rose-700 border-rose-200',
    urgent: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
        colors[norm] || colors.medium
      }`}
    >
      {priority}
    </span>
  );
};

export const MetricCard = ({
  title,
  value,
  change,
  category,
  tone = 'neutral', // 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  icon: Icon,
  className = '',
}) => {
  const toneClasses = {
    success: 'border-l-4 border-l-[#14804A]',
    warning: 'border-l-4 border-l-[#F59E0B]',
    danger: 'border-l-4 border-l-[#DC2626]',
    info: 'border-l-4 border-l-[#147D83]',
    neutral: 'border-l-4 border-l-[#52677A]',
  };

  return (
    <div className={`bg-white border border-[#D8E0E8] rounded-lg p-4 shadow-xs flex flex-col justify-between transition-all hover:border-[#C1CBD6] ${toneClasses[tone]} ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-[#52677A] tracking-tight">{title}</span>
        {Icon && <Icon className="w-4 h-4 text-[#748597] shrink-0" />}
      </div>
      
      <div className="mt-2.5">
        <div className="text-2xl font-bold tracking-tight text-[#172B4D] font-mono tabular-nums">
          {value}
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#748597] mt-1.5 pt-1.5 border-t border-[#F4F7FA]">
          <span className="truncate font-medium">{change}</span>
          {category && <span className="text-[#9AAEC0] shrink-0">{category}</span>}
        </div>
      </div>
    </div>
  );
};
