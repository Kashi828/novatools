import { NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/admin';
import { deleteContact, getReadContactIds, listContacts, setContactRead } from '@/lib/contacts';

export async function GET() {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  const [contacts, readIds] = await Promise.all([listContacts(), getReadContactIds()]);
  const read = new Set(readIds);
  return NextResponse.json({ contacts: contacts.map((contact) => ({ ...contact, status: read.has(contact.id) ? 'read' : 'unread' })) });
}

export async function POST(request: Request) {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  try {
    const body = await request.json();
    if (typeof body.id !== 'string' || typeof body.read !== 'boolean') return NextResponse.json({ error: 'id and read are required.' }, { status: 400 });
    await setContactRead(body.id, body.read);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Could not update contact.' }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  try {
    const body = await request.json();
    if (typeof body.id !== 'string') return NextResponse.json({ error: 'id is required.' }, { status: 400 });
    const deleted = await deleteContact(body.id);
    if (!deleted) return NextResponse.json({ error: 'Contact not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Could not delete contact.' }, { status: 500 }); }
}
