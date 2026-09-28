import React from 'react';
import { FileText, Download, ShieldCheck, X } from 'lucide-react';
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
                <p className="text-xs font-semibold text-[var(--color-primary-dark)]">{doc.type}</p>
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate mt-0.5">{doc.title}</p>
                <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-2 mt-0.5 font-mono">
                  <p className="truncate">{doc.filename}</p><p>·</p><p>{doc.size}</p>
                </div>
              </div>
            </div>
            <p className={'text-xs px-2 py-1 rounded-lg font-medium shrink-0 ml-2 ' + (selected ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] bg-[var(--color-background)]')}>
              {selected ? t('Viewing') : t('Inspect')}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export const DocumentViewerPlaceholder = ({ document, onClosePreview, className = '' }) => {
  const { t } = usePreferences();

  if (!document) {
    return (
      <div className={'h-full min-h-[400px] border border-dashed border-[var(--color-border)] rounded-lg bg-[var(--color-background-subtle)] flex flex-col items-center justify-center p-6 text-center ' + className}>
        <FileText className="w-10 h-10 text-[var(--color-text-muted)] mb-2" />
        <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">{t('No Document Selected')}</h4>
        <p className="text-xs text-[var(--color-text-muted)] max-w-xs mt-1">{t('Select an official document or customs receipt from the dossier list to preview.')}</p>
      </div>
    );
  }

  return (
    <section className={'flex flex-col h-full bg-white border border-[var(--color-border)] rounded-lg overflow-hidden shadow-xs ' + className}>
      <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-white">
        <div className="flex items-center gap-2.5 min-w-0">
          <FileText className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{document.type}</p>
            <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">{document.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onClosePreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClosePreview}
              icon={X}
            >
              Close preview
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Document "' + document.filename + '" downloaded.')}
            icon={Download}
          >
            Download
          </Button>
        </div>
      </div>

      <div className="px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-background-subtle)] flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
        <p className="font-mono text-[var(--color-text-secondary)]">{document.filename}</p>
        <p className="text-[var(--color-text-muted)]">·</p>
        <p className="text-[var(--color-text-secondary)]">{document.size}</p>
        <p className="text-[var(--color-text-muted)]">·</p>
        <p className="text-[var(--color-text-secondary)]">{document.date || '2026-03-20'}</p>
        <div className="ml-auto flex items-center gap-1.5 text-[var(--color-success)] bg-[rgba(46,125,50,0.10)] px-2 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <p className="font-medium">Verified</p>
        </div>
      </div>

      <div className="flex-1 min-h-[420px] overflow-auto bg-[var(--color-background-subtle)] p-4">
        <div className="w-full min-h-[520px] bg-white border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{document.title}</p>
              <p className="text-xs font-mono text-[var(--color-text-muted)] mt-1 truncate">{document.filename}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          <div className="py-4 space-y-4" aria-hidden="true">
            <div className="h-2.5 w-2/5 rounded bg-[var(--color-border-subtle)]" />
            <div className="space-y-3">
              <div className="h-2 w-full rounded bg-[var(--color-background-subtle)]" />
              <div className="h-2 w-11/12 rounded bg-[var(--color-background-subtle)]" />
              <div className="h-2 w-4/5 rounded bg-[var(--color-background-subtle)]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-subtle)]" />
              <div className="h-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-subtle)]" />
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full rounded bg-[var(--color-background-subtle)]" />
              <div className="h-2 w-5/6 rounded bg-[var(--color-background-subtle)]" />
              <div className="h-2 w-3/5 rounded bg-[var(--color-background-subtle)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
