import { NextResponse } from 'next/server';
import { getEffectivePremiumToolSlugs } from '@/lib/tool-premium';
import { tools } from '@/data/tools';
import '@/data/ai-tools';
import '@/data/extra-tools';

export const dynamic = 'force-dynamic';

export async function GET() {
  const premiumTools = await getEffectivePremiumToolSlugs(tools);
  return NextResponse.json({ premiumTools }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}
