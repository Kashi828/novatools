import { BrainCircuit, Code2, FileText, Languages, Mail, PenLine, Presentation, Regex, Search, Sparkles, Youtube } from 'lucide-react';
import type { ToolDefinition } from './types';
import { NovaAITool } from '@/components/tools/nova-ai-tool';

const definitions: Array<[string, string, string, string, string[]]> = [
  ['ai-summarizer', 'AI Summarizer', 'Turn long text into concise key points.', 'Summarize articles, notes, documents, and pasted content while preserving important facts.', ['ai summary', 'summarize', 'summary']],
  ['ai-rewriter', 'AI Rewriter', 'Rewrite text with a cleaner voice.', 'Rewrite content for clarity, natural flow, and the requested tone.', ['ai rewrite', 'rewrite', 'paraphrase']],
  ['ai-translator', 'AI Translator', 'Translate text while preserving meaning.', 'Translate supplied text while keeping tone, formatting, names, and numbers intact.', ['ai translate', 'translation', 'translator']],
  ['ai-grammar-fixer', 'AI Grammar Fixer', 'Correct grammar, spelling, and punctuation.', 'Polish writing without changing the intended meaning.', ['grammar', 'proofreading', 'spelling']],
  ['ai-email-writer', 'AI Email Writer', 'Create polished emails from a short brief.', 'Generate professional emails with subject lines and natural tone.', ['email writer', 'email generator', 'ai email']],
  ['ai-resume-improver', 'AI Resume Improver', 'Make resume content clearer and more impactful.', 'Improve resume wording and ATS-friendly structure without inventing experience.', ['resume', 'cv', 'ats']],
  ['ai-cover-letter', 'AI Cover Letter Writer', 'Create a tailored cover letter.', 'Turn a job description and real experience into a focused cover letter.', ['cover letter', 'job application']],
  ['ai-blog-outline', 'AI Blog Outline', 'Build a structured SEO-friendly article outline.', 'Create titles, sections, subsections, search intent, and talking points.', ['blog outline', 'seo', 'content plan']],
  ['ai-social-caption', 'AI Social Caption', 'Generate platform-ready social captions.', 'Create multiple captions with tone and hashtag suggestions.', ['social media', 'caption', 'instagram']],
  ['ai-youtube-script', 'AI YouTube Script', 'Turn an idea into an engaging video script.', 'Create a hook, structured sections, transitions, and a strong ending.', ['youtube', 'video script', 'creator']],
  ['ai-meeting-notes', 'AI Meeting Notes', 'Turn notes or transcripts into action items.', 'Extract decisions, actions, owners, deadlines, and open questions.', ['meeting notes', 'meeting summary', 'actions']],
  ['ai-study-notes', 'AI Study Notes', 'Convert material into exam-ready notes.', 'Organize definitions, concepts, examples, and important takeaways.', ['study notes', 'student', 'revision']],
  ['ai-quiz-generator', 'AI Quiz Generator', 'Create quizzes from your study material.', 'Generate mixed question types with an answer key and explanations.', ['quiz', 'questions', 'study quiz']],
  ['ai-code-explainer', 'AI Code Explainer', 'Understand unfamiliar code faster.', 'Explain code, flow, edge cases, and obvious issues without pretending to execute it.', ['code explanation', 'developer', 'programming']],
  ['ai-sql-helper', 'AI SQL Helper', 'Write, explain, or debug SQL.', 'Help with SQL using stated schema assumptions and dialect.', ['sql', 'database', 'query']],
  ['ai-regex-builder', 'AI Regex Builder', 'Build regular expressions from plain English.', 'Create, explain, and test regex patterns with useful examples.', ['regex', 'regular expression', 'pattern']],
  ['ai-prompt-builder', 'AI Prompt Builder', 'Turn an idea into a reusable AI prompt.', 'Build prompts with role, context, constraints, output format, and quality checks.', ['prompt engineering', 'prompt generator', 'ai prompt']],
];

const icons = [Sparkles, PenLine, Languages, FileText, Mail, FileText, Mail, Search, Sparkles, Youtube, FileText, BrainCircuit, BrainCircuit, Code2, Code2, Regex, Sparkles];

export const aiTools: ToolDefinition[] = definitions.map(([slug, name, shortDescription, description, keywords], index) => ({
  slug,
  name,
  shortDescription,
  description,
  category: 'ai',
  icon: icons[index],
  keywords,
  component: NovaAITool,
  isNew: true,
  relatedSlugs: ['nova-ai'],
}));
