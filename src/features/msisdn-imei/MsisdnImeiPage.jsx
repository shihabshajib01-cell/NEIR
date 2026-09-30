import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable, MobileRecordCard } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { RecordDetailsDrawer } from '../../components/overlays/Drawer.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { CompactSelect } from '../../components/forms/Select.jsx';
import { DateRangeFilter } from '../../components/forms/DateRangeFilter.jsx';
import { StatusBadge } from '../../components/data-display/StatusBadge.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Eye, Download, Radio } from 'lucide-react';

export const MsisdnImeiPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('MSISDN');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await mockApi.getMsisdnImeiList({
        search: searchTerm,
        searchBy,
        fromDate,
        toDate,
      });
      setData(res.items);
    } catch (err) {
      addToast('Failed to load MSISDN-IMEI records.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, searchBy, fromDate, toDate]);

  const handleOpenDetails = (record) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  const columns = [
    { key: 'sl', title: 'SL', width: '60px', isMono: true },
    {
      key: 'imei',
      title: 'IMEI',
      isMono: true,
      render: (val, row) => (
        <div className="flex flex-col">
          <p className="font-mono font-semibold text-[var(--color-primary-dark)]">{val}</p>
          <p className="type-meta text-[var(--color-text-muted)]">{row.deviceModel}</p>
        </div>
      ),
    },
    {
      key: 'msisdn',
      title: 'MSISDN',
      isMono: true,
      render: (val) => <p className="font-mono font-semibold text-[var(--color-text-primary)]">{val}</p>,
    },
    {
      key: 'operator',
      title: 'Operator',
      render: (val) => (
        <div className="inline-flex items-center gap-1.5 type-meta font-semibold text-[var(--color-text-primary)]">
          <Radio className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <p>{val}</p>
        </div>
      ),
    },
    {
      key: 'lastRegistrationDate',
      title: 'Last Registration Date',
      isMono: true,
      render: (val) => <p className="type-meta text-[var(--color-text-secondary)] font-mono">{val}</p>,
    },
    {
      key: 'status',
      title: 'Status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'actions',
      title: 'Action',
      width: '100px',
      sortable: false,
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={() => handleOpenDetails(row)}
          className="type-meta h-7 px-2"
        >
          Inspect
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="MSISDN IMEI List"
        breadcrumbs={[{ label: 'MSISDN IMEI' }]}
        actions={
          <Button
            variant="outline"
            size="md"
            icon={Download}
            onClick={() => addToast('Exporting cellular binding extract...', 'info')}
          >
            Export Log
          </Button>
        }
      />

      <TablePageWorkspace
        title="MSISDN IMEI List"
        count={data.length}
        toolbar={
          <FilterBar
            embedded
            searchPlaceholder={searchBy === 'MSISDN' ? 'Search by MSISDN...' : 'Search by IMEI...'}
            searchValue={searchTerm}
            searchSuggestions={data.flatMap((item) => [item.msisdn, item.imei, item.deviceModel])}
            onSearchChange={setSearchTerm}
            onReset={() => {
              setSearchTerm('');
              setSearchBy('MSISDN');
            }}
            filters={
              <>
                <div className="w-full sm:w-40">
                  <CompactSelect
                    value={searchBy}
                    onChange={(event) => setSearchBy(event.target.value)}
                    options={[
                      { value: 'MSISDN', label: 'MSISDN' },
                      { value: 'IMEI', label: 'IMEI' },
                    ]}
                    placeholder=""
                    aria-label="Search by"
                  />
                </div>
                <DateRangeFilter
                  compact
                  className="shrink-0"
                  startDate={fromDate}
                  endDate={toDate}
                  onStartDateChange={setFromDate}
                  onEndDateChange={setToDate}
                />
              </>
            }
          />
        }
      >
        <DataTable
          embedded
          columns={columns}
          data={data}
          isLoading={isLoading}
          pagination
          onRowClick={handleOpenDetails}
          renderMobileCard={(row) => (
            <MobileRecordCard
              title={row.imei}
              subtitle={row.msisdn}
              status={row.status}
              fields={[
                { label: 'Operator', value: row.operator },
                { label: 'Device', value: row.deviceModel },
              ]}
              footerMeta={row.lastRegistrationDate}
            />
          )}
        />
      </TablePageWorkspace>

      {selectedRecord && (
        <RecordDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
          onExited={() => {
            setSelectedRecord(null);
          }}
          title="Subscriber Device Registration"
          recordId={selectedRecord.msisdn}
          status={selectedRecord.status}
          sections={[
            {
              title: 'Registration Details',
              items: [
                { label: 'MSISDN', value: selectedRecord.msisdn, isMono: true },
                { label: 'IMEI', value: selectedRecord.imei, isMono: true },
                { label: 'Operator', value: selectedRecord.operator },
                { label: 'Last Registration Date', value: selectedRecord.lastRegistrationDate, isMono: true },
              ],
            },
            {
              title: 'Device Details',
              items: [
                { label: 'Device Model', value: selectedRecord.deviceModel },
                { label: 'Registration Status', value: selectedRecord.status },
              ],
            },
          ]}
        />
      )}
    </div>
  );
};
