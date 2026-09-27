import { NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/admin';
import { hideTool, showTool } from '@/lib/tool-visibility';

export async function POST(request: Request) {
  const admin = await isAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }

  const body = await request.json();
  const slug = typeof body.slug === 'string' ? body.slug : null;
  const hidden = typeof body.hidden === 'boolean' ? body.hidden : null;
  if (!slug || hidden === null) {
    return NextResponse.json({ error: 'slug and hidden are required.' }, { status: 400 });
  }

  if (hidden) {
    await hideTool(slug);
  } else {
    await showTool(slug);
  }
  return NextResponse.json({ success: true });
}
