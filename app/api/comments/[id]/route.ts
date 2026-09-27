import { NextResponse } from 'next/server';
import { deleteComment } from '@/lib/comments';
import { isAdminUser } from '@/lib/admin';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await isAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }
  const { id } = await params;
  const deleted = await deleteComment(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
