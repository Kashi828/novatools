import { NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/admin';
import { getSiteSettings, saveSiteSettings } from '@/lib/site-settings';

export async function GET() {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  return NextResponse.json(await getSiteSettings());
}

export async function PUT(request: Request) {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });

  try {
    const body = await request.json();
    const promoEnabled = typeof body.promoEnabled === 'boolean' ? body.promoEnabled : null;
    const announcementEnabled = typeof body.announcementEnabled === 'boolean' ? body.announcementEnabled : null;
    const promoMessage = typeof body.promoMessage === 'string' ? body.promoMessage.trim() : '';
    const announcementMessage = typeof body.announcementMessage === 'string' ? body.announcementMessage.trim() : '';

    if (promoEnabled === null || announcementEnabled === null || !promoMessage || !announcementMessage || promoMessage.length > 180 || announcementMessage.length > 180) {
      return NextResponse.json({ error: 'Provide both messages, each up to 180 characters.' }, { status: 400 });
    }

    const settings = { promoEnabled, promoMessage, announcementEnabled, announcementMessage };
    await saveSiteSettings(settings);
    return NextResponse.json({ success: true, ...settings });
  } catch {
    return NextResponse.json({ error: 'Could not save site settings.' }, { status: 500 });
  }
}
