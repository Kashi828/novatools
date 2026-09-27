import { NextResponse } from 'next/server';
import { getMaintenanceSettings, isMaintenanceActive } from '@/lib/maintenance';
export const dynamic = 'force-dynamic';
export async function GET() { const settings = await getMaintenanceSettings(); return NextResponse.json({ ...settings, active: isMaintenanceActive(settings) }, { headers: { 'Cache-Control': 'no-store, max-age=0' } }); }
