import { NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/admin';
import { getHiddenCategorySlugs, hideCategory, showCategory } from '@/lib/category-visibility';

export async function GET() {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  return NextResponse.json({ hiddenCategories: await getHiddenCategorySlugs() });
}
export async function POST(request: Request) {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  const body = await request.json();
  if (typeof body.slug !== 'string' || typeof body.hidden !== 'boolean') return NextResponse.json({ error: 'slug and hidden are required.' }, { status: 400 });
  if (body.hidden) await hideCategory(body.slug); else await showCategory(body.slug);
  return NextResponse.json({ success: true });
}
