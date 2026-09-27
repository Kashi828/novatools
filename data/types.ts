import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';

export type CategorySlug =
  | 'text'
  | 'image'
  | 'pdf'
  | 'developer'
  | 'calculators'
  | 'converters'
  | 'student'
  | 'ai'
  | 'security'
  | 'color'
  | 'web'
  | 'finance'
  | 'device'
  | 'utility';

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: CategorySlug;
  icon: LucideIcon;
  keywords: string[];
  trending?: boolean;
  featured?: boolean;
  isNew?: boolean;
  premium?: boolean;
  component?: ComponentType;
  faqs?: ToolFaq[];
  relatedSlugs?: string[];
}
