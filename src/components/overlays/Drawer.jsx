import React, { useEffect } from 'react';
import { X, ExternalLink, Download, Clock, ShieldCheck, Check } from 'lucide-react';
import { Button } from '../forms/Button.jsx';
import { StatusBadge } from '../data-display/StatusBadge.jsx';

export const Drawer = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'w-full sm:w-[480px]', // 420px - 560px desktop range
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#202338]/30 backdrop-blur-xs transition-opacity animate-fade-in"
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`relative ${width} bg-white shadow-2xl border-l border-[#E2E5F0] flex flex-col h-full animate-slide-left ${className}`}>
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-[#E2E5F0] bg-[#F7F8FC] flex items-center justify-between">
            <div className="pr-4 min-w-0">
              <h3 className="text-base font-semibold text-[#202338] truncate">{title}</h3>
              {subtitle && <p className="text-xs text-[#626981] mt-0.5 truncate">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-[#7A8197] hover:text-[#202338] hover:bg-[#E1F7FB] transition-colors cursor-pointer shrink-0"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {children}
          </div>

          {/* Drawer Footer */}
          {footer && (
            <div className="px-5 py-3 border-t border-[#E2E5F0] bg-[#F7F8FC] flex items-center justify-end gap-2.5">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const RecordDetailsDrawer = ({
  isOpen,
  onClose,
  title = 'Record Details',
  recordId,
  status,
  sections = [], // [{ title: 'Device Information', items: [{ label, value, isMono }] }]
  footerActions,
  width = 'w-full sm:w-[480px]',
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={recordId ? `ID: ${recordId}` : null}
      width={width}
      footer={
        footerActions || (
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        )
      }
    >
      {/* Identity & Status strip */}
      <div className="p-3.5 bg-[#F7F8FC] border border-[#E2E5F0] rounded-xl flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-[#626981] uppercase tracking-wider">Record Status</span>
          <span className="text-sm font-semibold text-[#202338] font-mono mt-0.5">{recordId || 'NEIR-REC'}</span>
        </div>
        {status && <StatusBadge status={status} size="md" />}
      </div>

      {/* Grouped sections */}
      {sections.map((sec, idx) => (
        <div key={idx} className="border border-[#E2E5F0] rounded-xl overflow-hidden bg-white">
          <div className="px-4 py-2.5 bg-[#F7F8FC] border-b border-[#E2E5F0] text-xs font-semibold text-[#202338] uppercase tracking-wider">
            {sec.title}
          </div>
          <div className="p-3.5 space-y-2.5">
            {sec.items.map((item, iIdx) => (
              <div key={iIdx} className="flex items-start justify-between gap-3 text-xs">
                <span className="text-[#626981] shrink-0">{item.label}:</span>
                <span className={`font-medium text-[#202338] text-right break-all ${item.isMono ? 'font-mono tabular-nums' : ''}`}>
                  {item.value || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Drawer>
  );
};

export const FullScreenWorkspace = ({
  isOpen,
  onClose,
  title,
  identifier,
  status,
  children,
  footer,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#202338]/30 backdrop-blur-xs animate-fade-in">
      <div className={`w-full max-w-[92vw] h-[88vh] bg-[#F7F8FC] rounded-xl shadow-2xl border border-[#E2E5F0] flex flex-col overflow-hidden animate-scale-up ${className}`}>
        {/* Workspace Top Bar */}
        <div className="px-6 py-4 bg-white text-[#202338] flex items-center justify-between border-b border-[#E2E5F0] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div>
              <h2 className="text-base font-semibold text-[#202338] leading-tight flex items-center gap-2">
                <span>{title}</span>
                {identifier && (
                  <span className="text-xs font-mono font-normal text-[#626981] bg-[#E1F7FB] px-2 py-0.5 rounded">
                    {identifier}
                  </span>
                )}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {status && <StatusBadge status={status} size="sm" />}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-[#626981] hover:text-[#01ADC1] hover:bg-[#E1F7FB] transition-colors cursor-pointer"
              aria-label="Close review workspace"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </div>

        {/* Workspace Sticky Footer */}
        {footer && (
          <div className="px-6 py-3 bg-white border-t border-[#E2E5F0] flex items-center justify-between shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
