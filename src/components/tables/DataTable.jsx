import React, { useState } from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown, Check, Eye } from 'lucide-react';
import { TableSkeleton, EmptyState, ErrorState } from '../feedback/FeedbackStates.jsx';
import { Pagination } from './Pagination.jsx';
import { Button } from '../forms/Button.jsx';
import { StatusBadge } from '../data-display/StatusBadge.jsx';

export const MobileRecordCard = ({
  title,
  subtitle,
  status,
  fields = [], // [{ label, value, isMono }]
  actions,
  className = '',
}) => {
  return (
    <div className={`p-4 bg-white border border-[#D8E0E8] rounded-lg shadow-xs flex flex-col gap-3 ${className}`}>
      <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#F4F7FA]">
        <div>
          <h4 className="text-sm font-semibold text-[#172B4D] leading-tight">{title}</h4>
          {subtitle && <p className="text-xs text-[#52677A] mt-0.5">{subtitle}</p>}
        </div>
        {status && <StatusBadge status={status} size="sm" />}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {fields.map((field, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-[11px] text-[#748597]">{field.label}</span>
            <span className={`font-medium text-[#172B4D] truncate ${field.isMono ? 'font-mono tabular-nums' : ''}`}>
              {field.value || '—'}
            </span>
          </div>
        ))}
      </div>

      {actions && (
        <div className="pt-2 border-t border-[#F4F7FA] flex items-center justify-end gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export const DataTable = ({
  columns = [], // [{ key, title, render, width, sortable, isMono }]
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
  // Pagination
  pagination = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  // Responsive transform
  renderMobileCard,
  className = '',
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSelectAll = (e) => {
    if (!onSelectChange) return;
    if (e.target.checked) {
      onSelectChange(data.map((item) => item[keyField]));
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectRow = (key) => {
    if (!onSelectChange) return;
    if (selectedKeys.includes(key)) {
      onSelectChange(selectedKeys.filter((k) => k !== key));
    } else {
      onSelectChange([...selectedKeys, key]);
    }
  };

  const allSelected = data.length > 0 && selectedKeys.length === data.length;

  return (
    <div className={`bg-white border border-[#D8E0E8] rounded-lg shadow-xs overflow-hidden flex flex-col ${className}`}>
      {/* Loading state */}
      {isLoading && <TableSkeleton rows={pageSize || 5} cols={columns.length} />}

      {/* Error state */}
      {!isLoading && isError && (
        <ErrorState message={errorMessage} onRetry={onRetry} />
      )}

      {/* Empty state */}
      {!isLoading && !isError && data.length === 0 && (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}

      {/* Desktop Table View */}
      {!isLoading && !isError && data.length > 0 && (
        <>
          {/* Mobile Card fallback if provided */}
          {renderMobileCard && (
            <div className="md:hidden divide-y divide-[#D8E0E8] p-3 space-y-3">
              {data.map((row, idx) => (
                <div key={row[keyField] || idx}>
                  {renderMobileCard(row, idx)}
                </div>
              ))}
            </div>
          )}

          {/* Regular Table (always visible on desktop, hidden on mobile if mobile card used) */}
          <div className={`overflow-x-auto w-full ${renderMobileCard ? 'hidden md:block' : 'block'}`}>
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#102A43] text-white border-b border-[#102A43] text-xs uppercase tracking-wider font-semibold select-none">
                <tr>
                  {selectable && (
                    <th className="w-10 px-3.5 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        className="rounded border-[#D8E0E8] text-[#14804A] focus:ring-[#14804A] cursor-pointer"
                      />
                    </th>
                  )}
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      style={{ width: col.width }}
                      className={`px-3.5 py-3 font-semibold text-slate-200 ${
                        col.sortable ? 'cursor-pointer hover:text-white transition-colors' : ''
                      }`}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.title}</span>
                        {col.sortable && (
                          <span className="text-slate-400">
                            {sortConfig.key === col.key ? (
                              sortConfig.direction === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 opacity-50" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8E0E8] bg-white text-[#172B4D]">
                {data.map((row, index) => {
                  const isSelected = selectedKeys.includes(row[keyField]);
                  return (
                    <tr
                      key={row[keyField] || index}
                      className={`hover:bg-[#F4F7FA] transition-colors ${
                        isSelected ? 'bg-[#14804A]/5' : index % 2 === 1 ? 'bg-[#FAFCFE]' : 'bg-white'
                      }`}
                    >
                      {selectable && (
                        <td className="px-3.5 py-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(row[keyField])}
                            className="rounded border-[#D8E0E8] text-[#14804A] focus:ring-[#14804A] cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map((col) => {
                        const cellValue = row[col.key];
                        return (
                          <td
                            key={col.key}
                            className={`px-3.5 py-2.5 text-xs text-[#172B4D] align-middle ${
                              col.isMono ? 'font-mono tabular-nums' : ''
                            }`}
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

      {/* Pagination Footer */}
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
