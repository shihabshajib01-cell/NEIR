import React from 'react';
import { FileText, Download, ShieldCheck } from 'lucide-react';
import { Button } from '../forms/Button.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const DocumentList = ({ documents = [], selectedDocId, onSelectDoc, className = '' }) => {
  const { t } = usePreferences();

  return (
    <div className={'flex flex-col gap-2 ' + className}>
      {documents.map((doc) => {
        const selected = selectedDocId === doc.id;
        return (
          <button
            key={doc.id}
            type="button"
            onClick={() => onSelectDoc?.(doc)}
            className={'w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ' +
              (selected ? 'border-[var(--color-primary)] bg-[rgba(1,173,193,0.05)] shadow-[var(--shadow-sm)]' : 'border-[var(--color-border)] bg-white hover:bg-[var(--color-background-subtle)]')}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ' + (selected ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]')}>
                <FileText className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-dark)]">{doc.type}</div>
                <div className="text-sm font-medium text-[var(--color-text-primary)] truncate mt-0.5">{doc.title}</div>
                <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-2 mt-0.5 font-mono">
                  <span className="truncate">{doc.filename}</span><span>·</span><span>{doc.size}</span>
                </div>
              </div>
            </div>
            <span className={'text-xs px-2 py-1 rounded-lg font-medium shrink-0 ml-2 ' + (selected ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] bg-[var(--color-background)]')}>
              {selected ? t('Viewing') : t('Inspect')}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export const DocumentViewerPlaceholder = ({ document, className = '' }) => {
  const { t } = usePreferences();

  if (!document) {
    return (
      <div className={'h-full min-h-[400px] border border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-background-subtle)] flex flex-col items-center justify-center p-6 text-center ' + className}>
        <FileText className="w-10 h-10 text-[var(--color-text-muted)] mb-2" />
        <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">{t('No Document Selected')}</h4>
        <p className="text-xs text-[var(--color-text-muted)] max-w-xs mt-1">{t('Select an official document or customs receipt from the dossier list to preview.')}</p>
      </div>
    );
  }

  return (
    <div className={'flex flex-col h-full bg-white border border-[var(--color-border)] rounded-xl overflow-hidden shadow-[var(--shadow-sm)] ' + className}>
      <div className="px-4 py-3 bg-[var(--color-primary-dark)] text-white flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-cyan-100 shrink-0" />
          <div className="truncate">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-100 mr-2">[{document.type}]</span>
            <span className="text-sm font-medium text-white truncate">{document.title}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={() => alert('Document "' + document.filename + '" downloaded.')} icon={Download}>
          Download
        </Button>
      </div>

      <div className="flex-1 min-h-[380px] p-4 sm:p-6 bg-[var(--color-background)] flex items-center justify-center overflow-auto">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-[var(--shadow-md)] p-5 sm:p-6 border border-[var(--color-border)] flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-dark)] flex items-center justify-center text-white text-[10px] font-bold">BD</div>
              <span className="text-xs font-bold text-[var(--color-text-primary)] tracking-wide">GOVERNMENT / CUSTOMS VERIFICATION RECORD</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#1B5E20] font-medium bg-[rgba(46,125,50,0.10)] px-2 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5" /><span>Dossier Match Verified</span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {[
              ['Document Reference:', document.filename],
              ['Document Category:', document.type],
              ['File Footprint:', document.size + ' (Signed & Stamped)'],
            ].map(([label, value]) => (
              <div key={label} className="p-2.5 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)] flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-[var(--color-text-secondary)]">{label}</span>
                <span className="font-semibold text-[var(--color-text-primary)] break-all">{value}</span>
              </div>
            ))}
          </div>

          <div className="border border-[var(--color-border)] rounded-xl bg-[var(--color-background-subtle)] p-4 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[rgba(1,173,193,0.10)] flex items-center justify-center text-[var(--color-primary-dark)]"><FileText className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-primary)]">High-Resolution Archival Scan</p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">BTRC Spectrum Division Document Preview Engine</p>
            </div>
          </div>

          <div className="text-[11px] text-[var(--color-text-muted)] text-center italic">Watermarked for internal BTRC administrative verification purposes only.</div>
        </div>
      </div>

      <div className="px-4 py-2 border-t border-[var(--color-border)] bg-[var(--color-background-subtle)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-[var(--color-text-secondary)]">
        <span>Uploaded: {document.date || '2026-03-20'}</span>
        <span>Status: Stored on BTRC Gov Cloud</span>
      </div>
    </div>
  );
};
