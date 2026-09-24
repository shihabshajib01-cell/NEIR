import React, { useMemo, useState } from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { TableSkeleton, EmptyState, ErrorState } from '../feedback/FeedbackStates.jsx';
import { Pagination } from './Pagination.jsx';
import { StatusBadge } from '../data-display/StatusBadge.jsx';

export const MobileRecordCard = ({
  title,
  subtitle,
  status,
  fields = [],
  actions,
  className = '',
}) => (
  <div className={'p-4 bg-white border border-[#E2E5F0] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-3 ' + className}>
    <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#E2E5F0]/70">
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-[#202338] leading-tight">{title}</h4>
        {subtitle && <p className="text-xs text-[#626981] mt-1">{subtitle}</p>}
      </div>
      {status && <StatusBadge status={status} size="sm" />}
    </div>

    <div className="grid grid-cols-2 gap-3 text-xs">
      {fields.map((field, idx) => (
        <div key={idx} className="flex flex-col min-w-0">
          <span className="text-[11px] text-[#7A8197]">{field.label}</span>
          <span className={'font-medium text-[#202338] truncate ' + (field.isMono ? 'font-mono tabular-nums' : '')}>
            {field.value || '—'}
          </span>
        </div>
      ))}
    </div>

    {actions && (
      <div className="pt-3 border-t border-[#E2E5F0]/70 flex items-center justify-end gap-2">
        {actions}
      </div>
    )}
  </div>
);

export const DataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no records matching your current filter criteria.',
  selectable = false,
  selectedKeys = [],
  onSelectChange,
  pagination = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  renderMobileCard,
  className = '',
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    setSortConfig((prev) => (
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    ));
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const av = a?.[sortConfig.key];
      const bv = b?.[sortConfig.key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' });
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });
  }, [data, sortConfig]);

  const handleSelectAll = (e) => {
    if (!onSelectChange) return;
    onSelectChange(e.target.checked ? data.map((item) => item[keyField]) : []);
  };

  const handleSelectRow = (key) => {
    if (!onSelectChange) return;
    onSelectChange(
      selectedKeys.includes(key)
        ? selectedKeys.filter((k) => k !== key)
        : [...selectedKeys, key]
    );
  };

  const allSelected = data.length > 0 && selectedKeys.length === data.length;

  return (
    <div className={'bg-white border border-[#E2E5F0] rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col ' + className}>
      {isLoading && <TableSkeleton rows={pageSize || 5} cols={columns.length} />}
      {!isLoading && isError && <ErrorState message={errorMessage} onRetry={onRetry} />}
      {!isLoading && !isError && data.length === 0 && <EmptyState title={emptyTitle} description={emptyDescription} />}

      {!isLoading && !isError && data.length > 0 && (
        <>
          {renderMobileCard && (
            <div className="md:hidden p-3 space-y-3 bg-[#F7F8FC]">
              {sortedData.map((row, idx) => (
                <div key={row[keyField] || idx}>{renderMobileCard(row, idx)}</div>
              ))}
            </div>
          )}

          <div className={'overflow-x-auto w-full ' + (renderMobileCard ? 'hidden md:block' : 'block')}>
            <table className="w-full min-w-max text-left border-collapse">
              <thead className="bg-[rgba(32,35,56,0.025)] border-b border-[#E2E5F0] text-[#626981] text-sm font-semibold select-none">
                <tr>
                  {selectable && (
                    <th className="w-10 px-3.5 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        className="rounded border-[#E2E5F0] text-[#01ADC1] focus:ring-[#01ADC1] cursor-pointer"
                      />
                    </th>
                  )}
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      style={{ width: col.width }}
                      className={'px-3.5 py-3 font-semibold whitespace-nowrap ' + (col.sortable ? 'cursor-pointer hover:text-[#01ADC1] transition-colors' : '')}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.title}</span>
                        {col.sortable && (
                          <span className="text-[#A0A6B8]">
                            {sortConfig.key === col.key ? (
                              sortConfig.direction === 'asc'
                                ? <ChevronUp className="w-3.5 h-3.5 text-[#01ADC1]" />
                                : <ChevronDown className="w-3.5 h-3.5 text-[#01ADC1]" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 opacity-60" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5F0]/70 bg-white text-[#202338]">
                {sortedData.map((row, index) => {
                  const isSelected = selectedKeys.includes(row[keyField]);
                  return (
                    <tr
                      key={row[keyField] || index}
                      className={
                        'transition-colors hover:bg-[rgba(1,173,193,0.045)] ' +
                        (isSelected ? 'bg-[#E1F7FB]' : index % 2 === 1 ? 'bg-[rgba(32,35,56,0.012)]' : 'bg-white')
                      }
                    >
                      {selectable && (
                        <td className="px-3.5 py-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(row[keyField])}
                            className="rounded border-[#E2E5F0] text-[#01ADC1] focus:ring-[#01ADC1] cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map((col) => {
                        const cellValue = row[col.key];
                        return (
                          <td
                            key={col.key}
                            className={'px-3.5 py-2.5 text-sm text-[#202338] align-middle whitespace-nowrap ' + (col.isMono ? 'font-mono tabular-nums' : '')}
                          >
                            {col.render ? col.render(cellValue, row, index) : cellValue ?? '—'}
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};
