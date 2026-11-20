'use client';

import { useCallback, useRef, useState } from 'react';
import { FileText } from 'lucide-react';

interface PdfDropzoneProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  label?: string;
}

export function PdfDropzone({ onFiles, multiple = false, label }: PdfDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList?.length) return;
      const selected = Array.from(fileList);
      const files = selected.filter((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
      if (!files.length) {
        setError('Please choose a valid PDF file.');
        return;
      }
      setError('');
      onFiles(multiple ? files : files.slice(0, 1));
      if (files.length !== selected.length) setError('Non-PDF files were skipped.');
    },
    [onFiles, multiple]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl2 border-2 border-dashed p-10 text-center transition-colors ${
        dragging ? 'border-primary-400 bg-primary-50 dark:bg-primary-500/10' : 'border-black/15 dark:border-white/15'
      }`}
    >
      <FileText className="h-8 w-8 text-black/30 dark:text-white/30" />
      <p className="text-sm font-medium">{label ?? (multiple ? 'Drop PDF files here, or click to browse' : 'Drop a PDF here, or click to browse')}</p>
      <p className="text-xs text-black/40 dark:text-white/40">Processed entirely in your browser — nothing is uploaded</p>
      {error && <p role="alert" className="text-xs text-danger">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.currentTarget.value = '';
        }}
      />
    </div>
  );
}
