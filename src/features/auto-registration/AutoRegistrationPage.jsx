import React, { useState } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { Card } from '../../components/data-display/Card.jsx';
import { IMEIInput, PhoneInput } from '../../components/forms/TextInput.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Alert } from '../../components/feedback/Alert.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Radio, CheckCircle2 } from 'lucide-react';

export const AutoRegistrationPage = () => {
  const [imei, setImei] = useState('867543048192019');
  const [currentPhone, setCurrentPhone] = useState('+880 1711-892019');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!imei || imei.length < 14) {
      setError('Please enter a valid 14–16 digit IMEI number.');
      return;
    }
    if (!currentPhone) {
      setError('Please provide current active phone number (MSISDN).');
      return;
    }

    try {
      setIsLoading(true);
      const res = await mockApi.autoRegisterDevice({
        imei,
        currentPhoneNumber: currentPhone,
      });
      setResult(res);
      addToast('Device paired and registered in NEIR.', 'success');
    } catch (err) {
      setError(err.message || 'Auto registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Auto Registration"
        description="Manual operational trigger to emulate MNO network attachment SIM-IMEI pairing into BTRC White List."
        breadcrumbs={[
          { label: 'Device Operations' },
          { label: 'Auto Registration' }
        ]}
      />

      <div className="max-w-xl mx-auto">
        <Card
          title="Manual Network Sync Registration"
          subtitle="Direct pairing bypass for official testing and carrier verification"
        >
          {error && (
            <Alert variant="danger" title="Registration Failed" className="mb-4">
              {error}
            </Alert>
          )}

          {result && (
            <Alert variant="success" title="Device Registered Successfully" className="mb-4">
              <p>{result.message}</p>
              <p className="mt-1 font-mono text-[11px]">Audit Token: {result.referenceId}</p>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <IMEIInput
              label="IMEI Number"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              required
            />

            <PhoneInput
              label="Current Phone Number (MSISDN)"
              value={currentPhone}
              onChange={(e) => setCurrentPhone(e.target.value)}
              required
            />

            <div className="pt-2 border-t border-[#E2E5F0] flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
              >
                Register Device
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
