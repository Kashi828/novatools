import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
const MAX_MESSAGES = 12;
const MAX_CHARS = 4000;

const SYSTEM_PROMPT = `You are Nova AI, the helpful assistant inside NovaTools. Be concise, accurate, friendly, and practical. NovaTools is a collection of free web utilities for text, images, PDFs, developer tasks, calculators, converters, security, and color workflows. When a request is clearly better handled by an existing NovaTools utility, explain which kind of tool the user should use, but do not pretend you executed a tool unless the application actually provides that action. Never claim access to private files, accounts, or live data that was not provided. Use simple Markdown when useful.`;

type IncomingMessage = { role: 'user' | 'assistant'; content: string };

function cleanMessages(value: unknown): IncomingMessage[] {
  if (!Array.isArray(value)) return [];
  return value.slice(-MAX_MESSAGES).flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return [];
    return [{ role, content: content.trim().slice(0, MAX_CHARS) }];
  }).filter((item) => item.content.length > 0);
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Nova AI is not configured yet. Add GEMINI_API_KEY to the server environment.' }, { status: 503 });

  try {
    const body = await request.json();
    const messages = cleanMessages(body?.messages);
    if (!messages.length) return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 });

    const contents = messages.map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
      }),
      cache: 'no-store',
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Nova AI provider error:', data);
      return NextResponse.json({ error: 'Nova AI could not complete that request right now. Please try again.' }, { status: response.status === 429 ? 429 : 502 });
    }

    const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('').trim();
    if (!text) return NextResponse.json({ error: 'Nova AI returned an empty response. Please try again.' }, { status: 502 });
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Nova AI route error:', error);
    return NextResponse.json({ error: 'Unable to reach Nova AI right now.' }, { status: 500 });
  }
}
