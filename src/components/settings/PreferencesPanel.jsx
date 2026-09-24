import React from 'react';
import { Languages, Type } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const PreferencesPanel = ({ className = '' }) => {
  const { language, setLanguage, textSize, setTextSize, t } = usePreferences();

  const languageOptions = [
    { id: 'en', label: 'English' },
    { id: 'bn', label: 'Bangla' },
  ];

  const sizeOptions = [
    { id: 'compact', label: 'Compact', sample: 'A' },
    { id: 'standard', label: 'Standard', sample: 'A' },
    { id: 'large', label: 'Large', sample: 'A' },
  ];

  return (
    <div className={'w-72 bg-white border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-lg)] overflow-hidden ' + className}>
      <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-background-subtle)]">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{t('Display preferences')}</p>
      </div>

      <div className="p-4 space-y-5">
        <section>
          <div className="flex items-center gap-2 mb-2.5 text-sm font-medium text-[var(--color-text-primary)]">
            <Languages className="w-4 h-4 text-[var(--color-primary)]" />
            <span>{t('Language')}</span>
          </div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label={t('Language')}>
            {languageOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setLanguage(option.id)}
                className={'min-h-10 rounded-lg border px-3 text-sm font-semibold transition-colors ' +
                  (language === option.id
                    ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary-dark)]'
                    : 'bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]')}
              >
                {t(option.label)}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-2.5 text-sm font-medium text-[var(--color-text-primary)]">
            <Type className="w-4 h-4 text-[var(--color-primary)]" />
            <span>{t('Text size')}</span>
          </div>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label={t('Text size')}>
            {sizeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setTextSize(option.id)}
                className={'min-h-14 rounded-lg border px-2 flex flex-col items-center justify-center gap-1 transition-colors ' +
                  (textSize === option.id
                    ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary-dark)]'
                    : 'bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]')}
              >
                <span className={
                  option.id === 'compact' ? 'text-xs font-semibold' :
                  option.id === 'large' ? 'text-lg font-semibold' :
                  'text-sm font-semibold'
                }>
                  {option.sample}
                </span>
                <span className="text-[11px] font-medium">{t(option.label)}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
