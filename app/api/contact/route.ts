import { NextResponse } from 'next/server';
import { addContact } from '@/lib/contacts';
import { getAdminFeatureSettings } from '@/lib/admin-feature-settings';

export async function POST(request: Request) {
  try {
    const settings = await getAdminFeatureSettings();
    if (!settings.contactsEnabled) return NextResponse.json({ error: 'The contact form is currently disabled.' }, { status: 503 });
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name : '';
    const email = typeof body.email === 'string' ? body.email : '';
    const message = typeof body.message === 'string' ? body.message : '';
    if (!name.trim() || !email.trim() || !message.trim()) return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 });
    const contact = await addContact(name, email, message);
    return NextResponse.json({ success: true, contact: { id: contact.id } });
  } catch {
    return NextResponse.json({ error: 'Could not send your message right now.' }, { status: 500 });
  }
}
