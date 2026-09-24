import React, { useEffect, useRef } from 'react';
import { X, AlertTriangle, Info } from 'lucide-react';
import { Button } from '../forms/Button.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal = ({ isOpen, onClose, title, subtitle, children, footer, maxWidth = 'max-w-lg', className = '' }) => {
  const { t } = usePreferences();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => panelRef.current?.querySelector(focusableSelector)?.focus());

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && panelRef.current) {
        const focusables = [...panelRef.current.querySelectorAll(focusableSelector)];
        if (!focusables.length) return;
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
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previous?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[rgba(32,35,56,0.30)] backdrop-blur-xs" role="presentation">
      <div ref={panelRef} className={'w-full ' + maxWidth + ' bg-white max-sm:rounded-t-[20px] sm:rounded-xl shadow-[var(--shadow-overlay)] border border-[var(--color-border)] overflow-hidden flex flex-col max-h-[90dvh] ' + className} role="dialog" aria-modal="true" aria-label={t(title)}>
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-white shrink-0">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)] leading-tight">{t(title)}</h3>
            {subtitle && <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{t(subtitle)}</p>}
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)]" aria-label={t('Close modal')}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1 text-sm text-[var(--color-text-primary)]">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-background-subtle)] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 shrink-0">{footer}</div>}
      </div>
    </div>
  );
};

export const ConfirmationDialog = ({
  isOpen, onClose, onConfirm, title = 'Confirm Action', message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'danger', isLoading = false,
}) => {
  const { t } = usePreferences();
  const iconMap = {
    danger: <AlertTriangle className="w-6 h-6 text-[var(--color-error)]" />,
    warning: <AlertTriangle className="w-6 h-6 text-[var(--color-warning)]" />,
    primary: <Info className="w-6 h-6 text-[var(--color-primary)]" />,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading} className="max-sm:w-full">{cancelLabel}</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} size="sm" onClick={onConfirm} isLoading={isLoading} className="max-sm:w-full">{confirmLabel}</Button>
        </>
      }
    >
      <div className="flex items-start gap-3.5 py-1">
        <div className="w-10 h-10 rounded-full bg-[var(--color-background)] flex items-center justify-center shrink-0">{iconMap[tone]}</div>
        <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">{t(message)}</p>
      </div>
    </Modal>
  );
};
