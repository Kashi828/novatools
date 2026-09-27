import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export type ToolkitOption = { slug: string; name: string; description: string };
export type ToolkitGroup = { name: string; options: ToolkitOption[] };
export type ToolkitConfig = { slug: string; name: string; description: string; groups: ToolkitGroup[] };

const TOOLKITS: ToolkitConfig[] = [
  { slug: 'pdf', name: 'PDF Toolkit', description: 'Group PDF editing, conversion, compression, and page-management functions together.', groups: [
    { name: 'Edit & Organize', options: [
      { slug: 'pdf-tools', name: 'PDF Workspace', description: 'Extract, delete, reorder, rotate, add pages, inspect, and edit PDF metadata.' },
      { slug: 'pdf-merge', name: 'Merge PDFs', description: 'Combine multiple PDF files into one document.' },
      { slug: 'pdf-split', name: 'Split PDF', description: 'Extract selected pages or page ranges.' },
    ]},
    { name: 'Convert & Optimize', options: [
      { slug: 'pdf-compress', name: 'Compress PDF', description: 'Reduce PDF file size.' },
      { slug: 'pdf-to-image', name: 'PDF to Image', description: 'Export PDF pages as images.' },
      { slug: 'image-to-pdf', name: 'Image to PDF', description: 'Turn images into a PDF.' },
    ]},
  ]},
  { slug: 'image', name: 'Image Toolkit', description: 'Keep image compression, conversion, resizing, batch work, and accessibility in one place.', groups: [
    { name: 'Prepare Images', options: [
      { slug: 'image-compressor', name: 'Compress', description: 'Reduce image size with quality control.' },
      { slug: 'image-resizer', name: 'Resize', description: 'Resize images to exact dimensions.' },
      { slug: 'batch-image-processor', name: 'Batch Process', description: 'Process multiple images together.' },
    ]},
    { name: 'Convert & Web', options: [
      { slug: 'image-converter', name: 'Convert', description: 'Convert between common image formats.' },
      { slug: 'favicon-generator', name: 'Favicon', description: 'Create standard website icon sizes.' },
      { slug: 'color-blindness-simulator', name: 'Accessibility Preview', description: 'Preview common color-vision variants.' },
    ]},
  ]},
  { slug: 'text', name: 'Text Toolkit', description: 'One workspace for counting, cleaning, transforming, comparing, and analyzing text.', groups: [
    { name: 'Clean & Transform', options: [
      { slug: 'word-counter', name: 'Count Text', description: 'Words, characters, sentences, paragraphs, and reading time.' },
      { slug: 'case-converter', name: 'Change Case', description: 'Switch between common casing styles.' },
      { slug: 'text-cleaner', name: 'Clean Text', description: 'Remove noise, repeated spaces, and blank lines.' },
      { slug: 'text-sorter', name: 'Sort Text', description: 'Sort, reverse, or shuffle lines.' },
      { slug: 'text-repeater', name: 'Repeat Text', description: 'Repeat text with a chosen separator.' },
    ]},
    { name: 'Analyze & Compare', options: [
      { slug: 'text-diff-checker', name: 'Compare Text', description: 'Compare two versions of text.' },
      { slug: 'readability-checker', name: 'Readability', description: 'Check reading difficulty.' },
      { slug: 'count-sentences', name: 'Sentence Counter', description: 'Count sentences in pasted text.' },
      { slug: 'word-length-counter', name: 'Word Length', description: 'Analyze word counts and average word length.' },
    ]},
  ]},
  { slug: 'developer', name: 'Developer Toolkit', description: 'Combine structured-data, encoding, URL, markup, regex, and code utilities.', groups: [
    { name: 'Data & JSON', options: [
      { slug: 'json-formatter', name: 'JSON Format', description: 'Format, validate, and minify JSON.' },
      { slug: 'json-validator', name: 'JSON Validate', description: 'Check JSON syntax and errors.' },
      { slug: 'json-key-sorter', name: 'Sort JSON Keys', description: 'Alphabetize JSON object keys.' },
      { slug: 'json-to-typescript', name: 'JSON → TypeScript', description: 'Generate a TypeScript interface.' },
      { slug: 'csv-to-json', name: 'CSV → JSON', description: 'Convert tabular data to JSON.' },
      { slug: 'json-to-csv-converter', name: 'JSON → CSV', description: 'Convert JSON records to CSV.' },
      { slug: 'csv-to-tsv', name: 'CSV → TSV', description: 'Convert CSV to tab-separated data.' },
      { slug: 'csv-to-markdown', name: 'CSV → Markdown', description: 'Turn CSV into a Markdown table.' },
    ]},
    { name: 'URLs, Code & Markup', options: [
      { slug: 'url-encoder-decoder', name: 'URL Encode', description: 'Encode or decode URL components.' },
      { slug: 'url-parser', name: 'URL Parser', description: 'Inspect URL parts and query data.' },
      { slug: 'url-query-builder', name: 'Query Builder', description: 'Build encoded query strings.' },
      { slug: 'query-string-parser', name: 'Query Parser', description: 'Parse URL query parameters.' },
      { slug: 'regex-tester', name: 'Regex Tester', description: 'Test regular expressions interactively.' },
      { slug: 'markdown-preview', name: 'Markdown', description: 'Preview Markdown as rendered content.' },
      { slug: 'html-preview', name: 'HTML Preview', description: 'Preview HTML safely.' },
      { slug: 'xml-formatter', name: 'XML', description: 'Format and validate XML.' },
      { slug: 'sql-formatter-lite', name: 'SQL Formatter', description: 'Apply lightweight SQL formatting.' },
    ]},
  ]},
  { slug: 'calculators', name: 'Calculator Toolkit', description: 'Group everyday, math, date, percentage, and practical calculations by purpose.', groups: [
    { name: 'Math & Numbers', options: [
      { slug: 'scientific-calculator', name: 'Scientific', description: 'Trigonometry, logs, powers, and more.' },
      { slug: 'percentage-calculator', name: 'Percentage', description: 'Solve common percentage problems.' },
      { slug: 'percentage-change-calculator', name: 'Percentage Change', description: 'Find increases and decreases.' },
      { slug: 'average-calculator', name: 'Average', description: 'Calculate the mean.' },
      { slug: 'median-calculator', name: 'Median', description: 'Find the middle value.' },
      { slug: 'ratio-calculator', name: 'Ratio', description: 'Simplify ratios.' },
      { slug: 'proportion-calculator', name: 'Proportion', description: 'Solve proportional relationships.' },
      { slug: 'lcm-gcd-calculator', name: 'GCD & LCM', description: 'Find greatest common divisor and least common multiple.' },
    ]},
    { name: 'Date, Time & Everyday', options: [
      { slug: 'age-calculator', name: 'Age', description: 'Calculate exact age from a date of birth.' },
      { slug: 'date-difference-calculator', name: 'Date Difference', description: 'Find the difference between dates.' },
      { slug: 'working-days-calculator', name: 'Working Days', description: 'Count weekdays between dates.' },
      { slug: 'speed-calculator', name: 'Speed', description: 'Calculate speed from distance and time.' },
      { slug: 'distance-calculator', name: 'Distance', description: 'Calculate distance from speed and time.' },
      { slug: 'time-calculator', name: 'Time', description: 'Convert minutes into hours and minutes.' },
      { slug: 'unit-rate-calculator', name: 'Unit Rate', description: 'Find the amount per unit.' },
    ]},
  ]},
  { slug: 'converters', name: 'Converter Toolkit', description: 'All major unit, time, currency, number, file-size, and text-data conversions together.', groups: [
    { name: 'Measurements & Digital', options: [
      { slug: 'unit-converter', name: 'Units', description: 'Length, weight, temperature, volume, and more.' },
      { slug: 'currency-converter', name: 'Currency', description: 'Convert between currencies.' },
      { slug: 'timezone-converter', name: 'Timezone', description: 'Compare times across time zones.' },
      { slug: 'file-size-converter', name: 'File Size', description: 'Convert bytes, KB, MB, GB, and binary units.' },
      { slug: 'number-base-converter', name: 'Number Bases', description: 'Convert binary, octal, decimal, and hex.' },
      { slug: 'binary-text-converter', name: 'Binary Text', description: 'Convert text and binary.' },
    ]},
    { name: 'Data & Encoding', options: [
      { slug: 'base64-encoder-decoder', name: 'Base64', description: 'Encode and decode Base64.' },
      { slug: 'hex-encoder', name: 'Text → Hex', description: 'Encode text as hex bytes.' },
      { slug: 'hex-decoder', name: 'Hex → Text', description: 'Decode hexadecimal bytes.' },
      { slug: 'base64-url-encoder', name: 'Base64 URL Encode', description: 'Create URL-safe Base64.' },
      { slug: 'base64-url-decoder', name: 'Base64 URL Decode', description: 'Decode URL-safe Base64.' },
    ]},
  ]},
  { slug: 'student', name: 'Student Toolkit', description: 'Study, grading, revision, citation, and exam-planning tools in one workspace.', groups: [
    { name: 'Grades & Exams', options: [
      { slug: 'gpa-calculator', name: 'GPA', description: 'Calculate your grade point average.' },
      { slug: 'grade-percentage-calculator', name: 'Grade %', description: 'Convert marks into percentages.' },
      { slug: 'grade-needed-calculator', name: 'Grade Needed', description: 'Estimate the score needed on remaining work.' },
      { slug: 'weighted-grade-calculator', name: 'Weighted Grade', description: 'Calculate weighted course scores.' },
      { slug: 'exam-score-calculator', name: 'Exam Score', description: 'Calculate exam percentages.' },
      { slug: 'exam-countdown-planner', name: 'Exam Planner', description: 'Track upcoming exams.' },
    ]},
    { name: 'Study & Writing', options: [
      { slug: 'flashcard-maker', name: 'Flashcards', description: 'Create study flashcards.' },
      { slug: 'study-timer', name: 'Study Timer', description: 'Focus with Pomodoro sessions.' },
      { slug: 'study-hours-calculator', name: 'Study Hours', description: 'Plan study time across days.' },
      { slug: 'citation-generator', name: 'Citations', description: 'Create APA, MLA, and Chicago citations.' },
    ]},
  ]},
  { slug: 'finance', name: 'Finance Toolkit', description: 'Loans, tax, budgeting, pricing, profitability, and savings tools grouped by workflow.', groups: [
    { name: 'Loans & Interest', options: [
      { slug: 'emi-calculator', name: 'EMI', description: 'Estimate monthly loan payments.' },
      { slug: 'loan-amortization', name: 'Amortization', description: 'View loan payoff schedules.' },
      { slug: 'simple-interest-calculator', name: 'Simple Interest', description: 'Calculate simple interest.' },
      { slug: 'compound-interest-calculator', name: 'Compound Interest', description: 'Estimate compound growth.' },
    ]},
    { name: 'Business & Money', options: [
      { slug: 'gst-calculator', name: 'GST', description: 'Add or remove GST from amounts.' },
      { slug: 'invoice-generator', name: 'Invoice', description: 'Create itemized invoices.' },
      { slug: 'budget-tracker', name: 'Budget', description: 'Track income and expenses.' },
      { slug: 'discount-calculator', name: 'Discount', description: 'Calculate sale prices and savings.' },
      { slug: 'profit-margin-calculator', name: 'Profit Margin', description: 'Calculate profit and margin.' },
      { slug: 'markup-calculator', name: 'Markup', description: 'Calculate markup percentage.' },
      { slug: 'commission-calculator', name: 'Commission', description: 'Calculate sales commission.' },
      { slug: 'break-even-calculator', name: 'Break-Even', description: 'Find break-even volume.' },
      { slug: 'savings-goal-calculator', name: 'Savings Goal', description: 'Plan progress toward a savings target.' },
    ]},
  ]},
  { slug: 'web', name: 'Web Toolkit', description: 'SEO, campaign URLs, metadata, QR, and website publishing helpers together.', groups: [
    { name: 'QR & Sharing', options: [
      { slug: 'qr-generator', name: 'QR Code', description: 'Create QR codes from text or links.' },
      { slug: 'qr-code-reader', name: 'QR Reader', description: 'Decode QR codes from images.' },
      { slug: 'qr-batch-generator', name: 'QR Batch', description: 'Generate many QR codes at once.' },
      { slug: 'vcard-qr-generator', name: 'Contact QR', description: 'Create QR codes for contact cards.' },
    ]},
    { name: 'SEO & Publishing', options: [
      { slug: 'meta-tag-generator', name: 'Meta Tags', description: 'Generate SEO and social metadata.' },
      { slug: 'utm-builder', name: 'UTM Builder', description: 'Create campaign URLs.' },
      { slug: 'slug-generator', name: 'Slug', description: 'Create clean SEO-friendly URL slugs.' },
      { slug: 'robots-generator', name: 'robots.txt', description: 'Generate crawler rules.' },
      { slug: 'sitemap-url-builder', name: 'Sitemap', description: 'Generate sitemap XML.' },
      { slug: 'open-graph-text', name: 'Open Graph', description: 'Generate social sharing metadata.' },
      { slug: 'favicon-generator', name: 'Favicon', description: 'Create web icons.' },
    ]},
  ]},
  { slug: 'security', name: 'Security Toolkit', description: 'Keep password, identity, hashing, and validation functions together.', groups: [
    { name: 'Credentials', options: [
      { slug: 'password-generator', name: 'Password Generator', description: 'Create strong passwords locally.' },
      { slug: 'password-strength-checker', name: 'Password Strength', description: 'Evaluate password strength locally.' },
      { slug: 'passphrase-generator', name: 'Passphrase', description: 'Create memorable word-based passwords.' },
      { slug: 'ipv4-validator', name: 'IPv4 Validator', description: 'Validate IPv4 addresses.' },
      { slug: 'email-validator', name: 'Email Validator', description: 'Check basic email syntax.' },
    ]},
    { name: 'Hashes & IDs', options: [
      { slug: 'hash-generator', name: 'Hash Generator', description: 'Generate common cryptographic hashes.' },
      { slug: 'uuid-generator', name: 'UUID Generator', description: 'Generate v4 UUIDs.' },
    ]},
  ]},
  { slug: 'color', name: 'Color Toolkit', description: 'Pick, convert, compare, simulate, and build colors from one place.', groups: [
    { name: 'Pick & Build', options: [
      { slug: 'color-picker', name: 'Color Picker', description: 'Pick colors and get HEX, RGB, and HSL.' },
      { slug: 'color-palette-generator', name: 'Palette Generator', description: 'Build color palettes.' },
      { slug: 'gradient-generator', name: 'Gradient Generator', description: 'Create CSS gradients.' },
      { slug: 'screen-color-picker', name: 'Screen Picker', description: 'Pick a color from your screen.' },
    ]},
    { name: 'Convert & Accessibility', options: [
      { slug: 'hex-color-converter', name: 'HEX Converter', description: 'Convert HEX into RGB and HSL.' },
      { slug: 'hex-to-rgb', name: 'HEX → RGB', description: 'Convert HEX to RGB.' },
      { slug: 'rgb-to-hex', name: 'RGB → HEX', description: 'Convert RGB to HEX.' },
      { slug: 'color-contrast-checker', name: 'Contrast Checker', description: 'Check text and background contrast.' },
      { slug: 'color-blindness-simulator', name: 'Color Blindness', description: 'Preview color-vision variants.' },
    ]},
  ]},
  { slug: 'utility', name: 'Utility Toolkit', description: 'Small everyday helpers and generators that do not need their own workspace.', groups: [
    { name: 'Generate & Randomize', options: [
      { slug: 'barcode-generator', name: 'Barcode Generator', description: 'Create standard barcodes.' },
      { slug: 'random-number-generator', name: 'Random Number', description: 'Generate random numbers.' },
      { slug: 'lorem-ipsum-generator', name: 'Lorem Ipsum', description: 'Generate placeholder text.' },
      { slug: 'random-emoji-generator', name: 'Random Emoji', description: 'Pick random emoji.' },
      { slug: 'spin-wheel', name: 'Spin Wheel', description: 'Choose a random item.' },
      { slug: 'dice-roller', name: 'Dice Roller', description: 'Roll virtual dice.' },
      { slug: 'coin-flip', name: 'Coin Flip', description: 'Flip a virtual coin.' },
    ]},
    { name: 'Everyday Helpers', options: [
      { slug: 'tip-calculator', name: 'Tip Calculator', description: 'Calculate tips and totals.' },
      { slug: 'unit-price-comparator', name: 'Unit Price', description: 'Compare prices per unit.' },
      { slug: 'quick-notes', name: 'Quick Notes', description: 'Keep temporary notes locally.' },
      { slug: 'grocery-list', name: 'Grocery List', description: 'Build a simple shopping list.' },
      { slug: 'recipe-scaler', name: 'Recipe Scaler', description: 'Scale ingredient quantities.' },
      { slug: 'random-team-generator', name: 'Random Teams', description: 'Create random teams.' },
    ]},
  ]},
  { slug: 'device', name: 'Device Toolkit', description: 'Device, time, and screen utilities in one compact workspace.', groups: [
    { name: 'Device & Screen', options: [
      { slug: 'device-info', name: 'Device Info', description: 'Inspect browser and device information.' },
      { slug: 'screen-ruler', name: 'Screen Ruler', description: 'Measure on-screen distances.' },
      { slug: 'world-clock', name: 'World Clock', description: 'Compare local times around the world.' },
      { slug: 'my-ip-address', name: 'My IP Address', description: 'View your public IP information.' },
    ]},
  ]},
  { slug: 'ai', name: 'Nova AI Toolkit', description: 'All AI writing, translation, study, developer, and content assistants together.', groups: [
    { name: 'Writing & Language', options: [
      { slug: 'ai-summarizer', name: 'AI Summarizer', description: 'Turn long text into concise summaries.' },
      { slug: 'ai-rewriter', name: 'AI Rewriter', description: 'Rewrite text in a chosen style and language.' },
      { slug: 'ai-translator', name: 'AI Translator', description: 'Translate text between supported languages.' },
      { slug: 'ai-grammar-fixer', name: 'AI Grammar Fixer', description: 'Correct grammar, clarity, and wording.' },
      { slug: 'ai-email-writer', name: 'AI Email Writer', description: 'Draft polished emails quickly.' },
      { slug: 'ai-resume-improver', name: 'AI Resume Improver', description: 'Improve resume wording and impact.' },
      { slug: 'ai-cover-letter-writer', name: 'AI Cover Letter', description: 'Draft tailored cover letters.' },
    ]},
    { name: 'Content, Study & Dev', options: [
      { slug: 'ai-blog-outline', name: 'AI Blog Outline', description: 'Create structured blog outlines.' },
      { slug: 'ai-social-caption', name: 'AI Social Caption', description: 'Generate social captions.' },
      { slug: 'ai-youtube-script', name: 'AI YouTube Script', description: 'Build video scripts from ideas.' },
      { slug: 'ai-meeting-notes', name: 'AI Meeting Notes', description: 'Turn notes into organized summaries.' },
      { slug: 'ai-study-notes', name: 'AI Study Notes', description: 'Turn content into study-ready notes.' },
      { slug: 'ai-quiz-generator', name: 'AI Quiz Generator', description: 'Create quizzes from source material.' },
      { slug: 'ai-code-explainer', name: 'AI Code Explainer', description: 'Explain code in plain language.' },
      { slug: 'ai-sql-helper', name: 'AI SQL Helper', description: 'Build and explain SQL queries.' },
      { slug: 'ai-regex-builder', name: 'AI Regex Builder', description: 'Create and explain regular expressions.' },
      { slug: 'ai-prompt-builder', name: 'AI Prompt Builder', description: 'Turn goals into better AI prompts.' },
    ]},
  ]},
];

export function getToolkit(slug: string) { return TOOLKITS.find((toolkit) => toolkit.slug === slug); }
export function getAllToolkits() { return TOOLKITS; }

export function ToolkitHub({ toolkit }: { toolkit: ToolkitConfig }) {
  return <div className="space-y-8">
    {toolkit.groups.map((group) => <section key={group.name}>
      <div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-heading text-sm font-semibold uppercase tracking-[0.12em] nova-muted">{group.name}</h2><span className="text-xs nova-muted">{group.options.length}</span></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.options.map((option) => <Link key={option.slug} href={option.slug === 'pdf-tools' ? '/pdf-tools' : `/tools/${option.slug}`} className="nova-control group block rounded-2xl p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-start justify-between gap-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500"><CheckCircle2 className="h-5 w-5" /></div><ArrowRight className="h-4 w-4 nova-muted transition group-hover:translate-x-1 group-hover:text-primary-500" /></div>
          <h3 className="mt-4 font-semibold">{option.name}</h3><p className="mt-1 text-sm leading-5 nova-muted">{option.description}</p>
        </Link>)}
      </div>
    </section>)}
  </div>;
}
