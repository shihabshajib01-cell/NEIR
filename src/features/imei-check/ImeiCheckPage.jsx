import React, { useState } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { Card } from '../../components/data-display/Card.jsx';
import { IMEIInput } from '../../components/forms/TextInput.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Modal } from '../../components/overlays/Modal.jsx';
import { StatusBadge } from '../../components/data-display/StatusBadge.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Search, Smartphone, CheckCircle2, ShieldCheck, Globe, Radio } from 'lucide-react';

export const ImeiCheckPage = () => {
  const [imei, setImei] = useState('862940058912341');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const { addToast } = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!imei || imei.length < 14) {
      addToast('Please enter a valid 14–16 digit IMEI number.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const res = await mockApi.checkImei(imei);
      setResult(res);
      setIsResultModalOpen(true);
    } catch (err) {
      addToast('Failed to query NEIR registry.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="IMEI Check"
        description="Verify individual terminal legitimacy, GSMA TAC allocation, and active status in Bangladesh EIR registry."
        breadcrumbs={[
          { label: 'IMEI Check' }
        ]}
      />

      {/* Centered Operational Card */}
      <div className="max-w-xl mx-auto">
        <Card
          title="Direct EIR Database Lookup"
          subtitle="Instant cross-carrier query for handset compliance status"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <IMEIInput
              label="International Mobile Equipment Identity (IMEI)"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              placeholder="e.g. 862940058912341"
              required
            />

            <div className="p-3 bg-[#F7F8FC] rounded-md border border-[#E2E5F0] text-xs text-[#626981] space-y-1">
              <p className="font-semibold text-[#202338]">Quick Inspection Shortcuts:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li><p>Standard 15-digit number: <code className="font-mono text-[#028A97]">862940058912341</code> (White Listed)</p></li>
                <li><p>Blocked stolen device: <code className="font-mono text-red-600">864920194820194</code> (Blacklisted)</p></li>
                <li><p>Unregistered terminal: <code className="font-mono text-amber-600">999000111222333</code> (Not Registered)</p></li>
              </ul>
            </div>

            <div className="pt-2 border-t border-[#E2E5F0] flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Search}
                isLoading={isLoading}
              >
                Verify IMEI
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Result Modal Dialog */}
      {result && (
        <Modal
          isOpen={isResultModalOpen}
          onClose={() => setIsResultModalOpen(false)}
          title="IMEI Verification Status"
          subtitle={`Query Target: ${result.imei}`}
          maxWidth="max-w-lg"
          footer={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResultModalOpen(false)}
            >
              Close Inquiry
            </Button>
          }
        >
          <div className="space-y-4">
            {/* Status Header Strip */}
            <div className="p-3.5 bg-[#F7F8FC] border border-[#E2E5F0] rounded-lg flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#626981] uppercase tracking-wider">EIR Verdict</p>
                <p className="text-base font-mono font-bold text-[#202338]">{result.imei}</p>
              </div>
              <StatusBadge status={result.status} size="md" />
            </div>

            {/* Bilingual Verification Message */}
            <div className="p-3.5 rounded-lg border border-[#01ADC1]/30 bg-[#01ADC1]/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#028A97]">
                <Globe className="w-4 h-4" />
                <p>Official Status Response</p>
              </div>
              <p className="text-sm font-semibold text-[#202338] leading-relaxed">
                {result.bengaliMessage}
              </p>
              <p className="text-xs text-[#626981]">
                {result.englishMessage}
              </p>
            </div>

            {/* Device Specification Box */}
            <div className="border border-[#E2E5F0] rounded-lg p-3.5 space-y-2 text-xs">
              <div className="flex justify-between pb-1.5 border-b border-[#F7F8FC]">
                <p className="text-[#626981]">Brand / Manufacturer:</p>
                <p className="font-semibold text-[#202338]">{result.brand}</p>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-[#F7F8FC]">
                <p className="text-[#626981]">Model & Tier:</p>
                <p className="font-medium text-[#202338]">{result.model}</p>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-[#F7F8FC]">
                <p className="text-[#626981]">GSMA Type Allocation Code (TAC):</p>
                <p className="font-mono font-semibold text-[#01ADC1]">{result.tac}</p>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-[#F7F8FC]">
                <p className="text-[#626981]">Authorization Category:</p>
                <p className="text-[#202338]">{result.importType}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#626981]">Carrier Attachment:</p>
                <p className="text-[#028A97] font-medium">{result.mnoAttachment}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
