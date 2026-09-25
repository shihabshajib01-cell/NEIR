import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { MobileRecordCard } from '../../components/tables/MobileRecordCard.jsx';
import { Drawer } from '../../components/overlays/Drawer.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Textarea, TextInput } from '../../components/forms/TextInput.jsx';
import { Select, CompactSelect } from '../../components/forms/Select.jsx';
import { StatusBadge, PriorityBadge } from '../../components/data-display/StatusBadge.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Headphones, Eye, MessageSquare, Send, CheckCircle2, User, Clock } from 'lucide-react';

export const SupportTicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [newStatus, setNewStatus] = useState('In Progress');
  const [isReplying, setIsReplying] = useState(false);
  const { addToast } = useToast();

  const statusTabs = [
    { id: 'All', label: 'All Tickets', count: 6 },
    { id: 'Open', label: 'Open', count: 2 },
    { id: 'In Progress', label: 'In Progress', count: 2 },
    { id: 'Resolved', label: 'Resolved', count: 1 },
    { id: 'Closed', label: 'Closed', count: 1 },
  ];

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await mockApi.getSupportTickets({
        status: statusFilter,
        search: searchTerm,
      });
      setTickets(res.items);
    } catch (err) {
      addToast('Failed to load support tickets.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, searchTerm]);

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setReplyMessage('');
    setIsDrawerOpen(true);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      addToast('Please enter an official response message.', 'error');
      return;
    }

    try {
      setIsReplying(true);
      const updated = await mockApi.replySupportTicket(
        selectedTicket.id,
        replyMessage,
        newStatus
      );
      setSelectedTicket(updated);
      setTickets((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      setReplyMessage('');
      addToast(`Response recorded for Ticket #${selectedTicket.ticketNumber}.`, 'success');
    } catch (err) {
      addToast('Failed to post reply.', 'error');
    } finally {
      setIsReplying(false);
    }
  };

  const columns = [
    { key: 'sl', title: 'SL', width: '60px', isMono: true },
    {
      key: 'ticketNumber',
      title: 'Ticket ID',
      isMono: true,
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-[#202338]">{val}</span>
          <span className="text-[11px] text-[#626981] font-sans truncate">{row.category}</span>
        </div>
      ),
    },
    {
      key: 'subject',
      title: 'Subject / Description',
      render: (val, row) => (
        <div className="flex flex-col max-w-sm">
          <span className="font-semibold text-[#202338] truncate">{val}</span>
          <span className="text-[11px] text-[#7A8197] truncate">{row.description}</span>
        </div>
      ),
    },
    {
      key: 'submittedBy',
      title: 'Submitted By',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#202338]">{val}</span>
          <span className="text-[11px] text-[#7A8197] font-mono">{row.phone}</span>
        </div>
      ),
    },
    {
      key: 'priority',
      title: 'Priority',
      width: '100px',
      render: (val) => <PriorityBadge priority={val} />,
    },
    {
      key: 'status',
      title: 'Status',
      width: '110px',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'date',
      title: 'Date',
      isMono: true,
      width: '110px',
      render: (val) => <span className="text-xs text-[#626981] font-mono">{val}</span>,
    },
    {
      key: 'actions',
      title: 'Action',
      width: '110px',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={() => handleOpenTicket(row)}
          className="text-xs h-7.5 px-2.5"
        >
          Inspect
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Support Ticket"
        description="Citizen and MNO helpdesk inquiries, EIR whitelist dispute resolution, and registration exception handling."
        breadcrumbs={[
          { label: 'Support Ticket' }
        ]}
      />

      

      <TablePageWorkspace
        title="Support Tickets"
        count={statusTabs.find((tab) => tab.id === statusFilter)?.count ?? tickets.length}
        tabs={statusTabs}
        activeTab={statusFilter}
        onTabChange={(id) => {
          setStatusFilter(id);
        }}
        showSummary
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Search by Ticket ID, citizen name, phone, or IMEI..."
                  searchValue={searchTerm}
                  searchSuggestions={tickets.flatMap((ticket) => [ticket.ticketNumber, ticket.submittedBy, ticket.phone, ticket.imei, ticket.subject])}
                  onSearchChange={setSearchTerm}
                  onReset={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                  }}
                />
        }
      >
        <DataTable embedded
                columns={columns}
                data={tickets}
                isLoading={isLoading}
                renderMobileCard={(row) => (
                  <MobileRecordCard
                    title={row.ticketNumber}
                    subtitle={row.subject}
                    status={row.status}
                    fields={[
                      { label: 'Submitted By', value: row.submittedBy },
                      { label: 'Phone', value: row.phone, isMono: true },
                      { label: 'Priority', value: row.priority },
                      { label: 'Date', value: row.date, isMono: true },
                    ]}
                    actions={
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Eye}
                        onClick={() => handleOpenTicket(row)}
                        className="w-full justify-center"
                      >
                        Inspect Ticket
                      </Button>
                    }
                  />
                )}
              />
      </TablePageWorkspace>

      {/* Support Ticket Details & Message History Drawer */}
      {selectedTicket && (
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedTicket(null);
          }}
          title={`Ticket #${selectedTicket.ticketNumber}`}
          subtitle={selectedTicket.subject}
          width="w-full sm:w-[540px]"
        >
          {/* Metadata banner */}
          <div className="p-3.5 bg-[#F7F8FC] border border-[#E2E5F0] rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#202338]">{selectedTicket.category}</span>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={selectedTicket.priority} />
                <StatusBadge status={selectedTicket.status} size="sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-[#626981]">
              <div>
                <span>Citizen:</span> <strong className="text-[#202338]">{selectedTicket.submittedBy}</strong>
              </div>
              <div>
                <span>Phone:</span> <span className="font-mono text-[#202338]">{selectedTicket.phone}</span>
              </div>
              {selectedTicket.imei && (
                <div className="col-span-2">
                  <span>Linked IMEI:</span> <span className="font-mono text-[#028A97] font-bold ml-1">{selectedTicket.imei}</span>
                </div>
              )}
            </div>
          </div>

          {/* Conversation History Thread */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#626981]">
              Conversation History
            </h4>
            <div className="space-y-3">
              {selectedTicket.messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                    msg.isStaff
                      ? 'bg-[#202338]/5 border-[#202338]/20 ml-4'
                      : 'bg-white border-[#E2E5F0] mr-4 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#F7F8FC]">
                    <span className="font-semibold text-[#202338]">
                      {msg.sender} {msg.isStaff && <span className="text-[10px] bg-[#01ADC1] text-white px-1.5 py-0.2 rounded font-normal ml-1">Staff</span>}
                    </span>
                    <span className="text-[10px] text-[#7A8197] font-mono">{msg.timestamp}</span>
                  </div>
                  <p className="text-[#202338]">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="pt-4 border-t border-[var(--color-border)] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#202338]">
                Post Official Resolution
              </h4>
              <div className="w-40">
                <CompactSelect
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  options={[
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Resolved', label: 'Resolved' },
                    { value: 'Closed', label: 'Closed' },
                  ]}
                  placeholder=""
                  aria-label="Ticket status"
                />
              </div>
            </div>

            <Textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Enter official resolution, verification findings, or citizen instructions..."
              rows={3}
              required
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Send}
                isLoading={isReplying}
              >
                Send Response
              </Button>
            </div>
          </form>
        </Drawer>
      )}
    </div>
  );
};
