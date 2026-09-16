'use client';

import { useEffect, useState } from 'react';
import { Loader2, Trash2, MessageSquare } from 'lucide-react';
import type { Comment } from '@/lib/comments';

export function AdminCommentsPanel() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/comments');
      const data = await res.json();
      setComments(data.comments ?? []);
    } catch {
      setError('Could not load comments.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center text-black/40 dark:text-white/40">
        <MessageSquare className="h-7 w-7" />
        <p className="text-sm">No comments have been posted yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-danger">{error}</p>}
      {comments.map((c) => (
        <div key={c.id} className="flex items-start justify-between gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{c.name}</span>
              <span className="text-xs text-black/40 dark:text-white/40">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm text-black/70 dark:text-white/70">{c.text}</p>
          </div>
          <button onClick={() => remove(c.id)} className="shrink-0 text-black/30 hover:text-danger dark:text-white/30" aria-label="Delete comment">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
