import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { optImg, optSrcSet } from './src/lib/image.js';
import { fitTitle, HOME_TITLE } from './src/data/seoContent.js';
import { tourPath, tourMetaDescription, destinationHeadings, collectionContent, HOME_META_DESCRIPTION, HOME_H1_FALLBACK, BUSINESS_ADDRESS, BUSINESS_LEGAL_NAME, ACTIVITIES_EXTRA } from './src/data/seoContent.js';

dotenv.config({ path: fs.existsSync('.env.local') ? '.env.local' : '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
let SUPABASE_ORIGIN = '';
try { SUPABASE_ORIGIN = supabaseUrl ? new URL(supabaseUrl).origin : ''; } catch { SUPABASE_ORIGIN = ''; }
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

function injectPageSeo(baseHtml, { title, description, canonicalPath, image, type = 'website', schema, bodyHtml, preloadImage }) {
  const safeTitle = escapeHtml(fitTitle(title || HOME_TITLE));
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
    // Conexión anticipada con Supabase (datos de tours y fotos): ahorra tiempo en móvil antes de pintar la página.
    // Dos conexiones: sin crossorigin para las imágenes (peticiones no-CORS) y con crossorigin para la API de datos.
    SUPABASE_ORIGIN ? `<link rel="preconnect" href="${SUPABASE_ORIGIN}" /><link rel="preconnect" href="${SUPABASE_ORIGIN}" crossorigin />` : '',
    preloadImage ? `<link rel="preload" as="image" href="${escapeHtml(optImg(preloadImage, 1600))}"${optSrcSet(preloadImage) ? ` imagesrcset="${escapeHtml(optSrcSet(preloadImage))}" imagesizes="100vw"` : ''} fetchpriority="high" />` : '',
    schema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : ''
  ]
    .filter(Boolean)
    .join('\n    ');

  html = html.replace('</head>', `    ${extraHead}\n  </head>`);

  if (bodyHtml) {
    // El contenido pre-renderizado es para buscadores y navegadores sin JS. Se oculta visualmente (patrón "sr-only")
    // para que no ocupe espacio y no provoque un salto de diseño (CLS) cuando React lo sustituye por la página real.
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"><div data-prerender style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${bodyHtml}</div></div>`
    );
  }

  return html;
}

function writeRouteHtml(routePath, htmlContent) {
  const cleanRoute = routePath.replace(/^\/+|\/+$/g, '');
  const targetDir = cleanRoute ? path.join(DIST_DIR, cleanRoute) : DIST_DIR;
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf-8');
}

function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Inicio', path: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: `${DOMAIN}${it.path}`
    }))
  };
}

function itemListLd(name, path, entries) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: `${DOMAIN}${path}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: entries.length,
      itemListElement: entries.map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.name, url: `${DOMAIN}${e.path}` }))
    }
  };
}

async function prerender() {
  const templatePath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.warn('⚠️ No se encontró dist/index.html. Ejecuta vite build primero.');
    return;
  }

  let baseHtml = fs.readFileSync(templatePath, 'utf-8');
  // Copia limpia de la app (sin metadatos de ninguna página concreta) para las rutas que no se pre-renderizan:
  // artículos nuevos del blog, /wishlist, etc. vercel.json reescribe esas rutas a /spa-shell.
  fs.writeFileSync(path.join(DIST_DIR, 'spa-shell.html'), baseHtml, 'utf-8');
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

  const siteName = settings?.business_name || settings?.site_name || 'Vivir Marruecos';

  // Datos básicos del negocio incrustados en el HTML: el logo y el texto de portada se pintan desde el primer
  // momento, sin esperar a Supabase, y así no hay saltos de diseño (CLS) cuando llegan los datos.
  if (settings) {
    const pick = ['logo_url', 'site_name', 'business_name', 'hero_title', 'hero_subtitle', 'hero_image_url'];
    const biz = Object.fromEntries(pick.filter(k => settings[k] != null).map(k => [k, settings[k]]));
    const bizScript = `<script>window.__BIZ__=${JSON.stringify(biz).replace(/</g, '\\u003c')}</script>`;
    baseHtml = baseHtml.replace('</head>', `    ${bizScript}\n  </head>`);
    fs.writeFileSync(path.join(DIST_DIR, 'spa-shell.html'), baseHtml, 'utf-8');
  }
  const navHtml = `<nav aria-label="Navegación principal"><a href="/">Inicio</a> | <a href="/destinations">Destinos</a> | <a href="/tours">Tours en Marruecos</a> | <a href="/actividades">Actividades</a> | <a href="/blog">Blog</a> | <a href="/galeria">Galería</a></nav>`;

  let count = 0;

  // 1. Home (/)
  const homeBody = `<main>${navHtml}<h1>${escapeHtml(stripHtml(settings?.hero_title || HOME_H1_FALLBACK))}</h1><p>${escapeHtml(settings?.hero_subtitle || 'Agencia especializada en tours privados, excursiones al desierto de Merzouga y rutas por Marruecos.')}</p><p>Vivir Marruecos organiza tours privados por Marruecos y el desierto de Merzouga, con conductor de habla española y salidas desde Marrakech, Fez, Tánger y Casablanca.</p><section><h2>Destinos Destacados en Marruecos</h2><ul>${destinations.map(d => `<li><a href="/destinations/${d.slug || d.id}">${escapeHtml(d.name)}</a></li>`).join('')}</ul></section><section><h2>Tours privados por Marruecos</h2><ul>${tours.map(t => `<li><a href="${tourPath(t)}">${escapeHtml(t.title)}</a> - Desde ${t.price || 0}€</li>`).join('')}</ul></section></main>`;
  writeRouteHtml('/', injectPageSeo(baseHtml, {
    title: HOME_TITLE,
    description: settings?.hero_subtitle && settings.hero_subtitle.trim().length >= 90 ? settings.hero_subtitle : HOME_META_DESCRIPTION,
    canonicalPath: '/',
    image: settings?.hero_image_url,
    preloadImage: settings?.hero_image_url,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: siteName,
      url: DOMAIN,
      telephone: settings?.whatsapp_number || '+34 604 48 82 23',
      email: 'info@vivirmarruecos.com',
      legalName: BUSINESS_LEGAL_NAME,
      address: BUSINESS_ADDRESS,
      image: settings?.logo_url || `${DOMAIN}/pwa-512x512.png`,
      sameAs: [settings?.instagram_url, settings?.facebook_url, settings?.tripadvisor_url].filter(Boolean)
    },
    bodyHtml: homeBody
  }));
  count++;

  // 2. Catálogo de Tours (/tours)
  const toursBody = `<main>${navHtml}<h1>Tours y circuitos por Marruecos</h1><p>Todos nuestros tours y circuitos privados por Marruecos: el desierto del Sáhara, Marrakech, Fez, Tánger y las ciudades imperiales.</p><ul>${tours.map(t => `<li><article><h2><a href="${tourPath(t)}">${escapeHtml(t.title)}</a></h2><p>${escapeHtml(stripHtml(t.itinerary_summary || t.description || '').slice(0, 220))}</p><p>Precio desde: ${t.price || 0}€</p></article></li>`).join('')}</ul></main>`;
  writeRouteHtml('/tours', injectPageSeo(baseHtml, {
    title: `Tours y circuitos por Marruecos | ${siteName}`,
    description: 'Explora todos nuestros tours por Marruecos: excursiones al desierto de Merzouga, rutas desde Marrakech, Fez, Tánger y viajes a medida.',
    canonicalPath: '/tours',
    schema: [itemListLd('Tours y circuitos por Marruecos', '/tours', tours.map(t => ({ name: t.title, path: tourPath(t) }))), breadcrumbLd([{ name: 'Tours', path: '/tours' }])],
    bodyHtml: toursBody
  }));
  count++;

  // 3. Catálogo de Destinos (/destinations y /destinos)
  const destsBody = `<main>${navHtml}<h1>Destinos en Marruecos</h1><p>Nuestros destinos en Marruecos: rutas desde Marrakech, Fez, Tánger y Casablanca, Chefchaouen y el desierto de Merzouga.</p><ul>${destinations.map(d => `<li><article><h2><a href="/destinations/${d.slug || d.id}">${escapeHtml(d.name)}</a></h2><p>${escapeHtml(stripHtml(d.description || '').slice(0, 220))}</p></article></li>`).join('')}</ul></main>`;
  for (const r of ['/destinations', '/destinos']) {
    writeRouteHtml(r, injectPageSeo(baseHtml, {
      title: `Destinos en Marruecos | ${siteName}`,
      description: 'Guía de destinos en Marruecos: Marrakech, Fez, Desierto de Merzouga, Chefchaouen, Tánger y Casablanca.',
      canonicalPath: '/destinations',
      schema: [itemListLd('Destinos en Marruecos', '/destinations', destinations.map(d => ({ name: d.name, path: `/destinations/${d.slug || d.id}` }))), breadcrumbLd([{ name: 'Destinos', path: '/destinations' }])],
      bodyHtml: destsBody
    }));
    count++;
  }

  // 4. Actividades (/actividades)
  const actPosts = posts.filter(p => p.category === 'Actividades');
  const actBody = `<main>${navHtml}<h1>Actividades en Marruecos</h1><p>Las mejores actividades para completar tu viaje por Marruecos: paseos en globo, quads en el desierto, rutas en dromedario y noche en campamento.</p><p>${escapeHtml(ACTIVITIES_EXTRA)}</p><ul>${actPosts.map(p => `<li><h2><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(p.excerpt || '')}</p></li>`).join('')}</ul></main>`;
  writeRouteHtml('/actividades', injectPageSeo(baseHtml, {
    title: `Actividades en Marruecos | ${siteName}`,
    description: 'Complementa tu viaje con actividades únicas: paseos en globo, quads en el desierto, rutas en camello y mucho más.',
    canonicalPath: '/actividades',
    schema: [itemListLd('Actividades en Marruecos', '/actividades', actPosts.map(p => ({ name: p.title, path: `/blog/${p.slug}` }))), breadcrumbLd([{ name: 'Actividades', path: '/actividades' }])],
    bodyHtml: actBody
  }));
  count++;

  // 5. Blog (/blog)
  const blogBody = `<main>${navHtml}<h1>Blog de viajes a Marruecos</h1><p>Nuestro blog de viajes a Marruecos: consejos, guías prácticas, rutas y secretos para preparar tu viaje.</p><ul>${posts.map(p => `<li><article><h2><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(p.excerpt || stripHtml(p.content || '').slice(0, 200))}</p></article></li>`).join('')}</ul></main>`;
  writeRouteHtml('/blog', injectPageSeo(baseHtml, {
    title: `Blog de viajes a Marruecos: guías y consejos | ${siteName}`,
    description: 'Artículos, consejos prácticos y guías completas para preparar tu viaje a Marruecos: qué ver, mejor época, gastronomía y desierto.',
    canonicalPath: '/blog',
    schema: [itemListLd('Blog de viajes a Marruecos', '/blog', posts.filter(p => p.slug).map(p => ({ name: p.title, path: `/blog/${p.slug}` }))), breadcrumbLd([{ name: 'Blog', path: '/blog' }])],
    bodyHtml: blogBody
  }));
  count++;

  // 6. Galería (/galeria) y Legales
  const staticPages = [
    { path: '/galeria', title: `Marruecos en imágenes: fotos de nuestros viajes | ${siteName}`, desc: 'Fotos de nuestros viajes por Marruecos: el desierto de Merzouga, Marrakech, Chefchaouen y mucho más, Marruecos en imágenes.' },
    { path: '/privacidad', title: `Política de Privacidad | ${siteName}`, desc: 'Política de privacidad y protección de datos de Vivir Marruecos.' },
    { path: '/aviso-legal', title: `Aviso Legal | ${siteName}`, desc: 'Aviso legal e información general de Vivir Marruecos.' },
    { path: '/cookies', title: `Política de Cookies | ${siteName}`, desc: 'Política de cookies: información sobre el uso de cookies en vivirmarruecos.com.' },
    { path: '/condiciones', title: `Condiciones Generales de Contratación | ${siteName}`, desc: 'Condiciones generales de contratación de nuestros viajes y rutas por Marruecos.' }
  ];
  for (const sp of staticPages) {
    writeRouteHtml(sp.path, injectPageSeo(baseHtml, {
      title: sp.title,
      description: sp.desc,
      canonicalPath: sp.path,
      bodyHtml: `<main>${navHtml}<h1>${escapeHtml(sp.title.split(' | ')[0])}</h1><p>${escapeHtml(sp.desc)}</p></main>`
    }));
    count++;
  }

  // 7. Cada Tour individual: URL principal /tours/:slug; /tours/:id redirige a la de slug
  for (const tour of tours) {
    const canonicalPath = tourPath(tour);
    const descText = tourMetaDescription(tour);
    const tourHtml = `<main>${navHtml}<article><h1>${escapeHtml(tour.title)}</h1><p>${escapeHtml(descText)}</p><p><strong>Precio desde:</strong> ${tour.price || 0}€ | <strong>Duración:</strong> ${escapeHtml(tour.duration || '')} | <strong>Salida:</strong> ${escapeHtml(tour.departure_city || '')}</p><div>${tour.description || ''}</div></article></main>`;
    const seoPayload = {
      title: `${tour.title} | ${siteName}`,
      description: descText,
      canonicalPath,
      image: tour.featured_image || tour.gallery?.[0],
      type: 'product',
      schema: [{
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: tour.title,
        description: descText,
        image: tour.featured_image || tour.gallery?.[0],
        provider: { '@type': 'TravelAgency', name: siteName, url: DOMAIN, address: BUSINESS_ADDRESS },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: tour.price || 0,
          availability: 'https://schema.org/InStock',
          url: `${DOMAIN}${canonicalPath}`
        }
      }, breadcrumbLd([{ name: 'Tours', path: '/tours' }, { name: tour.title, path: canonicalPath }])],
      bodyHtml: tourHtml
    };
    writeRouteHtml(canonicalPath, injectPageSeo(baseHtml, seoPayload));
    count++;
    if (tour.slug && tour.slug !== tour.id) {
      // Página ligera de redirección para las URLs antiguas con ID que Google ya conoce
      const target = `${DOMAIN}${canonicalPath}`;
      const redirectHtml = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${escapeHtml(tour.title)}</title><link rel="canonical" href="${target}"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${target}"></head><body><a href="${target}">${escapeHtml(tour.title)}</a></body></html>`;
      writeRouteHtml(`/tours/${tour.id}`, redirectHtml);
      count++;
    }
  }

  // 8. Cada Destino individual (/destinations/:slug, /destinations/:id y /destino/:slug)
  for (const dest of destinations) {
    const descText = stripHtml(dest.description || `Descubre los mejores tours y excursiones en ${dest.name}.`);
    const canonical = `/destinations/${dest.slug || dest.id}`;
    const headings = destinationHeadings(dest, siteName);
    const destTours = tours.filter(t => t.destination_id === dest.id || (t.destination_ids || []).includes(dest.id));
    const destToursHtml = `<section><h2>Tours y excursiones en ${escapeHtml(String(dest.name).trim())}</h2>${destTours.length ? `<ul>${destTours.map(t => `<li><a href="${tourPath(t)}">${escapeHtml(t.title)}</a> - Desde ${t.price || 0}€</li>`).join('')}</ul>` : `<p>Organizamos tours y excursiones privadas a medida. <a href="/tours">Ver todos los tours</a>.</p>`}</section>`;
    const destHtml = `<main>${navHtml}<article><h1>${escapeHtml(headings.h1)}</h1><div>${dest.description || `<p>${escapeHtml(descText)}</p>`}</div>${destToursHtml}</article></main>`;
    const seoPayload = {
      title: headings.title,
      description: descText.slice(0, 160),
      canonicalPath: canonical,
      image: dest.image_url,
      schema: [{
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: dest.name,
        description: descText.slice(0, 300),
        image: dest.image_url
      }, breadcrumbLd([{ name: 'Destinos', path: '/destinations' }, { name: String(dest.name).trim(), path: canonical }])],
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
      schema: [{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: descText.slice(0, 250),
        image: post.cover_image,
        datePublished: post.published_at || post.created_at,
        author: { '@type': 'Organization', name: siteName }
      }, breadcrumbLd([{ name: 'Blog', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }])],
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
    const col = collectionContent(slug);
    const colTours = tours.filter(t => (t.category || '').split(',').some(part => slugifyCategory(part) === slug));
    const colHtml = `<main>${navHtml}<h1>${escapeHtml(col.title)}</h1><p>${escapeHtml(col.intro)}</p>${(col.body || []).map(b => `<p>${escapeHtml(b)}</p>`).join('')}${colTours.length ? `<ul>${colTours.map(t => `<li><a href="${tourPath(t)}">${escapeHtml(t.title)}</a> - Desde ${t.price || 0}€</li>`).join('')}</ul>` : ''}</main>`;
    writeRouteHtml(`/coleccion/${slug}`, injectPageSeo(baseHtml, {
      title: `${col.title} | ${siteName}`,
      description: col.intro,
      canonicalPath: `/coleccion/${slug}`,
      schema: [itemListLd(col.title, `/coleccion/${slug}`, colTours.map(t => ({ name: t.title, path: tourPath(t) }))), breadcrumbLd([{ name: col.title, path: `/coleccion/${slug}` }])],
      bodyHtml: colHtml
    }));
    count++;
  }

  console.log(`✅ Pre-renderizado completado: ${count} páginas HTML estáticas generadas con metadatos, JSON-LD y contenido legible.`);
}

prerender();

