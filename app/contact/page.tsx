import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the NovaTools team.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold sm:text-4xl">Contact us</h1>
      <p className="mt-3 text-black/60 dark:text-white/60">
        Found a bug, have a tool request, or just want to say hi? Send us a message.
      </p>
      <ContactForm />
    </div>
  );
}
