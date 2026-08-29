import { NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/admin';
import { getSiteSettings, saveSiteSettings } from '@/lib/site-settings';

export async function GET() {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }
  return NextResponse.json(await getSiteSettings());
}

export async function PUT(request: Request) {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const promoEnabled = typeof body.promoEnabled === 'boolean' ? body.promoEnabled : null;
    const promoMessage = typeof body.promoMessage === 'string' ? body.promoMessage.trim() : '';

    if (promoEnabled === null || !promoMessage || promoMessage.length > 180) {
      return NextResponse.json(
        { error: 'Provide a promo status and a message of up to 180 characters.' },
        { status: 400 },
      );
    }

    await saveSiteSettings({ promoEnabled, promoMessage });
    return NextResponse.json({ success: true, promoEnabled, promoMessage });
  } catch {
    return NextResponse.json({ error: 'Could not save site settings.' }, { status: 500 });
  }
}
