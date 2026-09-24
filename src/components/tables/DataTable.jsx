import React, { useMemo, useState } from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { TableSkeleton, EmptyState, ErrorState } from '../feedback/FeedbackStates.jsx';
import { Pagination } from './Pagination.jsx';
import { StatusBadge } from '../data-display/StatusBadge.jsx';
import { SafeText } from '../data-display/SafeText.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';
import { Checkbox as AppCheckbox } from '../forms/Checkbox.jsx';

export const MobileRecordCard = ({ title, subtitle, status, fields = [], actions, className = '' }) => {
  const { t } = usePreferences();
  return (
    <article className={'p-4 bg-white border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-sm)] flex flex-col gap-3 ' + className}>
      <div className="flex items-start justify-between gap-2 pb-3 border-b border-[var(--color-border-subtle)]">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight break-words">{title}</h4>
          {subtitle && <p className="text-xs text-[var(--color-text-secondary)] mt-1 break-words">{subtitle}</p>}
        </div>
        {status && <StatusBadge status={status} size="sm" />}
      </div>
      <dl className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
        {fields.map((field, index) => (
          <div key={field.label || index} className="min-w-0">
            <dt className="text-[11px] text-[var(--color-text-muted)]">{t(field.label)}</dt>
            <dd className={'mt-0.5 text-sm font-medium text-[var(--color-text-primary)] break-words ' + (field.isMono ? 'font-mono tabular-nums' : '')}>{field.value || '—'}</dd>
          </div>
        ))}
      </dl>
      {actions && <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-end gap-2">{actions}</div>}
    </article>
  );
};

export const DataTable = ({
  columns = [], data = [], keyField = 'id', isLoading = false, isError = false, errorMessage, onRetry,
  emptyTitle = 'No records found', emptyDescription = 'There are no records matching your current filter criteria.',
  selectable = false, selectedKeys = [], onSelectChange, pagination = false, currentPage = 1, totalPages = 1,
  totalItems = 0, pageSize = 10, onPageChange, onPageSizeChange, renderMobileCard, onRowClick, embedded = false, className = '',
}) => {
  const { t } = usePreferences();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => setSortConfig((previous) => previous.key === key
    ? { key, direction: previous.direction === 'asc' ? 'desc' : 'asc' }
    : { key, direction: 'asc' });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const av = a?.[sortConfig.key];
      const bv = b?.[sortConfig.key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const comparison = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' });
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const handleSelectAll = (event) => onSelectChange?.(event.target.checked ? data.map((item) => item[keyField]) : []);
  const handleSelectRow = (key) => onSelectChange?.(selectedKeys.includes(key) ? selectedKeys.filter((item) => item !== key) : [...selectedKeys, key]);
  const allSelected = data.length > 0 && selectedKeys.length === data.length;

  return (
    <div className={(embedded ? 'bg-white overflow-hidden flex flex-col ' : 'bg-white border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-sm)] overflow-hidden flex flex-col ') + className}>
      {isLoading && <TableSkeleton rows={pageSize || 5} cols={columns.length} />}
      {!isLoading && isError && <ErrorState message={errorMessage} onRetry={onRetry} />}
      {!isLoading && !isError && data.length === 0 && <EmptyState title={emptyTitle} description={emptyDescription} />}

      {!isLoading && !isError && data.length > 0 && (
        <>
          {renderMobileCard && (
            <div className="lg:hidden p-3 space-y-3 bg-[var(--color-background)]">
              {sortedData.map((row, index) => <div key={row[keyField] || index}>{renderMobileCard(row, index)}</div>)}
            </div>
          )}

          <div className={'overflow-x-auto w-full ' + (renderMobileCard ? 'hidden lg:block' : 'block')}>
            <table className="w-full min-w-max text-left border-collapse">
              <thead className="bg-[var(--color-background-subtle)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-semibold select-none">
                <tr>
                  {selectable && (
                    <th className="w-10 px-3.5 py-3 text-center">
                      <AppCheckbox checked={allSelected} indeterminate={selectedKeys.length > 0 && selectedKeys.length < data.length} onChange={handleSelectAll} ariaLabel="Select all records" />
                    </th>
                  )}
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      style={{ width: column.width }}
                      className={'px-3.5 py-3 font-semibold whitespace-nowrap ' + (column.sortable ? 'cursor-pointer hover:text-[var(--color-primary-dark)] transition-colors' : '')}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{t(column.title)}</span>
                        {column.sortable && (
                          sortConfig.key === column.key
                            ? sortConfig.direction === 'asc'
                              ? <ChevronUp className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                              : <ChevronDown className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                            : <ArrowUpDown className="w-3 h-3 text-[var(--color-text-muted)] opacity-60" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)] bg-white text-[var(--color-text-primary)]">
                {sortedData.map((row, index) => {
                  const selected = selectedKeys.includes(row[keyField]);
                  return (
                    <tr
                      key={row[keyField] || index}
                      onClick={() => onRowClick?.(row)}
                      className={'transition-colors hover:bg-[rgba(1,173,193,0.045)] ' + (onRowClick ? 'cursor-pointer ' : '') + (selected ? 'bg-[var(--color-primary-light)]' : index % 2 === 1 ? 'bg-[rgba(32,35,56,0.012)]' : 'bg-white')}
                    >
                      {selectable && (
                        <td className="px-3.5 py-2.5 text-center" onClick={(event) => event.stopPropagation()}>
                          <AppCheckbox checked={selected} onChange={() => handleSelectRow(row[keyField])} ariaLabel="Select record" />
                        </td>
                      )}
                      {columns.map((column) => {
                        const cellValue = row[column.key];
                        return (
                          <td key={column.key} className={'px-3.5 py-2.5 text-sm align-middle ' + (column.isMono ? 'font-mono tabular-nums' : '')}>
                            {column.render ? column.render(cellValue, row, index) : <SafeText value={cellValue} mode={column.truncate || 'normal'} />}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!isLoading && !isError && pagination && totalItems > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
      )}
    </div>
  );
};
