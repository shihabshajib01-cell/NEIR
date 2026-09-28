import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const Breadcrumbs = ({ items = [] }) => {
  const { t } = usePreferences();
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 type-meta text-[var(--color-text-muted)] mb-2 overflow-x-auto">
      <Link to="/dashboard" className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors shrink-0" title={t('Dashboard')}>
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={item.href || item.label || index}>
            <ChevronRight className="w-3 h-3 text-[#A0A6B8] shrink-0" />
            {isLast || !item.href ? (
              <p className={'font-medium whitespace-nowrap ' + (isLast ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]')}>{t(item.label)}</p>
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
    <header className={'pb-5 mb-6 border-b border-[var(--color-border)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ' + className}>
      <div className="min-w-0">
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="type-page-title text-[var(--color-text-primary)]">{t(title)}</h1>
        {description && <p className="type-body text-[var(--color-text-secondary)] mt-1.5 max-w-3xl">{t(description)}</p>}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-center">
          {actions}
        </div>
      )}
    </header>
  );
};
