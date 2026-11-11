import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function slugifyCategory(str: string) {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const SITE_URL = 'https://www.vivirmarruecos.com';
    const today = new Date().toISOString().split('T')[0];

    const baseRoutes = [
      '/',
      '/tours',
      '/destinations',
      '/actividades',
      '/galeria',
      '/blog',
      '/privacidad',
      '/aviso-legal',
      '/cookies',
      '/condiciones',
    ];

    const [
      { data: destinations },
      { data: tours },
      { data: blogPosts },
    ] = await Promise.all([
      supabase.from('destinations').select('id, slug, updated_at'),
      supabase.from('tours').select('id, slug, category, updated_at').eq('is_active', true),
      supabase.from('blog_posts').select('slug, updated_at').eq('is_published', true),
    ]);

    const collectionSlugs = new Set<string>();
    (tours || []).forEach((t: any) => {
      if (!t.category) return;
      t.category.split(',').forEach((part: string) => {
        const clean = slugifyCategory(part);
        if (clean) collectionSlugs.add(clean);
      });
    });

    const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];

    baseRoutes.forEach((route) => {
      urls.push({
        loc: `${SITE_URL}${route}`,
        lastmod: today,
        changefreq: route === '/' ? 'daily' : 'weekly',
        priority: route === '/' ? '1.0' : '0.8',
      });
    });

    (destinations || []).forEach((dest: any) => {
      urls.push({
        loc: `${SITE_URL}/destinations/${dest.slug || dest.id}`,
        lastmod: dest.updated_at ? new Date(dest.updated_at).toISOString().split('T')[0] : today,
        changefreq: 'weekly',
        priority: '0.9',
      });
    });

    (tours || []).forEach((tour: any) => {
      urls.push({
        loc: `${SITE_URL}/tours/${tour.id}`,
        lastmod: tour.updated_at ? new Date(tour.updated_at).toISOString().split('T')[0] : today,
        changefreq: 'weekly',
        priority: '0.9',
      });
    });

    Array.from(collectionSlugs).forEach((slug) => {
      urls.push({
        loc: `${SITE_URL}/coleccion/${slug}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.9',
      });
    });

    (blogPosts || []).forEach((post: any) => {
      urls.push({
        loc: `${SITE_URL}/blog/${post.slug}`,
        lastmod: post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : today,
        changefreq: 'weekly',
        priority: '0.8',
      });
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(sitemap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating sitemap' });
  }
}
