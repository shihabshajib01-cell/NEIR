import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { MobileRecordCard } from '../../components/tables/MobileRecordCard.jsx';
import { RecordDetailsDrawer } from '../../components/overlays/Drawer.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { StatusBadge } from '../../components/data-display/StatusBadge.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Search, Eye, Download, Calendar, Radio } from 'lucide-react';

export const MsisdnImeiPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await mockApi.getMsisdnImeiList({
        search: searchTerm,
        operator: operatorFilter,
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
  }, [searchTerm, operatorFilter]);

  const handleOpenDetails = (record) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  const columns = [
    { key: 'sl', title: 'SL', width: '60px', isMono: true },
    {
      key: 'msisdn',
      title: 'Phone Number (MSISDN)',
      isMono: true,
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-[#202338]">{val}</span>
          <span className="text-[11px] text-[#626981] font-sans font-medium">{row.subscriberName}</span>
        </div>
      ),
    },
    {
      key: 'imei',
      title: 'Active IMEI Number',
      isMono: true,
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-mono font-semibold text-[#028A97]">{val}</span>
          <span className="text-[11px] text-[#7A8197]">{row.deviceModel}</span>
        </div>
      ),
    },
    {
      key: 'imsi',
      title: 'IMSI Identifier',
      isMono: true,
      render: (val) => <span className="font-mono text-xs text-[#626981]">{val}</span>,
    },
    {
      key: 'operator',
      title: 'Carrier Operator',
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#202338]">
          <Radio className="w-3.5 h-3.5 text-[#01ADC1]" />
          <span>{val}</span>
        </span>
      ),
    },
    {
      key: 'attachedDate',
      title: 'First Active Date',
      isMono: true,
      render: (val) => <span className="text-xs text-[#626981] font-mono">{val}</span>,
    },
    {
      key: 'status',
      title: 'Pairing Status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'actions',
      title: 'Action',
      width: '100px',
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
        description="Active cellular binding registry between subscriber identity modules (SIM) and physical terminals across Bangladesh."
        breadcrumbs={[
          { label: 'MSISDN IMEI' }
        ]}
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

      <TablePageWorkspace
        title="MSISDN IMEI List"
        count={data.length}
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Search by phone number, IMEI, IMSI, or subscriber name..."
                  searchValue={searchTerm}
                  onSearchChange={setSearchTerm}
                  onReset={() => {
                    setSearchTerm('');
                    setOperatorFilter('All');
                  }}
                  filters={
                    <div className="w-48">
                      <select
                        value={operatorFilter}
                        onChange={(e) => setOperatorFilter(e.target.value)}
                        className="w-full h-8.5 px-2 text-xs bg-[#F7F8FC] border border-[#E2E5F0] rounded-md text-[#202338] outline-hidden cursor-pointer"
                      >
                        <option value="All">All Operators (MNOs)</option>
                        <option value="Grameenphone">Grameenphone</option>
                        <option value="Robi Axiata">Robi Axiata</option>
                        <option value="Banglalink">Banglalink</option>
                        <option value="Teletalk">Teletalk</option>
                      </select>
                    </div>
                  }
                />
        }
      >
        <DataTable embedded
                columns={columns}
                data={data}
                isLoading={isLoading}
                renderMobileCard={(row) => (
                  <MobileRecordCard
                    title={row.msisdn}
                    subtitle={row.subscriberName}
                    status={row.status}
                    fields={[
                      { label: 'Active IMEI', value: row.imei, isMono: true },
                      { label: 'Operator', value: row.operator },
                      { label: 'Device', value: row.deviceModel },
                      { label: 'Attached Date', value: row.attachedDate, isMono: true },
                    ]}
                    actions={
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Eye}
                        onClick={() => handleOpenDetails(row)}
                        className="w-full justify-center"
                      >
                        Inspect Pairing
                      </Button>
                    }
                  />
                )}
              />
      </TablePageWorkspace>

      {/* Record Details Drawer */}
      {selectedRecord && (
        <RecordDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedRecord(null);
          }}
          title="Subscriber Cellular Binding"
          recordId={selectedRecord.msisdn}
          status={selectedRecord.status}
          sections={[
            {
              title: 'Subscriber & SIM Identity',
              items: [
                { label: 'Subscriber Name', value: selectedRecord.subscriberName },
                { label: 'MSISDN Phone', value: selectedRecord.msisdn, isMono: true },
                { label: 'IMSI Number', value: selectedRecord.imsi, isMono: true },
                { label: 'Carrier Network', value: selectedRecord.operator },
                { label: 'First Cell Attachment', value: selectedRecord.attachedDate, isMono: true },
              ]
            },
            {
              title: 'Bound Hardware Terminal',
              items: [
                { label: 'Hardware IMEI', value: selectedRecord.imei, isMono: true },
                { label: 'Device Model', value: selectedRecord.deviceModel },
                { label: 'EIR Compliance', value: 'White List (Authorized)' },
              ]
            }
          ]}
        />
      )}
    </div>
  );
};
