import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno pre-build
dotenv.config({ path: fs.existsSync('.env.local') ? '.env.local' : '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ No se encontraron credenciales de Supabase. El sitemap generado solo tendrá las rutas estáticas.');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const DOMAIN = 'https://www.vivirmarruecos.com';

async function generateSitemap() {
  console.log('Generando sitemap.xml...');

  const staticRoutes = [
    '/',
    '/tours',
    '/destinos',
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
      const { data: tours } = await supabase.from('tours').select('id, updated_at').eq('is_active', true);
      if (tours) {
        tours.forEach(tour => dynamicRoutes.push(`/tours/${tour.id}`));
      }

      // Fetch Destinations
      const { data: destinations } = await supabase.from('destinations').select('slug, updated_at');
      if (destinations) {
        destinations.forEach(dest => dynamicRoutes.push(`/destino/${dest.slug}`));
      }

      // Fetch Blog Posts
      const { data: posts } = await supabase.from('blog_posts').select('slug, updated_at').eq('is_published', true);
      if (posts) {
        posts.forEach(post => dynamicRoutes.push(`/blog/${post.slug}`));
      }
      
      // Fetch Collections
      const { data: collections } = await supabase.from('tours').select('category').eq('is_active', true);
      if (collections) {
        // Obtenemos categorias unicas mapeadas a slug
        const cats = [...new Set(collections.map(c => c.category).filter(Boolean))];
        cats.forEach(c => {
          let catSlug = c.toLowerCase()
              .replace(/ /g, '-')
              .normalize('NFD').replace(/[\u0300-\u036f]/g, ""); // quitar tildes
          dynamicRoutes.push(`/coleccion/${catSlug}`);
        });
      }
    } catch (err) {
      console.error('Error fetching dynamic routes:', err);
    }
  }

  // Quitar duplicados por si acaso
  dynamicRoutes = [...new Set(dynamicRoutes)];
  
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${DOMAIN}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : route.startsWith('/tours/') || route.startsWith('/coleccion/') ? '0.9' : '0.8'}</priority>
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
