import { currentUser } from '@clerk/nextjs/server';

export async function isAdminUser(): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return false;

  const user = await currentUser();
  if (!user) return false;

  const primaryEmail = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress;
  return primaryEmail?.toLowerCase() === adminEmail.toLowerCase();
}
