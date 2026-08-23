import type { MetadataRoute } from 'next';
import { tools } from '@/data/tools';
import { categories } from '@/data/categories';

const SITE_URL = 'https://novatools.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/tools', '/categories', '/about', '/contact', '/pricing', '/feedback', '/privacy', '/terms'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const toolRoutes = tools.map((t) => ({
    url: `${SITE_URL}/tools/${t.slug}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${SITE_URL}/categories/${c.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...toolRoutes, ...categoryRoutes];
}
