import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Search, Download, X } from 'lucide-react';
import { Button } from '../forms/Button.jsx';
import { TextInput } from '../forms/TextInput.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

const normalizeSearchSuggestion = (suggestion) => {
  if (suggestion === null || suggestion === undefined) return null;

  if (typeof suggestion === 'string' || typeof suggestion === 'number') {
    const value = String(suggestion).trim();
    return value ? { value, label: value } : null;
  }

  if (typeof suggestion === 'object') {
    const rawValue = suggestion.value ?? suggestion.label;
    if (rawValue === null || rawValue === undefined) return null;
    const value = String(rawValue).trim();
    if (!value) return null;

    return {
      ...suggestion,
      value,
      label: String(suggestion.label ?? value),
    };
  }

  return null;
};

export const FilterBar = ({
  searchPlaceholder = 'Search records...',
  searchValue = '',
  onSearchChange,
  searchSuggestions = [],
  maxSearchSuggestions = 10,
  filters = null,
  onExport,
  embedded = false,
  mobileInline = false,
  className = '',
}) => {
  const { t } = usePreferences();
  const searchContainerRef = useRef(null);
  const searchListId = useId();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const filteredSearchSuggestions = useMemo(() => {
    const query = String(searchValue ?? '').trim().toLowerCase();
    if (!query) return [];

    const seen = new Set();

    return searchSuggestions
      .map(normalizeSearchSuggestion)
      .filter(Boolean)
      .filter((suggestion) => {
        const key = suggestion.value.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return suggestion.label.toLowerCase().includes(query) || key.includes(query);
      })
      .slice(0, maxSearchSuggestions);
  }, [searchSuggestions, searchValue, maxSearchSuggestions]);

  useEffect(() => {
    setActiveSuggestionIndex(-1);
  }, [searchValue]);

  useEffect(() => {
    if (!isSearchOpen) return undefined;

    const handlePointerDown = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setActiveSuggestionIndex(-1);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isSearchOpen]);

  const showSuggestions =
    Boolean(onSearchChange) &&
    isSearchOpen &&
    Boolean(String(searchValue ?? '').trim()) &&
    filteredSearchSuggestions.length > 0;

  const selectSuggestion = (suggestion) => {
    onSearchChange?.(suggestion.value);
    setIsSearchOpen(false);
    setActiveSuggestionIndex(-1);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsSearchOpen(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    if (!filteredSearchSuggestions.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsSearchOpen(true);
      setActiveSuggestionIndex((current) =>
        current < filteredSearchSuggestions.length - 1 ? current + 1 : 0
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsSearchOpen(true);
      setActiveSuggestionIndex((current) =>
        current > 0 ? current - 1 : filteredSearchSuggestions.length - 1
      );
      return;
    }

    if (event.key === 'Enter' && activeSuggestionIndex >= 0) {
      event.preventDefault();
      selectSuggestion(filteredSearchSuggestions[activeSuggestionIndex]);
    }
  };

  const handleClearSearch = () => {
    onSearchChange?.('');
    setIsSearchOpen(false);
    setActiveSuggestionIndex(-1);
  };

  return (
    <div className={(embedded
      ? 'bg-transparent flex flex-col lg:flex-row lg:items-center lg:justify-end gap-2 w-full '
      : 'p-3 bg-white border border-[var(--color-border)] rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 ') + className}
    >
      <div className={embedded
        ? (mobileInline
          ? 'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 w-full lg:flex lg:flex-1 lg:w-auto lg:flex-wrap lg:justify-end'
          : 'flex flex-1 lg:flex-none flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-end gap-2')
        : 'flex flex-1 flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2'}
      >
        {onSearchChange && (
          <div
            ref={searchContainerRef}
            className="relative min-w-0 sm:min-w-[280px] xl:min-w-[320px] flex-1 max-w-2xl"
          >
            <TextInput
              type="search"
              value={searchValue}
              onChange={(event) => {
                onSearchChange(event.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={(event) => {
                if (!searchContainerRef.current?.contains(event.relatedTarget)) {
                  setIsSearchOpen(false);
                  setActiveSuggestionIndex(-1);
                }
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder={searchPlaceholder}
              icon={Search}
              density="compact"
              autoComplete="off"
              aria-label={t(searchPlaceholder)}
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
              aria-controls={showSuggestions ? searchListId : undefined}
              endAdornment={String(searchValue ?? '') ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-subtle)] transition-colors"
                  aria-label={t('Clear search')}
                  title={t('Clear search')}
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            />

            {showSuggestions && (
              <div
                id={searchListId}
                role="listbox"
                aria-label={t('Search suggestions')}
                className="mobile-bottom-sheet fixed inset-x-0 bottom-0 top-auto mt-0 max-h-[70dvh] overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border)] border-x-0 border-b-0 rounded-t-[20px] rounded-b-none shadow-[var(--shadow-overlay)] z-[70] p-1.5 sm:absolute sm:left-0 sm:right-0 sm:top-full sm:bottom-auto sm:mt-1 sm:max-h-80 sm:border sm:rounded-xl sm:z-40"
              >
                {filteredSearchSuggestions.map((suggestion, index) => {
                  const active = index === activeSuggestionIndex;

                  return (
                    <button
                      key={suggestion.value + '-' + index}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onMouseEnter={() => setActiveSuggestionIndex(index)}
                      onClick={() => selectSuggestion(suggestion)}
                      className={'w-full min-h-10 px-3 py-2 rounded-lg flex items-center gap-2.5 text-left type-control transition-colors ' +
                        (active
                          ? 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]'
                          : 'text-[var(--color-text-primary)] hover:bg-[var(--color-background-subtle)]')}
                    >
                      <Search className="w-4 h-4 shrink-0 text-[var(--color-text-muted)]" />
                      <p className="truncate">{suggestion.label}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {filters}
      </div>

      {onExport && (
        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
          <Button variant="outline" size="sm" onClick={onExport} icon={Download}>Export</Button>
        </div>
      )}
    </div>
  );
};
