import { NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/admin';
import { getAdminFeatureSettings, saveAdminFeatureSettings } from '@/lib/admin-feature-settings';

export async function GET() {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  return NextResponse.json({ settings: await getAdminFeatureSettings() });
}
export async function PUT(request: Request) {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  const body = await request.json();
  const settings = {
    commentsEnabled: Boolean(body.commentsEnabled),
    contactsEnabled: Boolean(body.contactsEnabled),
    allowAnonymousComments: Boolean(body.allowAnonymousComments),
    maintenanceNotice: typeof body.maintenanceNotice === 'string' ? body.maintenanceNotice.trim().slice(0, 180) : '',
  };
  await saveAdminFeatureSettings(settings);
  return NextResponse.json({ settings });
}
