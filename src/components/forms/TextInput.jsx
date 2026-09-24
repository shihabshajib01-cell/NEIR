import React, { useState } from 'react';
import { Eye, EyeOff, Search, Smartphone, Hash, Phone, Calendar, AlertCircle } from 'lucide-react';

export const TextInput = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  icon: Icon,
  className = '',
  inputClassName = '',
  ...props
}) => {
  const inputId = id || name || Math.random().toString(36).substring(2, 9);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#172B4D] flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </span>
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 pointer-events-none text-[#748597]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={`w-full h-9 px-3 rounded-md bg-white border text-sm text-[#172B4D] placeholder:text-[#748597] transition-all outline-hidden
            ${Icon ? 'pl-9' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[#D8E0E8] focus:border-[#147D83] focus:ring-2 focus:ring-[#147D83]/20'}
            ${disabled ? 'bg-[#F4F7FA] text-[#748597] cursor-not-allowed' : ''}
            ${inputClassName}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-[#748597] mt-0.5">{helperText}</p>
      )}
    </div>
  );
};

export const PasswordInput = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder = '••••••••',
  error,
  helperText,
  required = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || Math.random().toString(36).substring(2, 9);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#172B4D]">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={inputId}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full h-9 pl-3 pr-10 rounded-md bg-white border text-sm text-[#172B4D] placeholder:text-[#748597] transition-all outline-hidden
            ${error ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[#D8E0E8] focus:border-[#147D83] focus:ring-2 focus:ring-[#147D83]/20'}`}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2.5 p-1 text-[#748597] hover:text-[#172B4D] transition-colors cursor-pointer"
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#748597] mt-0.5">{helperText}</p>}
    </div>
  );
};

export const IMEIInput = ({
  label = 'IMEI Number',
  value,
  onChange,
  placeholder = 'e.g. 862940058912341 (14-16 digits)',
  error,
  helperText = 'Standard 15-digit international equipment identity number',
  required = false,
  className = '',
  ...props
}) => {
  const handleChange = (e) => {
    // Only permit digits
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 16);
    if (onChange) {
      onChange({ ...e, target: { ...e.target, value: cleaned } });
    }
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
      {...props}
    />
  );
};

export const PhoneInput = ({
  label = 'Phone Number',
  value,
  onChange,
  placeholder = '+880 1XXXXXXXXX',
  error,
  helperText,
  required = false,
  className = '',
  ...props
}) => {
  return (
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
};

export const DateInput = ({
  label,
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <TextInput
      label={label}
      icon={Calendar}
      type="date"
      value={value}
      onChange={onChange}
      error={error}
      required={required}
      className={className}
      {...props}
    />
  );
};

export const NumberInput = ({
  label,
  value,
  onChange,
  error,
  required = false,
  min,
  max,
  className = '',
  ...props
}) => {
  return (
    <TextInput
      label={label}
      type="number"
      value={value}
      onChange={onChange}
      error={error}
      required={required}
      min={min}
      max={max}
      className={className}
      inputClassName="font-mono tabular-nums"
      {...props}
    />
  );
};

export const FileUpload = ({
  label,
  helperText,
  accept,
  onFileSelect,
  className = '',
}) => {
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect && onFileSelect(file);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-[#172B4D]">{label}</label>}
      <div className="border-2 border-dashed border-[#D8E0E8] rounded-lg p-5 text-center bg-[#FAFCFE] hover:bg-[#F4F7FA] transition-colors relative cursor-pointer">
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="flex flex-col items-center justify-center gap-1.5">
          <Smartphone className="w-6 h-6 text-[#147D83]" />
          <span className="text-xs font-semibold text-[#102A43]">
            {fileName || 'Click or drag file to attach'}
          </span>
          <span className="text-[11px] text-[#748597]">
            {helperText || 'Supported files: PDF, PNG, JPG up to 10MB'}
          </span>
        </div>
      </div>
    </div>
  );
};

export const Textarea = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const inputId = id || name || Math.random().toString(36).substring(2, 9);
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#172B4D]">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full p-3 rounded-md bg-white border text-sm text-[#172B4D] placeholder:text-[#748597] transition-all outline-hidden resize-y
          ${error ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[#D8E0E8] focus:border-[#147D83] focus:ring-2 focus:ring-[#147D83]/20'}
          ${disabled ? 'bg-[#F4F7FA] text-[#748597] cursor-not-allowed' : ''}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#748597] mt-0.5">{helperText}</p>}
    </div>
  );
};

export const CSVUpload = ({
  label,
  helperText,
  onFileSelect,
  onSampleDownload,
  className = '',
}) => {
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect && onFileSelect(file);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-[#172B4D]">{label}</label>}
      <div className="border-2 border-dashed border-[#147D83]/40 rounded-lg p-5 text-center bg-[#147D83]/5 hover:bg-[#147D83]/10 transition-colors relative cursor-pointer">
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="flex flex-col items-center justify-center gap-1.5">
          <Hash className="w-6 h-6 text-[#147D83]" />
          <span className="text-xs font-bold text-[#102A43]">
            {fileName || 'Drop CSV batch file here or click to browse'}
          </span>
          <span className="text-[11px] text-[#52677A]">
            {helperText || 'Standard comma-delimited format (UTF-8)'}
          </span>
        </div>
      </div>
    </div>
  );
};



