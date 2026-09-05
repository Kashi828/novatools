'use client';

import { FormEvent, useState } from 'react';
import { ArrowUp, Bot, Copy, Loader2, Sparkles, User, WandSparkles } from 'lucide-react';

const suggestions = [
  'Explain what NovaTools can help me do.',
  'Help me choose the right tool for a PDF workflow.',
  'Write a clean professional email asking for an update.',
  'Explain this code in simple terms.',
];

type Message = { role: 'user' | 'assistant'; content: string };

export function NovaAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/nova-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-12) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Nova AI could not respond right now.');
      setMessages((current) => [...current, { role: 'assistant', content: data.text }]);
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
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-5xl flex-col px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500 shadow-sm shadow-primary-500/10">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-500">Nova AI</p>
        <h1 className="nova-title text-4xl font-bold tracking-tight sm:text-5xl">What can I help you do?</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-secondary-400 sm:text-base">Ask questions, create content, understand code, or find the right NovaTools workflow.</p>
      </div>

      <div className="flex-1 rounded-3xl border border-current/10 bg-[rgb(var(--surface-panel)/.72)] p-3 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-5 dark:shadow-black/20">
        <div className="min-h-[360px] space-y-5 overflow-y-auto rounded-2xl p-2 sm:p-4">
          {messages.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-500/15 bg-primary-500/5 text-primary-500"><WandSparkles className="h-7 w-7" /></div>
              <p className="text-sm font-semibold">Start with an idea</p>
              <div className="mt-5 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
                {suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setInput(suggestion)} className="rounded-xl border border-current/10 bg-[rgb(var(--surface-page)/.5)] px-4 py-3 text-left text-xs leading-5 text-secondary-400 transition hover:border-primary-500/25 hover:bg-primary-500/5 hover:text-[rgb(var(--color-text-primary))]">{suggestion}</button>)}
              </div>
            </div>
          ) : messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500"><Bot className="h-4 w-4" /></div>}
              <div className={`group max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-primary-600 text-white' : 'border border-current/10 bg-[rgb(var(--surface-page)/.55)]'}`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.role === 'assistant' && <button type="button" onClick={() => copy(message.content)} className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-secondary-400 transition hover:text-[rgb(var(--color-text-primary))]"><Copy className="h-3 w-3" /> Copy</button>}
              </div>
              {message.role === 'user' && <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--surface-page)/.7)] text-secondary-400"><User className="h-4 w-4" /></div>}
            </div>
          ))}
          {loading && <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500"><Bot className="h-4 w-4" /></div><div className="rounded-2xl border border-current/10 bg-[rgb(var(--surface-page)/.55)] px-4 py-3"><Loader2 className="h-4 w-4 animate-spin text-primary-500" /></div></div>}
        </div>

        {error && <p role="alert" className="mx-2 mb-3 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-600 dark:text-red-400">{error}</p>}

        <form onSubmit={sendMessage} className="rounded-2xl border border-current/10 bg-[rgb(var(--surface-page)/.72)] p-2 shadow-sm">
          <div className="flex items-end gap-2">
            <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder="Message Nova AI..." rows={1} maxLength={4000} className="min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-secondary-400" aria-label="Message Nova AI" />
            <button type="submit" disabled={!input.trim() || loading} aria-label="Send message" className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
          </div>
        </form>
        <p className="px-2 pt-2 text-center text-[11px] text-secondary-400">Nova AI can make mistakes. Check important information before relying on it.</p>
      </div>
    </section>
  );
}
