'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Bot, Check, Copy, Download, RotateCcw, Share2 } from 'lucide-react';
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

export function ToolShell({ children, outputValue, downloadFilename = 'output.txt', onReset, shareSlug }: ToolShellProps) {
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
    await copyToClipboard(`${window.location.origin}/tools/${shareSlug}`);
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
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }} className="space-y-5">
      {children}
      <div className="flex flex-wrap gap-2 pt-1">
        {outputValue !== undefined && <Button variant="secondary" size="sm" onClick={handleCopy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy'}</Button>}
        {outputValue !== undefined && <Button variant="outline" size="sm" onClick={handleDownload}><Download className="h-4 w-4" />Download</Button>}
        {onReset && <Button variant="ghost" size="sm" onClick={onReset}><RotateCcw className="h-4 w-4" />Reset</Button>}
        {shareSlug && <Button variant="ghost" size="sm" onClick={handleShare}><Share2 className="h-4 w-4" />{shared ? 'Link copied' : 'Share'}</Button>}
        {shareSlug && <Link href={`/nova-ai?tool=${encodeURIComponent(shareSlug)}`} className="inline-flex h-9 items-center gap-2 rounded-md border border-primary-500/20 bg-primary-500/5 px-3 text-sm font-medium text-primary-500 transition hover:bg-primary-500/10"><Bot className="h-4 w-4" />Ask Nova AI</Link>}
      </div>
    </motion.div>
  );
}
