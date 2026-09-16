import type { Metadata } from 'next';
import { CommentsSection } from '@/components/comments-section';

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Share your thoughts on NovaTools — open to everyone, no account required.',
};

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold sm:text-4xl">Feedback</h1>
      <p className="mt-2 text-black/60 dark:text-white/60">
        Tell us what you think, request a tool, or report a bug. Anyone can leave a comment here — no account needed.
      </p>
      <div className="mt-8">
        <CommentsSection />
      </div>
    </div>
  );
}
