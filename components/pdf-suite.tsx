'use client';

import { useMemo, useState } from 'react';
import { Download, FilePlus2, RotateCw, Trash2 } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import { ToolShell } from '@/components/tool-shell';
import { PdfDropzone } from '@/components/pdf-dropzone';
import { Button } from '@/components/ui/button';

type Operation = 'extract' | 'delete' | 'reorder' | 'rotate' | 'blank' | 'metadata' | 'inspect';

const OPERATIONS: { key: Operation; label: string; description: string }[] = [
  { key: 'extract', label: 'Extract pages', description: 'Create a new PDF from selected pages.' },
  { key: 'delete', label: 'Delete pages', description: 'Remove selected pages and keep the rest.' },
  { key: 'reorder', label: 'Reorder pages', description: 'Choose a new page order like 3,1,2.' },
  { key: 'rotate', label: 'Rotate pages', description: 'Rotate selected pages by 90° increments.' },
  { key: 'blank', label: 'Add blank page', description: 'Append a standard blank page.' },
  { key: 'metadata', label: 'Edit metadata', description: 'Update title, author, subject, and keywords.' },
  { key: 'inspect', label: 'Inspect PDF', description: 'View page count, file size, and document metadata.' },
];

function parsePages(input: string, max: number) {
  const pages = new Set<number>();
  for (const part of input.split(',')) {
    const value = part.trim();
    if (!value) continue;
    if (value.includes('-')) {
      const [rawStart, rawEnd] = value.split('-');
      const start = Number(rawStart);
      const end = Number(rawEnd);
      if (Number.isInteger(start) && Number.isInteger(end)) {
        const low = Math.min(start, end);
        const high = Math.max(start, end);
        for (let page = low; page <= high; page += 1) if (page >= 1 && page <= max) pages.add(page);
      }
    } else {
      const page = Number(value);
      if (Number.isInteger(page) && page >= 1 && page <= max) pages.add(page);
    }
  }
  return [...pages].sort((a, b) => a - b);
}

function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const fieldClass = 'w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5';

export function PdfSuite() {
  const [file, setFile] = useState<File | null>(null);
  const [doc, setDoc] = useState<PDFDocument | null>(null);
  const [operation, setOperation] = useState<Operation>('extract');
  const [pages, setPages] = useState('1');
  const [rotation, setRotation] = useState('90');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [keywords, setKeywords] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageCount = doc?.getPageCount() ?? 0;
  const selectedPages = useMemo(() => parsePages(pages, pageCount), [pages, pageCount]);

  async function loadFile(files: File[]) {
    const next = files[0];
    if (!next) return;
    setError(null);
    setFile(next);
    try {
      const loaded = await PDFDocument.load(await next.arrayBuffer());
      setDoc(loaded);
      setPages(`1-${loaded.getPageCount()}`);
      setTitle(loaded.getTitle() ?? '');
      setAuthor(loaded.getAuthor() ?? '');
      setSubject(loaded.getSubject() ?? '');
      setKeywords(loaded.getKeywords() ?? '');
    } catch {
      setDoc(null);
      setError('Could not open this PDF. It may be encrypted or corrupted.');
    }
  }

  function reset() {
    setFile(null);
    setDoc(null);
    setPages('1');
    setError(null);
  }

  async function process() {
    if (!doc || !file) return;
    setProcessing(true);
    setError(null);
    try {
      if (operation === 'inspect') return;

      if (operation === 'blank') {
        doc.addPage([612, 792]);
        downloadPdf(await doc.save(), `${file.name.replace(/\.pdf$/i, '')}-with-blank-page.pdf`);
        return;
      }

      if (operation === 'metadata') {
        if (title.trim()) doc.setTitle(title.trim()); else doc.setTitle('');
        if (author.trim()) doc.setAuthor(author.trim()); else doc.setAuthor('');
        if (subject.trim()) doc.setSubject(subject.trim()); else doc.setSubject('');
        doc.setKeywords(keywords.split(',').map((k) => k.trim()).filter(Boolean));
        downloadPdf(await doc.save(), `${file.name.replace(/\.pdf$/i, '')}-metadata.pdf`);
        return;
      }

      const selected = selectedPages;
      if (!selected.length) throw new Error('Select at least one valid page.');

      if (operation === 'rotate') {
        const output = await PDFDocument.load(await file.arrayBuffer());
        const amount = Number(rotation);
        for (const pageNumber of selected) {
          const page = output.getPage(pageNumber - 1);
          const current = page.getRotation().angle;
          page.setRotation(degrees((current + amount + 360) % 360));
        }
        downloadPdf(await output.save(), `${file.name.replace(/\.pdf$/i, '')}-rotated.pdf`);
        return;
      }

      const source = await PDFDocument.load(await file.arrayBuffer());
      const output = await PDFDocument.create();
      let indexes: number[];
      if (operation === 'extract') {
        indexes = selected.map((page) => page - 1);
      } else if (operation === 'delete') {
        const remove = new Set(selected.map((page) => page - 1));
        indexes = Array.from({ length: source.getPageCount() }, (_, index) => index).filter((index) => !remove.has(index));
        if (!indexes.length) throw new Error('You cannot delete every page from a PDF.');
      } else {
        const unique = new Set(selected);
        if (unique.size !== selected.length) throw new Error('Reorder list contains duplicate pages.');
        indexes = selected.map((page) => page - 1);
      }

      const copied = await output.copyPages(source, indexes);
      copied.forEach((page) => output.addPage(page));
      const suffix = operation === 'extract' ? 'extracted' : operation === 'delete' ? 'pages-removed' : 'reordered';
      downloadPdf(await output.save(), `${file.name.replace(/\.pdf$/i, '')}-${suffix}.pdf`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not process this PDF.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <ToolShell shareSlug="pdf-tools" onReset={reset}>
      {!file && <PdfDropzone onFiles={loadFile} label="Drop a PDF here, or click to browse" />}

      {file && doc && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/5">
            <div><p className="font-medium">{file.name}</p><p className="text-xs text-black/50 dark:text-white/50">{pageCount} page{pageCount === 1 ? '' : 's'} · {(file.size / 1024 / 1024).toFixed(2)} MB</p></div>
            <Button size="sm" variant="outline" onClick={reset}>Choose another</Button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {OPERATIONS.map((item) => <button key={item.key} type="button" onClick={() => setOperation(item.key)} className={`rounded-xl border p-3 text-left transition ${operation === item.key ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-500/10' : 'border-black/10 dark:border-white/10'}`}><div className="text-sm font-semibold">{item.label}</div><div className="mt-1 text-xs text-black/50 dark:text-white/50">{item.description}</div></button>)}
          </div>

          {operation === 'inspect' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {[['Pages', String(pageCount)], ['File size', `${(file.size / 1024 / 1024).toFixed(2)} MB`], ['Title', doc.getTitle() || '—'], ['Author', doc.getAuthor() || '—'], ['Subject', doc.getSubject() || '—']].map(([label, value]) => <div key={label} className="rounded-xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/5"><div className="text-xs uppercase tracking-wide text-black/40 dark:text-white/40">{label}</div><div className="mt-1 break-words text-sm font-medium">{value}</div></div>)}
            </div>
          ) : operation === 'metadata' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium">Title<input value={title} onChange={(e) => setTitle(e.target.value)} className={`mt-1 ${fieldClass}`} /></label>
              <label className="text-sm font-medium">Author<input value={author} onChange={(e) => setAuthor(e.target.value)} className={`mt-1 ${fieldClass}`} /></label>
              <label className="text-sm font-medium">Subject<input value={subject} onChange={(e) => setSubject(e.target.value)} className={`mt-1 ${fieldClass}`} /></label>
              <label className="text-sm font-medium">Keywords<input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="pdf, document, report" className={`mt-1 ${fieldClass}`} /></label>
            </div>
          ) : operation === 'blank' ? (
            <div className="rounded-xl border border-primary-400/30 bg-primary-50/30 p-5 dark:bg-primary-500/5"><p className="text-sm">A standard US Letter blank page will be appended to the end of this document.</p></div>
          ) : (
            <div className="space-y-4">
              <label className="block text-sm font-medium">{operation === 'reorder' ? 'New page order' : 'Pages'}<input value={pages} onChange={(e) => setPages(e.target.value)} placeholder={operation === 'reorder' ? 'e.g. 3,1,2,4' : 'e.g. 1-3, 5'} className={`mt-1 ${fieldClass}`} /></label>
              <p className="text-xs text-black/45 dark:text-white/45">Use 1-indexed page numbers. Ranges work for extract, delete, and rotate.</p>
              {operation === 'rotate' && <label className="block max-w-xs text-sm font-medium">Rotation<select value={rotation} onChange={(e) => setRotation(e.target.value)} className={`mt-1 ${fieldClass}`}><option value="90">90° clockwise</option><option value="180">180°</option><option value="270">270° clockwise</option></select></label>}
            </div>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}
          {operation !== 'inspect' && <Button disabled={processing} onClick={process}>{operation === 'rotate' ? <RotateCw className="h-4 w-4" /> : operation === 'delete' ? <Trash2 className="h-4 w-4" /> : operation === 'blank' ? <FilePlus2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}{processing ? 'Processing…' : `Apply ${OPERATIONS.find((item) => item.key === operation)?.label}`}</Button>}
        </div>
      )}

      {!file && error && <p className="text-sm text-danger">{error}</p>}
    </ToolShell>
  );
}
