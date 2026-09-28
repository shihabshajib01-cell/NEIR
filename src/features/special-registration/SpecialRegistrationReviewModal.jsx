import React, { useEffect, useRef, useState } from 'react';
import { FullScreenWorkspace } from '../../components/overlays/FullScreenWorkspace.jsx';
import { DocumentList, DocumentViewerPlaceholder } from '../../components/data-display/DocumentList.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Textarea } from '../../components/forms/TextInput.jsx';
import { ConfirmationDialog, Modal } from '../../components/overlays/Modal.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { mockApi } from '../../services/mockApi.js';
import { CheckCircle2, ChevronDown, FileText, Smartphone, User, ShieldCheck, XCircle } from 'lucide-react';

const CollapsibleSection = ({ title, icon: Icon, isOpen, onToggle, children }) => (
  <section className="bg-white border border-[#E2E5F0] rounded-lg shadow-xs overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-[var(--color-background-subtle)] transition-colors"
    >
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="w-4 h-4 text-[#01ADC1] shrink-0" />
        <p className="text-xs font-semibold text-[#202338] truncate">{title}</p>
      </div>
      <ChevronDown className={'w-4 h-4 text-[#7A8197] shrink-0 transition-transform ' + (isOpen ? 'rotate-180' : '')} />
    </button>
    {isOpen && (
      <div className="p-4 border-t border-[#E2E5F0]">
        {children}
      </div>
    )}
  </section>
);

export const SpecialRegistrationReviewModal = ({
  isOpen,
  onClose,
  registration,
  onStatusUpdated,
}) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [remarks, setRemarks] = useState(registration?.remarks || '');
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState({
    requester: true,
    device: true,
    attachments: true,
    remarks: true,
  });
  const { addToast } = useToast();
  const workspaceScrollRef = useRef(null);
  const reviewScrollPositionRef = useRef(0);

  useEffect(() => {
    if (!isOpen) {
      setSelectedDoc(null);
      return;
    }

    setSelectedDoc(null);
    setRemarks(registration?.remarks || '');
  }, [isOpen, registration?.id, registration?.remarks]);

  if (!registration) return null;

  const toggleSection = (section) => {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  };

  const handleDocumentSelect = (document) => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (isMobile) {
      reviewScrollPositionRef.current = workspaceScrollRef.current?.scrollTop || 0;
      setSelectedDoc(document);
      requestAnimationFrame(() => {
        if (workspaceScrollRef.current) workspaceScrollRef.current.scrollTop = 0;
      });
      return;
    }

    setSelectedDoc((current) => current?.id === document.id ? null : document);
  };

  const handleMobileDocumentBack = () => {
    setSelectedDoc(null);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (workspaceScrollRef.current) {
          workspaceScrollRef.current.scrollTop = reviewScrollPositionRef.current;
        }
      });
    });
  };

  const handleWorkspaceClose = () => {
    setSelectedDoc(null);
    onClose();
  };

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      await mockApi.updateSpecialRegistrationStatus(registration.id, 'Accepted', remarks);
      addToast(`Special Registration ${registration.id} approved. IMEI ${registration.imei} added to White List.`, 'success');
      setIsApproveOpen(false);
      onStatusUpdated && onStatusUpdated(registration.id, 'Accepted');
      handleWorkspaceClose();
    } catch (err) {
      addToast('Failed to approve application.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectRemarks.trim()) {
      addToast('Please provide an official rejection reason.', 'error');
      return;
    }
    try {
      setIsSubmitting(true);
      await mockApi.updateSpecialRegistrationStatus(registration.id, 'Rejected', rejectRemarks);
      addToast(`Special Registration ${registration.id} rejected with official remarks.`, 'info');
      setIsRejectOpen(false);
      onStatusUpdated && onStatusUpdated(registration.id, 'Rejected');
      handleWorkspaceClose();
    } catch (err) {
      addToast('Failed to reject application.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <FullScreenWorkspace
        isOpen={isOpen}
        onClose={handleWorkspaceClose}
        title="Special Registration Review Dossier"
        identifier={registration.id}
        status={registration.status}
        mobileTitle={selectedDoc ? selectedDoc.type : undefined}
        mobileIdentifier={selectedDoc ? `${selectedDoc.title} · ${selectedDoc.size}` : registration.id}
        onMobileBack={selectedDoc ? handleMobileDocumentBack : undefined}
        hideMobileFooter={Boolean(selectedDoc)}
        contentRef={workspaceScrollRef}
        contentClassName={selectedDoc ? 'max-md:p-0' : ''}
        maxWidth={selectedDoc ? 'max-w-[92vw]' : 'max-w-[720px]'}
        footer={
          <div className="flex flex-col gap-2 w-full md:flex-row md:items-center md:justify-end md:gap-3">
            <Button
              variant="dangerOutline"
              size="md"
              icon={XCircle}
              className="w-full md:w-auto"
              onClick={() => setIsRejectOpen(true)}
            >
              Reject Application
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={CheckCircle2}
              className="w-full md:w-auto"
              onClick={() => setIsApproveOpen(true)}
            >
              Approve & Whitelist
            </Button>
          </div>
        }
      >
        <div className={(selectedDoc ? 'hidden md:grid ' : 'grid ') + 'grid-cols-1 gap-4 h-full transition-all duration-[var(--motion-slow)] ease-out ' + (selectedDoc ? 'lg:grid-cols-12' : '')}>
          <div className={selectedDoc
            ? 'lg:col-span-5 space-y-4 overflow-y-auto'
            : 'w-full max-w-5xl mx-auto space-y-4'}
          >
            <CollapsibleSection
              title="Requester & Citizen Identity"
              icon={User}
              isOpen={openSections.requester}
              onToggle={() => toggleSection('requester')}
            >
              <div className="space-y-2 text-xs">
                <div className="flex justify-between gap-4">
                  <p className="text-[#626981]">Full Name:</p>
                  <p className="font-semibold text-[#202338] text-right">{registration.requesterName}</p>
                </div>
                <div className="flex justify-between gap-4">
                  <p className="text-[#626981]">National ID / Passport:</p>
                  <p className="font-mono text-[#202338] text-right">{registration.requesterNid}</p>
                </div>
                <div className="flex justify-between gap-4">
                  <p className="text-[#626981]">Contact Phone:</p>
                  <p className="font-mono text-[#202338] text-right">{registration.requesterPhone}</p>
                </div>
                <div className="flex justify-between gap-4">
                  <p className="text-[#626981]">Application Date:</p>
                  <p className="font-mono text-[#202338] text-right">{registration.date}</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="Device Specifications"
              icon={Smartphone}
              isOpen={openSections.device}
              onToggle={() => toggleSection('device')}
            >
              <div className="space-y-2 text-xs">
                <div className="flex justify-between gap-4">
                  <p className="text-[#626981]">IMEI Number:</p>
                  <p className="font-mono font-bold text-[#028A97] bg-[#028A97]/10 px-1.5 py-0.5 rounded">{registration.imei}</p>
                </div>
                <div className="flex justify-between gap-4">
                  <p className="text-[#626981]">Brand / Make:</p>
                  <p className="font-semibold text-[#202338] text-right">{registration.brand}</p>
                </div>
                <div className="flex justify-between gap-4">
                  <p className="text-[#626981]">Model:</p>
                  <p className="font-medium text-[#202338] text-right">{registration.model}</p>
                </div>
                <div className="flex justify-between gap-4">
                  <p className="text-[#626981]">Device Type:</p>
                  <p className="text-[#202338] text-right">{registration.deviceType}</p>
                </div>
                <div className="flex justify-between gap-4">
                  <p className="text-[#626981]">Serial Number:</p>
                  <p className="font-mono text-[#202338] text-right">{registration.serialNumber}</p>
                </div>
                <div className="flex justify-between gap-4">
                  <p className="text-[#626981]">Purchase Country:</p>
                  <p className="text-[#202338] text-right">{registration.purchaseCountry}</p>
                </div>
                <div className="flex justify-between gap-4">
                  <p className="text-[#626981]">Customs Challan / Baggage No:</p>
                  <p className="font-mono text-[#01ADC1] font-semibold text-right">{registration.customsChallanNo}</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title={`Dossier Attachments (${registration.attachments?.length || 0})`}
              icon={FileText}
              isOpen={openSections.attachments}
              onToggle={() => toggleSection('attachments')}
            >
              <div>
                <DocumentList
                  documents={registration.attachments || []}
                  selectedDocId={selectedDoc?.id}
                  onSelectDoc={handleDocumentSelect}
                />
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="Application Verification Remarks"
              icon={ShieldCheck}
              isOpen={openSections.remarks}
              onToggle={() => toggleSection('remarks')}
            >
              <div>
                <Textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter officer evaluation notes, customs tax verification references, or clearance remarks..."
                  rows={3}
                  aria-label="Application Verification Remarks"
                />
              </div>
            </CollapsibleSection>
          </div>

          {selectedDoc && (
            <div key={selectedDoc.id} className="lg:col-span-7 h-full flex flex-col min-w-0 preview-panel-enter">
              <DocumentViewerPlaceholder
                document={selectedDoc}
                onClosePreview={() => setSelectedDoc(null)}
              />
            </div>
          )}
        </div>

        {selectedDoc && (
          <div key={'mobile-' + selectedDoc.id} className="md:hidden h-full min-h-[calc(90dvh-64px)] bg-[var(--color-background-subtle)]">
            <DocumentViewerPlaceholder
              document={selectedDoc}
              focusedMobile
            />
          </div>
        )}
      </FullScreenWorkspace>

      <ConfirmationDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Special Registration"
        message={`Are you sure you want to approve Special Registration ${registration.id}? This will immediately broadcast IMEI ${registration.imei} to the EIR White List across Grameenphone, Robi, Banglalink, and Teletalk.`}
        confirmLabel="Confirm & Whitelist"
        tone="primary"
        isLoading={isSubmitting}
      />

      <Modal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="Reject Special Registration"
        maxWidth="max-w-md"
        footer={
          <Button
            variant="danger"
            size="sm"
            onClick={handleReject}
            isLoading={isSubmitting}
          >
            Confirm Rejection
          </Button>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-[#626981]">
            Please enter the official regulatory reason for rejecting application {registration.id}. This will be communicated to the applicant.
          </p>
          <Textarea
            label="Official Rejection Reason"
            value={rejectRemarks}
            onChange={(e) => setRejectRemarks(e.target.value)}
            placeholder="e.g. Customs duty voucher invalid, mismatching IMEI serial on invoice, or exceeded allowable personal baggage quota."
            rows={3}
            required
          />
        </div>
      </Modal>
    </>
  );
};
