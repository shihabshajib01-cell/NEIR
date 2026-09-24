import React, { useId, useRef, useState } from 'react';
import {
  Checkbox as MuiCheckbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup as MuiRadioGroup,
} from '@mui/material';
import { UploadCloud, FileText, X } from 'lucide-react';
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
  indeterminate = false,
  ariaLabel,
  className = '',
}) => {
  const generatedId = useId();
  const inputId = id || name || generatedId;
  const { t } = usePreferences();

  const control = (
    <MuiCheckbox
      id={inputId}
      name={name}
      checked={checked}
      indeterminate={indeterminate}
      onChange={onChange}
      disabled={disabled}
      size="small"
      inputProps={{ 'aria-label': ariaLabel ? t(ariaLabel) : undefined }}
      sx={{
        color: 'var(--color-border)',
        padding: '4px',
        '& .MuiSvgIcon-root': { fontSize: 20 },
        '&.Mui-checked': { color: 'var(--color-primary)' },
        '&.MuiCheckbox-indeterminate': { color: 'var(--color-primary)' },
        '&.Mui-focusVisible': {
          outline: '2px solid var(--color-primary)',
          outlineOffset: '2px',
          borderRadius: '4px',
        },
      }}
    />
  );

  if (!label && !description) {
    return <span className={className}>{control}</span>;
  }

  return (
    <FormControlLabel
      className={className}
      disabled={disabled}
      control={control}
      label={
        <span className="flex flex-col">
          {label && <span className="type-label text-[var(--color-text-primary)] leading-tight">{t(label)}</span>}
          {description && <span className="type-meta text-[var(--color-text-muted)] mt-0.5">{t(description)}</span>}
        </span>
      }
      sx={{
        margin: 0,
        alignItems: 'flex-start',
        gap: '6px',
        '& .MuiFormControlLabel-label': { paddingTop: '3px' },
      }}
    />
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
    <FormControl component="fieldset" disabled={disabled} className={className}>
      {label && (
        <FormLabel
          component="legend"
          sx={{
            fontSize: 'var(--type-label-size)',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
            mb: 1,
            '&.Mui-focused': { color: 'var(--color-text-primary)' },
          }}
        >
          {t(label)}
        </FormLabel>
      )}
      <MuiRadioGroup
        name={name}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        row={orientation === 'horizontal'}
        sx={{ gap: orientation === 'horizontal' ? 1 : 0.5 }}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio size="small" />}
            label={
              <span className="flex flex-col">
                <span className="type-label text-[var(--color-text-primary)]">{t(option.label)}</span>
                {option.description && <span className="type-meta text-[var(--color-text-muted)] mt-0.5">{t(option.description)}</span>}
              </span>
            }
            sx={{
              margin: 0,
              minHeight: 44,
              px: 1,
              py: 0.5,
              borderRadius: 'var(--radius-md)',
              '&:hover': { backgroundColor: 'var(--color-background-subtle)' },
            }}
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
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
      {label && <label className="type-label text-[var(--color-text-primary)]">{t(label)}</label>}
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
                <p className="type-label text-[var(--color-text-primary)] truncate">{file.name}</p>
                <p className="type-meta text-[var(--color-text-muted)]">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
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
              <span className="type-button-sm text-[var(--color-primary-dark)]">{t('Click to upload')}</span>
              <span className="type-meta text-[var(--color-text-muted)]">{t(' or drag and drop')}</span>
            </div>
            <p className="type-meta text-[var(--color-text-muted)]">{t(helperText)}</p>
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
            <p className="type-label text-[var(--color-text-primary)]">{selectedFile ? selectedFile.name : 'Choose a CSV file or drag and drop here'}</p>
            <p className="type-meta text-[var(--color-text-muted)] mt-0.5">{selectedFile ? (selectedFile.size / 1024).toFixed(1) + ' KB · Ready to process' : 'Supported format: .csv (UTF-8 encoded)'}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-[var(--color-border)]">
          <div className="type-meta text-[var(--color-text-muted)]">{selectedFile ? 'File verified. Click Process Batch to commit.' : 'No file selected yet.'}</div>
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
