'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { Loader2, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

const LANGUAGES = [
  ['English', 'English'],
  ['Hindi', 'Hindi'],
  ['Kannada', 'Kannada'],
  ['Tamil', 'Tamil'],
  ['Telugu', 'Telugu'],
  ['Malayalam', 'Malayalam'],
  ['Marathi', 'Marathi'],
  ['Bengali', 'Bengali'],
  ['Gujarati', 'Gujarati'],
  ['Punjabi', 'Punjabi'],
  ['Urdu', 'Urdu'],
  ['Spanish', 'Spanish'],
  ['French', 'French'],
  ['German', 'German'],
  ['Portuguese', 'Portuguese'],
  ['Arabic', 'Arabic'],
  ['Japanese', 'Japanese'],
  ['Korean', 'Korean'],
  ['Chinese', 'Chinese (Simplified)'],
  ['Russian', 'Russian'],
] as const;

const TASKS: Record<string, { title: string; prompt: string; placeholder: string }> = {
  'ai-summarizer': { title: 'Summarize text', prompt: 'Summarize the user-provided text clearly. Preserve important facts, decisions, names, dates, and action items.', placeholder: 'Paste an article, notes, document text, or any long content...' },
  'ai-rewriter': { title: 'Rewrite text', prompt: 'Rewrite the user-provided text to be clearer, more natural, and polished while preserving its meaning.', placeholder: 'Paste the text you want rewritten...' },
  'ai-translator': { title: 'Translate text', prompt: 'Translate the user-provided text. Preserve meaning, tone, formatting, names, and numbers.', placeholder: 'Paste the text you want to translate...' },
  'ai-grammar-fixer': { title: 'Fix grammar', prompt: 'Correct grammar, spelling, punctuation, clarity, and awkward phrasing. Return the corrected version first, then a brief list of important changes.', placeholder: 'Paste your text...' },
  'ai-email-writer': { title: 'Write an email', prompt: 'Write a polished email based on the user request. Include a useful subject line and a professional, natural body.', placeholder: 'Tell me who the email is for, the purpose, and the tone...' },
  'ai-resume-improver': { title: 'Improve a resume', prompt: 'Improve the resume content for clarity, impact, ATS compatibility, and professional language without inventing qualifications.', placeholder: 'Paste your resume or a section of it...' },
  'ai-cover-letter': { title: 'Cover letter writer', prompt: 'Write a tailored cover letter from the information provided. Never invent experience, qualifications, or achievements.', placeholder: 'Paste the job description and your relevant experience...' },
  'ai-blog-outline': { title: 'Blog outline', prompt: 'Create a strong SEO-friendly blog outline with a compelling title, sections, subsections, search intent, and suggested talking points.', placeholder: 'What is the topic, audience, and goal?' },
  'ai-social-caption': { title: 'Social caption', prompt: 'Create several concise social media captions suited to the requested platform, audience, and tone. Include optional hashtag suggestions.', placeholder: 'Describe the post, platform, audience, and tone...' },
  'ai-youtube-script': { title: 'YouTube script', prompt: 'Create an engaging YouTube script with a hook, structured sections, transitions, and a strong ending. Do not invent factual claims when sources are not provided.', placeholder: 'Give me the video topic, audience, length, and style...' },
  'ai-meeting-notes': { title: 'Meeting notes', prompt: 'Turn the provided meeting transcript or notes into a structured summary with decisions, action items, owners, deadlines, and open questions.', placeholder: 'Paste meeting notes or a transcript...' },
  'ai-study-notes': { title: 'Study notes', prompt: 'Turn the provided material into concise, well-organized study notes with definitions, key concepts, examples, and exam-focused takeaways.', placeholder: 'Paste your study material...' },
  'ai-quiz-generator': { title: 'Quiz generator', prompt: 'Generate a useful quiz from the provided material. Mix question types and include an answer key with concise explanations.', placeholder: 'Paste the material and tell me the desired difficulty...' },
  'ai-code-explainer': { title: 'Explain code', prompt: 'Explain the provided code clearly, including what it does, how it works, important edge cases, and any obvious issues. Do not claim to have executed it.', placeholder: 'Paste code and optionally tell me the language...' },
  'ai-sql-helper': { title: 'SQL helper', prompt: 'Help write, explain, optimize, or debug the SQL requested by the user. State assumptions about the schema and never claim a query was executed.', placeholder: 'Describe your tables, desired result, and SQL dialect...' },
  'ai-regex-builder': { title: 'Regex builder', prompt: 'Build or improve a regular expression for the requested pattern. Explain the important groups and flags and provide a few test examples.', placeholder: 'Describe exactly what the regex should match...' },
  'ai-prompt-builder': { title: 'Prompt builder', prompt: 'Turn the user goal into a strong reusable AI prompt with context, role, constraints, output format, and quality checks.', placeholder: 'Describe what you want an AI system to accomplish...' },
};

export function NovaAITool() {
  const pathname = usePathname();
  const slug = pathname.split('/').filter(Boolean).pop() || 'ai-summarizer';
  const task = TASKS[slug] || TASKS['ai-summarizer'];
  const isTranslator = slug === 'ai-translator';
  const { isLoaded, isSignedIn } = useAuth();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('English');
  const [sourceLanguage, setSourceLanguage] = useState('Auto-detect');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function run() {
    if (!input.trim() || loading) return;
    setLoading(true); setError('');
    const languageInstruction = isTranslator
      ? `Translate from ${sourceLanguage} to ${language}.`
      : `Write the final response in ${language}, unless code, SQL, regex syntax, names, URLs, or other technical tokens must remain unchanged.`;
    try {
      const response = await fetch('/api/nova-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: `${task.prompt}\n\nLANGUAGE INSTRUCTION:\n${languageInstruction}\n\nUSER INPUT:\n${input.trim()}` }] }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Nova AI could not complete this task.');
      setOutput(data.text || '');
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setLoading(false); }
  }

  if (isLoaded && !isSignedIn) return <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16"><div className="rounded-3xl border border-primary-500/15 bg-[rgb(var(--surface-panel)/.75)] p-8 text-center shadow-xl shadow-black/5"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500"><Sparkles className="h-7 w-7" /></div><h1 className="nova-title mt-5 text-3xl font-bold">Sign in to use {task.title}</h1><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-secondary-400">Nova AI tools are available to signed-in NovaTools users so your usage can be tracked fairly.</p><Link href="/sign-in" className="mt-6 inline-flex rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700">Sign in to continue</Link></div></div>;

  return <ToolShell outputValue={output || undefined} onReset={() => { setInput(''); setOutput(''); setError(''); }} shareSlug={slug}>
    <div className="rounded-2xl border border-primary-500/15 bg-primary-500/5 p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500"><Sparkles className="h-5 w-5" /></div><div><h2 className="font-semibold">{task.title}</h2><p className="text-xs text-secondary-400">Powered by Nova AI</p></div></div></div>
    <div className="rounded-2xl border border-current/10 bg-[rgb(var(--surface-panel)/.55)] p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {isTranslator && <label className="block"><span className="mb-1.5 block text-xs font-semibold text-secondary-400">Source language</span><select value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)} className="w-full rounded-xl border border-current/10 bg-[rgb(var(--surface-page)/.65)] px-3 py-2.5 text-sm outline-none focus:border-primary-500/40"><option>Auto-detect</option>{LANGUAGES.map(([label]) => <option key={label}>{label}</option>)}</select></label>}
        <label className={isTranslator ? 'block' : 'block sm:col-span-2'}><span className="mb-1.5 block text-xs font-semibold text-secondary-400">{isTranslator ? 'Target language' : 'Output language'}</span><select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-xl border border-current/10 bg-[rgb(var(--surface-page)/.65)] px-3 py-2.5 text-sm outline-none focus:border-primary-500/40">{LANGUAGES.map(([label, value]) => <option key={label} value={value}>{label}</option>)}</select></label>
      </div>
    </div>
    <div className="grid gap-4 lg:grid-cols-2"><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} placeholder={task.placeholder} className="w-full rounded-2xl border border-current/10 bg-[rgb(var(--surface-page)/.6)] p-4 text-sm leading-6 outline-none focus:border-primary-500/40" /><textarea value={output} readOnly rows={14} placeholder="Your result will appear here..." className="w-full rounded-2xl border border-current/10 bg-[rgb(var(--surface-page)/.45)] p-4 text-sm leading-6 outline-none" /></div>
    {error && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
    <Button onClick={() => void run()} disabled={!input.trim() || loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{loading ? 'Working...' : 'Run with Nova AI'}</Button>
  </ToolShell>;
}
