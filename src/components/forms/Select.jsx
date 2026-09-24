import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, AlertCircle } from 'lucide-react';

export const Select = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [], // [{ value: '', label: '' }] or strings
  placeholder = 'Select option',
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const selectId = id || name || Math.random().toString(36).substring(2, 9);

  const normalizedOptions = options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[#172B4D]">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full h-9 pl-3 pr-8 rounded-md bg-white border text-sm text-[#172B4D] transition-all appearance-none cursor-pointer outline-hidden
            ${error ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[#D8E0E8] focus:border-[#147D83] focus:ring-2 focus:ring-[#147D83]/20'}
            ${disabled ? 'bg-[#F4F7FA] text-[#748597] cursor-not-allowed' : ''}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {normalizedOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#748597]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
      {helperText && !error && <p className="text-xs text-[#748597] mt-0.5">{helperText}</p>}
    </div>
  );
};

export const SearchableSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select or search...',
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  const normalizedOptions = options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

  const filteredOptions = normalizedOptions.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={`flex flex-col gap-1.5 relative ${className}`}>
      {label && (
        <label className="text-sm font-medium text-[#172B4D]">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-9 px-3 rounded-md bg-white border text-sm text-left flex items-center justify-between transition-all outline-hidden
          ${error ? 'border-red-500' : 'border-[#D8E0E8] focus:border-[#147D83] focus:ring-2 focus:ring-[#147D83]/20'}
          ${disabled ? 'bg-[#F4F7FA] text-[#748597] cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={selectedOption ? 'text-[#172B4D]' : 'text-[#748597]'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-[#748597] shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#D8E0E8] rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-[#D8E0E8] bg-[#F4F7FA]">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-[#748597]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full h-7 pl-7 pr-2 text-xs bg-white border border-[#D8E0E8] rounded outline-hidden focus:border-[#147D83]"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-48 p-1">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-xs text-[#748597] text-center">No options found</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full px-2.5 py-1.5 text-left text-xs rounded flex items-center justify-between hover:bg-[#F4F7FA] cursor-pointer ${
                    opt.value === value ? 'bg-[#10683D]/10 text-[#10683D] font-medium' : 'text-[#172B4D]'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {opt.value === value && <Check className="w-3.5 h-3.5 text-[#10683D] shrink-0 ml-2" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#748597] mt-0.5">{helperText}</p>}
    </div>
  );
};
