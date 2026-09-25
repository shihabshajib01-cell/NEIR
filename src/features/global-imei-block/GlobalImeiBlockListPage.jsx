import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { MobileRecordCard } from '../../components/tables/MobileRecordCard.jsx';
import { RecordDetailsDrawer } from '../../components/overlays/Drawer.jsx';
import { ConfirmationDialog } from '../../components/overlays/Modal.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { StatusBadge } from '../../components/data-display/StatusBadge.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Ban, Eye, Unlock, Download } from 'lucide-react';

export const GlobalImeiBlockListPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [unblockTarget, setUnblockTarget] = useState(null);
  const [isUnblocking, setIsUnblocking] = useState(false);
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await mockApi.getGlobalBlockedImeis({ search: searchTerm });
      setData(res.items);
    } catch (err) {
      addToast('Failed to load global blacklist.', 'error');
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

  const handleExecuteUnblock = async () => {
    if (!unblockTarget) return;
    try {
      setIsUnblocking(true);
      await mockApi.unblockGlobalImei(unblockTarget.id);
      setData((prev) =>
        prev.map((r) =>
          r.id === unblockTarget.id ? { ...r, status: 'Unblocked' } : r
        )
      );
      addToast(`Directive ${unblockTarget.blockId} revoked. IMEI ${unblockTarget.imei} removed from blacklist.`, 'success');
      setUnblockTarget(null);
    } catch (err) {
      addToast('Failed to unblock IMEI.', 'error');
    } finally {
      setIsUnblocking(false);
    }
  };

  const columns = [
    { key: 'sl', title: 'SL', width: '60px', isMono: true },
    {
      key: 'blockId',
      title: 'Block ID',
      isMono: true,
      render: (val) => <p className="font-mono font-bold text-[#202338]">{val}</p>,
    },
    {
      key: 'imei',
      title: 'IMEI / Target',
      isMono: true,
      render: (val, row) => (
        <div className="flex flex-col">
          <p className="font-mono font-bold text-[#C62828]">{val}</p>
          <p className="text-[11px] text-[#626981]">{row.blockType}</p>
        </div>
      ),
    },
    {
      key: 'reason',
      title: 'Reason / Authority',
      render: (val, row) => (
        <div className="flex flex-col max-w-xs">
          <p className="font-semibold text-[#202338] truncate">{val}</p>
          <p className="text-[11px] text-[#7A8197] truncate">{row.remarks}</p>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      width: '110px',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'blockDate',
      title: 'Block Date',
      isMono: true,
      width: '120px',
      render: (val) => <p className="text-xs text-[#626981] font-mono">{val}</p>,
    },
    {
      key: 'actions',
      title: 'Action',
      width: '180px',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={() => handleOpenDetails(row)}
            className="text-xs h-7 px-2"
          >
            Details
          </Button>
          {row.status === 'Blocked' && (
            <Button
              variant="outline"
              size="sm"
              icon={Unlock}
              onClick={() => setUnblockTarget(row)}
              className="text-xs h-7 px-2 border-emerald-300 text-emerald-800 hover:bg-emerald-50"
            >
              Unblock
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Global IMEI Block List"
        description="Master historical blacklist of barred mobile equipment identity records active in MNO EIR nodes."
        breadcrumbs={[
          { label: 'Global IMEI Block' },
          { label: 'Block List' }
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => addToast('Exporting active EIR Blacklist database...', 'info')}
          >
            Export Blacklist
          </Button>
        }
      />

      <TablePageWorkspace
        title="Global IMEI Block List"
        count={data.length}
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Search by Block ID, IMEI, authority, or remarks..."
                  searchValue={searchTerm}
                  searchSuggestions={data.flatMap((item) => [item.blockId, item.imei, item.reason, item.remarks, item.blockedBy])}
                  onSearchChange={setSearchTerm}
                  onReset={() => setSearchTerm('')}
                />
        }
      >
        <DataTable embedded
                columns={columns}
                data={data}
                isLoading={isLoading}
                renderMobileCard={(row) => (
                  <MobileRecordCard
                    title={row.blockId}
                    subtitle={row.imei}
                    status={row.status}
                    fields={[
                      { label: 'Reason', value: row.reason },
                      { label: 'Blocked By', value: row.blockedBy },
                      { label: 'Block Date', value: row.blockDate, isMono: true },
                      { label: 'Type', value: row.blockType },
                    ]}
                    actions={
                      <div className="flex items-center gap-2 w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Eye}
                          onClick={() => handleOpenDetails(row)}
                          className="flex-1 justify-center"
                        >
                          View Details
                        </Button>
                        {row.status === 'Blocked' && (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Unlock}
                            onClick={() => setUnblockTarget(row)}
                            className="flex-1 justify-center border-emerald-300 text-emerald-800"
                          >
                            Unblock
                          </Button>
                        )}
                      </div>
                    }
                  />
                )}
              />
      </TablePageWorkspace>

      {/* Details Drawer */}
      {selectedRecord && (
        <RecordDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedRecord(null);
          }}
          title="Blacklist Directive Record"
          recordId={selectedRecord.blockId}
          status={selectedRecord.status}
          sections={[
            {
              title: 'Directive Overview',
              items: [
                { label: 'Block Directive ID', value: selectedRecord.blockId, isMono: true },
                { label: 'Target IMEI', value: selectedRecord.imei, isMono: true },
                { label: 'Target Scope', value: selectedRecord.blockType },
                { label: 'Issuing Officer', value: selectedRecord.blockedBy },
                { label: 'Directive Timestamp', value: selectedRecord.blockDate, isMono: true },
              ]
            },
            {
              title: 'Legal & Operational Justification',
              items: [
                { label: 'Legal Authority', value: selectedRecord.reason },
                { label: 'Case Reference / Remarks', value: selectedRecord.remarks },
              ]
            }
          ]}
        />
      )}

      {/* Unblock Confirmation Dialog */}
      {unblockTarget && (
        <ConfirmationDialog
          isOpen={Boolean(unblockTarget)}
          onClose={() => setUnblockTarget(null)}
          onConfirm={handleExecuteUnblock}
          title="Revoke Blacklist & Unblock IMEI"
          message={`Are you sure you want to restore cellular access for IMEI ${unblockTarget.imei}? This directive will command all 4 MNO EIR nodes to remove the blacklist restriction.`}
          confirmLabel="Revoke Blacklist"
          tone="primary"
          isLoading={isUnblocking}
        />
      )}
    </div>
  );
};
