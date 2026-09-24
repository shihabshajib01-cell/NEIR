import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#7A8197] mb-2">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-[#01ADC1] transition-colors"
        title="Dashboard"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-[#A0A6B8] shrink-0" />
            {isLast || !item.href ? (
              <span className={'font-medium truncate ' + (isLast ? 'text-[#202338]' : 'text-[#7A8197]')}>
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-[#01ADC1] transition-colors truncate"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export const PageHeader = ({
  title,
  description,
  breadcrumbs = [],
  actions,
  className = '',
}) => {
  return (
    <div className={'pb-5 mb-6 border-b border-[#E2E5F0] flex flex-col md:flex-row md:items-center md:justify-between gap-4 ' + className}>
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="text-2xl font-semibold tracking-tight text-[#202338] leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-[#626981] mt-1.5 leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          {actions}
        </div>
      )}
    </div>
  );
};

export const ContextualSecondaryNav = ({
  tabs = [],
  activeId,
  onTabChange,
  className = '',
}) => {
  return (
    <div className={'border-b border-[#E2E5F0] mb-5 ' + className}>
      <nav className="flex items-center gap-1 -mb-px overflow-x-auto" aria-label="Secondary Navigation">
        {tabs.map((tab) => {
          const isActive = activeId ? activeId === tab.id : false;
          const Icon = tab.icon;
          const classes = 'inline-flex items-center gap-2 py-2.5 px-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ' +
            (isActive
              ? 'border-[#01ADC1] text-[#01ADC1] font-semibold bg-[#E1F7FB] rounded-t-lg'
              : 'border-transparent text-[#626981] hover:text-[#01ADC1] hover:border-[#C9CEE0]');

          if (tab.href) {
            return (
              <Link key={tab.id || tab.href} to={tab.href} className={classes}>
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className={'px-1.5 py-0.5 rounded-full text-[11px] font-medium ' +
                    (isActive ? 'bg-[#01ADC1] text-white' : 'bg-[#E1F7FB] text-[#626981]')}>
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          }

          return (
            <button key={tab.id} type="button" onClick={() => onTabChange && onTabChange(tab.id)} className={classes + ' cursor-pointer'}>
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={'px-1.5 py-0.5 rounded-full text-[11px] font-medium ' +
                  (isActive ? 'bg-[#01ADC1] text-white' : 'bg-[#E1F7FB] text-[#626981]')}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
