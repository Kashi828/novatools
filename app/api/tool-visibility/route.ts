import { NextResponse } from 'next/server';
import { getHiddenSlugs } from '@/lib/tool-visibility';

// Public read — client components (search, command palette) need this to filter
// hidden tools out of what visitors see. No admin data is exposed here.
export async function GET() {
  try {
    const hiddenSlugs = await getHiddenSlugs();
    return NextResponse.json({ hiddenSlugs });
  } catch {
    // If Redis isn't reachable, fail open (show everything) rather than breaking the site.
    return NextResponse.json({ hiddenSlugs: [] });
  }
}
