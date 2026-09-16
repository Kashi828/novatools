'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, MessageSquare } from 'lucide-react';
import type { Comment } from '@/lib/comments';

export function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/comments');
      const data = await res.json();
      setComments(data.comments ?? []);
      setIsAdmin(!!data.isAdmin);
    } catch {
      setError('Could not load comments right now.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text }),
      });
      if (!res.ok) throw new Error();
      setText('');
      await load();
    } catch {
      setError('Could not post your comment. Try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    const previous = comments;
    setComments((prev) => prev.filter((c) => c.id !== id));
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
    } catch {
      setComments(previous);
      setError('Could not delete that comment.');
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="space-y-3 rounded-xl2 border border-black/10 bg-white/70 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={40}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts about NovaTools..."
          rows={3}
          maxLength={500}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-black/40 dark:text-white/40">{text.length}/500</span>
          <Button type="submit" disabled={submitting || !text.trim()}>
            {submitting ? 'Posting...' : 'Post comment'}
          </Button>
        </div>
      </form>

      {error && <p className="text-sm text-danger">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
        </div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center text-black/40 dark:text-white/40">
          <MessageSquare className="h-8 w-8" />
          <p className="text-sm">No comments yet — be the first to share your thoughts.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="rounded-xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-medium">{c.name}</span>
                  <span className="ml-2 text-xs text-black/40 dark:text-white/40">
                    {new Date(c.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {isAdmin && (
                  <button onClick={() => remove(c.id)} className="shrink-0 text-black/30 hover:text-danger dark:text-white/30" aria-label="Delete comment">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-black/70 dark:text-white/70">{c.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
