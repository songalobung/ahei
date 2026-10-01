import { MetadataRoute } from 'next';
import institutionsData from '@/data/institutions.json';
import countriesData from '@/data/countries.json';
import { ARTICLES_DATA } from '@/data/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';

  // Core static discovery & intelligence routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/rankings`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/universities`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/subjects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/calculator`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/methodology`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/corrections`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/about/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // 5 Macro-regional corridors
  const regionalSlugs = ['north-africa', 'west-africa', 'east-africa', 'central-africa', 'southern-africa'];
  const regionalRoutes: MetadataRoute.Sitemap = regionalSlugs.map((slug) => ({
    url: `${baseUrl}/regions/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Country profiles
  const countryRoutes: MetadataRoute.Sitemap = (countriesData as any[]).map((c) => ({
    url: `${baseUrl}/countries/${c.country_iso2.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // University deep profile dossiers
  const universityRoutes: MetadataRoute.Sitemap = (institutionsData as any[]).map((inst) => ({
    url: `${baseUrl}/universities/${inst.institution_id.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Article / Blog posts
  const articleRoutes: MetadataRoute.Sitemap = ARTICLES_DATA.map((art) => ({
    url: `${baseUrl}/articles/${art.slug}`,
    lastModified: new Date(art.modifiedDate || art.publishDate),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...regionalRoutes, ...countryRoutes, ...universityRoutes, ...articleRoutes];
}
