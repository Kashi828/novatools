import { NextResponse } from 'next/server';
import { listComments, addComment } from '@/lib/comments';
import { isAdminUser } from '@/lib/admin';
import { getAdminFeatureSettings } from '@/lib/admin-feature-settings';
import { getCommentModerationIds } from '@/lib/comment-moderation';

export async function GET() {
  try {
    const [comments, isAdmin, moderation] = await Promise.all([listComments(), isAdminUser(), getCommentModerationIds()]);
    const hidden = new Set(moderation.hidden);
    const flagged = new Set(moderation.flagged);
    const publicComments = comments.filter((comment) => !hidden.has(comment.id) && !flagged.has(comment.id));
    return NextResponse.json({ comments: publicComments, isAdmin });
  } catch {
    return NextResponse.json({ error: 'Could not load comments right now.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const settings = await getAdminFeatureSettings();
    if (!settings.commentsEnabled) return NextResponse.json({ error: 'Comments are currently disabled.' }, { status: 503 });
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name : '';
    const text = typeof body.text === 'string' ? body.text : '';
    if (!settings.allowAnonymousComments && !name.trim()) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    if (!text.trim()) return NextResponse.json({ error: 'Comment text is required.' }, { status: 400 });
    const comment = await addComment(name, text);
    return NextResponse.json({ comment });
  } catch {
    return NextResponse.json({ error: 'Could not post your comment right now.' }, { status: 500 });
  }
}
