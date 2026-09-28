import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable, MobileRecordCard } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { RecordDetailsDrawer } from '../../components/overlays/Drawer.jsx';
import { Card } from '../../components/data-display/Card.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Select, CompactSelect } from '../../components/forms/Select.jsx';
import { TextInput } from '../../components/forms/TextInput.jsx';
import { StatusBadge } from '../../components/data-display/StatusBadge.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Search, Eye, Download, Radio } from 'lucide-react';

export const MsisdnImeiPage = () => {
  const [records, setRecords] = useState([]);
  const [lookupResults, setLookupResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lookupType, setLookupType] = useState('MSISDN');
  const [lookupQuery, setLookupQuery] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await mockApi.getMsisdnImeiList();
      setRecords(res.items);
    } catch (err) {
      addToast('Failed to load MSISDN-IMEI records.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const visibleRecords = useMemo(() => {
    const source = lookupResults ?? records;
    if (operatorFilter === 'All') return source;
    return source.filter((record) => record.operator === operatorFilter);
  }, [lookupResults, records, operatorFilter]);

  const handleLookup = async (event) => {
    event.preventDefault();
    const query = lookupQuery.trim();

    if (!query) {
      addToast(lookupType === 'MSISDN' ? 'Enter a phone number to search.' : 'Enter a device IMEI to search.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const result = await mockApi.lookupMsisdnImei(lookupType, query);
      setLookupResults(result);
      if (!result.length) addToast('No matching MSISDN-IMEI record found.', 'info');
    } catch (err) {
      addToast('MSISDN-IMEI lookup failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetLookup = () => {
    setLookupType('MSISDN');
    setLookupQuery('');
    setOperatorFilter('All');
    setLookupResults(null);
  };

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
          <p className="text-[11px] text-[var(--color-text-muted)]">{row.deviceModel}</p>
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
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
          <Radio className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <p>{val}</p>
        </div>
      ),
    },
    {
      key: 'lastRegistrationDate',
      title: 'Last Registration Date',
      isMono: true,
      render: (val) => <p className="text-xs text-[var(--color-text-secondary)] font-mono">{val}</p>,
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
          className="text-xs h-7 px-2"
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
        description="Search and review subscriber-to-device registration records in the NEIR registry."
        breadcrumbs={[{ label: 'MSISDN IMEI' }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => addToast('Exporting cellular binding extract...', 'info')}
          >
            Export Log
          </Button>
        }
      />

      <Card
        title="Search MSISDN/IMEI"
        subtitle="Search the registry by subscriber number or device IMEI."
        bodyClassName="p-4 sm:p-5"
      >
        <form onSubmit={handleLookup} className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:items-end">
          <div className="lg:col-span-3">
            <Select
              label="Search By"
              value={lookupType}
              onChange={(event) => setLookupType(event.target.value)}
              options={[
                { value: 'MSISDN', label: 'MSISDN' },
                { value: 'IMEI', label: 'IMEI' },
              ]}
              placeholder=""
            />
          </div>

          <div className="lg:col-span-5">
            <TextInput
              label="MSISDN / IMEI"
              value={lookupQuery}
              onChange={(event) => setLookupQuery(event.target.value)}
              placeholder={lookupType === 'MSISDN' ? 'Enter MSISDN' : 'Enter IMEI'}
              icon={Search}
              inputMode="numeric"
            />
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-2">
            <Button type="submit" variant="primary" size="md" icon={Search} className="w-full" isLoading={isLoading}>
              Search
            </Button>
            <Button type="button" variant="outline" size="md" onClick={handleResetLookup} className="w-full">
              Reset
            </Button>
          </div>
        </form>
      </Card>

      <TablePageWorkspace
        title="MSISDN IMEI List"
        count={visibleRecords.length}
        toolbar={
          <div className="w-full sm:w-56">
            <CompactSelect
              value={operatorFilter}
              onChange={(event) => setOperatorFilter(event.target.value)}
              options={[
                { value: 'All', label: 'All Operators' },
                { value: 'Grameenphone', label: 'Grameenphone' },
                { value: 'Robi', label: 'Robi' },
                { value: 'Banglalink', label: 'Banglalink' },
                { value: 'Teletalk', label: 'Teletalk' },
              ]}
              placeholder=""
              aria-label="Filter by operator"
            />
          </div>
        }
      >
        <DataTable
          embedded
          columns={columns}
          data={visibleRecords}
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
