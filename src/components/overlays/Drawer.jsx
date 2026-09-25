import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '../forms/Button.jsx';
import { StatusBadge } from '../data-display/StatusBadge.jsx';
import { SafeText } from '../data-display/SafeText.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const useOverlayFocus = (isOpen, onClose, panelRef) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      panelRef.current?.querySelector(focusableSelector)?.focus();
    });

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && panelRef.current) {
        const focusables = [...panelRef.current.querySelectorAll(focusableSelector)];
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previous?.focus?.();
    };
  }, [isOpen, onClose, panelRef]);
};

export const Drawer = ({ isOpen, onClose, title, subtitle, children, footer, width = 'w-full sm:w-[480px]', className = '' }) => {
  const { t } = usePreferences();
  const panelRef = useRef(null);
  useOverlayFocus(isOpen, onClose, panelRef);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-stretch lg:justify-end" role="dialog" aria-modal="true" aria-label={t(title || 'Record Details')}>
      <button type="button" onClick={onClose} className="absolute inset-0 bg-[rgba(32,35,56,0.30)] backdrop-blur-xs" aria-label={t('Close drawer')} />
      <div
        ref={panelRef}
        className={'relative max-lg:!w-full max-lg:max-h-[90dvh] max-lg:rounded-t-[20px] lg:h-full bg-white shadow-[var(--shadow-overlay)] border border-[var(--color-border)] lg:border-y-0 lg:border-r-0 flex flex-col overflow-hidden ' + width + ' ' + className}
      >
        <div className="px-5 py-4 border-b border-[var(--color-border)] bg-white flex items-center justify-between shrink-0">
          <div className="pr-4 min-w-0">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)] truncate">{t(title)}</h3>
            {subtitle && <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 truncate">{t(subtitle)}</p>}
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)] shrink-0" aria-label={t('Close drawer')}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-background-subtle)] flex items-center justify-end gap-2.5 shrink-0">{footer}</div>}
      </div>
    </div>
  );
};

export const RecordDetailsDrawer = ({
  isOpen, onClose, title = 'Record Details', recordId, status, sections = [], footerActions, width = 'w-full sm:w-[480px]',
}) => {
  const { t } = usePreferences();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={recordId ? 'ID: ' + recordId : null}
      width={width}
      footer={footerActions || <Button variant="outline" size="sm" onClick={onClose}>Close</Button>}
    >
      <div className="p-3.5 bg-[var(--color-background-subtle)] border border-[var(--color-border)] rounded-xl flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <p className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{t('Record Status')}</p>
          <p className="text-sm font-semibold text-[var(--color-text-primary)] font-mono mt-0.5 truncate">{recordId || 'NEIR-REC'}</p>
        </div>
        {status && <StatusBadge status={status} size="md" />}
      </div>

      {sections.map((section, index) => (
        <section key={section.title || index} className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-white">
          <h4 className="px-4 py-2.5 bg-[var(--color-background-subtle)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">{t(section.title)}</h4>
          <dl className="p-3.5 space-y-2.5">
            {section.items.map((item, itemIndex) => (
              <div key={item.label || itemIndex} className="grid grid-cols-[minmax(110px,0.8fr)_minmax(0,1.2fr)] gap-3 text-xs">
                <dt className="text-[var(--color-text-secondary)]"><p>{t(item.label)}</p></dt>
                <dd className={'font-medium text-[var(--color-text-primary)] text-right min-w-0 ' + (item.isMono ? 'font-mono tabular-nums' : '')}>
                  <SafeText value={item.value} mode="long" className="ml-auto" />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </Drawer>
  );
};

export const FullScreenWorkspace = ({ isOpen, onClose, title, identifier, status, children, footer, className = '' }) => {
  const { t } = usePreferences();
  const panelRef = useRef(null);
  useOverlayFocus(isOpen, onClose, panelRef);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[rgba(32,35,56,0.30)] backdrop-blur-xs" role="dialog" aria-modal="true">
      <div ref={panelRef} className={'w-full max-w-[92vw] h-[88vh] bg-[var(--color-background)] rounded-xl shadow-[var(--shadow-overlay)] border border-[var(--color-border)] flex flex-col overflow-hidden ' + className}>
        <div className="px-6 py-4 bg-white text-[var(--color-text-primary)] flex items-center justify-between border-b border-[var(--color-border)] shrink-0">
          <h2 className="text-base font-semibold leading-tight flex items-center gap-2 min-w-0">
            <p className="truncate">{t(title)}</p>
            {identifier && <p className="text-xs font-mono font-normal text-[var(--color-text-secondary)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded">{identifier}</p>}
          </h2>
          <div className="flex items-center gap-3 shrink-0">
            {status && <StatusBadge status={status} size="sm" />}
            <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)]" aria-label={t('Close review workspace')}><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
        {footer && <div className="px-6 py-3 bg-white border-t border-[var(--color-border)] flex items-center justify-between shrink-0">{footer}</div>}
      </div>
    </div>
  );
};
