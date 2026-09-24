import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const Breadcrumbs = ({ items = [] }) => {
  const { t } = usePreferences();
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] mb-2 overflow-x-auto">
      <Link to="/dashboard" className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors shrink-0" title={t('Dashboard')}>
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={item.href || item.label || index}>
            <ChevronRight className="w-3 h-3 text-[#A0A6B8] shrink-0" />
            {isLast || !item.href ? (
              <span className={'font-medium whitespace-nowrap ' + (isLast ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]')}>{t(item.label)}</span>
            ) : (
              <Link to={item.href} className="hover:text-[var(--color-primary)] transition-colors whitespace-nowrap">{t(item.label)}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export const PageHeader = ({ title, description, breadcrumbs = [], actions, className = '' }) => {
  const { t } = usePreferences();
  return (
    <div className={'pb-5 mb-6 border-b border-[var(--color-border)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ' + className}>
      <div className="min-w-0">
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="text-[length:var(--fs-h3)] sm:text-[length:var(--fs-h2)] font-semibold tracking-tight text-[var(--color-text-primary)] leading-tight">{t(title)}</h1>
        {description && <p className="text-sm text-[var(--color-text-secondary)] mt-1.5 leading-relaxed max-w-3xl">{t(description)}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-center">{actions}</div>}
    </div>
  );
};

export const ContextualSecondaryNav = ({ tabs = [], activeId, onTabChange, className = '' }) => {
  const { t } = usePreferences();
  return (
    <div className={'border-b border-[var(--color-border)] mb-5 ' + className}>
      <nav className="flex items-center gap-1 -mb-px overflow-x-auto" aria-label="Secondary Navigation">
        {tabs.map((tab) => {
          const isActive = activeId ? activeId === tab.id : false;
          const Icon = tab.icon;
          const classes = 'inline-flex items-center gap-2 min-h-11 py-2.5 px-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ' +
            (isActive ? 'border-[var(--color-primary)] text-[var(--color-primary-dark)] font-semibold bg-[var(--color-primary-light)] rounded-t-lg' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] hover:border-[var(--color-border)]');

          const content = (
            <>
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{t(tab.label)}</span>
              {typeof tab.count === 'number' && <span className={'px-1.5 py-0.5 rounded-full text-[11px] font-medium ' + (isActive ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-primary-light)] text-[var(--color-text-secondary)]')}>{tab.count}</span>}
            </>
          );

          return tab.href
            ? <Link key={tab.id || tab.href} to={tab.href} className={classes}>{content}</Link>
            : <button key={tab.id} type="button" onClick={() => onTabChange?.(tab.id)} className={classes + ' cursor-pointer'}>{content}</button>;
        })}
      </nav>
    </div>
  );
};
