'use client';

import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Download, RotateCcw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyToClipboard, downloadText } from '@/lib/utils';
import { useToast } from '@/components/toast-provider';

interface ToolShellProps {
  children: ReactNode;
  outputValue?: string;
  downloadFilename?: string;
  onReset?: () => void;
  shareSlug?: string;
}

export function ToolShell({
  children,
  outputValue,
  downloadFilename = 'output.txt',
  onReset,
  shareSlug,
}: ToolShellProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const { showToast } = useToast();

  async function handleCopy() {
    if (!outputValue) return;
    await copyToClipboard(outputValue);
    setCopied(true);
    showToast('Copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleShare() {
    if (!shareSlug) return;
    const url = `${window.location.origin}/tools/${shareSlug}`;
    await copyToClipboard(url);
    setShared(true);
    showToast('Link copied — share away', 'success');
    setTimeout(() => setShared(false), 1500);
  }

  function handleDownload() {
    if (!outputValue) return;
    downloadText(downloadFilename, outputValue);
    showToast('Download started', 'success');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-5"
    >
      {children}
      <div className="flex flex-wrap gap-2 pt-1">
        {outputValue !== undefined && (
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        )}
        {outputValue !== undefined && (
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download
          </Button>
        )}
        {onReset && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        )}
        {shareSlug && (
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            {shared ? 'Link copied' : 'Share'}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
