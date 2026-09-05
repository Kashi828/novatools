'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export type ToolkitOption = {
  slug: string;
  name: string;
  description: string;
};

export type ToolkitConfig = {
  slug: string;
  name: string;
  description: string;
  options: ToolkitOption[];
};

const TOOLKITS: ToolkitConfig[] = [
  {
    slug: 'pdf', name: 'PDF Toolkit', description: 'One workspace for the most common PDF tasks instead of jumping between separate pages.',
    options: [
      { slug: 'pdf-merge', name: 'Merge PDFs', description: 'Combine multiple PDF files into one document.' },
      { slug: 'pdf-split', name: 'Split PDF', description: 'Extract selected pages or page ranges.' },
      { slug: 'pdf-compress', name: 'Compress PDF', description: 'Reduce PDF file size.' },
      { slug: 'pdf-to-image', name: 'PDF to Image', description: 'Export PDF pages as images.' },
      { slug: 'image-to-pdf', name: 'Image to PDF', description: 'Turn images into a PDF.' },
      { slug: 'pdf-tools', name: 'Advanced PDF workspace', description: 'Extract, delete, reorder, rotate pages, edit metadata, add blanks, and inspect PDFs.' },
    ],
  },
  {
    slug: 'image', name: 'Image Toolkit', description: 'A single image workspace for preparing, converting, resizing, and processing images.',
    options: [
      { slug: 'image-compressor', name: 'Compress', description: 'Reduce image size with quality control.' },
      { slug: 'image-converter', name: 'Convert', description: 'Convert between common image formats.' },
      { slug: 'image-resizer', name: 'Resize', description: 'Resize to exact dimensions.' },
      { slug: 'batch-image-processor', name: 'Batch Process', description: 'Process many images together.' },
      { slug: 'favicon-generator', name: 'Favicon', description: 'Generate standard website icon sizes.' },
      { slug: 'color-blindness-simulator', name: 'Accessibility Preview', description: 'Preview color-vision-deficiency variants.' },
    ],
  },
  {
    slug: 'text', name: 'Text Toolkit', description: 'Clean, transform, inspect, compare, and prepare text from one place.',
    options: [
      { slug: 'word-counter', name: 'Count', description: 'Words, characters, sentences, paragraphs, and reading time.' },
      { slug: 'case-converter', name: 'Case', description: 'Switch between common text casing styles.' },
      { slug: 'text-cleaner', name: 'Clean', description: 'Remove noise, extra spaces, and blank lines.' },
      { slug: 'text-sorter', name: 'Sort', description: 'Sort, reverse, or shuffle lines.' },
      { slug: 'text-diff-checker', name: 'Compare', description: 'Compare two versions of text.' },
      { slug: 'text-repeater', name: 'Repeat', description: 'Repeat text with your chosen separator.' },
      { slug: 'readability-checker', name: 'Readability', description: 'Check reading difficulty.' },
    ],
  },
  {
    slug: 'developer', name: 'Developer Toolkit', description: 'A focused toolbox for JSON, URLs, code, markup, data, and debugging workflows.',
    options: [
      { slug: 'json-formatter', name: 'JSON Format', description: 'Format, validate, and minify JSON.' },
      { slug: 'json-validator', name: 'JSON Validate', description: 'Check JSON syntax and errors.' },
      { slug: 'base64-encoder-decoder', name: 'Base64', description: 'Encode and decode Base64.' },
      { slug: 'url-encoder-decoder', name: 'URL Encode', description: 'Encode or decode URL components.' },
      { slug: 'url-parser', name: 'URL Parser', description: 'Inspect URL parts and query data.' },
      { slug: 'regex-tester', name: 'Regex Tester', description: 'Test regular expressions interactively.' },
      { slug: 'markdown-preview', name: 'Markdown', description: 'Preview Markdown as rendered content.' },
      { slug: 'html-preview', name: 'HTML Preview', description: 'Preview HTML in a sandbox.' },
      { slug: 'xml-formatter', name: 'XML', description: 'Format, validate, and minify XML.' },
      { slug: 'csv-to-json', name: 'CSV → JSON', description: 'Convert tabular CSV data to JSON.' },
      { slug: 'json-to-csv-converter', name: 'JSON → CSV', description: 'Convert JSON records to CSV.' },
      { slug: 'json-to-typescript', name: 'JSON → TypeScript', description: 'Generate a TypeScript interface from JSON.' },
    ],
  },
  {
    slug: 'calculators', name: 'Calculator Toolkit', description: 'Group common math and practical calculators into one searchable workspace.',
    options: [
      { slug: 'percentage-calculator', name: 'Percentage', description: 'Solve common percentage problems.' },
      { slug: 'percentage-change-calculator', name: 'Percentage Change', description: 'Find increases and decreases.' },
      { slug: 'date-difference-calculator', name: 'Date Difference', description: 'Find the difference between dates.' },
      { slug: 'scientific-calculator', name: 'Scientific', description: 'Trigonometry, logs, powers, and more.' },
      { slug: 'bmi-calculator', name: 'BMI', description: 'Calculate body mass index.' },
      { slug: 'age-calculator', name: 'Age', description: 'Calculate exact age from a date of birth.' },
      { slug: 'average-calculator', name: 'Average', description: 'Calculate the mean of numbers.' },
      { slug: 'median-calculator', name: 'Median', description: 'Find the middle value of a dataset.' },
      { slug: 'ratio-calculator', name: 'Ratio', description: 'Simplify ratios.' },
      { slug: 'working-days-calculator', name: 'Working Days', description: 'Count weekdays between dates.' },
    ],
  },
  {
    slug: 'converters', name: 'Converter Toolkit', description: 'Switch between measurements, currencies, digital sizes, time zones, and data formats.',
    options: [
      { slug: 'unit-converter', name: 'Units', description: 'Length, weight, temperature, volume, and more.' },
      { slug: 'currency-converter', name: 'Currency', description: 'Convert between world currencies.' },
      { slug: 'timezone-converter', name: 'Timezone', description: 'Compare times across time zones.' },
      { slug: 'file-size-converter', name: 'File Size', description: 'Convert bytes, KB, MB, GB, and binary units.' },
      { slug: 'number-base-converter', name: 'Number Bases', description: 'Convert binary, octal, decimal, and hex.' },
      { slug: 'binary-text-converter', name: 'Binary Text', description: 'Convert text and binary.' },
      { slug: 'csv-to-json', name: 'CSV → JSON', description: 'Convert spreadsheet-style data to JSON.' },
      { slug: 'json-to-csv-converter', name: 'JSON → CSV', description: 'Convert JSON records to CSV.' },
      { slug: 'hex-encoder', name: 'Text → Hex', description: 'Encode text as hexadecimal bytes.' },
      { slug: 'hex-decoder', name: 'Hex → Text', description: 'Decode hexadecimal bytes.' },
    ],
  },
  {
    slug: 'student', name: 'Student Toolkit', description: 'Keep study, writing, grading, revision, and planning tools together.',
    options: [
      { slug: 'gpa-calculator', name: 'GPA', description: 'Calculate your grade point average.' },
      { slug: 'grade-percentage-calculator', name: 'Grade %', description: 'Convert marks into percentages and grades.' },
      { slug: 'grade-needed-calculator', name: 'Grade Needed', description: 'Estimate the score needed on remaining work.' },
      { slug: 'weighted-grade-calculator', name: 'Weighted Grade', description: 'Calculate a weighted course score.' },
      { slug: 'flashcard-maker', name: 'Flashcards', description: 'Create study flashcards.' },
      { slug: 'study-timer', name: 'Study Timer', description: 'Focus with Pomodoro sessions.' },
      { slug: 'citation-generator', name: 'Citations', description: 'Create APA, MLA, and Chicago citations.' },
      { slug: 'study-hours-calculator', name: 'Study Hours', description: 'Plan study time across days.' },
      { slug: 'exam-score-calculator', name: 'Exam Score', description: 'Calculate exam percentages.' },
      { slug: 'exam-countdown-planner', name: 'Exam Planner', description: 'Track upcoming exams.' },
    ],
  },
  {
    slug: 'finance', name: 'Finance Toolkit', description: 'Bring everyday money calculations into one clean workspace.',
    options: [
      { slug: 'emi-calculator', name: 'EMI', description: 'Estimate monthly loan payments.' },
      { slug: 'loan-amortization', name: 'Amortization', description: 'View loan payoff schedules.' },
      { slug: 'gst-calculator', name: 'GST', description: 'Add or remove GST from amounts.' },
      { slug: 'invoice-generator', name: 'Invoice', description: 'Create itemized invoices.' },
      { slug: 'budget-tracker', name: 'Budget', description: 'Track income and expenses.' },
      { slug: 'discount-calculator', name: 'Discount', description: 'Calculate sale prices and savings.' },
      { slug: 'profit-margin-calculator', name: 'Profit Margin', description: 'Calculate profit and margin.' },
      { slug: 'markup-calculator', name: 'Markup', description: 'Calculate markup percentage.' },
      { slug: 'commission-calculator', name: 'Commission', description: 'Calculate sales commission.' },
      { slug: 'compound-interest-calculator', name: 'Compound Interest', description: 'Estimate compound growth.' },
      { slug: 'break-even-calculator', name: 'Break-Even', description: 'Find your break-even volume.' },
      { slug: 'savings-goal-calculator', name: 'Savings Goal', description: 'Plan progress toward a savings target.' },
    ],
  },
  {
    slug: 'web', name: 'Web Toolkit', description: 'SEO, URLs, metadata, QR codes, and website helpers in one place.',
    options: [
      { slug: 'qr-generator', name: 'QR Code', description: 'Create QR codes from text or links.' },
      { slug: 'qr-code-reader', name: 'QR Reader', description: 'Decode QR codes from images.' },
      { slug: 'qr-batch-generator', name: 'QR Batch', description: 'Generate many QR codes at once.' },
      { slug: 'vcard-qr-generator', name: 'Contact QR', description: 'Create QR codes for contact cards.' },
      { slug: 'meta-tag-generator', name: 'Meta Tags', description: 'Generate SEO and social metadata.' },
      { slug: 'utm-builder', name: 'UTM Builder', description: 'Create campaign URLs.' },
      { slug: 'slug-generator', name: 'Slug', description: 'Create clean SEO-friendly URL slugs.' },
      { slug: 'robots-generator', name: 'robots.txt', description: 'Generate basic crawler rules.' },
      { slug: 'sitemap-url-builder', name: 'Sitemap', description: 'Generate sitemap XML from URLs.' },
      { slug: 'open-graph-text', name: 'Open Graph', description: 'Generate social sharing metadata.' },
      { slug: 'favicon-generator', name: 'Favicon', description: 'Create standard web icons.' },
    ],
  },
  {
    slug: 'security', name: 'Security Toolkit', description: 'Password, hashing, and encoding utilities designed for safe local use.',
    options: [
      { slug: 'password-generator', name: 'Password Generator', description: 'Create random strong passwords locally.' },
      { slug: 'password-strength-checker', name: 'Password Strength', description: 'Evaluate password strength locally.' },
      { slug: 'passphrase-generator', name: 'Passphrase', description: 'Create memorable word-based passwords.' },
      { slug: 'hash-generator', name: 'Hash Generator', description: 'Generate common cryptographic hashes.' },
      { slug: 'uuid-generator', name: 'UUID Generator', description: 'Generate v4 UUIDs.' },
      { slug: 'base64-encoder-decoder', name: 'Base64', description: 'Encode and decode Base64 content.' },
      { slug: 'hex-encoder', name: 'Hex Encoder', description: 'Encode text into hex bytes.' },
      { slug: 'hex-decoder', name: 'Hex Decoder', description: 'Decode hex bytes into text.' },
    ],
  },
];

export function getToolkit(slug: string) {
  return TOOLKITS.find((toolkit) => toolkit.slug === slug);
}

export function getAllToolkits() {
  return TOOLKITS;
}

export function ToolkitHub({ toolkit }: { toolkit: ToolkitConfig }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {toolkit.options.map((option) => (
          <Link key={option.slug} href={option.slug === 'pdf-tools' ? '/pdf-tools' : `/tools/${option.slug}`} className="group rounded-2xl border border-black/10 bg-white/60 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary-400/40 hover:bg-white/80 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/[.08]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500"><CheckCircle2 className="h-5 w-5" /></div>
              <ArrowRight className="h-4 w-4 text-black/30 transition group-hover:translate-x-1 group-hover:text-primary-500 dark:text-white/30" />
            </div>
            <h2 className="mt-4 font-semibold">{option.name}</h2>
            <p className="mt-1 text-sm leading-5 text-black/55 dark:text-white/55">{option.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
