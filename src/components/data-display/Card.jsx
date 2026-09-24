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
    <div className={`bg-white border border-[#D8E0E8] rounded-lg shadow-xs overflow-hidden ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="px-5 py-3.5 border-b border-[#D8E0E8] flex items-center justify-between bg-white">
          <div>
            {title && <h3 className="text-base font-semibold text-[#172B4D] tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-[#52677A] mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '' : bodyClassName}>
        {children}
      </div>
      {footer && (
        <div className="px-5 py-3 border-t border-[#D8E0E8] bg-[#F4F7FA] flex items-center justify-between">
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
    <section className={`flex flex-col gap-3 ${className}`}>
      {(title || description || action) && (
        <div className="flex items-start justify-between">
          <div>
            {title && <h4 className="text-sm font-semibold uppercase tracking-wider text-[#52677A]">{title}</h4>}
            {description && <p className="text-xs text-[#748597] mt-0.5">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
};
