import React from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  ShieldAlert,
  Ban,
  Activity,
  HelpCircle,
} from 'lucide-react';

export const StatusBadge = ({
  status = 'Active',
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  const norm = (status || '').toLowerCase().trim();

  let config = {
    bg: 'bg-[#F7F8FC]',
    text: 'text-[#626981]',
    border: 'border-[#E2E5F0]',
    icon: HelpCircle,
  };

  if (norm.includes('approved') || norm.includes('accepted') || norm === 'white listed' || norm === 'found' || norm === 'active' || norm.includes('resolved')) {
    config = {
      bg: 'bg-[#2E7D32]/10',
      text: 'text-[#2E7D32]',
      border: 'border-[#2E7D32]/25',
      icon: CheckCircle2,
    };
  } else if (norm.includes('pending') || norm === 'in queue' || norm.includes('lost') || norm.includes('stolen')) {
    config = {
      bg: 'bg-[#EF8F22]/10',
      text: 'text-[#B96B18]',
      border: 'border-[#EF8F22]/30',
      icon: norm.includes('lost') || norm.includes('stolen') ? ShieldAlert : Clock,
    };
  } else if (norm.includes('progress') || norm.includes('review') || norm.includes('gray')) {
    config = {
      bg: 'bg-[#4B5694]/10',
      text: 'text-[#4B5694]',
      border: 'border-[#4B5694]/22',
      icon: Activity,
    };
  } else if (norm.includes('rejected') || norm.includes('denied') || norm.includes('failed')) {
    config = {
      bg: 'bg-[#C62828]/10',
      text: 'text-[#C62828]',
      border: 'border-[#C62828]/25',
      icon: XCircle,
    };
  } else if (norm.includes('blocked') || norm.includes('black list')) {
    config = {
      bg: 'bg-[#C62828]/10',
      text: 'text-[#A91F22]',
      border: 'border-[#C62828]/25',
      icon: Ban,
    };
  }

  const Icon = config.icon;
  const sizeClasses = size === 'sm'
    ? 'text-[11px] px-2 py-1 gap-1'
    : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={'inline-flex items-center font-semibold rounded-full border leading-none shrink-0 ' + config.bg + ' ' + config.text + ' ' + config.border + ' ' + sizeClasses + ' ' + className}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{status}</span>
    </span>
  );
};

export const PriorityBadge = ({ priority = 'Medium' }) => {
  const norm = (priority || '').toLowerCase();
  const colors = {
    high: 'bg-[#C62828]/10 text-[#C62828] border-[#C62828]/25',
    urgent: 'bg-[#C62828]/10 text-[#A91F22] border-[#C62828]/25',
    medium: 'bg-[#EF8F22]/10 text-[#B96B18] border-[#EF8F22]/30',
    low: 'bg-[#F7F8FC] text-[#626981] border-[#E2E5F0]',
  };

  return (
    <span className={'px-2 py-1 rounded-full text-[11px] font-semibold border ' + (colors[norm] || colors.medium)}>
      {priority}
    </span>
  );
};

export const MetricCard = ({
  title,
  value,
  change,
  category,
  tone = 'neutral',
  icon: Icon,
  className = '',
}) => {
  const tones = {
    success: { dot: 'bg-[#2E7D32]', iconBg: 'bg-[#2E7D32]/10', iconText: 'text-[#2E7D32]' },
    warning: { dot: 'bg-[#EF8F22]', iconBg: 'bg-[#EF8F22]/10', iconText: 'text-[#B96B18]' },
    danger: { dot: 'bg-[#C62828]', iconBg: 'bg-[#C62828]/10', iconText: 'text-[#C62828]' },
    info: { dot: 'bg-[#4B5694]', iconBg: 'bg-[#4B5694]/10', iconText: 'text-[#4B5694]' },
    neutral: { dot: 'bg-[#7A8197]', iconBg: 'bg-[#626981]/8', iconText: 'text-[#626981]' },
  };
  const t = tones[tone] || tones.neutral;

  return (
    <div className={'bg-white border border-[#E2E5F0] rounded-[14px] p-5 min-h-[116px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-px ' + className}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={'w-2 h-2 rounded-full shrink-0 ' + t.dot} />
            <span className="text-sm font-medium text-[#626981] leading-5">{title}</span>
          </div>
          <div className="text-[28px] leading-[1.1] font-bold tracking-tight text-[#202338] font-mono tabular-nums mt-3">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ' + t.iconBg}>
            <Icon className={'w-5 h-5 ' + t.iconText} />
          </div>
        )}
      </div>

      {(change || category) && (
        <div className="flex items-start justify-between gap-3 text-xs text-[#7A8197] mt-3 pt-2.5 border-t border-[#E2E5F0]/70">
          <span className="font-medium leading-4">{change}</span>
          {category && <span className="text-[#7A8197] shrink-0 text-right">{category}</span>}
        </div>
      )}
    </div>
  );
};
