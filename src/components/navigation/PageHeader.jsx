import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#748597] mb-1.5">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-[#172B4D] transition-colors"
        title="Dashboard"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-[#9AAEC0] shrink-0" />
            {isLast || !item.href ? (
              <span className={`font-medium truncate ${isLast ? 'text-[#172B4D]' : 'text-[#748597]'}`}>
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-[#172B4D] transition-colors truncate"
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
    <div className={`pb-4 mb-5 border-b border-[#D8E0E8] flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${className}`}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="text-2xl font-bold tracking-tight text-[#102A43] leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-[#52677A] mt-1 leading-relaxed max-w-3xl">
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
  tabs = [], // [{ id, label, href, count, icon: Icon }]
  activeId,
  onTabChange,
  className = '',
}) => {
  return (
    <div className={`border-b border-[#D8E0E8] mb-5 ${className}`}>
      <nav className="flex items-center gap-1 -mb-px overflow-x-auto" aria-label="Secondary Navigation">
        {tabs.map((tab) => {
          const isActive = activeId ? activeId === tab.id : false;
          const Icon = tab.icon;

          if (tab.href) {
            return (
              <Link
                key={tab.id || tab.href}
                to={tab.href}
                className={`inline-flex items-center gap-2 py-2.5 px-3.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-[#14804A] text-[#10683D] font-semibold bg-[#14804A]/5 rounded-t-md'
                    : 'border-transparent text-[#52677A] hover:text-[#172B4D] hover:border-[#C1CBD6]'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-[#10683D] text-white' : 'bg-[#EAEFF5] text-[#52677A]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange && onTabChange(tab.id)}
              className={`inline-flex items-center gap-2 py-2.5 px-3.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[#14804A] text-[#10683D] font-semibold bg-[#14804A]/5 rounded-t-md'
                  : 'border-transparent text-[#52677A] hover:text-[#172B4D] hover:border-[#C1CBD6]'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-[#10683D] text-white' : 'bg-[#EAEFF5] text-[#52677A]'
                }`}>
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
