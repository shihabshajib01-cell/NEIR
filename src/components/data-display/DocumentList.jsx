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
                ? 'border-[#14804A] bg-[#14804A]/5 shadow-xs'
                : 'border-[#D8E0E8] bg-white hover:bg-[#F4F7FA]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                isSelected ? 'bg-[#14804A] text-white' : 'bg-[#EAEFF5] text-[#173F5F]'
              }`}>
                <FileText className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#147D83]">
                  {doc.type}
                </div>
                <div className="text-sm font-medium text-[#172B4D] truncate mt-0.5">
                  {doc.title}
                </div>
                <div className="text-xs text-[#748597] flex items-center gap-2 mt-0.5 font-mono">
                  <span>{doc.filename}</span>
                  <span>·</span>
                  <span>{doc.size}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              <span className={`text-xs px-2 py-1 rounded font-medium ${
                isSelected ? 'bg-[#14804A] text-white' : 'text-[#52677A] bg-[#F4F7FA]'
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
      <div className={`h-full min-h-[400px] border border-dashed border-[#D8E0E8] rounded-lg bg-[#F4F7FA] flex flex-col items-center justify-center p-6 text-center ${className}`}>
        <FileText className="w-10 h-10 text-[#748597] mb-2" />
        <h4 className="text-sm font-semibold text-[#172B4D]">No Document Selected</h4>
        <p className="text-xs text-[#748597] max-w-xs mt-1">
          Select an official document or customs receipt from the dossier list to preview.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white border border-[#D8E0E8] rounded-lg overflow-hidden shadow-xs ${className}`}>
      {/* Viewer Header */}
      <div className="px-4 py-3 bg-[#102A43] text-white flex items-center justify-between">
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
        <div className="w-full max-w-lg bg-white rounded-md shadow-md p-6 border border-[#C1CBD6] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAEFF5]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#10683D] flex items-center justify-center text-white text-[10px] font-bold">
                BD
              </div>
              <span className="text-xs font-bold text-[#102A43] tracking-wide">
                GOVERNMENT / CUSTOMS VERIFICATION RECORD
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#10683D] font-medium bg-[#10683D]/10 px-2 py-0.5 rounded">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dossier Match Verified</span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-2.5 bg-[#F4F7FA] rounded border border-[#D8E0E8] flex justify-between">
              <span className="text-[#52677A]">Document Reference:</span>
              <span className="font-semibold text-[#172B4D]">{document.filename}</span>
            </div>
            <div className="p-2.5 bg-[#F4F7FA] rounded border border-[#D8E0E8] flex justify-between">
              <span className="text-[#52677A]">Document Category:</span>
              <span className="font-semibold text-[#147D83]">{document.type}</span>
            </div>
            <div className="p-2.5 bg-[#F4F7FA] rounded border border-[#D8E0E8] flex justify-between">
              <span className="text-[#52677A]">File Footprint:</span>
              <span className="font-semibold text-[#172B4D]">{document.size} (Signed & Stamped)</span>
            </div>
          </div>

          {/* Graphical placeholder representing scanned passport / customs invoice */}
          <div className="border border-[#D8E0E8] rounded bg-[#FAFCFE] p-4 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#173F5F]/10 flex items-center justify-center text-[#173F5F]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#172B4D]">High-Resolution Archival Scan</p>
              <p className="text-[11px] text-[#748597] mt-0.5">BTRC Spectrum Division Document Preview Engine</p>
            </div>
          </div>

          <div className="text-[11px] text-[#748597] text-center italic">
            Watermarked for internal BTRC administrative verification purposes only.
          </div>
        </div>
      </div>

      <div className="px-4 py-2 border-t border-[#D8E0E8] bg-[#F4F7FA] flex items-center justify-between text-xs text-[#52677A]">
        <span>Uploaded: {document.date || '2026-03-20'}</span>
        <span>Status: Stored on BTRC Gov Cloud</span>
      </div>
    </div>
  );
};
