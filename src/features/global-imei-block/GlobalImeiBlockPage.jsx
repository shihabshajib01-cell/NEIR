import React, { useState } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { Card } from '../../components/data-display/Card.jsx';
import { RadioGroup } from '../../components/forms/RadioGroup.jsx';
import { IMEIInput, Textarea, TextInput } from '../../components/forms/TextInput.jsx';
import { Select } from '../../components/forms/Select.jsx';
import { CSVUpload } from '../../components/forms/FileUpload.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { ConfirmationDialog } from '../../components/overlays/Modal.jsx';
import { Alert } from '../../components/feedback/Alert.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Ban, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const GlobalImeiBlockPage = () => {
  const [blockType, setBlockType] = useState('single'); // 'single' | 'batch'
  const [imei, setImei] = useState('864920194820194');
  const [batchImeis, setBatchImeis] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [reason, setReason] = useState('Law Enforcement Requisition (Police GD)');
  const [remarks, setRemarks] = useState('DMP Detective Branch Requisition #DB-2026-9912. Immediate nationwide blacklist.');
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastBlockedResult, setLastBlockedResult] = useState(null);
  const { addToast } = useToast();

  const handleInitiateBlock = (e) => {
    e.preventDefault();
    if (blockType === 'single') {
      if (!imei || imei.length < 14) {
        addToast('Please enter a valid 14–16 digit IMEI number.', 'error');
        return;
      }
    } else {
      if (!batchImeis.trim() && !selectedFile) {
        addToast('Please enter batch IMEI list or attach a CSV file.', 'error');
        return;
      }
    }
    setIsConfirmOpen(true);
  };

  const handleExecuteBlock = async () => {
    try {
      setIsLoading(true);
      const res = await mockApi.blockGlobalImei({
        blockType: blockType === 'single' ? 'Single IMEI' : 'Batch List',
        imei: blockType === 'single' ? imei : `${batchImeis.split('\n').filter(Boolean).length || 5} Batch IMEIs`,
        reason,
        remarks,
      });
      setLastBlockedResult(res);
      addToast(`Global IMEI Blacklist directive broadcasted across all 4 MNOs.`, 'success');
      setIsConfirmOpen(false);
    } catch (err) {
      addToast('Failed to execute global block instruction.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Block IMEI"
        description="Issue nationwide EIR blacklisting directives to deny cellular network attachment across all Bangladeshi telecom operators."
        breadcrumbs={[
          { label: 'Global IMEI Block' },
          { label: 'Block IMEI' }
        ]}
      />

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Warning banner */}
        <Alert variant="warning" title="Critical Regulatory Action">
          Executing a Global IMEI Block immediately propagates the terminal identifier to the Central Equipment Identity Register (EIR) Blacklist of Grameenphone, Robi Axiata, Banglalink, and Teletalk. Network attachment will be barred within 60 seconds.
        </Alert>

        {lastBlockedResult && (
          <Alert variant="danger" title="IMEI Block Active">
            <p>Target: <strong className="font-mono">{lastBlockedResult.record.imei}</strong></p>
            <p className="mt-0.5">Reference Directive: <code className="font-mono">{lastBlockedResult.record.blockId}</code></p>
          </Alert>
        )}

        <Card title="Global Blacklist Directive Form">
          <form onSubmit={handleInitiateBlock} className="space-y-4">
            <RadioGroup
              label="Block Mode"
              name="blockType"
              value={blockType}
              onChange={setBlockType}
              options={[
                { value: 'single', label: 'Single IMEI Target' },
                { value: 'batch', label: 'Batch IMEI List / Bulk Requisition' },
              ]}
            />

            {blockType === 'single' ? (
              <IMEIInput
                label="Target IMEI Number"
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                placeholder="e.g. 864920194820194"
                required
              />
            ) : (
              <div className="space-y-3">
                <Textarea
                  label="Batch IMEI List (One per line)"
                  value={batchImeis}
                  onChange={(e) => setBatchImeis(e.target.value)}
                  placeholder="864920194820194&#10;862940058912341&#10;354890112458901"
                  rows={4}
                />
                <div className="text-center text-xs text-[#7A8197] font-semibold uppercase"><p>— OR UPLOAD CSV —</p></div>
                <CSVUpload
                  label="Batch Requisition CSV File"
                  onFileSelect={(file) => setSelectedFile(file)}
                />
              </div>
            )}

            <Select
              label="Official Blocking Reason / Authority"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              options={[
                'Law Enforcement Requisition (Police GD)',
                'Court Order / Judicial Mandate',
                'National Security Agency Directive',
                'Confirmed Stolen / Armed Robbery',
                'Cloned / Duplicated IMEI Fraud',
                'Unapproved Illegal Import Seizure'
              ]}
              required
            />

            <Textarea
              label="Operational Case Reference / Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter Thana GD reference number, court case ID, or investigating officer details..."
              rows={3}
              required
            />

            <div className="pt-2 border-t border-[#E2E5F0] flex justify-end">
              <Button
                type="submit"
                variant="danger"
                size="md"
                icon={Ban}
              >
                Block IMEI Globally
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleExecuteBlock}
        title="Confirm Nationwide IMEI Blacklist"
        message={`Are you sure you want to permanently blacklist ${
          blockType === 'single' ? `IMEI ${imei}` : 'this batch of handsets'
        }? This will immediately bar cellular service across all MNOs.`}
        confirmLabel="Execute Global Block"
        tone="danger"
        isLoading={isLoading}
      />
    </div>
  );
};
