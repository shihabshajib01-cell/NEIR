import React, { useId, useRef, useState } from 'react';
import { UploadCloud, FileText, X, Check } from 'lucide-react';
import { Button } from './Button.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const Checkbox = ({
  label,
  id,
  name,
  checked = false,
  onChange,
  disabled = false,
  description,
  className = '',
}) => {
  const generatedId = useId();
  const inputId = id || name || generatedId;
  const { t } = usePreferences();

  return (
    <label htmlFor={inputId} className={'flex items-start gap-2.5 cursor-pointer select-none ' + (disabled ? 'opacity-50 cursor-not-allowed ' : '') + className}>
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          id={inputId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-5 h-5 rounded-md border border-[var(--color-border)] bg-white transition-all peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)] peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(1,173,193,0.28)] flex items-center justify-center">
          <Check className={'w-3.5 h-3.5 text-white stroke-[3] transition-opacity ' + (checked ? 'opacity-100' : 'opacity-0')} />
        </div>
      </div>
      <div className="flex flex-col">
        {label && <span className="text-sm font-medium text-[var(--color-text-primary)] leading-tight">{t(label)}</span>}
        {description && <span className="text-xs text-[var(--color-text-muted)] mt-0.5">{t(description)}</span>}
      </div>
    </label>
  );
};

export const RadioGroup = ({
  label,
  name,
  value,
  onChange,
  options = [],
  orientation = 'vertical',
  disabled = false,
  className = '',
}) => {
  const { t } = usePreferences();

  return (
    <fieldset className={'flex flex-col gap-2 ' + className} disabled={disabled}>
      {label && <legend className="text-sm font-medium text-[var(--color-text-primary)] mb-1">{t(label)}</legend>}
      <div className={'flex ' + (orientation === 'horizontal' ? 'flex-row flex-wrap gap-3' : 'flex-col gap-2')}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={'flex items-start gap-2.5 cursor-pointer select-none p-3 rounded-lg border transition-all ' +
                (selected ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' : 'border-[var(--color-border)] bg-white hover:bg-[var(--color-background-subtle)]') +
                (disabled ? ' opacity-50 cursor-not-allowed' : '')}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => !disabled && onChange?.(option.value)}
                disabled={disabled}
                className="sr-only"
              />
              <div className={'w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center transition-all ' + (selected ? 'border-[var(--color-primary)] bg-white' : 'border-[var(--color-border)] bg-white')}>
                {selected && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />}
              </div>
              <div className="flex flex-col">
                <span className={'text-sm font-medium ' + (selected ? 'text-[var(--color-primary-dark)]' : 'text-[var(--color-text-primary)]')}>{t(option.label)}</span>
                {option.description && <span className="text-xs text-[var(--color-text-muted)] mt-0.5">{t(option.description)}</span>}
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};

export const FileUpload = ({
  label,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 5,
  onFileSelect,
  helperText = 'Allowed formats: PDF, JPG, PNG (Max 5MB)',
  className = '',
}) => {
  const { t } = usePreferences();
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    if (selected) {
      setFile(selected);
      onFileSelect?.(selected);
    }
  };

  const handleClear = (event) => {
    event.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onFileSelect?.(null);
  };

  return (
    <div className={'flex flex-col gap-1.5 ' + className}>
      {label && <label className="text-sm font-medium text-[var(--color-text-primary)]">{t(label)}</label>}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={'border-2 border-dashed rounded-xl p-4 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-2 ' +
          (file ? 'border-[var(--color-primary)] bg-[rgba(1,173,193,0.05)]' : 'border-[var(--color-border)] bg-[var(--color-background-subtle)] hover:bg-[var(--color-primary-light)]')}
      >
        <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
        {file ? (
          <div className="flex items-center justify-between w-full px-2">
            <div className="flex items-center gap-2.5 text-left truncate">
              <FileText className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
              <div className="truncate">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{file.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button type="button" onClick={handleClear} className="w-9 h-9 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-error)] rounded-lg" aria-label={t('Clear')}>
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud className="w-6 h-6 text-[var(--color-text-muted)]" />
            <div>
              <span className="text-xs font-semibold text-[var(--color-primary-dark)]">{t('Click to upload')}</span>
              <span className="text-xs text-[var(--color-text-muted)]">{t(' or drag and drop')}</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)]">{t(helperText)}</p>
          </>
        )}
      </div>
    </div>
  );
};

export const CSVUpload = ({
  onUpload,
  isProcessing = false,
  className = '',
}) => {
  const { t } = usePreferences();
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') setDragActive(true);
    if (event.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file?.name.endsWith('.csv')) setSelectedFile(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  return (
    <div className={'bg-white border border-[var(--color-border)] rounded-xl p-5 ' + className}>
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Upload Manufacturer CSV Batch</h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Select a verified .CSV file formatted with mandatory columns: <code className="bg-[var(--color-background)] px-1 py-0.5 rounded text-[var(--color-primary-dark)] font-mono">IMEI, BRAND, MODEL, TAC</code>
          </p>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={'border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ' +
            (dragActive ? 'border-[var(--color-primary)] bg-[rgba(1,173,193,0.05)]' : 'border-[var(--color-border)] bg-[var(--color-background-subtle)] hover:bg-[var(--color-primary-light)]')}
        >
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          <div className="w-12 h-12 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shadow-[var(--shadow-sm)]">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{selectedFile ? selectedFile.name : 'Choose a CSV file or drag and drop here'}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{selectedFile ? (selectedFile.size / 1024).toFixed(1) + ' KB · Ready to process' : 'Supported format: .csv (UTF-8 encoded)'}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-[var(--color-border)]">
          <div className="text-xs text-[var(--color-text-muted)]">{selectedFile ? 'File verified. Click Process Batch to commit.' : 'No file selected yet.'}</div>
          <div className="flex items-center gap-2 self-end">
            {selectedFile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                Clear
              </Button>
            )}
            <Button variant="primary" size="md" disabled={!selectedFile || isProcessing} isLoading={isProcessing} onClick={() => selectedFile && onUpload?.(selectedFile)}>
              Process Batch & Commit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
