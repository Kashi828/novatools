'use client';

import { useCallback, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface ImageDropzoneProps {
  onFile: (file: File) => void;
  accept?: string;
}

export function ImageDropzone({ onFile, accept = 'image/*' }: ImageDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) onFile(file);
    },
    [onFile]
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
      <UploadCloud className="h-8 w-8 text-black/30 dark:text-white/30" />
      <p className="text-sm font-medium">Drop an image here, or click to browse</p>
      <p className="text-xs text-black/40 dark:text-white/40">Processed entirely in your browser — nothing is uploaded</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
