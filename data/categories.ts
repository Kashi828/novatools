import {
  Type,
  Image as ImageIcon,
  FileText,
  Code2,
  Calculator,
  Repeat,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Palette,
  Globe,
  Landmark,
  Wrench,
  Smartphone,
} from 'lucide-react';
import type { Category } from './types';

export const categories: Category[] = [
  { slug: 'text', name: 'Text Tools', description: 'Count, clean, and transform text instantly.', icon: Type },
  { slug: 'image', name: 'Image Tools', description: 'Compress, convert, and resize images.', icon: ImageIcon },
  { slug: 'pdf', name: 'PDF Tools', description: 'Merge, split, and convert PDF files.', icon: FileText },
  { slug: 'developer', name: 'Developer Tools', description: 'Format, encode, and debug code and data.', icon: Code2 },
  { slug: 'calculators', name: 'Calculators', description: 'Quick answers for everyday math.', icon: Calculator },
  { slug: 'converters', name: 'Converters', description: 'Switch between units and formats.', icon: Repeat },
  { slug: 'student', name: 'Student Tools', description: 'Helpers for coursework and study.', icon: GraduationCap },
  { slug: 'ai', name: 'AI Tools', description: 'Smart helpers powered by AI.', icon: Sparkles },
  { slug: 'security', name: 'Security Tools', description: 'Passwords, hashes, and safety checks.', icon: ShieldCheck },
  { slug: 'color', name: 'Color Tools', description: 'Pick, convert, and build palettes.', icon: Palette },
  { slug: 'web', name: 'Web Tools', description: 'Utilities for building and testing the web.', icon: Globe },
  { slug: 'finance', name: 'Finance Tools', description: 'Loans, tax, and money math.', icon: Landmark },
  { slug: 'device', name: 'Device Tools', description: 'Tools that use your phone or laptop\u2019s built-in sensors.', icon: Smartphone },
  { slug: 'utility', name: 'Utility Tools', description: 'Small tools that solve daily problems.', icon: Wrench },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
