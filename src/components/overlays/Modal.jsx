import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '../forms/Button.jsx';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-lg', // 'max-w-md' | 'max-w-lg' | 'max-w-2xl' | 'max-w-4xl'
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202338]/30 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full ${maxWidth} bg-white rounded-xl shadow-xl border border-[#E2E5F0] overflow-hidden flex flex-col max-h-[90vh] animate-scale-up ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E5F0] flex items-center justify-between bg-[#F7F8FC]">
          <div>
            <h3 className="text-base font-semibold text-[#202338] leading-tight">{title}</h3>
            {subtitle && <p className="text-xs text-[#626981] mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[#7A8197] hover:text-[#202338] hover:bg-[#EEF0FA] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 text-sm text-[#202338]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-3 border-t border-[#E2E5F0] bg-[#F7F8FC] flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger', // 'danger' | 'warning' | 'primary'
  isLoading = false,
}) => {
  const iconMap = {
    danger: <AlertTriangle className="w-6 h-6 text-[#C62828]" />,
    warning: <AlertTriangle className="w-6 h-6 text-[#EF8F22]" />,
    primary: <Info className="w-6 h-6 text-[#4B5694]" />,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3.5 py-1">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
          {iconMap[tone]}
        </div>
        <div className="flex-1">
          <p className="text-sm text-[#202338] leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  );
};
