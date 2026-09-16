'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowUp, Bot, CheckCircle2, Copy, FileUp, Loader2, Paperclip, Sparkles, Trash2, User, WandSparkles, X } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };
type Attachment = { id: string; file: File; preview?: string };
type Quota = { used: number; remaining: number; limit: number | null };

const aiTools = [
  ['Summarize', 'Turn long text or documents into clear key points.'],
  ['Rewrite', 'Make writing professional, concise, friendly, or persuasive.'],
  ['Extract', 'Pull names, dates, tables, action items, or structured data.'],
  ['Translate', 'Translate text or supported documents while preserving meaning.'],
  ['Explain code', 'Understand errors, functions, architecture, and code snippets.'],
  ['Analyze data', 'Ask questions about CSV/XLSX-like data or pasted tables.'],
  ['Study helper', 'Create notes, quizzes, flashcards, and simple explanations.'],
  ['Prompt builder', 'Turn rough ideas into strong prompts for AI tools.'],
  ['Email writer', 'Draft replies, follow-ups, applications, and professional emails.'],
  ['Developer helper', 'Generate JSON, regex, SQL, API examples, and debugging help.'],
  ['Tool finder', 'Describe a task and Nova AI recommends the right NovaTools workflow.'],
  ['Content studio', 'Brainstorm posts, titles, outlines, scripts, and captions.'],
] as const;

const suggestions = [
  'Summarize this file and list the important action items.',
  'Explain this code and point out possible bugs.',
  'Turn this into a professional email.',
  'Which NovaTools should I use for this task?',
];

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function NovaAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quota, setQuota] = useState<Quota | null>(null);
  const [showTools, setShowTools] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tool = params.get('tool');
    if (tool) setInput(`Help me use the ${tool.replace(/-/g, ' ')} tool. Explain the best workflow and what I should provide.`);
  }, []);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = Array.from(list).slice(0, 3 - attachments.length);
    const accepted = next.filter((file) => file.size <= 8 * 1024 * 1024);
    setAttachments((current) => [...current, ...accepted.map((file) => ({ id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`, file }))]);
    if (next.some((file) => file.size > 8 * 1024 * 1024)) setError('Each attachment must be 8 MB or smaller.');
    else setError('');
  }

  function removeFile(id: string) {
    setAttachments((current) => current.filter((item) => item.id !== id));
  }

  async function fileToData(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
      reader.readAsDataURL(file);
    });
  }

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const text = input.trim();
    if ((!text && !attachments.length) || loading) return;
    setError('');
    setLoading(true);
    const attachedForRequest = [...attachments];
    const next = text ? [...messages, { role: 'user' as const, content: text }] : [...messages, { role: 'user' as const, content: 'Please process the attached file(s).' }];
    setMessages(next);
    setInput('');
    setAttachments([]);

    try {
      const files = await Promise.all(attachedForRequest.map(async ({ file }) => ({ name: file.name, type: file.type || 'application/octet-stream', size: file.size, data: await fileToData(file) })));
      const response = await fetch('/api/nova-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-12), files }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Nova AI could not respond right now.');
      setMessages((current) => [...current, { role: 'assistant', content: data.text }]);
      if (data.quota) setQuota(data.quota);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); } catch { /* Clipboard may be unavailable. */ }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500 shadow-sm shadow-primary-500/10"><Sparkles className="h-6 w-6" /></div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-500">Nova AI</p>
        <h1 className="nova-title text-4xl font-bold tracking-tight sm:text-5xl">Your AI workspace for NovaTools.</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-secondary-400 sm:text-base">Upload files, ask questions, create content, analyze data, understand code, and get AI assistance inside your tools.</p>
      </div>

      <div className="grid flex-1 gap-5 lg:grid-cols-[1fr_280px]">
        <div className="flex min-h-[620px] flex-col rounded-3xl border border-current/10 bg-[rgb(var(--surface-panel)/.72)] p-3 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-5 dark:shadow-black/20">
          <div className="flex-1 min-h-[380px] space-y-5 overflow-y-auto rounded-2xl p-2 sm:p-4">
            {messages.length === 0 ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-500/15 bg-primary-500/5 text-primary-500"><WandSparkles className="h-7 w-7" /></div>
                <p className="text-sm font-semibold">Start with a file or an idea</p>
                <p className="mt-1 max-w-md text-xs leading-5 text-secondary-400">Nova AI can work with supported uploads and your prompt together.</p>
                <div className="mt-5 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
                  {suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setInput(suggestion)} className="rounded-xl border border-current/10 bg-[rgb(var(--surface-page)/.5)] px-4 py-3 text-left text-xs leading-5 text-secondary-400 transition hover:border-primary-500/25 hover:bg-primary-500/5 hover:text-[rgb(var(--color-text-primary))]">{suggestion}</button>)}
                </div>
              </div>
            ) : messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500"><Bot className="h-4 w-4" /></div>}
                <div className={`group max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-primary-600 text-white' : 'border border-current/10 bg-[rgb(var(--surface-page)/.55)]'}`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.role === 'assistant' && <button type="button" onClick={() => copy(message.content)} className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-secondary-400 transition hover:text-[rgb(var(--color-text-primary))]"><Copy className="h-3 w-3" /> Copy</button>}
                </div>
                {message.role === 'user' && <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--surface-page)/.7)] text-secondary-400"><User className="h-4 w-4" /></div>}
              </div>
            ))}
            {loading && <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500"><Bot className="h-4 w-4" /></div><div className="rounded-2xl border border-current/10 bg-[rgb(var(--surface-page)/.55)] px-4 py-3"><Loader2 className="h-4 w-4 animate-spin text-primary-500" /></div></div>}
          </div>

          {error && <p role="alert" className="mx-2 mb-3 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-600 dark:text-red-400">{error}</p>}

          {attachments.length > 0 && <div className="mx-2 mb-2 flex flex-wrap gap-2">{attachments.map(({ id, file }) => <div key={id} className="flex items-center gap-2 rounded-xl border border-primary-500/15 bg-primary-500/5 px-3 py-2 text-xs"><FileUp className="h-4 w-4 text-primary-500" /><span className="max-w-40 truncate font-medium">{file.name}</span><span className="text-secondary-400">{formatBytes(file.size)}</span><button type="button" onClick={() => removeFile(id)} aria-label={`Remove ${file.name}`}><X className="h-3.5 w-3.5 text-secondary-400" /></button></div>)}</div>}

          <form onSubmit={sendMessage} className="rounded-2xl border border-current/10 bg-[rgb(var(--surface-page)/.72)] p-2 shadow-sm">
            <div className="flex items-end gap-2">
              <input ref={fileInput} type="file" multiple className="hidden" onChange={(event) => { addFiles(event.target.files); event.currentTarget.value = ''; }} accept="image/*,.pdf,.txt,.md,.csv,.json,.xml,.html,.css,.js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.h,.sql,.doc,.docx,.xls,.xlsx,.ppt,.pptx" />
              <button type="button" onClick={() => fileInput.current?.click()} disabled={loading || attachments.length >= 3} className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-current/10 text-secondary-400 transition hover:border-primary-500/25 hover:text-primary-500 disabled:opacity-40" aria-label="Attach files"><Paperclip className="h-4 w-4" /></button>
              <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder="Ask Nova AI to analyze, create, transform, explain, or help you use a tool..." rows={1} maxLength={4000} className="min-h-11 flex-1 resize-none bg-transparent px-2 py-3 text-sm outline-none placeholder:text-secondary-400" aria-label="Message Nova AI" />
              <button type="submit" disabled={(!input.trim() && !attachments.length) || loading} aria-label="Send message" className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
            </div>
            <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-secondary-400"><span>Up to 3 files • 8 MB each</span>{quota && <span>{quota.limit === null ? 'Unlimited • Admin' : `${quota.remaining.toLocaleString()} AI tokens remaining today`}</span>}</div>
          </form>
          <p className="px-2 pt-2 text-center text-[11px] text-secondary-400">Files are sent to the configured AI provider to answer your request. Avoid uploading sensitive information.</p>
        </div>

        <aside className="rounded-3xl border border-current/10 bg-[rgb(var(--surface-panel)/.58)] p-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="flex items-center justify-between"><div><p className="text-sm font-semibold">AI tools</p><p className="mt-0.5 text-xs text-secondary-400">Choose a starting capability</p></div><button type="button" onClick={() => setShowTools((value) => !value)} className="rounded-lg p-2 text-secondary-400 hover:text-primary-500 lg:hidden" aria-label="Toggle AI tools">{showTools ? <X className="h-4 w-4" /> : <WandSparkles className="h-4 w-4" />}</button></div>
          <div className={`${showTools ? 'mt-4 block' : 'hidden'} space-y-1 lg:mt-4 lg:block`}>
            {aiTools.map(([title, description]) => <button key={title} type="button" onClick={() => { setInput(`${title}: `); setShowTools(false); }} className="w-full rounded-xl px-3 py-2.5 text-left transition hover:bg-primary-500/5"><div className="flex items-center gap-2 text-xs font-semibold"><CheckCircle2 className="h-3.5 w-3.5 text-primary-500" />{title}</div><p className="mt-1 pl-5 text-[11px] leading-4 text-secondary-400">{description}</p></button>)}
          </div>
          <div className="mt-5 rounded-2xl border border-primary-500/10 bg-primary-500/5 p-3"><div className="flex items-center gap-2 text-xs font-semibold"><Sparkles className="h-3.5 w-3.5 text-primary-500" />NovaTools assistance</div><p className="mt-1.5 text-[11px] leading-4 text-secondary-400">Open Nova AI from a tool and it can explain that tool, suggest inputs, and help troubleshoot your workflow.</p></div>
        </aside>
      </div>
    </section>
  );
}
