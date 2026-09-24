import React from 'react';
import { FileText, Download, Eye, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../forms/Button.jsx';

export const DocumentList = ({
  documents = [],
  selectedDocId,
  onSelectDoc,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {documents.map((doc) => {
        const isSelected = selectedDocId === doc.id;
        return (
          <button
            key={doc.id}
            type="button"
            onClick={() => onSelectDoc && onSelectDoc(doc)}
            className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
              isSelected
                ? 'border-[#01ADC1] bg-[#01ADC1]/5 shadow-xs'
                : 'border-[#E2E5F0] bg-white hover:bg-[#F7F8FC]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                isSelected ? 'bg-[#01ADC1] text-white' : 'bg-[#E1F7FB] text-[#01ADC1]'
              }`}>
                <FileText className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#01ADC1]">
                  {doc.type}
                </div>
                <div className="text-sm font-medium text-[#202338] truncate mt-0.5">
                  {doc.title}
                </div>
                <div className="text-xs text-[#7A8197] flex items-center gap-2 mt-0.5 font-mono">
                  <span>{doc.filename}</span>
                  <span>·</span>
                  <span>{doc.size}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              <span className={`text-xs px-2 py-1 rounded font-medium ${
                isSelected ? 'bg-[#01ADC1] text-white' : 'text-[#626981] bg-[#F7F8FC]'
              }`}>
                {isSelected ? 'Viewing' : 'Inspect'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export const DocumentViewerPlaceholder = ({
  document,
  className = '',
}) => {
  if (!document) {
    return (
      <div className={`h-full min-h-[400px] border border-dashed border-[#E2E5F0] rounded-lg bg-[#F7F8FC] flex flex-col items-center justify-center p-6 text-center ${className}`}>
        <FileText className="w-10 h-10 text-[#7A8197] mb-2" />
        <h4 className="text-sm font-semibold text-[#202338]">No Document Selected</h4>
        <p className="text-xs text-[#7A8197] max-w-xs mt-1">
          Select an official document or customs receipt from the dossier list to preview.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white border border-[#E2E5F0] rounded-lg overflow-hidden shadow-xs ${className}`}>
      {/* Viewer Header */}
      <div className="px-4 py-3 bg-[#202338] text-white flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="truncate">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mr-2">
              [{document.type}]
            </span>
            <span className="text-sm font-medium text-white truncate">{document.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 h-7 text-xs px-2"
            onClick={() => alert(`Document "${document.filename}" downloaded.`)}
            icon={Download}
          >
            Download
          </Button>
        </div>
      </div>

      {/* Viewer Simulated Document Canvas */}
      <div className="flex-1 min-h-[380px] p-6 bg-[#E5E9EE] flex items-center justify-center overflow-auto">
        <div className="w-full max-w-lg bg-white rounded-md shadow-md p-6 border border-[#C9CEE0] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E1F7FB]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#028A97] flex items-center justify-center text-white text-[10px] font-bold">
                BD
              </div>
              <span className="text-xs font-bold text-[#202338] tracking-wide">
                GOVERNMENT / CUSTOMS VERIFICATION RECORD
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#028A97] font-medium bg-[#028A97]/10 px-2 py-0.5 rounded">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dossier Match Verified</span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-2.5 bg-[#F7F8FC] rounded border border-[#E2E5F0] flex justify-between">
              <span className="text-[#626981]">Document Reference:</span>
              <span className="font-semibold text-[#202338]">{document.filename}</span>
            </div>
            <div className="p-2.5 bg-[#F7F8FC] rounded border border-[#E2E5F0] flex justify-between">
              <span className="text-[#626981]">Document Category:</span>
              <span className="font-semibold text-[#01ADC1]">{document.type}</span>
            </div>
            <div className="p-2.5 bg-[#F7F8FC] rounded border border-[#E2E5F0] flex justify-between">
              <span className="text-[#626981]">File Footprint:</span>
              <span className="font-semibold text-[#202338]">{document.size} (Signed & Stamped)</span>
            </div>
          </div>

          {/* Graphical placeholder representing scanned passport / customs invoice */}
          <div className="border border-[#E2E5F0] rounded bg-[#F7F8FC] p-4 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#01ADC1]/10 flex items-center justify-center text-[#01ADC1]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#202338]">High-Resolution Archival Scan</p>
              <p className="text-[11px] text-[#7A8197] mt-0.5">BTRC Spectrum Division Document Preview Engine</p>
            </div>
          </div>

          <div className="text-[11px] text-[#7A8197] text-center italic">
            Watermarked for internal BTRC administrative verification purposes only.
          </div>
        </div>
      </div>

      <div className="px-4 py-2 border-t border-[#E2E5F0] bg-[#F7F8FC] flex items-center justify-between text-xs text-[#626981]">
        <span>Uploaded: {document.date || '2026-03-20'}</span>
        <span>Status: Stored on BTRC Gov Cloud</span>
      </div>
    </div>
  );
};
