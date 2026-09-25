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
import { Eye, Download, Ban } from 'lucide-react';

export const LostStolenPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadError, setLoadError] = useState('');
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      setLoadError('');
      const res = await mockApi.getLostStolenDevices({ search: searchTerm });
      setData(res.items);
    } catch (err) {
      const message = err.message || 'Failed to retrieve lost/stolen registry.';
      setLoadError(message);
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm]);

  const handleOpenDetails = (record) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  const columns = [
    { key: 'sl', title: 'SL', width: '60px', isMono: true },
    {
      key: 'imei',
      title: 'IMEI Number',
      isMono: true,
      render: (val, row) => (
        <div className="flex flex-col">
          <p className="font-mono font-semibold text-[#202338]">{val}</p>
          <p className="text-[11px] text-[#626981] truncate">{row.deviceDetails.brand} {row.deviceDetails.model} ({row.deviceDetails.color})</p>
        </div>
      ),
    },
    {
      key: 'requestedBy',
      title: 'Requested By / Thana GD',
      render: (val, row) => (
        <div className="flex flex-col">
          <p className="font-medium text-[#202338]">{val}</p>
          <p className="text-[11px] text-[#7A8197] font-mono">{row.thana}</p>
        </div>
      ),
    },
    {
      key: 'reportDate',
      title: 'Report Date',
      isMono: true,
      render: (val) => <p className="text-xs text-[#626981] font-mono">{val}</p>,
    },
    {
      key: 'status',
      title: 'Current Status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'actions',
      title: 'Action',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={() => handleOpenDetails(row)}
          className="text-xs h-7.5 px-2.5"
        >
          View details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Lost and Stolen Devices"
        description="Police GD synchronized handset theft logs, law enforcement requisitions, and EIR gray/black list triggers."
        breadcrumbs={[
          { label: 'Lost & Stolen' }
        ]}
        actions={
          <Button
            variant="secondary"
            size="md"
            icon={Download}
            onClick={() => addToast('Downloading Lost/Stolen EIR police extract...', 'info')}
          >
            Export
          </Button>
        }
      />

      <TablePageWorkspace
        title="Lost & Stolen Registry"
        count={data.length}
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Search by IMEI, GD number, citizen name, or Police Station..."
                  searchValue={searchTerm}
                  searchSuggestions={data.flatMap((item) => [item.imei, item.gdNumber, item.requestedBy, item.thana])}
                  onSearchChange={setSearchTerm}
                  onReset={() => setSearchTerm('')}
                />
        }
      >
        <DataTable embedded
                columns={columns}
                data={data}
                isLoading={isLoading}
                isError={Boolean(loadError)}
                errorMessage={loadError}
                onRetry={loadData}
                renderMobileCard={(row) => (
                  <MobileRecordCard
                    title={row.imei}
                    subtitle={`${row.deviceDetails.brand} ${row.deviceDetails.model}`}
                    status={row.status}
                    fields={[
                      { label: 'Requested By', value: row.requestedBy },
                      { label: 'GD Number', value: row.gdNumber, isMono: true },
                      { label: 'Report Date', value: row.reportDate, isMono: true },
                      { label: 'Last Seen Carrier', value: row.deviceDetails.lastSeenOperator },
                    ]}
                    actions={
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Eye}
                        onClick={() => handleOpenDetails(row)}
                        className="w-full justify-center"
                      >
                        View Police Details
                      </Button>
                    }
                  />
                )}
              />
      </TablePageWorkspace>

      {/* Right-Side Record Details Drawer */}
      {selectedRecord && (
        <RecordDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedRecord(null);
          }}
          title="Lost / Stolen Handset Dossier"
          recordId={selectedRecord.id}
          status={selectedRecord.status}
          sections={[
            {
              title: 'Police & Citizen Information',
              items: [
                { label: 'Complainant Name', value: selectedRecord.requestedBy },
                { label: 'General Diary (GD) No.', value: selectedRecord.gdNumber, isMono: true },
                { label: 'Police Station / Thana', value: selectedRecord.thana },
                { label: 'Citizen NID', value: selectedRecord.ownerNid, isMono: true },
                { label: 'Contact Phone', value: selectedRecord.ownerPhone, isMono: true },
              ]
            },
            {
              title: 'Device & Radio Network Information',
              items: [
                { label: 'IMEI', value: selectedRecord.imei, isMono: true },
                { label: 'Brand & Model', value: `${selectedRecord.deviceDetails.brand} ${selectedRecord.deviceDetails.model}` },
                { label: 'Color', value: selectedRecord.deviceDetails.color },
                { label: 'Last Reported Location', value: selectedRecord.deviceDetails.lastSeenLocation },
                { label: 'Last Active MNO Carrier', value: selectedRecord.deviceDetails.lastSeenOperator },
                { label: 'Last Cellular Ping', value: selectedRecord.deviceDetails.lastSeenTimestamp, isMono: true },
              ]
            },
            {
              title: 'Audit & EIR Trigger Trail',
              items: selectedRecord.actionHistory.map(h => ({
                label: `${h.date} (${h.actor})`,
                value: h.event
              }))
            }
          ]}
          footerActions={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDrawerOpen(false)}
              >
                Close Drawer
              </Button>
              <Button
                variant="danger"
                size="md"
                icon={Ban}
                onClick={() => {
                  addToast(`Re-broadcasted Blacklist command for IMEI ${selectedRecord.imei}`, 'success');
                  setIsDrawerOpen(false);
                }}
              >
                Re-Broadcast Blacklist
              </Button>
            </div>
          }
        />
      )}
    </div>
  );
};
