import React, { useState } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { Card } from '../../components/data-display/Card.jsx';
import { CSVUpload } from '../../components/forms/FileUpload.jsx';
import { TextInput } from '../../components/forms/TextInput.jsx';
import { Select } from '../../components/forms/Select.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Alert } from '../../components/feedback/Alert.jsx';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { UploadCloud, RotateCcw, CheckCircle2, FileSpreadsheet, Download } from 'lucide-react';

export const ManufacturerUploadPage = () => {
  const [manufacturer, setManufacturer] = useState('Samsung Electronics Bangladesh Ltd.');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const { addToast } = useToast();

  const handleDownloadSample = () => {
    const csvContent =
      'imei1,imei2,brand,model,tac\n862940058912341,862940058912342,Samsung,Galaxy A55,86294005\n867543048192019,867543048192020,Xiaomi,Redmi Note 13,86754304\n354890112458901,354890112458902,Apple,iPhone 15 Pro,35489011';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'btrc_neir_manufacturer_imei_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Sample CSV template downloaded.', 'info');
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadResult(null);
  };

  const handleProcessUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      addToast('Please attach a CSV data file first.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const res = await mockApi.uploadManufacturerBatch({
        manufacturer,
        file: selectedFile,
      });
      setUploadResult(res);
      addToast(`Batch ${res.batchId} processed: ${res.totalProcessed} records ingested into White List.`, 'success');
    } catch (err) {
      addToast('Failed to process batch upload.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const previewColumns = [
    { key: 'imei1', title: 'IMEI 1 (Primary)', isMono: true },
    { key: 'imei2', title: 'IMEI 2 (Secondary)', isMono: true },
    { key: 'brand', title: 'Brand' },
    { key: 'model', title: 'Model' },
    { key: 'tac', title: 'TAC Code', isMono: true },
    {
      key: 'status',
      title: 'Validation',
      render: (val) => (
        <span className="text-xs font-semibold text-[#028A97] bg-[#01ADC1]/10 px-2 py-0.5 rounded">
          {val || 'Whitelisted'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manufacturer IMEI Upload"
        description="Bulk import authorized domestic manufacturing and officially imported IMEI batches into the National White List."
        breadcrumbs={[
          { label: 'Manufacturer Portal' },
          { label: 'IMEI Upload' }
        ]}
        actions={
          <Button
            variant="secondary"
            size="md"
            icon={Download}
            onClick={handleDownloadSample}
          >
            Download CSV Template
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5">
          <Card
            title="Batch Ingestion Form"
            subtitle="Upload standard CSV file containing dual-SIM TAC and IMEI entries"
          >
            <form onSubmit={handleProcessUpload} className="space-y-4">
              <Select
                label="Licensed Manufacturer / Importer"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                options={[
                  'Samsung Electronics Bangladesh Ltd.',
                  'Walton Digi-Tech Industries Ltd.',
                  'Xiaomi Technology Bangladesh',
                  'Symphony Mobile (Edison Group)',
                  'Vivo Mobile Bangladesh',
                  'Oppo Bangladesh Ltd.',
                  'Realme Bangladesh'
                ]}
                required
              />

              <CSVUpload
                label="Manufactured Handsets CSV File"
                helperText="Required columns: imei1, imei2, brand, model, tac"
                onFileSelect={(file) => setSelectedFile(file)}
                onSampleDownload={handleDownloadSample}
              />

              <div className="pt-2 border-t border-[#E2E5F0] flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  icon={RotateCcw}
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={UploadCloud}
                  isLoading={isLoading}
                  disabled={!selectedFile}
                >
                  Upload & Whitelist
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Preview / Ingestion Log (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {uploadResult ? (
            <div className="space-y-4">
              <Alert
                variant="success"
                title={`Batch ${uploadResult.batchId} Successfully Ingested`}
              >
                <div className="mt-1 space-y-1 text-xs">
                  <p>Manufacturer: <strong className="text-[#202338]">{uploadResult.manufacturer}</strong></p>
                  <p>Total Records Processed: <strong className="text-[#028A97] font-mono">{uploadResult.totalProcessed}</strong></p>
                  <p>Broadcast Target: <span className="font-mono">All 4 MNO Central EIR Nodes (GP, Robi, BL, TT)</span></p>
                </div>
              </Alert>

              <Card title="Ingested Handset Sample Preview">
                <DataTable
                  embedded
                  columns={previewColumns}
                  data={uploadResult.previewSample || []}
                  pagination={false}
                />
              </Card>
            </div>
          ) : (
            <Card title="Batch Validation Guidelines">
              <div className="space-y-3 text-xs text-[#626981] leading-relaxed">
                <p>
                  Local assemblers and type-approved importers must submit batch manifests before distributing mobile terminals into retail channels.
                </p>
                <div className="p-3 bg-[#F7F8FC] rounded-md border border-[#E2E5F0] space-y-1 font-mono text-[11px] text-[#202338]">
                  <p className="font-bold font-sans text-xs">Expected CSV Column Header Structure:</p>
                  <code>imei1,imei2,brand,model,tac</code>
                </div>
                <ul className="list-disc list-inside space-y-1 pt-1 text-[11px]">
                  <li>All IMEI numbers must pass the standard Luhn algorithm checksum.</li>
                  <li>Type Allocation Code (TAC) first 8 digits must match GSMA master allocations.</li>
                  <li>Duplicate IMEIs previously allocated will trigger duplicate rejection alerts.</li>
                </ul>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
