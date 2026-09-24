import React, { useId, useState } from 'react';
import { Eye, EyeOff, Smartphone, Hash, Phone, Calendar, AlertCircle } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

const FieldMessage = ({ error, helperText }) => {
  const { t } = usePreferences();
  if (error) {
    return (
      <p className="text-xs text-[var(--color-error)] flex items-center gap-1 mt-0.5 font-medium">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>{t(error)}</span>
      </p>
    );
  }
  return helperText ? <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t(helperText)}</p> : null;
};

export const TextInput = ({
  label, id, name, value, onChange, placeholder, type = 'text', error, helperText,
  required = false, disabled = false, readOnly = false, icon: Icon, className = '', inputClassName = '', ...props
}) => {
  const generatedId = useId();
  const { t } = usePreferences();
  const inputId = id || name || generatedId;

  return (
    <div className={'flex flex-col gap-1.5 ' + className}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text-primary)]">
          {t(label)}{required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && <div className="absolute left-3 pointer-events-none text-[var(--color-text-muted)]"><Icon className="w-4 h-4" /></div>}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={t(placeholder)}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error || helperText ? inputId + '-message' : undefined}
          className={'w-full min-h-10 px-3 rounded-lg bg-white border text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all ' +
            (Icon ? 'pl-9 ' : '') +
            (error ? 'border-[var(--color-error)] focus:ring-2 focus:ring-red-100 ' : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(1,173,193,0.18)] ') +
            (disabled ? 'bg-[var(--color-background)] text-[var(--color-text-muted)] cursor-not-allowed ' : '') +
            inputClassName}
          {...props}
        />
      </div>
      <div id={inputId + '-message'}><FieldMessage error={error} helperText={helperText} /></div>
    </div>
  );
};

export const PasswordInput = ({ label, id, name, value, onChange, placeholder = '••••••••', error, helperText, required = false, className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const { t } = usePreferences();
  const inputId = id || name || generatedId;

  return (
    <div className={'flex flex-col gap-1.5 ' + className}>
      {label && <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text-primary)]">{t(label)}{required && <span className="text-[var(--color-error)] ml-0.5">*</span>}</label>}
      <div className="relative flex items-center">
        <input
          id={inputId}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={t(placeholder)}
          required={required}
          aria-invalid={Boolean(error)}
          className={'w-full min-h-10 pl-3 pr-11 rounded-lg bg-white border text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all ' +
            (error ? 'border-[var(--color-error)] focus:ring-2 focus:ring-red-100' : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(1,173,193,0.18)]')}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
          className="absolute right-1.5 w-9 h-9 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg"
          title={t(showPassword ? 'Hide password' : 'Show password')}
          aria-label={t(showPassword ? 'Hide password' : 'Show password')}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      <FieldMessage error={error} helperText={helperText} />
    </div>
  );
};

export const IMEIInput = ({ label = 'IMEI Number', value, onChange, placeholder = 'e.g. 862940058912341 (14-16 digits)', error, helperText = 'Standard 15-digit international equipment identity number', required = false, className = '', ...props }) => {
  const handleChange = (event) => {
    const cleaned = event.target.value.replace(/\D/g, '').slice(0, 16);
    onChange?.({ ...event, target: { ...event.target, value: cleaned } });
  };
  return <TextInput label={label} icon={Smartphone} value={value} onChange={handleChange} placeholder={placeholder} error={error} helperText={helperText} required={required} className={className} inputClassName="font-mono tabular-nums tracking-wider" maxLength={16} inputMode="numeric" {...props} />;
};

export const PhoneInput = ({ label = 'Phone Number', value, onChange, placeholder = '+880 1XXXXXXXXX', error, helperText, required = false, className = '', ...props }) => (
  <TextInput label={label} icon={Phone} type="tel" value={value} onChange={onChange} placeholder={placeholder} error={error} helperText={helperText} required={required} className={className} inputClassName="font-mono tabular-nums" {...props} />
);

export const DateInput = ({ label, value, onChange, error, required = false, className = '', ...props }) => (
  <TextInput label={label} icon={Calendar} type="date" value={value} onChange={onChange} error={error} required={required} className={className} {...props} />
);

export const NumberInput = ({ label, value, onChange, error, required = false, min, max, className = '', ...props }) => (
  <TextInput label={label} type="number" value={value} onChange={onChange} error={error} required={required} min={min} max={max} className={className} inputClassName="font-mono tabular-nums" {...props} />
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

export const Textarea = ({ label, id, name, value, onChange, placeholder, rows = 3, error, helperText, required = false, disabled = false, className = '', ...props }) => {
  const generatedId = useId();
  const { t } = usePreferences();
  const inputId = id || name || generatedId;

  return (
    <div className={'flex flex-col gap-1.5 ' + className}>
      {label && <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text-primary)]">{t(label)}{required && <span className="text-[var(--color-error)] ml-0.5">*</span>}</label>}
      <textarea
        id={inputId}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={t(placeholder)}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        className={'w-full p-3 rounded-lg bg-white border text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all resize-y ' +
          (error ? 'border-[var(--color-error)] focus:ring-2 focus:ring-red-100 ' : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(1,173,193,0.18)] ') +
          (disabled ? 'bg-[var(--color-background)] text-[var(--color-text-muted)] cursor-not-allowed' : '')}
        {...props}
      />
      <FieldMessage error={error} helperText={helperText} />
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
