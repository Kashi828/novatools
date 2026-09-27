import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { isAdminUser } from '@/lib/admin';
import { AdminControlCenter } from '@/components/admin-control-center';
import { MaintenanceAdminPanel } from '@/components/maintenance-admin-panel';

export const metadata: Metadata = { title: 'Admin Control Center', robots: { index: false, follow: false } };
export default async function AdminPage() {
  const admin = await isAdminUser();
  if (!admin) return <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-32 text-center"><ShieldAlert className="h-10 w-10 text-black/30 dark:text-white/30" /><h1 className="font-heading text-2xl font-semibold">Not authorized</h1><p className="text-sm text-black/50 dark:text-white/50">This control center is only available to the site administrator.</p><Link href="/" className="mt-2 text-sm text-primary-500 hover:underline">Back to NovaTools</Link></div>;
  return <div className="min-h-screen bg-[#05060a]"><div className="mx-auto max-w-[1500px] space-y-5 px-3 py-3 sm:px-5 lg:px-6"><MaintenanceAdminPanel /><AdminControlCenter /></div></div>;
}
