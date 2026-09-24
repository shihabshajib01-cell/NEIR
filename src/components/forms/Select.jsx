import React, { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Search, Check, AlertCircle } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const Select = ({
  label, id, name, value, onChange, options = [], placeholder = 'Select option', error, helperText,
  required = false, disabled = false, className = '', ...props
}) => {
  const generatedId = useId();
  const { t } = usePreferences();
  const selectId = id || name || generatedId;
  const normalizedOptions = options.map((option) => typeof option === 'string' ? { value: option, label: option } : option);

  return (
    <div className={'flex flex-col gap-1.5 ' + className}>
      {label && <label htmlFor={selectId} className="text-sm font-medium text-[var(--color-text-primary)]">{t(label)}{required && <span className="text-[var(--color-error)] ml-0.5">*</span>}</label>}
      <div className="relative">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          className={'w-full min-h-10 pl-3 pr-8 rounded-lg bg-white border text-base text-[var(--color-text-primary)] transition-all appearance-none cursor-pointer ' +
            (error ? 'border-[var(--color-error)] focus:ring-2 focus:ring-red-100 ' : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(1,173,193,0.18)] ') +
            (disabled ? 'bg-[var(--color-background)] text-[var(--color-text-muted)] cursor-not-allowed' : '')}
          {...props}
        >
          {placeholder && <option value="">{t(placeholder)}</option>}
          {normalizedOptions.map((option) => <option key={option.value} value={option.value}>{t(option.label)}</option>)}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]"><ChevronDown className="w-4 h-4" /></div>
      </div>
      {error && <p className="text-xs text-[var(--color-error)] flex items-center gap-1 mt-0.5"><AlertCircle className="w-3.5 h-3.5 shrink-0" /><span>{t(error)}</span></p>}
      {helperText && !error && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t(helperText)}</p>}
    </div>
  );
};

export const SearchableSelect = ({
  label, value, onChange, options = [], placeholder = 'Select or search...', error, helperText,
  required = false, disabled = false, className = '',
}) => {
  const { t } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);
  const normalizedOptions = options.map((option) => typeof option === 'string' ? { value: option, label: option } : option);
  const selectedOption = normalizedOptions.find((option) => option.value === value);
  const filteredOptions = normalizedOptions.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={'flex flex-col gap-1.5 relative ' + className}>
      {label && <label className="text-sm font-medium text-[var(--color-text-primary)]">{t(label)}{required && <span className="text-[var(--color-error)] ml-0.5">*</span>}</label>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((open) => !open)}
        className={'w-full min-h-10 px-3 rounded-lg bg-white border text-base text-left flex items-center justify-between transition-all ' +
          (error ? 'border-[var(--color-error)] ' : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(1,173,193,0.18)] ') +
          (disabled ? 'bg-[var(--color-background)] text-[var(--color-text-muted)] cursor-not-allowed' : 'cursor-pointer')}
      >
        <span className={selectedOption ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}>{selectedOption ? t(selectedOption.label) : t(placeholder)}</span>
        <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-lg)] max-h-60 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-[var(--color-border)] bg-[var(--color-background-subtle)]">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-2.5 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t('Search...')}
                className="w-full min-h-10 pl-8 pr-2 text-base bg-white border border-[var(--color-border)] rounded-lg focus:border-[var(--color-primary)]"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-48 p-1">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-[var(--color-text-muted)] text-center">{t('No options found')}</div>
            ) : filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={'w-full min-h-10 px-2.5 py-2 text-left text-sm rounded-lg flex items-center justify-between hover:bg-[var(--color-background)] cursor-pointer ' +
                  (option.value === value ? 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] font-medium' : 'text-[var(--color-text-primary)]')}
              >
                <span className="truncate">{t(option.label)}</span>
                {option.value === value && <Check className="w-3.5 h-3.5 text-[var(--color-primary-dark)] shrink-0 ml-2" />}
              </button>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-xs text-[var(--color-error)] mt-0.5">{t(error)}</p>}
      {helperText && !error && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t(helperText)}</p>}
    </div>
  );
};
