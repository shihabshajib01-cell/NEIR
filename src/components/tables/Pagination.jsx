import React from 'react';
import {
  TablePagination as MuiTablePagination,
} from '@mui/material';
import { Search, RotateCcw, Download } from 'lucide-react';
import { Button } from '../forms/Button.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
  className = '',
}) => {
  const { t } = usePreferences();

  return (
    <div className={className}>
      <MuiTablePagination
        component="div"
        count={totalItems}
        page={Math.max(0, Math.min(currentPage - 1, Math.max(0, totalPages - 1)))}
        rowsPerPage={pageSize}
        rowsPerPageOptions={onPageSizeChange ? pageSizeOptions : []}
        onPageChange={(_, page) => onPageChange?.(page + 1)}
        onRowsPerPageChange={(event) => onPageSizeChange?.(Number(event.target.value))}
        labelRowsPerPage={t('Rows per page:')}
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} ${t('of')} ${count}`}
        showFirstButton={false}
        showLastButton={false}
        sx={{
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          '& .MuiTablePagination-toolbar': {
            justifyContent: 'flex-end',
            gap: '8px',
          },
          '& .MuiTablePagination-spacer': {
            display: 'none',
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            whiteSpace: 'nowrap',
          },
        }}
      />
    </div>
  );
};

export const FilterBar = ({
  searchPlaceholder = 'Search records...',
  searchValue = '',
  onSearchChange,
  filters = null,
  onReset,
  onExport,
  embedded = false,
  className = '',
}) => {
  const { t } = usePreferences();

  return (
    <div className={(embedded
      ? 'bg-transparent flex flex-col lg:flex-row lg:items-center lg:justify-end gap-2 w-full '
      : 'p-3 bg-white border border-[var(--color-border)] rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 ') + className}
    >
      <div className={embedded
        ? 'flex flex-1 lg:flex-none flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-end gap-2'
        : 'flex flex-1 flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2'}
      >
        {onSearchChange && (
          <div className="relative min-w-0 sm:min-w-[240px] flex-1 max-w-lg">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t(searchPlaceholder)}
              className="w-full h-10 pl-9 pr-3 type-control bg-white border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(1,173,193,0.12)]"
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
