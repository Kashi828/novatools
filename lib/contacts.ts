import { redis } from '@/lib/redis';

export const CONTACTS_KEY = 'novatools:contacts';
export const CONTACT_READ_KEY = 'novatools:contact-read';
const MAX_STORED_CONTACTS = 500;

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export async function listContacts(): Promise<ContactMessage[]> {
  return redis.lrange<ContactMessage>(CONTACTS_KEY, 0, MAX_STORED_CONTACTS - 1);
}

export async function getReadContactIds(): Promise<string[]> {
  try { return (await redis.smembers(CONTACT_READ_KEY)) ?? []; } catch { return []; }
}

export async function addContact(name: string, email: string, message: string): Promise<ContactMessage> {
  const contact: ContactMessage = { id: crypto.randomUUID(), name: name.trim().slice(0, 80), email: email.trim().slice(0, 160), message: message.trim().slice(0, 2000), createdAt: new Date().toISOString() };
  if (!contact.name || !contact.email || !contact.message) throw new Error('All contact fields are required');
  await redis.lpush(CONTACTS_KEY, contact);
  await redis.ltrim(CONTACTS_KEY, 0, MAX_STORED_CONTACTS - 1);
  return contact;
}

export async function setContactRead(id: string, read: boolean): Promise<void> {
  if (read) await redis.sadd(CONTACT_READ_KEY, id);
  else await redis.srem(CONTACT_READ_KEY, id);
}

export async function deleteContact(id: string): Promise<boolean> {
  const contacts = await listContacts();
  const target = contacts.find((contact) => contact.id === id);
  if (!target) return false;
  await redis.lrem(CONTACTS_KEY, 1, target);
  await redis.srem(CONTACT_READ_KEY, id);
  return true;
}
