import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno pre-build
dotenv.config({ path: fs.existsSync('.env.local') ? '.env.local' : '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ No se encontraron credenciales de Supabase. El sitemap generado solo tendrá las rutas estáticas.');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const DOMAIN = 'https://www.vivirmarruecos.com';

function slugifyCategory(str) {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

async function generateSitemap() {
  console.log('Generando sitemap.xml...');

  const staticRoutes = [
    '/',
    '/tours',
    '/destinations',
    '/actividades',
    '/galeria',
    '/blog',
    '/privacidad',
    '/aviso-legal',
    '/cookies',
    '/condiciones'
  ];

  let dynamicRoutes = [];

  if (supabase) {
    try {
      // Fetch Tours
      const { data: tours } = await supabase.from('tours').select('id, slug, updated_at').eq('is_active', true);
      if (tours) {
        tours.forEach(tour => dynamicRoutes.push(`/tours/${tour.slug || tour.id}`));
      }

      // Fetch Destinations
      const { data: destinations } = await supabase.from('destinations').select('id, slug, updated_at');
      if (destinations) {
        destinations.forEach(dest => dynamicRoutes.push(`/destinations/${dest.slug || dest.id}`));
      }

      // Fetch Blog Posts
      const { data: posts } = await supabase.from('blog_posts').select('slug, updated_at').eq('is_published', true);
      if (posts) {
        posts.forEach(post => dynamicRoutes.push(`/blog/${post.slug}`));
      }

      // Fetch Collections (separando categorías múltiples por coma)
      const { data: collections } = await supabase.from('tours').select('category').eq('is_active', true);
      if (collections) {
        const individualCats = new Set();
        collections.forEach(item => {
          if (!item.category) return;
          item.category.split(',').forEach(part => {
            const clean = slugifyCategory(part);
            if (clean) individualCats.add(clean);
          });
        });
        individualCats.forEach(catSlug => {
          dynamicRoutes.push(`/coleccion/${catSlug}`);
        });
      }
    } catch (err) {
      console.error('Error fetching dynamic routes:', err);
    }
  }

  dynamicRoutes = [...new Set(dynamicRoutes)];
  const allRoutes = [...staticRoutes, ...dynamicRoutes];
  const today = new Date().toISOString().split('T')[0];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${DOMAIN}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : route.startsWith('/tours/') || route.startsWith('/coleccion/') || route.startsWith('/destinations/') ? '0.9' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  const publicPath = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
  }

  fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), sitemapXml);
  console.log(`✅ Sitemap generado exitosamente en public/sitemap.xml con ${allRoutes.length} rutas.`);
}

generateSitemap();
