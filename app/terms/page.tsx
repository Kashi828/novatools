import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing your use of NovaTools.',
};

export default function TermsPage() {
  return (
    <article className="prose prose-sm mx-auto max-w-3xl px-4 py-16 dark:prose-invert sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold sm:text-4xl">Terms of Service</h1>
      <p className="text-black/50 dark:text-white/50">Last updated: August 29, 2026</p>

      <h2>Acceptance of these terms</h2>
      <p>By accessing or using NovaTools, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use the service.</p>

      <h2>Using NovaTools</h2>
      <p>NovaTools provides online utilities for personal and commercial use. You may use the service only in a lawful manner and must not interfere with its security, availability, or other users&apos; access.</p>

      <h2>Your content and files</h2>
      <p>Many tools process your content locally in your browser. Where a feature sends data to a server or third-party service, it will be identified in the product flow. You are responsible for ensuring that you have the right to process any content you provide.</p>

      <h2>Accounts and subscriptions</h2>
      <p>Some features may require an account or paid subscription. You are responsible for keeping account credentials confidential and for charges made through your account. Subscription terms, pricing, renewals, and cancellation options are shown before checkout. We may change plans or pricing prospectively with reasonable notice where required by law.</p>

      <h2>Acceptable use</h2>
      <p>Do not use NovaTools to break the law, infringe intellectual-property or privacy rights, distribute malware, abuse automated systems, or attempt to reverse engineer, disrupt, or gain unauthorised access to the service.</p>

      <h2>No professional advice</h2>
      <p>Tools and results are provided for convenience only. They are not financial, medical, legal, tax, security, or other professional advice. Verify important results independently before relying on them.</p>

      <h2>Availability and liability</h2>
      <p>NovaTools is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. To the maximum extent permitted by law, we do not guarantee uninterrupted operation or error-free results and are not liable for indirect or consequential loss arising from your use of the service.</p>

      <h2>Changes and contact</h2>
      <p>We may update these terms as the service evolves. Continued use after the effective date means you accept the revised terms. For questions, use the Contact page.</p>
    </article>
  );
}
