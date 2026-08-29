import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How NovaTools handles information and privacy.',
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-sm mx-auto max-w-3xl px-4 py-16 dark:prose-invert sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
      <p className="text-black/50 dark:text-white/50">Last updated: August 29, 2026</p>

      <h2>Our approach</h2>
      <p>NovaTools is designed to keep as much work as possible on your device. Most text, numbers, and files entered into a tool are processed in your browser and are not uploaded to our servers.</p>

      <h2>Information we may collect</h2>
      <p>If you contact us, submit feedback, create an account, or subscribe, we may process the information you provide, such as your name, email address, feedback text, and account or subscription status. Payment information is handled by our payment and authentication providers, not stored by NovaTools.</p>

      <h2>How we use information</h2>
      <p>We use information to operate the service, respond to requests, keep the platform secure, administer accounts and subscriptions, and understand aggregated usage so we can improve the tools. We do not sell personal information.</p>

      <h2>Cookies and local storage</h2>
      <p>We use local storage to remember preferences such as theme, typography, colours, and recently used tools. Authentication providers may use essential cookies to keep you signed in. You can remove local storage through your browser settings.</p>

      <h2>Service providers</h2>
      <p>We use carefully selected providers for functions such as authentication, billing, hosting, and storage. They process data only as needed to provide those services and under their own applicable privacy terms.</p>

      <h2>Retention and security</h2>
      <p>We retain information only for as long as necessary for the purposes described here, legal obligations, or dispute resolution. No online service can promise absolute security, but we use reasonable safeguards to protect the information we control.</p>

      <h2>Your choices</h2>
      <p>You can request access, correction, or deletion of personal information we hold about you, subject to applicable law. Use the Contact page to make a request or ask a privacy question.</p>

      <h2>Updates</h2>
      <p>We may update this policy as NovaTools develops. The latest version will always be published here with its effective date.</p>
    </article>
  );
}
