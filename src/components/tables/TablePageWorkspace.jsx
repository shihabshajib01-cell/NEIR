import React from 'react';
import { BarChart3, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

const getTone = (id = '') => {
  const value = String(id).toLowerCase();
  if (value.includes('reject') || value.includes('cancel') || value.includes('block') || value.includes('closed')) return 'danger';
  if (value.includes('accept') || value.includes('approv') || value.includes('resolve') || value.includes('complete') || value.includes('active')) return 'success';
  if (value.includes('pending') || value.includes('progress') || value.includes('draft') || value.includes('open')) return 'warning';
  return 'primary';
};

const toneClasses = {
  primary: {
    border: 'border-l-[var(--color-primary)]',
    icon: 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]',
  },
  success: {
    border: 'border-l-[var(--color-success)]',
    icon: 'bg-[rgba(46,125,50,0.10)] text-[var(--color-success)]',
  },
  warning: {
    border: 'border-l-[var(--color-warning)]',
    icon: 'bg-[rgba(239,143,34,0.10)] text-[#B85F00]',
  },
  danger: {
    border: 'border-l-[var(--color-error)]',
    icon: 'bg-[rgba(198,40,40,0.08)] text-[var(--color-error)]',
  },
};

const toneIcon = {
  primary: BarChart3,
  success: CheckCircle2,
  warning: Clock3,
  danger: XCircle,
};

export const TableSummaryStrip = ({ items = [], className = '' }) => {
  const { t } = usePreferences();
  if (!items.length) return null;

  return (
    <section className={'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 ' + className} aria-label={t('Summary')}>
      {items.map((item) => {
        const tone = item.tone || getTone(item.id || item.label);
        const config = toneClasses[tone] || toneClasses.primary;
        const Icon = item.icon || toneIcon[tone] || BarChart3;
        return (
          <article
            key={item.id || item.label}
            className={'bg-white border border-[var(--color-border)] border-l-4 rounded-xl p-4 shadow-[var(--shadow-sm)] min-w-0 ' + config.border}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="type-kpi text-[var(--color-text-primary)]">
                  {item.value ?? item.count ?? 0}
                </p>
                <p className="type-meta font-medium text-[var(--color-text-secondary)] mt-2 truncate">{t(item.label)}</p>
              </div>
              <div className={'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ' + config.icon}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
};

export const TablePageWorkspace = ({
  title,
  count,
  toolbar,
  tabs = [],
  activeTab,
  onTabChange,
  showSummary = false,
  summaryItems,
  children,
  className = '',
}) => {
  const { t } = usePreferences();
  const resolvedSummary = summaryItems || (showSummary
    ? tabs.map((tab) => ({
        id: tab.id,
        label: tab.label,
        count: tab.count,
        tone: getTone(tab.id || tab.label),
      }))
    : []);

  return (
    <div className={'space-y-3 ' + className}>
      <TableSummaryStrip items={resolvedSummary} />

      <section className="bg-white border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-sm)] overflow-hidden">
        <header className="px-4 sm:px-5 py-3.5 border-b border-[var(--color-border)] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="type-card-title text-[var(--color-text-primary)] truncate">{t(title)}</h2>
            {typeof count === 'number' && (
              <span className="inline-flex items-center rounded-full bg-[var(--color-background-subtle)] px-2 py-0.5 type-badge text-[var(--color-text-secondary)] whitespace-nowrap">
                {count} {t(count === 1 ? 'record' : 'records')}
              </span>
            )}
          </div>

          {toolbar && <div className="min-w-0 xl:max-w-[72%] w-full xl:w-auto">{toolbar}</div>}
        </header>

        {tabs.length > 0 && (
          <nav className="border-b border-[var(--color-border)] px-2.5 sm:px-3 overflow-x-auto" aria-label={t('Table filters')}>
            <div className="flex items-center gap-1 min-w-max">
              {tabs.map((tab) => {
                const active = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange?.(tab.id)}
                    className={'min-h-10 px-3 py-2 type-meta font-medium border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ' +
                      (active
                        ? 'border-[var(--color-primary)] text-[var(--color-primary-dark)]'
                        : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] hover:bg-[var(--color-background-subtle)]')}
                  >
                    <span>{t(tab.label)}</span>
                    {typeof tab.count === 'number' && (
                      <span className={'min-w-5 h-5 px-1.5 rounded-full inline-flex items-center justify-center type-badge tabular-nums ' +
                        (active ? 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]' : 'bg-[var(--color-background)] text-[var(--color-text-muted)]')}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        <div>{children}</div>
      </section>
    </div>
  );
};
