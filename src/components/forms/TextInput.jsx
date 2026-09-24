import React, { useId, useState } from 'react';
import { TextField, InputAdornment, IconButton as MuiIconButton } from '@mui/material';
import { Eye, EyeOff, Smartphone, Hash, Phone, Calendar } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';
import { muiFieldSx } from '../../system/muiFieldSx.js';

const translated = (t, value) => typeof value === 'string' ? t(value) : value;

const FieldLabel = ({ htmlFor, label, required = false }) => {
  if (!label) return null;

  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-5 text-[var(--color-text-primary)]"
    >
      {label}
      {required ? <span className="text-[var(--color-error)]" aria-hidden="true"> *</span> : null}
    </label>
  );
};

export const TextInput = ({
  label, id, name, value, onChange, placeholder, type = 'text', error, helperText,
  required = false, disabled = false, readOnly = false, icon: Icon, className = '', inputClassName = '', ...props
}) => {
  const generatedId = useId();
  const { t } = usePreferences();
  const inputId = id || name || generatedId;
  const fieldLabel = translated(t, label);

  return (
    <div className={'flex flex-col gap-1.5 ' + className}>
      <FieldLabel htmlFor={inputId} label={fieldLabel} required={required} />
      <TextField
        id={inputId}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={translated(t, placeholder)}
        type={type}
        error={Boolean(error)}
        helperText={translated(t, error || helperText)}
        required={required}
        disabled={disabled}
        variant="outlined"
        size="small"
        fullWidth
        autoComplete={props.autoComplete}
        InputProps={{
          readOnly,
          startAdornment: Icon ? (
            <InputAdornment position="start">
              <Icon className="w-4 h-4" />
            </InputAdornment>
          ) : undefined,
        }}
        inputProps={{
          maxLength: props.maxLength,
          min: props.min,
          max: props.max,
          inputMode: props.inputMode,
          className: inputClassName,
          'aria-invalid': Boolean(error) || undefined,
          'aria-describedby': error || helperText ? inputId + '-helper' : undefined,
        }}
        FormHelperTextProps={{ id: inputId + '-helper' }}
        sx={muiFieldSx}
        {...Object.fromEntries(Object.entries(props).filter(([key]) => !['autoComplete','maxLength','min','max','inputMode'].includes(key)))}
      />
    </div>
  );
};

export const PasswordInput = ({
  label, id, name, value, onChange, placeholder = '••••••••', error, helperText,
  required = false, disabled = false, className = '', ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const { t } = usePreferences();
  const inputId = id || name || generatedId;
  const fieldLabel = translated(t, label);

  return (
    <div className={'flex flex-col gap-1.5 ' + className}>
      <FieldLabel htmlFor={inputId} label={fieldLabel} required={required} />
      <TextField
        id={inputId}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={translated(t, placeholder)}
        type={showPassword ? 'text' : 'password'}
        error={Boolean(error)}
        helperText={translated(t, error || helperText)}
        required={required}
        disabled={disabled}
        variant="outlined"
        size="small"
        fullWidth
        autoComplete={props.autoComplete}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <MuiIconButton
                edge="end"
                size="small"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={t(showPassword ? 'Hide password' : 'Show password')}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </MuiIconButton>
            </InputAdornment>
          ),
        }}
        inputProps={{
          'aria-invalid': Boolean(error) || undefined,
          'aria-describedby': error || helperText ? inputId + '-helper' : undefined,
        }}
        FormHelperTextProps={{ id: inputId + '-helper' }}
        sx={muiFieldSx}
        {...Object.fromEntries(Object.entries(props).filter(([key]) => key !== 'autoComplete'))}
      />
    </div>
  );
};

export const IMEIInput = ({
  label = 'IMEI Number', value, onChange,
  placeholder = 'e.g. 862940058912341 (14-16 digits)',
  error, helperText = 'Standard 15-digit international equipment identity number',
  required = false, className = '', ...props
}) => {
  const handleChange = (event) => {
    const cleaned = event.target.value.replace(/\D/g, '').slice(0, 16);
    onChange?.({ ...event, target: { ...event.target, value: cleaned } });
  };

  return (
    <TextInput
      label={label}
      icon={Smartphone}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      required={required}
      className={className}
      inputClassName="font-mono tabular-nums tracking-wider"
      maxLength={16}
      inputMode="numeric"
      {...props}
    />
  );
};

export const PhoneInput = ({
  label = 'Phone Number', value, onChange, placeholder = '+880 1XXXXXXXXX',
  error, helperText, required = false, className = '', ...props
}) => (
  <TextInput
    label={label}
    icon={Phone}
    type="tel"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    error={error}
    helperText={helperText}
    required={required}
    className={className}
    inputClassName="font-mono tabular-nums"
    {...props}
  />
);

export const DateInput = ({ label, value, onChange, error, helperText, required = false, className = '', ...props }) => (
  <TextInput
    label={label}
    icon={Calendar}
    type="date"
    value={value}
    onChange={onChange}
    error={error}
    helperText={helperText}
    required={required}
    className={className}
    {...props}
  />
);

export const NumberInput = ({ label, value, onChange, error, helperText, required = false, min, max, className = '', ...props }) => (
  <TextInput
    label={label}
    type="number"
    value={value}
    onChange={onChange}
    error={error}
    helperText={helperText}
    required={required}
    min={min}
    max={max}
    className={className}
    inputClassName="font-mono tabular-nums"
    {...props}
  />
);

export const FileUpload = ({ label, helperText, accept, onFileSelect, className = '' }) => {
  const [fileName, setFileName] = useState('');
  const { t } = usePreferences();

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect?.(file);
    }
  };

  return (
    <div className={'flex flex-col gap-1.5 ' + className}>
      {label && <label className="text-sm font-medium text-[var(--color-text-primary)]">{t(label)}</label>}
      <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-5 text-center bg-[var(--color-background-subtle)] hover:bg-[var(--color-primary-light)] transition-colors relative cursor-pointer">
        <input type="file" accept={accept} onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="flex flex-col items-center justify-center gap-1.5">
          <Smartphone className="w-6 h-6 text-[var(--color-primary)]" />
          <span className="text-xs font-semibold text-[var(--color-text-primary)]">{fileName || t('Click or drag file to attach')}</span>
          <span className="text-[11px] text-[var(--color-text-muted)]">{t(helperText || 'Supported files: PDF, PNG, JPG up to 10MB')}</span>
        </div>
      </div>
    </div>
  );
};

export const Textarea = ({
  label, id, name, value, onChange, placeholder, rows = 3, error, helperText,
  required = false, disabled = false, readOnly = false, className = '', ...props
}) => {
  const generatedId = useId();
  const { t } = usePreferences();
  const inputId = id || name || generatedId;
  const fieldLabel = translated(t, label);

  return (
    <div className={'flex flex-col gap-1.5 ' + className}>
      <FieldLabel htmlFor={inputId} label={fieldLabel} required={required} />
      <TextField
        id={inputId}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={translated(t, placeholder)}
        multiline
        minRows={rows}
        error={Boolean(error)}
        helperText={translated(t, error || helperText)}
        required={required}
        disabled={disabled}
        variant="outlined"
        size="small"
        fullWidth
        InputProps={{ readOnly }}
        inputProps={{
          'aria-invalid': Boolean(error) || undefined,
          'aria-describedby': error || helperText ? inputId + '-helper' : undefined,
        }}
        FormHelperTextProps={{ id: inputId + '-helper' }}
        sx={muiFieldSx}
        {...props}
      />
    </div>
  );
};

export const CSVUpload = ({ label, helperText, onFileSelect, onSampleDownload, className = '' }) => {
  const [fileName, setFileName] = useState('');
  const { t } = usePreferences();

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect?.(file);
    }
  };

  return (
    <div className={'flex flex-col gap-1.5 ' + className}>
      {label && <label className="text-sm font-medium text-[var(--color-text-primary)]">{t(label)}</label>}
      <div className="border-2 border-dashed border-[rgba(1,173,193,0.35)] rounded-xl p-5 text-center bg-[rgba(1,173,193,0.04)] hover:bg-[var(--color-primary-light)] transition-colors relative cursor-pointer">
        <input type="file" accept=".csv,text/csv" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="flex flex-col items-center justify-center gap-1.5">
          <Hash className="w-6 h-6 text-[var(--color-primary)]" />
          <span className="text-xs font-bold text-[var(--color-text-primary)]">{fileName || 'Drop CSV batch file here or click to browse'}</span>
          {helperText && <span className="text-[11px] text-[var(--color-text-muted)]">{t(helperText)}</span>}
        </div>
      </div>
      {onSampleDownload && (
        <button type="button" onClick={onSampleDownload} className="self-start text-xs font-semibold text-[var(--color-primary-dark)] hover:text-[var(--color-primary)]">
          Download sample CSV
        </button>
      )}
    </div>
  );
};
