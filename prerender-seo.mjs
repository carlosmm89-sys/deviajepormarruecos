import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: fs.existsSync('.env.local') ? '.env.local' : '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const DOMAIN = 'https://www.vivirmarruecos.com';
const DIST_DIR = path.join(process.cwd(), 'dist');

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripHtml(html = '') {
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function slugifyCategory(str = '') {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function injectPageSeo(baseHtml, { title, description, canonicalPath, image, type = 'website', schema, bodyHtml }) {
  const safeTitle = escapeHtml(title || 'Marruecos Experiencia - Tu Agencia de Viajes en Marruecos');
  const safeDesc = escapeHtml(
    (description || 'Descubre la magia de Marruecos con nuestros tours y excursiones organizadas a medida.').slice(0, 160)
  );
  const fullUrl = canonicalPath.startsWith('http') ? canonicalPath : `${DOMAIN}${canonicalPath}`;
  const safeImage = escapeHtml(image || `${DOMAIN}/pwa-512x512.png`);

  let html = baseHtml
    .replace(/<title>.*?<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${safeDesc}">`)
    .replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${safeTitle}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${safeDesc}" />`)
    .replace(/<meta property="og:image" content=".*?"\s*\/?>/i, `<meta property="og:image" content="${safeImage}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/?>/i, `<meta property="og:url" content="${fullUrl}" />`)
    .replace(/<meta property="og:type" content=".*?"\s*\/?>/i, `<meta property="og:type" content="${type}" />`);

  const extraHead = [
    `<link rel="canonical" href="${fullUrl}" />`,
    schema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : ''
  ]
    .filter(Boolean)
    .join('\n    ');

  html = html.replace('</head>', `    ${extraHead}\n  </head>`);

  if (bodyHtml) {
    html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  }

  return html;
}

function writeRouteHtml(routePath, htmlContent) {
  const cleanRoute = routePath.replace(/^\/+|\/+$/g, '');
  const targetDir = cleanRoute ? path.join(DIST_DIR, cleanRoute) : DIST_DIR;
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf-8');
}

async function prerender() {
  const templatePath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.warn('⚠️ No se encontró dist/index.html. Ejecuta vite build primero.');
    return;
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf-8');
  console.log('🚀 Pre-renderizando páginas SEO en dist/...');

  let tours = [];
  let destinations = [];
  let posts = [];
  let settings = null;

  if (supabase) {
    try {
      const [toursRes, destsRes, postsRes, settingsRes] = await Promise.all([
        supabase.from('tours').select('*, destinations(*)').eq('is_active', true),
        supabase.from('destinations').select('*'),
        supabase.from('blog_posts').select('*').eq('is_published', true),
        supabase.from('business_settings').select('*').limit(1).single()
      ]);
      tours = toursRes.data || [];
      destinations = destsRes.data || [];
      posts = postsRes.data || [];
      settings = settingsRes.data || null;
    } catch (err) {
      console.error('Error consultando Supabase para prerender:', err);
    }
  }

  const siteName = settings?.business_name || settings?.site_name || 'Marruecos Experiencia';
  const navHtml = `<nav aria-label="Navegación principal"><a href="/">Inicio</a> | <a href="/destinations">Destinos</a> | <a href="/tours">Tours en Marruecos</a> | <a href="/actividades">Actividades</a> | <a href="/blog">Blog</a> | <a href="/galeria">Galería</a></nav>`;

  let count = 0;

  // 1. Home (/)
  const homeBody = `<main>${navHtml}<h1>${escapeHtml(stripHtml(settings?.hero_title || 'Viajes y Rutas por Marruecos a Medida'))}</h1><p>${escapeHtml(settings?.hero_subtitle || 'Agencia especializada en tours privados, excursiones al desierto de Merzouga y rutas por Marruecos.')}</p><section><h2>Destinos Destacados en Marruecos</h2><ul>${destinations.map(d => `<li><a href="/destinations/${d.slug || d.id}">${escapeHtml(d.name)}</a></li>`).join('')}</ul></section><section><h2>Rutas y Circuitos por Marruecos</h2><ul>${tours.map(t => `<li><a href="/tours/${t.id}">${escapeHtml(t.title)}</a> - Desde ${t.price || 0}€</li>`).join('')}</ul></section></main>`;
  writeRouteHtml('/', injectPageSeo(baseHtml, {
    title: `${siteName} - Agencia de Viajes y Rutas en Marruecos`,
    description: settings?.hero_subtitle || 'Descubre la magia de Marruecos con nuestros tours y excursiones organizadas a medida. Desierto del Sahara, Marrakech, Fez y más.',
    canonicalPath: '/',
    image: settings?.hero_image_url,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: siteName,
      url: DOMAIN,
      telephone: settings?.whatsapp_number || '+34 604 48 82 23',
      email: settings?.admin_email || 'info@vivirmarruecos.com'
    },
    bodyHtml: homeBody
  }));
  count++;

  // 2. Catálogo de Tours (/tours)
  const toursBody = `<main>${navHtml}<h1>Tours y Circuitos por Marruecos</h1><p>Explora nuestras rutas privadas y en grupo por el desierto del Sahara, Marrakech, Fez, Tánger y las Ciudades Imperiales.</p><ul>${tours.map(t => `<li><article><h2><a href="/tours/${t.id}">${escapeHtml(t.title)}</a></h2><p>${escapeHtml(stripHtml(t.itinerary_summary || t.description || '').slice(0, 220))}</p><p>Precio desde: ${t.price || 0}€</p></article></li>`).join('')}</ul></main>`;
  writeRouteHtml('/tours', injectPageSeo(baseHtml, {
    title: `Tours y Circuitos por Marruecos | ${siteName}`,
    description: 'Explora todos nuestros tours por Marruecos: excursiones al desierto de Merzouga, rutas desde Marrakech, Fez, Tánger y viajes a medida.',
    canonicalPath: '/tours',
    bodyHtml: toursBody
  }));
  count++;

  // 3. Catálogo de Destinos (/destinations y /destinos)
  const destsBody = `<main>${navHtml}<h1>Destinos en Marruecos</h1><p>Descubre nuestras rutas desde Marrakech, Fez, Tánger, Casablanca, Chefchaouen y el desierto de Merzouga.</p><ul>${destinations.map(d => `<li><article><h2><a href="/destinations/${d.slug || d.id}">${escapeHtml(d.name)}</a></h2><p>${escapeHtml(stripHtml(d.description || '').slice(0, 220))}</p></article></li>`).join('')}</ul></main>`;
  for (const r of ['/destinations', '/destinos']) {
    writeRouteHtml(r, injectPageSeo(baseHtml, {
      title: `Destinos en Marruecos | ${siteName}`,
      description: 'Guía de destinos en Marruecos: Marrakech, Fez, Desierto de Merzouga, Chefchaouen, Tánger y Casablanca.',
      canonicalPath: '/destinations',
      bodyHtml: destsBody
    }));
    count++;
  }

  // 4. Actividades (/actividades)
  const actPosts = posts.filter(p => p.category === 'Actividades');
  const actBody = `<main>${navHtml}<h1>Actividades y Experiencias en Marruecos</h1><p>Complementa tu viaje con actividades únicas: paseos en globo, quads en el desierto, rutas en camello y noche en campamento bereber.</p><ul>${actPosts.map(p => `<li><h2><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(p.excerpt || '')}</p></li>`).join('')}</ul></main>`;
  writeRouteHtml('/actividades', injectPageSeo(baseHtml, {
    title: `Actividades y Experiencias en Marruecos | ${siteName}`,
    description: 'Complementa tu viaje con actividades únicas: paseos en globo, quads en el desierto, rutas en camello y mucho más.',
    canonicalPath: '/actividades',
    bodyHtml: actBody
  }));
  count++;

  // 5. Blog (/blog)
  const blogBody = `<main>${navHtml}<h1>Blog de Viajes a Marruecos</h1><p>Consejos, guías prácticas, rutas y secretos para viajar a Marruecos.</p><ul>${posts.map(p => `<li><article><h2><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(p.excerpt || stripHtml(p.content || '').slice(0, 200))}</p></article></li>`).join('')}</ul></main>`;
  writeRouteHtml('/blog', injectPageSeo(baseHtml, {
    title: `Blog de Viajes a Marruecos: Guías y Consejos | ${siteName}`,
    description: 'Artículos, consejos prácticos y guías completas para preparar tu viaje a Marruecos: qué ver, mejor época, gastronomía y desierto.',
    canonicalPath: '/blog',
    bodyHtml: blogBody
  }));
  count++;

  // 6. Galería (/galeria) y Legales
  const staticPages = [
    { path: '/galeria', title: `Galería de Imágenes de Marruecos | ${siteName}`, desc: 'Descubre Marruecos en imágenes: desierto de Merzouga, Marrakech, Chefchaouen y experiencias reales de nuestros viajeros.' },
    { path: '/privacidad', title: `Política de Privacidad | ${siteName}`, desc: 'Política de privacidad y protección de datos de Marruecos Experiencia.' },
    { path: '/aviso-legal', title: `Aviso Legal | ${siteName}`, desc: 'Aviso legal e información general de Marruecos Experiencia.' },
    { path: '/cookies', title: `Política de Cookies | ${siteName}`, desc: 'Información sobre el uso de cookies en vivirmarruecos.com.' },
    { path: '/condiciones', title: `Condiciones Generales de Contratación | ${siteName}`, desc: 'Términos y condiciones generales para nuestros viajes y rutas por Marruecos.' }
  ];
  for (const sp of staticPages) {
    writeRouteHtml(sp.path, injectPageSeo(baseHtml, {
      title: sp.title,
      description: sp.desc,
      canonicalPath: sp.path,
      bodyHtml: `<main>${navHtml}<h1>${escapeHtml(sp.title)}</h1><p>${escapeHtml(sp.desc)}</p></main>`
    }));
    count++;
  }

  // 7. Cada Tour individual (/tours/:id y /tours/:slug)
  for (const tour of tours) {
    const descText = stripHtml(tour.itinerary_summary || tour.description || `Reserva el tour ${tour.title} en Marruecos.`);
    const tourHtml = `<main>${navHtml}<article><h1>${escapeHtml(tour.title)}</h1><p>${escapeHtml(descText)}</p><p><strong>Precio desde:</strong> ${tour.price || 0}€ | <strong>Categoría:</strong> ${escapeHtml(tour.category || 'Marruecos')}</p><div>${tour.description || ''}</div></article></main>`;
    const seoPayload = {
      title: `${tour.title} | ${siteName}`,
      description: descText.slice(0, 160),
      canonicalPath: `/tours/${tour.id}`,
      image: tour.featured_image || tour.gallery?.[0],
      type: 'product',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: tour.title,
        description: descText.slice(0, 300),
        image: tour.featured_image || tour.gallery?.[0],
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: tour.price || 0,
          availability: 'https://schema.org/InStock',
          url: `${DOMAIN}/tours/${tour.id}`
        }
      },
      bodyHtml: tourHtml
    };
    writeRouteHtml(`/tours/${tour.id}`, injectPageSeo(baseHtml, seoPayload));
    count++;
    if (tour.slug) {
      writeRouteHtml(`/tours/${tour.slug}`, injectPageSeo(baseHtml, seoPayload));
      count++;
    }
  }

  // 8. Cada Destino individual (/destinations/:slug, /destinations/:id y /destino/:slug)
  for (const dest of destinations) {
    const descText = stripHtml(dest.description || `Descubre los mejores tours y excursiones en ${dest.name}.`);
    const canonical = `/destinations/${dest.slug || dest.id}`;
    const destHtml = `<main>${navHtml}<article><h1>${escapeHtml(dest.name)} - Viajes y Rutas en Marruecos</h1><div>${dest.description || `<p>${escapeHtml(descText)}</p>`}</div></article></main>`;
    const seoPayload = {
      title: `${dest.name} - Viajes y Rutas a Marruecos | ${siteName}`,
      description: descText.slice(0, 160),
      canonicalPath: canonical,
      image: dest.image_url,
      schema: {
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: dest.name,
        description: descText.slice(0, 300),
        image: dest.image_url
      },
      bodyHtml: destHtml
    };
    writeRouteHtml(`/destinations/${dest.id}`, injectPageSeo(baseHtml, seoPayload));
    count++;
    if (dest.slug) {
      writeRouteHtml(`/destinations/${dest.slug}`, injectPageSeo(baseHtml, seoPayload));
      writeRouteHtml(`/destino/${dest.slug}`, injectPageSeo(baseHtml, seoPayload));
      count += 2;
    }
  }

  // 9. Cada Post del Blog (/blog/:slug)
  for (const post of posts) {
    if (!post.slug) continue;
    const descText = stripHtml(post.meta_description || post.excerpt || post.content || post.title);
    const postHtml = `<main>${navHtml}<article><h1>${escapeHtml(post.title)}</h1><p>${escapeHtml(post.excerpt || '')}</p><div>${post.content || ''}</div></article></main>`;
    writeRouteHtml(`/blog/${post.slug}`, injectPageSeo(baseHtml, {
      title: `${post.meta_title || post.title} | ${siteName}`,
      description: descText.slice(0, 160),
      canonicalPath: `/blog/${post.slug}`,
      image: post.cover_image,
      type: 'article',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: descText.slice(0, 250),
        image: post.cover_image,
        datePublished: post.published_at || post.created_at,
        author: { '@type': 'Organization', name: siteName }
      },
      bodyHtml: postHtml
    }));
    count++;
  }

  // 10. Colecciones (/coleccion/:slug)
  const collectionSlugs = new Set([
    'desierto', 'norte-de-marruecos', 'ciudades-imperiales', 'aventura',
    'cultura', 'viajes-exclusivos', 'viajes-de-lujo', 'luna-de-miel',
    'viajes-en-familia', 'viajes-en-grupo', 'paquetes', 'actividades'
  ]);
  tours.forEach(t => {
    if (!t.category) return;
    t.category.split(',').forEach(part => {
      const s = slugifyCategory(part);
      if (s) collectionSlugs.add(s);
    });
  });

  for (const slug of collectionSlugs) {
    const readable = slug.replace(/-/g, ' ');
    const colHtml = `<main>${navHtml}<h1>Rutas y Viajes: ${escapeHtml(readable)} en Marruecos</h1><p>Descubre nuestra selección de tours de ${escapeHtml(readable)} en Marruecos diseñados a medida.</p></main>`;
    writeRouteHtml(`/coleccion/${slug}`, injectPageSeo(baseHtml, {
      title: `Viajes de ${readable} en Marruecos | ${siteName}`,
      description: `Descubre nuestras mejores rutas y circuitos de ${readable} en Marruecos organizados a medida.`,
      canonicalPath: `/coleccion/${slug}`,
      bodyHtml: colHtml
    }));
    count++;
  }

  console.log(`✅ Pre-renderizado completado: ${count} páginas HTML estáticas generadas con metadatos, JSON-LD y contenido legible.`);
}

prerender();
