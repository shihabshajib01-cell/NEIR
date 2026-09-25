import React, { useState } from 'react';
import { FullScreenWorkspace } from '../../components/overlays/FullScreenWorkspace.jsx';
import { StatusBadge } from '../../components/data-display/StatusBadge.jsx';
import { DocumentList, DocumentViewerPlaceholder } from '../../components/data-display/DocumentList.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Textarea } from '../../components/forms/TextInput.jsx';
import { ConfirmationDialog } from '../../components/overlays/Modal.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { mockApi } from '../../services/mockApi.js';
import { CheckCircle2, XCircle, FileText, Smartphone, User, ShieldCheck } from 'lucide-react';

export const SpecialRegistrationReviewModal = ({
  isOpen,
  onClose,
  registration,
  onStatusUpdated,
}) => {
  if (!registration) return null;

  const [selectedDoc, setSelectedDoc] = useState(
    registration.attachments && registration.attachments.length > 0 ? registration.attachments[0] : null
  );
  const [remarks, setRemarks] = useState(registration.remarks || '');
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      await mockApi.updateSpecialRegistrationStatus(registration.id, 'Accepted', remarks);
      addToast(`Special Registration ${registration.id} approved. IMEI ${registration.imei} added to White List.`, 'success');
      setIsApproveOpen(false);
      onStatusUpdated && onStatusUpdated(registration.id, 'Accepted');
      onClose();
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
      onClose();
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
        onClose={onClose}
        title="Special Registration Review Dossier"
        identifier={registration.id}
        status={registration.status}
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-[#626981] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#01ADC1]" />
              <p>BTRC Spectrum Management & Customs Validation Protocol</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                variant="danger"
                size="md"
                icon={XCircle}
                onClick={() => setIsRejectOpen(true)}
              >
                Reject Application
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={CheckCircle2}
                onClick={() => setIsApproveOpen(true)}
              >
                Approve & Whitelist
              </Button>
            </div>
          </div>
        }
      >
        {/* Workspace Dual-Panel Layout (Left 45%, Right 55%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* LEFT 45% (5 cols lg): Device Details, Requester, Attachments, Remarks */}
          <div className="lg:col-span-5 space-y-4 overflow-y-auto pr-1">
            {/* Requester Profile Card */}
            <div className="bg-white border border-[#E2E5F0] rounded-lg p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#202338] pb-2 border-b border-[#E2E5F0]">
                <User className="w-4 h-4 text-[#01ADC1]" />
                <p>Requester & Citizen Identity</p>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <p className="text-[#626981]">Full Name:</p>
                  <p className="font-semibold text-[#202338]">{registration.requesterName}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#626981]">National ID / Passport:</p>
                  <p className="font-mono text-[#202338]">{registration.requesterNid}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#626981]">Contact Phone:</p>
                  <p className="font-mono text-[#202338]">{registration.requesterPhone}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#626981]">Application Date:</p>
                  <p className="font-mono text-[#202338]">{registration.date}</p>
                </div>
              </div>
            </div>

            {/* Device Specification Card */}
            <div className="bg-white border border-[#E2E5F0] rounded-lg p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#202338] pb-2 border-b border-[#E2E5F0]">
                <Smartphone className="w-4 h-4 text-[#01ADC1]" />
                <p>Device Specifications</p>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <p className="text-[#626981]">IMEI Number:</p>
                  <p className="font-mono font-bold text-[#028A97] bg-[#028A97]/10 px-1.5 py-0.5 rounded">
                    {registration.imei}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#626981]">Brand / Make:</p>
                  <p className="font-semibold text-[#202338]">{registration.brand}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#626981]">Model:</p>
                  <p className="font-medium text-[#202338]">{registration.model}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#626981]">Device Type:</p>
                  <p className="text-[#202338]">{registration.deviceType}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#626981]">Serial Number:</p>
                  <p className="font-mono text-[#202338]">{registration.serialNumber}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#626981]">Purchase Country:</p>
                  <p className="text-[#202338]">{registration.purchaseCountry}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#626981]">Customs Challan / Baggage No:</p>
                  <p className="font-mono text-[#01ADC1] font-semibold">{registration.customsChallanNo}</p>
                </div>
              </div>
            </div>

            {/* Submitted Attachments List */}
            <div className="bg-white border border-[#E2E5F0] rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E5F0]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#202338]">
                  <FileText className="w-4 h-4 text-[#01ADC1]" />
                  <p>Dossier Attachments ({registration.attachments?.length || 0})</p>
                </div>
                <p className="text-[11px] text-[#7A8197]">Click to preview</p>
              </div>
              <div className="mt-3">
                <DocumentList
                  documents={registration.attachments || []}
                  selectedDocId={selectedDoc?.id}
                  onSelectDoc={(doc) => setSelectedDoc(doc)}
                />
              </div>
            </div>

            {/* Operational Remarks */}
            <div className="bg-white border border-[#E2E5F0] rounded-lg p-4 shadow-xs">
              <Textarea
                label="Application Verification Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter officer evaluation notes, customs tax verification references, or clearance remarks..."
                rows={3}
              />
            </div>
          </div>

          {/* RIGHT 55% (7 cols lg): Scanned Document High-Res Viewer */}
          <div className="lg:col-span-7 h-full flex flex-col">
            <DocumentViewerPlaceholder document={selectedDoc} />
          </div>
        </div>
      </FullScreenWorkspace>

      {/* Approve Confirmation Modal */}
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

      {/* Reject Confirmation Modal with Mandatory Remarks */}
      {isRejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202338]/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-[#E2E5F0] p-5">
            <h3 className="text-base font-semibold text-red-700 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <p>Reject Special Registration</p>
            </h3>
            <p className="text-xs text-[#626981] mt-1">
              Please enter the official regulatory reason for rejecting application {registration.id}. This will be communicated to the applicant.
            </p>

            <div className="mt-4">
              <Textarea
                label="Official Rejection Reason"
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
                placeholder="e.g. Customs duty voucher invalid, mismatching IMEI serial on invoice, or exceeded allowable personal baggage quota."
                rows={3}
                required
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRejectOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleReject}
                isLoading={isSubmitting}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
