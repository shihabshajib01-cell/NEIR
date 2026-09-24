import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const { t } = usePreferences();

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((previous) => [...previous, { id, message, type }]);
    if (duration > 0) setTimeout(() => setToasts((previous) => previous.filter((item) => item.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => setToasts((previous) => previous.filter((item) => item.id !== id)), []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[70] flex flex-col gap-2 sm:max-w-sm pointer-events-none" aria-live="polite">
        {toasts.map((toastItem) => {
          const isSuccess = toastItem.type === 'success';
          const isError = toastItem.type === 'error';
          const shell = isSuccess
            ? 'bg-[var(--color-text-primary)] border-[rgba(46,125,50,0.30)]'
            : isError
              ? 'bg-[#7F1D1D] border-[rgba(198,40,40,0.35)]'
              : 'bg-[var(--color-primary-dark)] border-[rgba(1,173,193,0.35)]';

          return (
            <div key={toastItem.id} className={'pointer-events-auto p-3.5 rounded-xl shadow-[var(--shadow-lg)] border flex items-start gap-2.5 text-white ' + shell}>
              {isSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" /> : isError ? <AlertCircle className="w-4 h-4 text-rose-200 shrink-0 mt-0.5" /> : <Info className="w-4 h-4 text-cyan-100 shrink-0 mt-0.5" />}
              <div className="flex-1 text-xs font-medium leading-normal">{t(toastItem.message)}</div>
              <button type="button" onClick={() => removeToast(toastItem.id)} className="text-white/75 hover:text-white p-0.5 shrink-0" aria-label={t('Close')}><X className="w-3.5 h-3.5" /></button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
