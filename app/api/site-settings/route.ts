import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/site-settings';

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
