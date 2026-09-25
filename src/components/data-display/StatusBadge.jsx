import React from 'react';
import { CheckCircle2, Clock, XCircle, ShieldAlert, Ban, Activity, HelpCircle } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const StatusBadge = ({ status = 'Active', showIcon = true, size = 'md', className = '' }) => {
  const { t } = usePreferences();
  const norm = (status || '').toLowerCase().trim();
  let config = { bg: 'bg-[var(--color-background)]', text: 'text-[var(--color-text-secondary)]', border: 'border-[var(--color-border)]', icon: HelpCircle };

  if (norm.includes('approved') || norm.includes('accepted') || norm === 'white listed' || norm === 'found' || norm === 'active' || norm.includes('resolved')) {
    config = { bg: 'bg-[rgba(46,125,50,0.10)]', text: 'text-[var(--color-success)]', border: 'border-[rgba(46,125,50,0.25)]', icon: CheckCircle2 };
  } else if (norm.includes('pending') || norm === 'in queue' || norm.includes('lost') || norm.includes('stolen')) {
    config = { bg: 'bg-[rgba(239,143,34,0.10)]', text: 'text-[#B96B18]', border: 'border-[rgba(239,143,34,0.30)]', icon: norm.includes('lost') || norm.includes('stolen') ? ShieldAlert : Clock };
  } else if (norm.includes('progress') || norm.includes('review') || norm.includes('gray')) {
    config = { bg: 'bg-[rgba(1,173,193,0.10)]', text: 'text-[var(--color-primary-dark)]', border: 'border-[rgba(1,173,193,0.25)]', icon: Activity };
  } else if (norm.includes('rejected') || norm.includes('denied') || norm.includes('failed') || norm.includes('blocked') || norm.includes('black list')) {
    config = { bg: 'bg-[rgba(198,40,40,0.10)]', text: 'text-[var(--color-error)]', border: 'border-[rgba(198,40,40,0.25)]', icon: norm.includes('blocked') || norm.includes('black') ? Ban : XCircle };
  }

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'type-badge px-2 py-1 gap-1' : 'type-badge px-2.5 py-1 gap-1.5';

  return (
    <div className={'inline-flex items-center font-semibold rounded-full border leading-none shrink-0 ' + config.bg + ' ' + config.text + ' ' + config.border + ' ' + sizeClasses + ' ' + className}>
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <p>{t(status)}</p>
    </div>
  );
};

export const PriorityBadge = ({ priority = 'Medium' }) => {
  const { t } = usePreferences();
  const norm = (priority || '').toLowerCase();
  const colors = {
    high: 'bg-[rgba(198,40,40,0.10)] text-[var(--color-error)] border-[rgba(198,40,40,0.25)]',
    urgent: 'bg-[rgba(198,40,40,0.10)] text-[var(--color-error)] border-[rgba(198,40,40,0.25)]',
    medium: 'bg-[rgba(239,143,34,0.10)] text-[#B96B18] border-[rgba(239,143,34,0.30)]',
    low: 'bg-[var(--color-background)] text-[var(--color-text-secondary)] border-[var(--color-border)]',
  };
  return <p className={'px-2 py-1 rounded-full type-badge border ' + (colors[norm] || colors.medium)}>{t(priority)}</p>;
};

export const MetricCard = ({ title, value, change, category, tone = 'neutral', icon: Icon, className = '' }) => {
  const { t } = usePreferences();
  const tones = {
    success: { dot: 'bg-[var(--color-success)]', iconBg: 'bg-[rgba(46,125,50,0.10)]', iconText: 'text-[var(--color-success)]' },
    warning: { dot: 'bg-[var(--color-warning)]', iconBg: 'bg-[rgba(239,143,34,0.10)]', iconText: 'text-[#B96B18]' },
    danger: { dot: 'bg-[var(--color-error)]', iconBg: 'bg-[rgba(198,40,40,0.10)]', iconText: 'text-[var(--color-error)]' },
    info: { dot: 'bg-[var(--color-primary)]', iconBg: 'bg-[rgba(1,173,193,0.10)]', iconText: 'text-[var(--color-primary-dark)]' },
    neutral: { dot: 'bg-[var(--color-text-muted)]', iconBg: 'bg-[rgba(98,105,129,0.08)]', iconText: 'text-[var(--color-text-secondary)]' },
  };
  const toneConfig = tones[tone] || tones.neutral;

  return (
    <div className={'bg-white border border-[var(--color-border)] rounded-xl p-5 min-h-[116px] shadow-[var(--shadow-sm)] flex flex-col justify-between transition-all hover:shadow-[var(--shadow-md)] ' + className}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className={'w-2 h-2 rounded-full shrink-0 ' + toneConfig.dot} />
            <p className="type-label text-[var(--color-text-secondary)]">{t(title)}</p>
          </div>
          <p className="type-kpi text-[var(--color-text-primary)] mt-3">{value}</p>
        </div>
        {Icon && <div className={'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ' + toneConfig.iconBg}><Icon className={'w-5 h-5 ' + toneConfig.iconText} /></div>}
      </div>
      {(change || category) && (
        <div className="flex items-start justify-between gap-3 type-meta text-[var(--color-text-muted)] mt-3 pt-2.5 border-t border-[var(--color-border-subtle)]">
          <p className="font-medium leading-4">{change}</p>
          {category && <p className="shrink-0 text-right">{t(category)}</p>}
        </div>
      )}
    </div>
  );
};
