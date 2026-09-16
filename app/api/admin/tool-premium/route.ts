import { NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/admin';
import { getPremiumToolSlugs, setToolPremium } from '@/lib/tool-premium';

export async function GET() {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  return NextResponse.json({ premiumTools: await getPremiumToolSlugs() });
}
export async function POST(request: Request) {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  const body = await request.json();
  if (typeof body.slug !== 'string' || typeof body.premium !== 'boolean') return NextResponse.json({ error: 'slug and premium are required.' }, { status: 400 });
  await setToolPremium(body.slug, body.premium);
  return NextResponse.json({ success: true });
}
