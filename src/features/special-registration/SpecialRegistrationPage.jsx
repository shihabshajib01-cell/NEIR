import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { MobileRecordCard } from '../../components/tables/MobileRecordCard.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { StatusBadge } from '../../components/data-display/StatusBadge.jsx';
import { SpecialRegistrationReviewModal } from './SpecialRegistrationReviewModal.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Eye, Download, Calendar } from 'lucide-react';

const DEFAULT_PAGE_SIZE = 10;

export const SpecialRegistrationPage = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('2026-03-01');
  const [toDate, setToDate] = useState('2026-03-24');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const { addToast } = useToast();

  const statusTabs = [
    { id: 'All', label: 'All Applications', count: 7 },
    { id: 'Pending', label: 'Pending Review', count: 3 },
    { id: 'In Progress', label: 'In Progress', count: 1 },
    { id: 'Accepted', label: 'Accepted', count: 2 },
    { id: 'Rejected', label: 'Rejected', count: 1 },
  ];

  const loadRegistrations = async () => {
    try {
      setIsLoading(true);
      const res = await mockApi.getSpecialRegistrations({
        status: statusFilter,
        search: searchTerm,
        page,
        pageSize,
      });
      setData(res.items);
      setTotal(res.total);
    } catch (err) {
      addToast('Failed to load special registrations.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, [statusFilter, searchTerm, page, pageSize]);

  const handleOpenReview = (item) => {
    setSelectedItem(item);
    setIsReviewOpen(true);
  };

  const handleStatusUpdated = (id, newStatus) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const columns = [
    { key: 'sl', title: 'SL', width: '48px', maxWidth: '48px', isMono: true, sortable: false },
    {
      key: 'imei',
      title: 'IMEI Number',
      minWidth: '250px',
      isMono: true,
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-mono font-semibold text-[#202338]">{val}</span>
          <span className="text-[11px] text-[#626981] truncate">{row.brand} {row.model}</span>
        </div>
      ),
    },
    {
      key: 'category',
      title: 'Device Category',
      minWidth: '210px',
      render: (val) => <span className="text-xs text-[#202338]">{val}</span>,
    },
    {
      key: 'requesterName',
      title: 'Requester / NID',
      minWidth: '230px',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#202338]">{val}</span>
          <span className="text-[11px] text-[#7A8197] font-mono">{row.requesterNid}</span>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      width: '130px',
      minWidth: '130px',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'date',
      title: 'Date',
      width: '170px',
      minWidth: '170px',
      isMono: true,
      render: (val) => <span className="text-xs text-[#626981] font-mono">{val}</span>,
    },
    {
      key: 'actions',
      title: 'Action',
      width: '132px',
      minWidth: '132px',
      sortable: false,
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={() => handleOpenReview(row)}
          className="text-xs h-7.5 px-2.5"
        >
          View details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <PageHeader
        title="Special Registration"
        description="Review and evaluate individual import quotas, overseas gifts, and testing sample whitelist requests."
        breadcrumbs={[
          { label: 'Special Registration' }
        ]}
        actions={
          <Button
            variant="secondary"
            size="md"
            icon={Download}
            onClick={() => addToast('Exporting Special Registration CSV batch...', 'info')}
          >
            Export List
          </Button>
        }
      />

      <TablePageWorkspace
        title="All Applications"
        count={total}
        tabs={statusTabs}
        activeTab={statusFilter}
        onTabChange={(id) => {
          setStatusFilter(id);
          setPage(1);
          setPageSize(DEFAULT_PAGE_SIZE);
        }}
        showSummary
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Search by IMEI, Requester name, or NID..."
                  searchValue={searchTerm}
                  searchSuggestions={data.flatMap((item) => [item.imei, item.requesterName, item.requesterNid])}
                  onSearchChange={setSearchTerm}
                  onReset={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                    setPage(1);
                    setPageSize(DEFAULT_PAGE_SIZE);
                  }}
                  filters={
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:flex h-10 items-center gap-2 bg-white border border-[var(--color-border)] rounded-lg px-3 type-control text-[var(--color-text-secondary)]">
                        <Calendar className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                        <input
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="bg-transparent text-[var(--color-text-primary)] outline-none cursor-pointer"
                          aria-label="From date"
                        />
                        <span className="text-[var(--color-text-muted)]">to</span>
                        <input
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="bg-transparent text-[var(--color-text-primary)] outline-none cursor-pointer"
                          aria-label="To date"
                        />
                      </div>
                    </div>
                  }
                />
        }
      >
        <DataTable embedded
                columns={columns}
                data={data}
                isLoading={isLoading}
                pagination
                currentPage={page}
                totalPages={Math.ceil(total / pageSize) || 1}
                totalItems={total}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
                renderMobileCard={(row) => (
                  <MobileRecordCard
                    title={row.imei}
                    subtitle={`${row.brand} ${row.model}`}
                    status={row.status}
                    fields={[
                      { label: 'Requester', value: row.requesterName },
                      { label: 'Category', value: row.category },
                      { label: 'Date', value: row.date, isMono: true },
                      { label: 'Challan No', value: row.customsChallanNo, isMono: true },
                    ]}
                    actions={
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Eye}
                        onClick={() => handleOpenReview(row)}
                        className="w-full justify-center"
                      >
                        View details & Review
                      </Button>
                    }
                  />
                )}
              />
      </TablePageWorkspace>

      {/* Large Review Workspace Modal */}
      {selectedItem && (
        <SpecialRegistrationReviewModal
          isOpen={isReviewOpen}
          onClose={() => {
            setIsReviewOpen(false);
            setSelectedItem(null);
          }}
          registration={selectedItem}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
};
