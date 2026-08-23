import { NextResponse } from 'next/server';
import { listComments, addComment } from '@/lib/comments';
import { isAdminUser } from '@/lib/admin';

export async function GET() {
  try {
    const [comments, isAdmin] = await Promise.all([listComments(), isAdminUser()]);
    return NextResponse.json({ comments, isAdmin });
  } catch {
    return NextResponse.json({ error: 'Could not load comments right now.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name : '';
    const text = typeof body.text === 'string' ? body.text : '';
    if (!text.trim()) {
      return NextResponse.json({ error: 'Comment text is required.' }, { status: 400 });
    }
    const comment = await addComment(name, text);
    return NextResponse.json({ comment });
  } catch {
    return NextResponse.json({ error: 'Could not post your comment right now.' }, { status: 500 });
  }
}
