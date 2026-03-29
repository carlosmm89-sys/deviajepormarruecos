import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Usar variables de Vercel/Node o fallback a las de Vite (si están inyectadas localmente)
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const SITE_URL = 'https://www.vivirmarruecos.com';

    // 1. Fetch static or base routes
    const baseRoutes = [
      '',
      '/tours',
      '/destinations',
      '/blog',
      '/favoritos',
    ];

    // 2. Fetch Destinations
    const { data: destinations } = await supabase
      .from('destinations')
      .select('id, updated_at');

    // 3. Fetch Tours
    const { data: tours } = await supabase
      .from('tours')
      .select('id, updated_at')
      .eq('is_active', true);

    // 4. Fetch Blog Posts
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${baseRoutes
    .map((route) => {
      return `
    <url>
      <loc>${SITE_URL}${route}</loc>
      <changefreq>daily</changefreq>
      <priority>${route === '' ? '1.0' : '0.8'}</priority>
    </url>
  `;
    })
    .join('')}
  
  ${(destinations || [])
    .map((dest) => {
      return `
    <url>
      <loc>${SITE_URL}/destinations/${dest.id}</loc>
      <lastmod>${new Date(dest.updated_at || Date.now()).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
  `;
    })
    .join('')}

  ${(tours || [])
    .map((tour) => {
      return `
    <url>
      <loc>${SITE_URL}/tours/${tour.id}</loc>
      <lastmod>${new Date(tour.updated_at || Date.now()).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
  `;
    })
    .join('')}

  ${(blogPosts || [])
    .map((post) => {
      return `
    <url>
      <loc>${SITE_URL}/blog/${post.slug}</loc>
      <lastmod>${new Date(post.updated_at || Date.now()).toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
  `;
    })
    .join('')}
</urlset>
`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour
    res.status(200).send(sitemap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating sitemap' });
  }
}
