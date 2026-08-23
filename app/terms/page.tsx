import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern your use of NovaTools.',
};

export default function TermsPage() {
  return (
    <div className="prose prose-sm mx-auto max-w-3xl px-4 py-16 dark:prose-invert sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold sm:text-4xl">Terms of Service</h1>
      <p className="text-black/50 dark:text-white/50">Last updated: August 2026</p>

      <h2>Using NovaTools</h2>
      <p>
        NovaTools is provided free of charge, as-is, with no warranty of any kind. You&rsquo;re welcome to use any tool for
        personal or commercial purposes.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Don&rsquo;t use NovaTools to generate or process unlawful content, or to attempt to disrupt or reverse engineer the
        service in a way that harms other users.
      </p>

      <h2>No guarantee of accuracy</h2>
      <p>
        Calculators and converters are provided for convenience. Always verify results independently before making financial,
        medical, or legal decisions.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms as the product evolves. Continued use after changes means you accept the new terms.</p>
    </div>
  );
}
