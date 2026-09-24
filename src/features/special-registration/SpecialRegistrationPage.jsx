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
import { Eye, Download, Calendar, Filter } from 'lucide-react';

export const SpecialRegistrationPage = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('2026-03-01');
  const [toDate, setToDate] = useState('2026-03-24');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
    { key: 'sl', title: 'SL', width: '60px', isMono: true },
    {
      key: 'imei',
      title: 'IMEI Number',
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
      render: (val) => <span className="text-xs text-[#202338]">{val}</span>,
    },
    {
      key: 'requesterName',
      title: 'Requester / NID',
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
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'date',
      title: 'Date',
      isMono: true,
      render: (val) => <span className="text-xs text-[#626981] font-mono">{val}</span>,
    },
    {
      key: 'actions',
      title: 'Action',
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
            variant="outline"
            size="sm"
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
        }}
        showSummary
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Search by IMEI, Requester name, or NID..."
                  searchValue={searchTerm}
                  onSearchChange={setSearchTerm}
                  onReset={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                  }}
                  filters={
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:flex items-center gap-1.5 bg-[#F7F8FC] border border-[#E2E5F0] rounded-md px-2 py-1 text-xs text-[#626981]">
                        <Calendar className="w-3.5 h-3.5 text-[#7A8197]" />
                        <input
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="text-xs bg-transparent text-[#202338] outline-hidden cursor-pointer"
                        />
                        <span>to</span>
                        <input
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="text-xs bg-transparent text-[#202338] outline-hidden cursor-pointer"
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
                onPageSizeChange={setPageSize}
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
