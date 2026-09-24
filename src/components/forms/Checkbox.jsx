import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Check } from 'lucide-react';
import { Button } from './Button.jsx';

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
  const inputId = id || name || Math.random().toString(36).substring(2, 9);

  return (
    <label htmlFor={inputId} className={`flex items-start gap-2.5 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
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
        <div className="w-4 h-4 rounded border border-[#D8E0E8] bg-white transition-all peer-checked:bg-[#14804A] peer-checked:border-[#14804A] peer-focus-visible:ring-2 peer-focus-visible:ring-[#14804A]/30 flex items-center justify-center">
          <Check className={`w-3 h-3 text-white stroke-[3] transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </div>
      <div className="flex flex-col">
        {label && <span className="text-sm font-medium text-[#172B4D] leading-tight">{label}</span>}
        {description && <span className="text-xs text-[#748597] mt-0.5">{description}</span>}
      </div>
    </label>
  );
};

export const RadioGroup = ({
  label,
  name,
  value,
  onChange,
  options = [], // [{ value, label, description }]
  orientation = 'vertical', // 'vertical' | 'horizontal'
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="text-sm font-medium text-[#172B4D]">{label}</span>}
      <div className={`flex ${orientation === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col gap-2'}`}>
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex items-start gap-2.5 cursor-pointer select-none p-2.5 rounded-md border transition-all ${
                isSelected ? 'border-[#14804A] bg-[#14804A]/5' : 'border-[#D8E0E8] bg-white hover:bg-[#F4F7FA]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                onChange={() => !disabled && onChange(opt.value)}
                disabled={disabled}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center transition-all ${
                isSelected ? 'border-[#14804A] bg-white' : 'border-[#D8E0E8] bg-white'
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-[#14804A]" />}
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-medium ${isSelected ? 'text-[#10683D]' : 'text-[#172B4D]'}`}>
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-xs text-[#748597] mt-0.5">{opt.description}</span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
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
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      if (onFileSelect) onFileSelect(selected);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-[#172B4D]">{label}</label>}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-4 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-2 ${
          file ? 'border-[#14804A] bg-[#14804A]/5' : 'border-[#D8E0E8] bg-[#F4F7FA] hover:bg-[#EAEFF5]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        {file ? (
          <div className="flex items-center justify-between w-full px-2">
            <div className="flex items-center gap-2.5 text-left truncate">
              <FileText className="w-5 h-5 text-[#14804A] shrink-0" />
              <div className="truncate">
                <p className="text-sm font-medium text-[#172B4D] truncate">{file.name}</p>
                <p className="text-xs text-[#748597]">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-[#748597] hover:text-red-600 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud className="w-6 h-6 text-[#748597]" />
            <div>
              <span className="text-xs font-semibold text-[#147D83]">Click to upload</span>
              <span className="text-xs text-[#748597]"> or drag and drop</span>
            </div>
            <p className="text-[11px] text-[#748597]">{helperText}</p>
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStartUpload = () => {
    if (selectedFile && onUpload) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className={`bg-white border border-[#D8E0E8] rounded-lg p-5 ${className}`}>
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold text-[#172B4D]">Upload Manufacturer CSV Batch</h3>
          <p className="text-xs text-[#52677A] mt-0.5">
            Select a verified .CSV file formatted with mandatory columns: <code className="bg-[#F4F7FA] px-1 py-0.5 rounded text-[#173F5F] font-mono">IMEI, BRAND, MODEL, TAC</code>
          </p>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ${
            dragActive ? 'border-[#14804A] bg-[#14804A]/5' : 'border-[#D8E0E8] bg-[#F4F7FA] hover:bg-[#EAEFF5]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-white border border-[#D8E0E8] flex items-center justify-center text-[#173F5F] shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#172B4D]">
              {selectedFile ? selectedFile.name : 'Choose a CSV file or drag and drop here'}
            </p>
            <p className="text-xs text-[#748597] mt-0.5">
              {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB · Ready to process` : 'Supported format: .csv (UTF-8 encoded)'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#D8E0E8]">
          <div className="text-xs text-[#748597]">
            {selectedFile ? 'File verified. Click Process Batch to commit.' : 'No file selected yet.'}
          </div>
          <div className="flex items-center gap-2">
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
            <Button
              variant="primary"
              size="md"
              disabled={!selectedFile || isProcessing}
              isLoading={isProcessing}
              onClick={handleStartUpload}
            >
              Process Batch & Commit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
