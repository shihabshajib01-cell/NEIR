import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className = '',
  bodyClassName = 'p-5',
  noPadding = false,
}) => {
  return (
    <div className={'bg-white border border-[#E2E5F0] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden ' + className}>
      {(title || subtitle || headerAction) && (
        <div className="px-5 py-4 border-b border-[#E2E5F0] flex items-center justify-between gap-4 bg-white">
          <div className="min-w-0">
            {title && <h3 className="text-base font-semibold text-[#202338] tracking-tight">{title}</h3>}
            {subtitle && <p className="text-sm text-[#626981] mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div className="flex items-center gap-2 shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '' : bodyClassName}>{children}</div>
      {footer && (
        <div className="px-5 py-3.5 border-t border-[#E2E5F0] bg-[#F7F8FC] flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};

export const Section = ({
  title,
  description,
  children,
  action,
  className = '',
}) => {
  return (
    <section className={'flex flex-col gap-3 ' + className}>
      {(title || description || action) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h4 className="text-sm font-semibold text-[#202338]">{title}</h4>}
            {description && <p className="text-sm text-[#626981] mt-0.5">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
};
