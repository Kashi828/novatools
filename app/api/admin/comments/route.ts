import { NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/admin';
import { getCommentModerationIds, setCommentModeration } from '@/lib/comment-moderation';
import { listComments } from '@/lib/comments';

export async function GET() {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  const [comments, moderation] = await Promise.all([listComments(), getCommentModerationIds()]);
  const flagged = new Set(moderation.flagged);
  const hidden = new Set(moderation.hidden);
  return NextResponse.json({ comments: comments.map((comment) => ({ ...comment, status: hidden.has(comment.id) ? 'hidden' : flagged.has(comment.id) ? 'flagged' : 'visible' })) });
}

export async function POST(request: Request) {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  try {
    const body = await request.json();
    if (typeof body.id !== 'string' || !['visible', 'flagged', 'hidden'].includes(body.status)) return NextResponse.json({ error: 'id and a valid status are required.' }, { status: 400 });
    await setCommentModeration(body.id, body.status);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Could not update comment moderation.' }, { status: 500 }); }
}
