import React, { useMemo, useState } from 'react';
import {
  Checkbox as MuiCheckbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination as MuiTablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { TableSkeleton, EmptyState, ErrorState } from '../feedback/FeedbackStates.jsx';
import { StatusBadge } from '../data-display/StatusBadge.jsx';
import { SafeText } from '../data-display/SafeText.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const MobileRecordCard = ({ title, subtitle, status, fields = [], actions, className = '' }) => {
  const { t } = usePreferences();

  return (
    <article className={'p-4 bg-white border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-sm)] flex flex-col gap-3 ' + className}>
      <div className="flex items-start justify-between gap-2 pb-3 border-b border-[var(--color-border-subtle)]">
        <div className="min-w-0">
          <h4 className="type-body-strong text-[var(--color-text-primary)] break-words">{title}</h4>
          {subtitle && <p className="type-meta text-[var(--color-text-secondary)] mt-1 break-words">{subtitle}</p>}
        </div>
        {status && <StatusBadge status={status} size="sm" />}
      </div>

      <dl className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
        {fields.map((field, index) => (
          <div key={field.label || index} className="min-w-0">
            <dt className="type-badge text-[var(--color-text-muted)]">{t(field.label)}</dt>
            <dd className={'mt-0.5 type-table-cell font-medium text-[var(--color-text-primary)] break-words ' + (field.isMono ? 'font-mono tabular-nums' : '')}>
              {field.value || '—'}
            </dd>
          </div>
        ))}
      </dl>

      {actions && <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-end gap-2">{actions}</div>}
    </article>
  );
};

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
  pageSizeOptions = [5, 10, 25, 50],
  onPageChange,
  onPageSizeChange,
  renderMobileCard,
  onRowClick,
  embedded = false,
  stickyHeader = true,
  maxHeight = 'min(62vh, 640px)',
  className = '',
}) => {
  const { t, textSize } = usePreferences();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const dense = textSize === 'compact';

  const handleSort = (key) => {
    setSortConfig((previous) => previous.key === key
      ? { key, direction: previous.direction === 'asc' ? 'desc' : 'asc' }
      : { key, direction: 'asc' });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const av = a?.[sortConfig.key];
      const bv = b?.[sortConfig.key];

      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;

      const comparison = String(av).localeCompare(String(bv), undefined, {
        numeric: true,
        sensitivity: 'base',
      });

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const pageKeys = data.map((item) => item[keyField]);
  const selectedOnPage = pageKeys.filter((key) => selectedKeys.includes(key));
  const allSelected = pageKeys.length > 0 && selectedOnPage.length === pageKeys.length;
  const partiallySelected = selectedOnPage.length > 0 && !allSelected;

  const handleSelectAll = (event) => {
    if (!onSelectChange) return;

    if (event.target.checked) {
      onSelectChange([...new Set([...selectedKeys, ...pageKeys])]);
      return;
    }

    onSelectChange(selectedKeys.filter((key) => !pageKeys.includes(key)));
  };

  const handleSelectRow = (key) => {
    if (!onSelectChange) return;
    onSelectChange(
      selectedKeys.includes(key)
        ? selectedKeys.filter((item) => item !== key)
        : [...selectedKeys, key]
    );
  };

  const desktopVisibleClass = renderMobileCard ? 'hidden lg:block' : 'block';
  const wrapperClass = embedded
    ? 'bg-white overflow-hidden flex flex-col'
    : 'bg-white border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-sm)] overflow-hidden flex flex-col';

  return (
    <div className={wrapperClass + ' ' + className}>
      {isLoading && <TableSkeleton rows={pageSize || 5} cols={columns.length} />}
      {!isLoading && isError && <ErrorState message={errorMessage} onRetry={onRetry} />}
      {!isLoading && !isError && data.length === 0 && <EmptyState title={emptyTitle} description={emptyDescription} />}

      {!isLoading && !isError && data.length > 0 && (
        <>
          {renderMobileCard && (
            <div className="lg:hidden p-3 space-y-3 bg-[var(--color-background)]">
              {sortedData.map((row, index) => (
                <div key={row[keyField] || index}>{renderMobileCard(row, index)}</div>
              ))}
            </div>
          )}

          <div className={desktopVisibleClass}>
            <TableContainer
              component={Paper}
              elevation={0}
              square
              sx={{
                maxHeight: stickyHeader ? maxHeight : 'none',
                overflowX: 'auto',
                borderRadius: 0,
              }}
            >
              <Table
                stickyHeader={stickyHeader}
                size={dense ? 'small' : 'medium'}
                sx={{
                  minWidth: 720,
                  tableLayout: 'auto',
                  '& .MuiTableCell-root': {
                    whiteSpace: 'nowrap',
                  },
                  '& .MuiTableBody-root .MuiTableRow-root': {
                    height: dense ? 44 : 52,
                  },
                }}
                aria-label={t('Records table')}
              >
                <TableHead>
                  <TableRow>
                    {selectable && (
                      <TableCell padding="checkbox" align="center">
                        <MuiCheckbox
                          size="small"
                          checked={allSelected}
                          indeterminate={partiallySelected}
                          onChange={handleSelectAll}
                          inputProps={{ 'aria-label': t('Select all records') }}
                        />
                      </TableCell>
                    )}

                    {columns.map((column) => {
                      const activeSort = sortConfig.key === column.key;
                      const sortable = column.sortable !== false && column.key !== 'actions';
                      return (
                        <TableCell
                          key={column.key}
                          sortDirection={activeSort ? sortConfig.direction : false}
                          align={column.align || 'left'}
                          sx={{
                            width: column.width,
                            minWidth: column.minWidth ?? column.width,
                            ...(column.maxWidth ? { maxWidth: column.maxWidth } : {}),
                            ...(column.width ? { flexShrink: 0 } : {}),
                          }}
                        >
                          {sortable ? (
                            <TableSortLabel
                              active={activeSort}
                              direction={activeSort ? sortConfig.direction : 'asc'}
                              onClick={() => handleSort(column.key)}
                            >
                              {t(column.title)}
                            </TableSortLabel>
                          ) : (
                            t(column.title)
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {sortedData.map((row, index) => {
                    const key = row[keyField] ?? index;
                    const selected = selectedKeys.includes(key);

                    return (
                      <TableRow
                        hover
                        key={key}
                        selected={selected}
                        onClick={() => onRowClick?.(row)}
                        sx={{
                          cursor: onRowClick ? 'pointer' : 'default',
                          '&:last-child td, &:last-child th': { borderBottom: 0 },
                        }}
                      >
                        {selectable && (
                          <TableCell
                            padding="checkbox"
                            align="center"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <MuiCheckbox
                              size="small"
                              checked={selected}
                              onChange={() => handleSelectRow(key)}
                              inputProps={{ 'aria-label': t('Select record') }}
                            />
                          </TableCell>
                        )}

                        {columns.map((column) => {
                          const cellValue = row[column.key];
                          return (
                            <TableCell
                              key={column.key}
                              align={column.align || 'left'}
                              sx={{
                                width: column.width,
                                minWidth: column.minWidth ?? column.width,
                                ...(column.maxWidth ? { maxWidth: column.maxWidth } : {}),
                              }}
                              className={column.isMono ? 'font-mono tabular-nums' : ''}
                            >
                              {column.render
                                ? column.render(cellValue, row, index)
                                : <SafeText value={cellValue} mode={column.truncate || 'normal'} />}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}

      {!isLoading && !isError && pagination && totalItems > 0 && (
        <MuiTablePagination
          component="div"
          count={totalItems}
          page={Math.max(0, currentPage - 1)}
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
            flexShrink: 0,
            '& .MuiTablePagination-toolbar': {
              justifyContent: 'flex-end',
              gap: '10px',
              paddingLeft: '16px',
              paddingRight: '12px',
            },
            '& .MuiTablePagination-spacer': {
              display: 'none',
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              whiteSpace: 'nowrap',
            },
          }}
        />
      )}
    </div>
  );
};
