import { currentUser } from '@clerk/nextjs/server';

export async function isAdminUser(): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !process.env.CLERK_SECRET_KEY || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return false;

  const user = await currentUser();
  if (!user) return false;

  const primaryEmail = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress;
  return primaryEmail?.toLowerCase() === adminEmail.toLowerCase();
}
