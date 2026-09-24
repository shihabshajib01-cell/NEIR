import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, RotateCcw, Download } from 'lucide-react';
import { Button } from '../forms/Button.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const Pagination = ({
  currentPage = 1, totalPages = 1, totalItems = 0, pageSize = 10, onPageChange, onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100], className = '',
}) => {
  const { t } = usePreferences();
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const navButton = 'w-9 h-9 inline-flex items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)] disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed';

  return (
    <div className={'px-4 py-3 border-t border-[var(--color-border)] bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ' + className}>
      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-secondary)]">
        <span>
          {t('Showing')} <strong className="text-[var(--color-text-primary)] font-mono">{startItem}</strong> {t('to')} <strong className="text-[var(--color-text-primary)] font-mono">{endItem}</strong> {t('of')} <strong className="text-[var(--color-text-primary)] font-mono">{totalItems}</strong> {t('records')}
        </span>
        {onPageSizeChange && (
          <label className="flex items-center gap-1.5 sm:border-l border-[var(--color-border)] sm:pl-3">
            <span className="text-[var(--color-text-muted)]">{t('Rows per page:')}</span>
            <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))} className="min-h-9 px-2 text-base sm:text-sm bg-[var(--color-background-subtle)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] font-mono">
              {pageSizeOptions.map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-1 self-end sm:self-center">
        <button type="button" disabled={currentPage <= 1} onClick={() => onPageChange?.(1)} className={navButton} title={t('First Page')} aria-label={t('First Page')}><ChevronsLeft className="w-4 h-4" /></button>
        <button type="button" disabled={currentPage <= 1} onClick={() => onPageChange?.(currentPage - 1)} className={navButton} title={t('Previous Page')} aria-label={t('Previous Page')}><ChevronLeft className="w-4 h-4" /></button>
        <span className="text-xs px-2.5 font-medium text-[var(--color-text-primary)] font-mono tabular-nums whitespace-nowrap">{t('Page')} {currentPage} {t('of')} {Math.max(1, totalPages)}</span>
        <button type="button" disabled={currentPage >= totalPages} onClick={() => onPageChange?.(currentPage + 1)} className={navButton} title={t('Next Page')} aria-label={t('Next Page')}><ChevronRight className="w-4 h-4" /></button>
        <button type="button" disabled={currentPage >= totalPages} onClick={() => onPageChange?.(totalPages)} className={navButton} title={t('Last Page')} aria-label={t('Last Page')}><ChevronsRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

export const FilterBar = ({
  searchPlaceholder = 'Search records...', searchValue = '', onSearchChange, filters = null, onReset, onExport, className = '',
}) => {
  const { t } = usePreferences();

  return (
    <div className={'p-3 bg-white border border-[var(--color-border)] rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 ' + className}>
      <div className="flex flex-1 flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5">
        {onSearchChange && (
          <div className="relative min-w-0 sm:min-w-[240px] flex-1 max-w-lg">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t(searchPlaceholder)}
              className="w-full min-h-10 pl-9 pr-3 text-base bg-[var(--color-background-subtle)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(1,173,193,0.18)]"
            />
          </div>
        )}
        {filters}
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
        {onReset && <Button variant="ghost" size="sm" onClick={onReset} icon={RotateCcw}>Reset</Button>}
        {onExport && <Button variant="outline" size="sm" onClick={onExport} icon={Download}>Export</Button>}
      </div>
    </div>
  );
};
