import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Filter, RotateCcw, Download } from 'lucide-react';
import { Button } from '../forms/Button.jsx';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className = '',
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`px-4 py-3 border-t border-[#E2E5F0] bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${className}`}>
      {/* Records count & page size */}
      <div className="flex items-center gap-3 text-xs text-[#626981]">
        <span>
          Showing <span className="font-semibold text-[#202338] font-mono tabular-nums">{startItem}</span> to{' '}
          <span className="font-semibold text-[#202338] font-mono tabular-nums">{endItem}</span> of{' '}
          <span className="font-semibold text-[#202338] font-mono tabular-nums">{totalItems}</span> records
        </span>
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-[#E2E5F0] pl-3">
            <span className="text-[#7A8197]">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-7 px-2 text-xs bg-[#F7F8FC] border border-[#E2E5F0] rounded-lg text-[#202338] font-mono outline-hidden cursor-pointer"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 self-end sm:self-center">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(1)}
          className="p-1.5 rounded text-[#626981] hover:bg-[#F7F8FC] hover:text-[#202338] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded text-[#626981] hover:bg-[#F7F8FC] hover:text-[#202338] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs px-2.5 font-medium text-[#202338] font-mono tabular-nums">
          Page {currentPage} of {Math.max(1, totalPages)}
        </span>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded text-[#626981] hover:bg-[#F7F8FC] hover:text-[#202338] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(totalPages)}
          className="p-1.5 rounded text-[#626981] hover:bg-[#F7F8FC] hover:text-[#202338] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const FilterBar = ({
  searchPlaceholder = 'Search records...',
  searchValue = '',
  onSearchChange,
  filters = null, // ReactNode with custom filter selects
  onReset,
  onExport,
  className = '',
}) => {
  return (
    <div className={`p-3 bg-white border border-[#E2E5F0] rounded-t-2xl border-b-0 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 ${className}`}>
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {onSearchChange && (
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8197]" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-8.5 pl-9 pr-3 text-xs bg-[#F7F8FC] border border-[#E2E5F0] rounded-lg text-[#202338] placeholder:text-[#7A8197] outline-hidden focus:bg-white focus:border-[#01ADC1] focus:ring-1 focus:ring-[#01ADC1]"
            />
          </div>
        )}
        {filters}
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
        {onReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            icon={RotateCcw}
            className="text-xs h-8.5"
          >
            Reset
          </Button>
        )}
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            icon={Download}
            className="text-xs h-8.5"
          >
            Export
          </Button>
        )}
      </div>
    </div>
  );
};
