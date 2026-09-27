'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email address'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Could not send your message.');
    setSent(true);
    reset();
  }

  const submit = handleSubmit(async (values) => {
    try { await onSubmit(values); } catch (error) { setServerError(error instanceof Error ? error.message : 'Could not send your message.'); }
  });

  if (sent) return <div className="mt-8 flex flex-col items-center gap-3 rounded-xl2 border border-success/30 bg-success/5 p-10 text-center"><CheckCircle2 className="h-8 w-8 text-success" /><p className="font-medium">Message sent</p><p className="text-sm text-black/60 dark:text-white/60">Thanks for reaching out — your message is now in our support inbox.</p><Button variant="outline" size="sm" onClick={() => setSent(false)}>Send another message</Button></div>;

  return <form onSubmit={submit} className="mt-8 space-y-4">
    <div><label className="mb-1 block text-sm font-medium">Name</label><input {...register('name')} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />{errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}</div>
    <div><label className="mb-1 block text-sm font-medium">Email</label><input type="email" {...register('email')} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />{errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}</div>
    <div><label className="mb-1 block text-sm font-medium">Message</label><textarea rows={5} {...register('message')} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />{errors.message && <p className="mt-1 text-xs text-danger">{errors.message.message}</p>}</div>
    {serverError && <p className="rounded-lg border border-danger/25 bg-danger/5 p-3 text-sm text-danger">{serverError}</p>}
    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send message'}</Button>
  </form>;
}
