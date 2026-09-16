import { NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/admin';
import { getMaintenanceSettings, saveMaintenanceSettings, type MaintenanceSettings } from '@/lib/maintenance';

export const dynamic = 'force-dynamic';
export async function GET() {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  return NextResponse.json(await getMaintenanceSettings(), { headers: { 'Cache-Control': 'no-store' } });
}
export async function PUT(request: Request) {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  try {
    const body = await request.json() as Partial<MaintenanceSettings>;
    const startAt = typeof body.startAt === 'string' && body.startAt ? new Date(body.startAt).toISOString() : null;
    const endAt = typeof body.endAt === 'string' && body.endAt ? new Date(body.endAt).toISOString() : null;
    if (startAt && endAt && Date.parse(startAt) >= Date.parse(endAt)) return NextResponse.json({ error: 'Stop time must be after start time.' }, { status: 400 });
    const settings: MaintenanceSettings = { enabled: body.enabled === true, startAt, endAt, message: typeof body.message === 'string' && body.message.trim() ? body.message.trim().slice(0, 240) : 'NovaTools is undergoing scheduled maintenance. Please check back shortly.' };
    await saveMaintenanceSettings(settings);
    return NextResponse.json({ success: true, settings });
  } catch { return NextResponse.json({ error: 'Could not save maintenance settings.' }, { status: 500 }); }
}
