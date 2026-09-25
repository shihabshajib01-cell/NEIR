import React from 'react';
import { Languages, Moon, Sun, Type } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const PreferencesPanel = ({ className = '' }) => {
  const { language, setLanguage, textSize, setTextSize, theme, setTheme, t } = usePreferences();

  const languageOptions = [
    { id: 'en', label: 'English' },
    { id: 'bn', label: 'Bangla' },
  ];

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
  ];

  const sizeOptions = [
    { id: 'compact', label: 'Compact', sample: 'A' },
    { id: 'standard', label: 'Standard', sample: 'A' },
    { id: 'large', label: 'Large', sample: 'A' },
  ];

  return (
    <div className={'w-72 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-lg)] overflow-hidden ' + className}>
      <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-background-subtle)]">
        <p className="type-label text-[var(--color-text-primary)]">{t('Display preferences')}</p>
      </div>

      <div className="p-4 space-y-5">
        <section>
          <div className="flex items-center gap-2 mb-2.5 type-label text-[var(--color-text-primary)]">
            <Languages className="w-4 h-4 text-[var(--color-primary)]" />
            <p>{t('Language')}</p>
          </div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label={t('Language')}>
            {languageOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setLanguage(option.id)}
                className={'min-h-10 rounded-lg border px-3 type-button-sm transition-colors ' +
                  (language === option.id
                    ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary-dark)]'
                    : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]')}
              >
                {t(option.label)}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-2.5 type-label text-[var(--color-text-primary)]">
            {theme === 'dark'
              ? <Moon className="w-4 h-4 text-[var(--color-primary)]" />
              : <Sun className="w-4 h-4 text-[var(--color-primary)]" />}
            <p>{t('Theme')}</p>
          </div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label={t('Theme')}>
            {themeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTheme(option.id)}
                  className={'min-h-10 rounded-lg border px-3 type-button-sm flex items-center justify-center gap-2 transition-colors ' +
                    (theme === option.id
                      ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary-dark)]'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]')}
                  aria-pressed={theme === option.id}
                >
                  <Icon className="w-4 h-4" />
                  <p>{t(option.label)}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-2.5 type-label text-[var(--color-text-primary)]">
            <Type className="w-4 h-4 text-[var(--color-primary)]" />
            <p>{t('Text size')}</p>
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
                    : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]')}
              >
                <p className={
                  option.id === 'compact' ? 'text-[14px] font-semibold leading-none' :
                  option.id === 'large' ? 'text-[18px] font-semibold leading-none' :
                  'text-[16px] font-semibold leading-none'
                }>
                  {option.sample}
                </p>
                <p className="type-meta font-medium">{t(option.label)}</p>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
