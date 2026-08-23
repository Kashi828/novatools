import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How NovaTools handles your data.',
};

export default function PrivacyPage() {
  return (
    <div className="prose prose-sm mx-auto max-w-3xl px-4 py-16 dark:prose-invert sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
      <p className="text-black/50 dark:text-white/50">Last updated: August 2026</p>

      <h2>What we collect</h2>
      <p>
        Most NovaTools utilities run entirely in your browser. Text, numbers, and files you enter into a tool are processed
        locally on your device and are not transmitted to our servers unless a tool explicitly says otherwise.
      </p>

      <h2>Analytics</h2>
      <p>
        We use privacy-respecting, aggregated analytics to understand which tools are popular, so we can prioritize what to
        build next. This does not include the content you enter into any tool.
      </p>

      <h2>Cookies</h2>
      <p>
        We use local storage to remember your theme preference (light or dark) and recently used tools. This stays on your
        device and is never sent to us.
      </p>

      <h2>Contact</h2>
      <p>Questions about this policy can be sent through our Contact page.</p>
    </div>
  );
}
