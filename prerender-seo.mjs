import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { optImg, optSrcSet } from './src/lib/image.js';
import { GUIDE_PATH, getGuide } from './src/data/guiaViaje.js';
import { LANGS, localizePath, stripLangPrefix, alternateUrls, localizeHtmlLinks } from './src/i18n/urlLang.js';
import { collectionContentI18n } from './src/data/collectionsI18n.js';
import { getAbout, getContact, ABOUT_PATH, CONTACT_PATH, COMPANY, OPENING_HOURS } from './src/data/companyContent.js';
import { getHomeContent, localizeReviewMeta, REVIEWS, REVIEW_TOTALS } from './src/data/homeContent.js';
import { fitTitle, HOME_TITLE } from './src/data/seoContent.js';
import { tourPath, tourMetaDescription, destinationHeadings, HOME_META_DESCRIPTION, HOME_H1_FALLBACK, BUSINESS_ADDRESS, BUSINESS_LEGAL_NAME, ACTIVITIES_EXTRA_I18N, HOME_I18N_SEO, TOURS_TITLE } from './src/data/seoContent.js';

// «&nbsp;» del editor del panel → espacio normal (si no, las líneas no se cortan en el móvil)
const nb = (html) => String(html || '').replace(/&nbsp;|\u00A0/g, ' ');

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
  return String(html).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').replace(/\s+([,.;:!?)])/g, '$1').trim();
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

const OG_LOCALE = { es: 'es_ES', en: 'en_GB', fr: 'fr_FR' };

function injectPageSeo(baseHtml, { title, description, canonicalPath, image, type = 'website', schema, bodyHtml, preloadImage, modulePreload, lang = 'es' }) {
  const safeTitle = escapeHtml(fitTitle(title || HOME_TITLE));
  const safeDesc = escapeHtml(
    excerpt(description || 'Descubre la magia de Marruecos con nuestros tours y excursiones organizadas a medida.', 160)
  );
  const fullUrl = canonicalPath.startsWith('http') ? canonicalPath : `${DOMAIN}${canonicalPath}`;
  const safeImage = escapeHtml(image || `${DOMAIN}/pwa-512x512.png`);

  let html = baseHtml
    .replace(/<html lang="[^"]*"/i, `<html lang="${lang}"`)
    .replace(/<title>.*?<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${safeDesc}">`)
    .replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${safeTitle}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${safeDesc}" />`)
    .replace(/<meta property="og:image" content=".*?"\s*\/?>/i, `<meta property="og:image" content="${safeImage}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/?>/i, `<meta property="og:url" content="${fullUrl}" />`)
    .replace(/<meta property="og:type" content=".*?"\s*\/?>/i, `<meta property="og:type" content="${type}" />`);

  const extraHead = [
    `<link rel="canonical" href="${fullUrl}" data-prerender />`,
    // Las tres versiones de la página (español, inglés, francés) para que Google muestre la de cada idioma
    ...alternateUrls(stripLangPrefix(new URL(fullUrl).pathname)).map(a => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" data-prerender />`),
    `<meta property="og:locale" content="${OG_LOCALE[lang] || 'es_ES'}" data-prerender />`,
    // Conexión anticipada con Supabase (datos de tours y fotos): ahorra tiempo en móvil antes de pintar la página.
    // Dos conexiones: sin crossorigin para las imágenes (peticiones no-CORS) y con crossorigin para la API de datos.
    SUPABASE_ORIGIN ? `<link rel="preconnect" href="${SUPABASE_ORIGIN}" /><link rel="preconnect" href="${SUPABASE_ORIGIN}" crossorigin />` : '',
    modulePreload ? `<link rel="modulepreload" crossorigin href="${modulePreload}" />` : '',
    preloadImage && typeof preloadImage === 'object'
      ? `<link rel="preload" as="image" href="${escapeHtml(preloadImage.src)}" imagesrcset="${escapeHtml(preloadImage.srcset)}" imagesizes="100vw" fetchpriority="high" />`
      : preloadImage ? `<link rel="preload" as="image" href="${escapeHtml(optImg(preloadImage, 1600))}"${optSrcSet(preloadImage) ? ` imagesrcset="${escapeHtml(optSrcSet(preloadImage))}" imagesizes="100vw"` : ''} fetchpriority="high" />` : '',
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

const HOME_NAME = { es: 'Inicio', en: 'Home', fr: 'Accueil' };

function breadcrumbLd(items, lang = 'es') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: HOME_NAME[lang], path: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: `${DOMAIN}${localizePath(it.path, lang)}`
    }))
  };
}

function itemListLd(name, path, entries, lang = 'es') {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    inLanguage: lang,
    url: `${DOMAIN}${localizePath(path, lang)}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: entries.length,
      itemListElement: entries.map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.name, url: `${DOMAIN}${localizePath(e.path, lang)}` }))
    }
  };
}

/** Recorta un texto sin partir palabras y añade «…» si se ha cortado. */
function excerpt(text, max) {
  const t = String(text || '').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const sp = cut.lastIndexOf(' ');
  return (sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:.\-–—«"(]+$/, '') + '…';
}

/** «3 Días» → «3 days» / «3 jours» (la duración no siempre está traducida en la base de datos). */
function localizeDuration(d, lang) {
  if (!d || lang === 'es') return d;
  const word = { en: ['day', 'days'], fr: ['jour', 'jours'] }[lang];
  if (!word) return d;
  return d.replace(/\bd[ií]as\b/gi, word[1]).replace(/\bd[ií]a\b/gi, word[0]);
}

/** Registro de la base de datos con los campos traducidos al idioma pedido (como dbService en la web). */
function tx(rec, lang) {
  if (!rec || lang === 'es') return rec;
  const t = rec.translations?.[lang];
  let out = rec;
  if (t && typeof t === 'object') {
    out = { ...rec, ...Object.fromEntries(Object.entries(t).filter(([, v]) => (typeof v === 'string' ? v.trim() !== '' : v != null))) };
  }
  if (out.destinations && typeof out.destinations === 'object' && !Array.isArray(out.destinations)) {
    out = { ...out, destinations: tx(out.destinations, lang) };
  }
  return out;
}

/**
 * Copia la foto de portada a la propia web (dist/images/hero/) en varios anchos y en WebP.
 * Así el móvil la descarga por la misma conexión que la página, sin abrir otra con Supabase (mejora el LCP).
 */
async function localizeHeroImage(url) {
  if (!url || !/\.supabase\.co\/storage\/v1\/object\/public\//.test(url)) return null;
  try {
    const hash = crypto.createHash('md5').update(url).digest('hex').slice(0, 8);
    const dir = path.join(DIST_DIR, 'images', 'hero');
    fs.mkdirSync(dir, { recursive: true });
    const entries = [];
    for (const w of [480, 768, 1024, 1600]) {
      const res = await fetch(optImg(url, w, w <= 768 ? 55 : 65), { headers: { Accept: 'image/webp,image/*;q=0.8' } });
      if (!res.ok) return null;
      const ct = res.headers.get('content-type') || '';
      const ext = ct.includes('webp') ? 'webp' : ct.includes('avif') ? 'avif' : ct.includes('png') ? 'png' : 'jpg';
      const file = `hero-${hash}-${w}.${ext}`;
      fs.writeFileSync(path.join(dir, file), Buffer.from(await res.arrayBuffer()));
      entries.push({ w, path: `/images/hero/${file}` });
    }
    return {
      src: entries.find(e => e.w === 1024).path,
      srcset: entries.map(e => `${e.path} ${e.w}w`).join(', ')
    };
  } catch (err) {
    console.warn('No se pudo copiar la foto de portada:', err?.message || err);
    return null;
  }
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
        supabase.from('business_settings').select('hero_image_url,hero_title,hero_subtitle,logo_url,site_name').limit(1).single()
      ]);
      tours = toursRes.data || [];
      destinations = destsRes.data || [];
      posts = postsRes.data || [];
      settings = settingsRes.data || null;
    } catch (err) {
      console.error('Error consultando Supabase para prerender:', err);
    }
  }

  let HOME_CHUNK = '';
  try {
    const f = fs.readdirSync(path.join(DIST_DIR, 'assets')).find(n => /^Home-[\w-]+\.js$/.test(n));
    if (f) HOME_CHUNK = `/assets/${f}`;
  } catch { HOME_CHUNK = ''; }

  const siteName = settings?.business_name || settings?.site_name || 'Vivir Marruecos';

  let heroLocal = null;
  // Datos básicos del negocio incrustados en el HTML: el logo y el texto de portada se pintan desde el primer
  // momento, sin esperar a Supabase, y así no hay saltos de diseño (CLS) cuando llegan los datos.
  if (settings) {
    const pick = ['logo_url', 'site_name', 'business_name', 'hero_title', 'hero_subtitle', 'hero_image_url', 'whatsapp_number', 'whatsapp_welcome_message'];
    const biz = Object.fromEntries(pick.filter(k => settings[k] != null).map(k => [k, settings[k]]));
    heroLocal = await localizeHeroImage(settings.hero_image_url);
    if (heroLocal) {
      biz.hero_local_src = heroLocal.src;
      biz.hero_local_srcset = heroLocal.srcset;
    }
    const bizScript = `<script>window.__BIZ__=${JSON.stringify(biz).replace(/</g, '\\u003c')}</script>`;
    baseHtml = baseHtml.replace('</head>', `    ${bizScript}\n  </head>`);
    fs.writeFileSync(path.join(DIST_DIR, 'spa-shell.html'), baseHtml, 'utf-8');
  }
  // Cada página se genera en español (sin prefijo), inglés (/en/...) y francés (/fr/...)
  let count = 0;
  const baseToursEs = tours;

  for (const lang of LANGS) {
    const T = (texts) => texts[lang] ?? texts.es;
    const L = (p) => localizePath(p, lang);
    const links = (html) => localizeHtmlLinks(nb(html), lang);
    const page = (payload) => injectPageSeo(baseHtml, { ...payload, lang });
    const write = (p, html) => { writeRouteHtml(L(p), html); count++; };
    const crumbs = (items) => breadcrumbLd(items, lang);
    const list = (name, p, entries) => itemListLd(name, p, entries, lang);
    const from = (price) => T({ es: `Desde ${price || 0}€`, en: `From €${price || 0}`, fr: `À partir de ${price || 0} €` });

    const toursL = baseToursEs.map(t => tx(t, lang));
    const destinationsL = destinations.map(d => tx(d, lang));
    const postsL = posts.map(p => tx(p, lang));
    const home = getHomeContent(lang);
    const GUIDE = getGuide(lang);

    const navHtml = `<nav aria-label="${T({ es: 'Navegación principal', en: 'Main navigation', fr: 'Navigation principale' })}"><a href="${L('/')}">${HOME_NAME[lang]}</a> | <a href="${L('/destinations')}">${T({ es: 'Destinos', en: 'Destinations', fr: 'Destinations' })}</a> | <a href="${L('/tours')}">${T({ es: 'Tours en Marruecos', en: 'Tours in Morocco', fr: 'Circuits au Maroc' })}</a> | <a href="${L('/actividades')}">${T({ es: 'Actividades', en: 'Activities', fr: 'Activités' })}</a> | <a href="${L(GUIDE_PATH)}">${T({ es: 'Viaje a Marruecos', en: 'Travelling to Morocco', fr: 'Voyager au Maroc' })}</a> | <a href="${L('/blog')}">Blog</a> | <a href="${L('/galeria')}">${T({ es: 'Galería', en: 'Gallery', fr: 'Galerie' })}</a> | <a href="${L('/sobre-nosotros')}">${T({ es: 'Quiénes somos', en: 'About us', fr: 'Qui sommes-nous' })}</a> | <a href="${L('/contacto')}">${T({ es: 'Contacto', en: 'Contact', fr: 'Contact' })}</a> | ${LANGS.filter(l => l !== lang).map(l => `<a href="${localizePath('/', l)}" hreflang="${l}">${{ es: 'Español', en: 'English', fr: 'Français' }[l]}</a>`).join(' | ')}</nav>`;

    // 1. Portada
    const homeSeo = lang === 'es'
      ? { title: HOME_TITLE, h1: stripHtml(settings?.hero_title || HOME_H1_FALLBACK), subtitle: settings?.hero_subtitle || 'Organizamos tours privados, excursiones al desierto de Merzouga y rutas por Marruecos.', description: settings?.hero_subtitle && settings.hero_subtitle.trim().length >= 90 ? settings.hero_subtitle : HOME_META_DESCRIPTION }
      : { ...HOME_I18N_SEO[lang], subtitle: HOME_I18N_SEO[lang].description };
    const reviewsLine = T({
      es: `${REVIEW_TOTALS.tripadvisor.rating} de 5 en Tripadvisor (${REVIEW_TOTALS.tripadvisor.count} opiniones) y ${REVIEW_TOTALS.google.rating} de 5 en Google`,
      en: `${REVIEW_TOTALS.tripadvisor.rating} out of 5 on Tripadvisor (${REVIEW_TOTALS.tripadvisor.count} reviews) and ${REVIEW_TOTALS.google.rating} out of 5 on Google`,
      fr: `${REVIEW_TOTALS.tripadvisor.rating} sur 5 sur Tripadvisor (${REVIEW_TOTALS.tripadvisor.count} avis) et ${REVIEW_TOTALS.google.rating} sur 5 sur Google`
    });
    const homeBody = `<main>${navHtml}<h1>${escapeHtml(homeSeo.h1)}</h1><p>${escapeHtml(homeSeo.subtitle)}</p><p>${T({
      es: 'Vivir Marruecos organiza tours privados por Marruecos y el desierto de Merzouga, con conductor de habla española y salidas desde Marrakech, Fez, Tánger y Casablanca.',
      en: 'Vivir Marruecos organises private tours of Morocco and the Merzouga desert, with English-speaking drivers and departures from Marrakech, Fez, Tangier and Casablanca.',
      fr: 'Vivir Marruecos organise des circuits privés au Maroc et dans le désert de Merzouga, avec des chauffeurs francophones et des départs de Marrakech, Fès, Tanger et Casablanca.'
    })}</p><section><h2>${T({ es: 'Destinos Destacados en Marruecos', en: 'Featured destinations in Morocco', fr: 'Destinations phares au Maroc' })}</h2><ul>${destinationsL.map(d => `<li><a href="${L(`/destinations/${d.slug || d.id}`)}">${escapeHtml(d.name)}</a></li>`).join('')}</ul></section><section><h2>${T({ es: 'Tours privados por Marruecos', en: 'Private tours of Morocco', fr: 'Circuits privés au Maroc' })}</h2><ul>${toursL.map(t => `<li><a href="${L(tourPath(t))}">${escapeHtml(t.title)}</a> - ${from(t.price)}</li>`).join('')}</ul><p>${escapeHtml(home.priceNote)}</p></section><section><h2>${T({ es: 'Tu viaje en 4 pasos', en: 'Your trip in 4 steps', fr: 'Votre voyage en 4 étapes' })}</h2><ol>${home.howItWorks.map(st => `<li><strong>${escapeHtml(st.title)}</strong>: ${escapeHtml(st.text)}</li>`).join('')}</ol></section><section><h2>${T({ es: 'Lo que dicen nuestros viajeros', en: 'What our travellers say', fr: 'Ce que disent nos voyageurs' })}</h2><p>${reviewsLine}</p>${REVIEWS.map(r => { const m = localizeReviewMeta(r, lang); return `<blockquote><p>${escapeHtml(r.text)}</p><footer>${escapeHtml(r.author)}, ${escapeHtml(m.date)} (${r.source === 'tripadvisor' ? 'Tripadvisor' : 'Google'})</footer></blockquote>`; }).join('')}</section><section><h2>${T({ es: 'Preguntas frecuentes', en: 'Frequently asked questions', fr: 'Questions fréquentes' })}</h2>${home.faqs.map(f => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`).join('')}</section></main>`;
    write('/', page({
      title: homeSeo.title,
      description: homeSeo.description,
      canonicalPath: L('/'),
      image: settings?.hero_image_url,
      preloadImage: heroLocal || settings?.hero_image_url,
      // Descarga anticipada del código de la portada (si no, el navegador solo lo pide después de ejecutar el JS principal).
      modulePreload: HOME_CHUNK,
      schema: [{
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: siteName,
        url: `${DOMAIN}${L('/')}`,
        telephone: settings?.whatsapp_number || '+34 604 48 82 23',
        email: 'info@vivirmarruecos.com',
        legalName: BUSINESS_LEGAL_NAME,
        address: BUSINESS_ADDRESS,
        image: settings?.logo_url || `${DOMAIN}/pwa-512x512.png`,
        knowsLanguage: ['es', 'en', 'fr'],
        foundingDate: '2015-05',
        openingHoursSpecification: OPENING_HOURS,
        sameAs: [settings?.instagram_url, settings?.facebook_url, settings?.tripadvisor_url].filter(Boolean)
      }, {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: home.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
      }],
      bodyHtml: homeBody
    }));

    // 2. Catálogo de tours
    const toursTitle = T({ es: 'Tours y circuitos por Marruecos', en: 'Tours and trips in Morocco', fr: 'Circuits et voyages au Maroc' });
    const priceFromLabel = T({ es: 'Precio desde', en: 'Price from', fr: 'Prix à partir de' });
    const toursBody = `<main>${navHtml}<h1>${toursTitle}</h1><p>${T({
      es: 'Todos nuestros tours y circuitos privados por Marruecos: el desierto del Sáhara, Marrakech, Fez, Tánger y las ciudades imperiales.',
      en: 'All our private tours and trips in Morocco: the Sahara desert, Marrakech, Fez, Tangier and the imperial cities.',
      fr: 'Tous nos circuits privés au Maroc : le désert du Sahara, Marrakech, Fès, Tanger et les villes impériales.'
    })}</p><ul>${toursL.map(t => `<li><article><h2><a href="${L(tourPath(t))}">${escapeHtml(t.title)}</a></h2><p>${escapeHtml(excerpt(stripHtml(t.itinerary_summary || t.description || ''), 220))}</p><p>${priceFromLabel}: ${t.price || 0}€</p></article></li>`).join('')}</ul></main>`;
    write('/tours', page({
      title: TOURS_TITLE[lang],
      description: T({
        es: 'Explora todos nuestros tours por Marruecos: excursiones al desierto de Merzouga, rutas desde Marrakech, Fez, Tánger y viajes a medida.',
        en: 'Explore all our tours of Morocco: trips to the Merzouga desert, routes from Marrakech, Fez and Tangier, and tailor-made journeys.',
        fr: 'Découvrez tous nos circuits au Maroc : excursions dans le désert de Merzouga, itinéraires depuis Marrakech, Fès, Tanger et voyages sur mesure.'
      }),
      canonicalPath: L('/tours'),
      schema: [list(toursTitle, '/tours', toursL.map(t => ({ name: t.title, path: tourPath(t) }))), crumbs([{ name: 'Tours', path: '/tours' }])],
      bodyHtml: toursBody
    }));

    // 3. Catálogo de destinos
    const destsTitle = T({ es: 'Destinos en Marruecos', en: 'Destinations in Morocco', fr: 'Destinations au Maroc' });
    const destsBody = `<main>${navHtml}<h1>${destsTitle}</h1><p>${T({
      es: 'Nuestros destinos en Marruecos: rutas desde Marrakech, Fez, Tánger y Casablanca, Chefchaouen y el desierto de Merzouga.',
      en: 'Our destinations in Morocco: routes from Marrakech, Fez, Tangier and Casablanca, Chefchaouen and the Merzouga desert.',
      fr: 'Nos destinations au Maroc : circuits depuis Marrakech, Fès, Tanger et Casablanca, Chefchaouen et le désert de Merzouga.'
    })}</p><ul>${destinationsL.map(d => `<li><article><h2><a href="${L(`/destinations/${d.slug || d.id}`)}">${escapeHtml(d.name)}</a></h2><p>${escapeHtml(excerpt(stripHtml(d.description || ''), 220))}</p></article></li>`).join('')}</ul></main>`;
    write('/destinations', page({
      title: `${destsTitle} | ${siteName}`,
      description: T({
        es: 'Guía de destinos en Marruecos: Marrakech, Fez, Desierto de Merzouga, Chefchaouen, Tánger y Casablanca.',
        en: 'Guide to destinations in Morocco: Marrakech, Fez, the Merzouga desert, Chefchaouen, Tangier and Casablanca.',
        fr: 'Guide des destinations au Maroc : Marrakech, Fès, le désert de Merzouga, Chefchaouen, Tanger et Casablanca.'
      }),
      canonicalPath: L('/destinations'),
      schema: [list(destsTitle, '/destinations', destinationsL.map(d => ({ name: d.name, path: `/destinations/${d.slug || d.id}` }))), crumbs([{ name: T({ es: 'Destinos', en: 'Destinations', fr: 'Destinations' }), path: '/destinations' }])],
      bodyHtml: destsBody
    }));

    // 4. Actividades
    const actTitle = T({ es: 'Actividades en Marruecos', en: 'Activities in Morocco', fr: 'Activités au Maroc' });
    const actPosts = postsL.filter((p, i) => posts[i].category === 'Actividades');
    const actBody = `<main>${navHtml}<h1>${actTitle}</h1><p>${T({
      es: 'Las mejores actividades para completar tu viaje por Marruecos: paseos en globo, quads en el desierto, rutas en dromedario y noche en campamento.',
      en: 'The best activities to complete your trip to Morocco: balloon rides, quad bikes in the desert, camel rides and a night at a desert camp.',
      fr: 'Les meilleures activités pour compléter votre voyage au Maroc : montgolfière, quad dans le désert, balades à dromadaire et nuit au campement.'
    })}</p><p>${escapeHtml(ACTIVITIES_EXTRA_I18N[lang])}</p><ul>${actPosts.map(p => `<li><h2><a href="${L(`/blog/${p.slug}`)}">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(p.excerpt || '')}</p></li>`).join('')}</ul></main>`;
    write('/actividades', page({
      title: `${actTitle} | ${siteName}`,
      description: T({
        es: 'Complementa tu viaje con actividades únicas: paseos en globo, quads en el desierto, rutas en camello y mucho más.',
        en: 'Complete your trip with unique activities: balloon rides, desert quads, camel rides and much more.',
        fr: 'Complétez votre voyage avec des activités uniques : montgolfière, quads dans le désert, balades à dromadaire et bien plus.'
      }),
      canonicalPath: L('/actividades'),
      schema: [list(actTitle, '/actividades', actPosts.map(p => ({ name: p.title, path: `/blog/${p.slug}` }))), crumbs([{ name: T({ es: 'Actividades', en: 'Activities', fr: 'Activités' }), path: '/actividades' }])],
      bodyHtml: actBody
    }));

    // 5. Blog
    const blogTitle = T({ es: 'Blog de viajes a Marruecos', en: 'Morocco travel blog', fr: 'Blog de voyage au Maroc' });
    const blogBody = `<main>${navHtml}<h1>${blogTitle}</h1><p>${T({
      es: 'Nuestro blog de viajes a Marruecos: consejos, guías prácticas, rutas y secretos para preparar tu viaje.',
      en: 'Our Morocco travel blog: tips, practical guides, routes and secrets to plan your trip.',
      fr: 'Notre blog de voyage au Maroc : conseils, guides pratiques, itinéraires et secrets pour préparer votre voyage.'
    })}</p><ul>${postsL.map(p => `<li><article><h2><a href="${L(`/blog/${p.slug}`)}">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(p.excerpt || excerpt(stripHtml(p.content || ''), 200))}</p></article></li>`).join('')}</ul></main>`;
    write('/blog', page({
      title: T({ es: `Blog de viajes a Marruecos: guías y consejos | ${siteName}`, en: `Morocco travel blog: guides and tips | ${siteName}`, fr: `Blog de voyage au Maroc : guides et conseils | ${siteName}` }),
      description: T({
        es: 'Artículos, consejos prácticos y guías completas para preparar tu viaje a Marruecos: qué ver, mejor época, gastronomía y desierto.',
        en: 'Articles, practical tips and complete guides to plan your trip to Morocco: what to see, the best time to go, food and the desert.',
        fr: 'Articles, conseils pratiques et guides complets pour préparer votre voyage au Maroc : que voir, meilleure période, gastronomie et désert.'
      }),
      canonicalPath: L('/blog'),
      schema: [list(blogTitle, '/blog', postsL.filter(p => p.slug).map(p => ({ name: p.title, path: `/blog/${p.slug}` }))), crumbs([{ name: 'Blog', path: '/blog' }])],
      bodyHtml: blogBody
    }));

    // 5b. Guía pilar "Viaje a Marruecos"
    const faqTitle = T({ es: 'Preguntas frecuentes', en: 'Frequently asked questions', fr: 'Questions fréquentes' });
    const guideBody = `<main>${navHtml}<article><h1>${escapeHtml(GUIDE.title)}</h1>${GUIDE.intro.map(p => `<p>${escapeHtml(p)}</p>`).join('')}${GUIDE.sections.map(s => `<section id="${s.id}"><h2>${escapeHtml(s.h2)}</h2>${links(s.html)}</section>`).join('')}<section><h2>${faqTitle}</h2>${GUIDE.faqs.map(f => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`).join('')}</section></article></main>`;
    write(GUIDE_PATH, page({
      title: GUIDE.metaTitle,
      description: GUIDE.description,
      canonicalPath: L(GUIDE_PATH),
      type: 'article',
      schema: [{
        '@context': 'https://schema.org',
        '@type': 'Article',
        inLanguage: lang,
        headline: GUIDE.title,
        description: GUIDE.description,
        dateModified: GUIDE.updated,
        author: { '@type': 'Organization', name: siteName, url: DOMAIN },
        publisher: { '@type': 'Organization', name: siteName, url: DOMAIN },
        mainEntityOfPage: `${DOMAIN}${L(GUIDE_PATH)}`
      }, {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: GUIDE.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
      }, crumbs([{ name: T({ es: 'Viaje a Marruecos', en: 'Travelling to Morocco', fr: 'Voyager au Maroc' }), path: GUIDE_PATH }])],
      bodyHtml: guideBody
    }));

    // 6. Galería y páginas legales
    const staticPages = [
      { path: '/galeria', title: T({ es: 'Marruecos en imágenes: fotos de nuestros viajes', en: 'Morocco in pictures: photos from our trips', fr: 'Le Maroc en images : photos de nos voyages' }), desc: T({ es: 'Fotos de nuestros viajes por Marruecos: el desierto de Merzouga, Marrakech, Chefchaouen y mucho más, Marruecos en imágenes.', en: 'Photos from our trips around Morocco: the Merzouga desert, Marrakech, Chefchaouen and much more, Morocco in pictures.', fr: 'Photos de nos voyages au Maroc : le désert de Merzouga, Marrakech, Chefchaouen et bien plus, le Maroc en images.' }) },
      { path: '/privacidad', title: T({ es: 'Política de Privacidad', en: 'Privacy Policy', fr: 'Politique de confidentialité' }), desc: T({ es: 'Cómo trata Vivirmarruecos SARL (Vivir Marruecos) tus datos personales: responsable, finalidad, proveedores, conservación y tus derechos.', en: 'How Vivirmarruecos SARL (Vivir Marruecos) handles your personal data: controller, purpose, providers, retention and your rights.', fr: 'Comment Vivirmarruecos SARL (Vivir Marruecos) traite vos données personnelles : responsable, finalité, prestataires, conservation et vos droits.' }) },
      { path: '/aviso-legal', title: T({ es: 'Aviso Legal', en: 'Legal Notice', fr: 'Mentions légales' }), desc: T({ es: 'Aviso legal de Vivir Marruecos: datos de Vivirmarruecos SARL (ICE y Registro de Comercio), domicilio en Hassi Labied, propiedad intelectual y responsabilidad.', en: 'Legal notice of Vivir Marruecos: details of Vivirmarruecos SARL (ICE and Trade Register), registered office in Hassi Labied, intellectual property and liability.', fr: 'Mentions légales de Vivir Marruecos : informations sur Vivirmarruecos SARL (ICE et Registre du commerce), siège à Hassi Labied, propriété intellectuelle et responsabilité.' }) },
      { path: '/cookies', title: T({ es: 'Política de Cookies', en: 'Cookie Policy', fr: 'Politique de cookies' }), desc: T({ es: 'Política de cookies: información sobre el uso de cookies en vivirmarruecos.com.', en: 'Cookie policy: information about the use of cookies on vivirmarruecos.com.', fr: 'Politique de cookies : informations sur l’utilisation des cookies sur vivirmarruecos.com.' }) },
      { path: '/condiciones', title: T({ es: 'Condiciones Generales de Contratación', en: 'Terms and Conditions', fr: 'Conditions générales' }), desc: T({ es: 'Condiciones generales de contratación de nuestros viajes y rutas por Marruecos.', en: 'General terms and booking conditions for our trips and tours in Morocco.', fr: 'Conditions générales de réservation de nos voyages et circuits au Maroc.' }) }
    ];
    for (const sp of staticPages) {
      write(sp.path, page({
        title: `${sp.title} | ${siteName}`,
        description: sp.desc,
        canonicalPath: L(sp.path),
        bodyHtml: `<main>${navHtml}<h1>${escapeHtml(sp.title)}</h1><p>${escapeHtml(sp.desc)}</p></main>`
      }));
    }

    // 6b. Quiénes somos y Contacto
    const A = getAbout(lang);
    const aboutBody = `<main>${navHtml}<article><h1>${escapeHtml(A.h1)}</h1><p>${escapeHtml(A.intro)}</p><section><h2>${escapeHtml(A.founder.h2)}</h2>${A.founder.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}</section>${A.sections.map(sec => `<section><h2>${escapeHtml(sec.h2)}</h2>${(sec.paragraphs || []).map(p => `<p>${escapeHtml(p)}</p>`).join('')}${sec.list ? `<ul>${sec.list.map(li => `<li>${escapeHtml(li)}</li>`).join('')}</ul>` : ''}</section>`).join('')}<p><a href="${L('/tours')}">${escapeHtml(A.ctaTours)}</a> | <a href="${L(CONTACT_PATH)}">${escapeHtml(A.ctaContact)}</a></p></article></main>`;
    const agencyLd = (extra = {}) => ({
      '@type': 'LocalBusiness',
      name: siteName,
      legalName: COMPANY.legalName,
      email: COMPANY.email,
      telephone: settings?.whatsapp_number || COMPANY.whatsapp,
      address: BUSINESS_ADDRESS,
      openingHoursSpecification: OPENING_HOURS,
      knowsLanguage: ['es', 'en', 'fr'],
      url: DOMAIN,
      ...extra
    });
    write(ABOUT_PATH, page({
      title: A.metaTitle,
      description: A.description,
      canonicalPath: L(ABOUT_PATH),
      schema: [{ '@context': 'https://schema.org', '@type': 'AboutPage', name: A.h1, inLanguage: lang, url: `${DOMAIN}${L(ABOUT_PATH)}`, mainEntity: agencyLd({ foundingDate: '2015-05', founder: { '@type': 'Person', name: 'Ali' } }) }, crumbs([{ name: A.h1, path: ABOUT_PATH }])],
      bodyHtml: aboutBody
    }));

    const C = getContact(lang);
    const phone = settings?.whatsapp_number || COMPANY.whatsapp;
    const contactBody = `<main>${navHtml}<h1>${escapeHtml(C.h1)}</h1><p>${escapeHtml(C.intro)}</p><section><h2>${C.whatsapp}</h2><p>${escapeHtml(C.whatsappText)} <a href="https://wa.me/${phone.replace(/\D/g, '')}">${escapeHtml(phone)}</a></p></section><section><h2>${C.email}</h2><p>${escapeHtml(C.emailText)} <a href="mailto:${COMPANY.email}">${COMPANY.email}</a></p></section><section><h2>${escapeHtml(C.quote)}</h2><p>${escapeHtml(C.quoteText)}</p></section><section><h2>${escapeHtml(C.hours)}</h2><p>${escapeHtml(C.hoursValue)}</p><h2>${escapeHtml(C.address)}</h2><p>${escapeHtml(C.addressValue)}</p><h2>${escapeHtml(C.languages)}</h2><p>${escapeHtml(C.languagesValue)}</p></section></main>`;
    write(CONTACT_PATH, page({
      title: C.metaTitle,
      description: C.description,
      canonicalPath: L(CONTACT_PATH),
      schema: [{ '@context': 'https://schema.org', '@type': 'ContactPage', name: C.h1, inLanguage: lang, url: `${DOMAIN}${L(CONTACT_PATH)}`, mainEntity: agencyLd({ contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer service', telephone: phone, email: COMPANY.email, availableLanguage: ['Spanish', 'English', 'French'] }] }) }, crumbs([{ name: C.h1, path: CONTACT_PATH }])],
      bodyHtml: contactBody
    }));

    // 7. Cada tour: URL principal /tours/:slug (las antiguas con ID redirigen desde api/page-fallback.ts)
    const lbl = {
      duration: T({ es: 'Duración', en: 'Duration', fr: 'Durée' }),
      departure: T({ es: 'Salida', en: 'Departure', fr: 'Départ' }),
      arrival: T({ es: 'Llegada', en: 'Arrival', fr: 'Arrivée' }),
      perPerson: T({ es: 'por persona', en: 'per person', fr: 'par personne' }),
      itinerary: T({ es: 'Itinerario día a día', en: 'Day-by-day itinerary', fr: 'Itinéraire jour par jour' }),
      includes: T({ es: 'Qué incluye', en: 'What’s included', fr: 'Ce qui est inclus' }),
      excludes: T({ es: 'Qué no incluye', en: 'Not included', fr: 'Ce qui n’est pas inclus' }),
      tips: T({ es: 'Recomendaciones', en: 'Recommendations', fr: 'Recommandations' }),
      agencyH: T({ es: 'Un tour privado con una empresa local', en: 'A private tour with a local company', fr: 'Un circuit privé avec une entreprise locale' }),
      agencyP: T({
        es: 'Vivir Marruecos es una empresa con base en Hassi Labied, a los pies de las dunas de Erg Chebbi (Merzouga). Organizamos el viaje nosotros mismos: vehículo privado, conductor de habla española y campamento en el desierto, con presupuesto a medida según el número de viajeros.',
        en: 'Vivir Marruecos is a company based in Hassi Labied, at the foot of the Erg Chebbi dunes (Merzouga). We organise the trip ourselves: private vehicle, English-speaking driver and desert camp, with a tailor-made quote for your number of travellers.',
        fr: 'Vivir Marruecos est une entreprise basée à Hassi Labied, au pied des dunes de l’Erg Chebbi (Merzouga). Nous organisons le voyage nous-mêmes : véhicule privé, chauffeur francophone et campement dans le désert, avec un devis sur mesure selon le nombre de voyageurs.'
      }),
      others: T({ es: 'Otros tours por Marruecos', en: 'Other tours in Morocco', fr: 'Autres circuits au Maroc' })
    };
    for (const tour of toursL) {
      const canonicalPath = tourPath(tour);
      const descText = tourMetaDescription(tour, lang);
      // Contenido completo para Google: descripción, itinerario día a día, qué incluye y otros tours relacionados
      const section = (h, html) => (stripHtml(html || '') ? `<section><h2>${h}</h2><div>${links(html)}</div></section>` : '');
      const related = toursL.filter(t => t.id !== tour.id).slice(0, 6);
      const tourHtml = `<main>${navHtml}<article><h1>${escapeHtml(tour.title)}</h1><p>${escapeHtml(descText)}</p><p><strong>${priceFromLabel}:</strong> ${tour.price || 0}€ ${lbl.perPerson} | <strong>${lbl.duration}:</strong> ${escapeHtml(localizeDuration(tour.duration || '', lang))} | <strong>${lbl.departure}:</strong> ${escapeHtml(tour.departure_city || '')}${tour.return_city ? ` | <strong>${lbl.arrival}:</strong> ${escapeHtml(tour.return_city)}` : ''}</p><div>${links(tour.description)}</div>${section(lbl.itinerary, tour.itinerary_details)}${section(lbl.includes, tour.description_includes)}${section(lbl.excludes, tour.description_excludes)}${section(lbl.tips, tour.recommendations)}<section><h2>${lbl.agencyH}</h2><p>${lbl.agencyP}</p></section>${related.length ? `<section><h2>${lbl.others}</h2><ul>${related.map(t => `<li><a href="${L(tourPath(t))}">${escapeHtml(t.title)}</a> - ${from(t.price)}</li>`).join('')}</ul></section>` : ''}</article></main>`;
      write(canonicalPath, page({
        title: `${tour.title} | ${siteName}`,
        description: descText,
        canonicalPath: L(canonicalPath),
        image: tour.featured_image || tour.gallery?.[0],
        type: 'product',
        schema: [{
          '@context': 'https://schema.org',
          '@type': 'TouristTrip',
          name: tour.title,
          description: descText,
          inLanguage: lang,
          image: tour.featured_image || tour.gallery?.[0],
          provider: { '@type': 'LocalBusiness', name: siteName, url: DOMAIN, address: BUSINESS_ADDRESS },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: tour.price || 0,
            availability: 'https://schema.org/InStock',
            url: `${DOMAIN}${L(canonicalPath)}`
          }
        }, crumbs([{ name: 'Tours', path: '/tours' }, { name: tour.title, path: canonicalPath }])],
        bodyHtml: tourHtml
      }));
    }

    // 8. Cada destino (/destinations/:slug; /destinations/<id> y /destino/<slug> redirigen con 301)
    for (const dest of destinationsL) {
      const descText = stripHtml(dest.description || T({ es: `Descubre los mejores tours y excursiones en ${dest.name}.`, en: `Discover the best tours and excursions in ${dest.name}.`, fr: `Découvrez les meilleurs circuits et excursions à ${dest.name}.` }));
      const canonical = `/destinations/${dest.slug || dest.id}`;
      const headings = destinationHeadings(dest, siteName, lang);
      const destTours = toursL.filter(t => t.destination_id === dest.id || (t.destination_ids || []).includes(dest.id));
      const destName = escapeHtml(String(dest.name).trim());
      const destToursHtml = `<section><h2>${T({ es: `Tours y excursiones en ${destName}`, en: `Tours and excursions in ${destName}`, fr: `Circuits et excursions à ${destName}` })}</h2>${destTours.length ? `<ul>${destTours.map(t => `<li><a href="${L(tourPath(t))}">${escapeHtml(t.title)}</a> - ${from(t.price)}</li>`).join('')}</ul>` : `<p>${T({ es: 'Organizamos tours y excursiones privadas a medida.', en: 'We organise tailor-made private tours and excursions.', fr: 'Nous organisons des circuits et excursions privés sur mesure.' })} <a href="${L('/tours')}">${T({ es: 'Ver todos los tours', en: 'See all tours', fr: 'Voir tous les circuits' })}</a>.</p>`}</section>`;
      const destHtml = `<main>${navHtml}<article><h1>${escapeHtml(headings.h1)}</h1><div>${dest.description ? links(dest.description) : `<p>${escapeHtml(descText)}</p>`}</div>${destToursHtml}</article></main>`;
      write(canonical, page({
        title: headings.title,
        description: descText.slice(0, 160),
        canonicalPath: L(canonical),
        image: dest.image_url,
        schema: [{
          '@context': 'https://schema.org',
          '@type': 'TouristDestination',
          name: dest.name,
          description: descText.slice(0, 300),
          image: dest.image_url
        }, crumbs([{ name: T({ es: 'Destinos', en: 'Destinations', fr: 'Destinations' }), path: '/destinations' }, { name: String(dest.name).trim(), path: canonical }])],
        bodyHtml: destHtml
      }));
    }

    // 9. Cada artículo del blog
    for (let i = 0; i < postsL.length; i++) {
      const post = postsL[i];
      if (!post.slug) continue;
      // La meta descripción y el meta título del panel solo existen en español: en inglés/francés se usan el título y el extracto traducidos
      const metaDesc = lang === 'es' ? post.meta_description : post.translations?.[lang]?.meta_description;
      const metaTitle = lang === 'es' ? post.meta_title : post.translations?.[lang]?.meta_title;
      const descText = stripHtml(metaDesc || post.excerpt || post.content || post.title);
      const postHtml = `<main>${navHtml}<article><h1>${escapeHtml(post.title)}</h1><p>${escapeHtml(post.excerpt || '')}</p><div>${links(post.content)}</div></article></main>`;
      write(`/blog/${post.slug}`, page({
        title: `${metaTitle || post.title} | ${siteName}`,
        description: descText.slice(0, 160),
        canonicalPath: L(`/blog/${post.slug}`),
        image: post.cover_image,
        type: 'article',
        schema: [{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          inLanguage: lang,
          headline: post.title,
          description: descText.slice(0, 250),
          image: post.cover_image,
          datePublished: post.published_at || post.created_at,
          author: { '@type': 'Organization', name: siteName }
        }, crumbs([{ name: 'Blog', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }])],
        bodyHtml: postHtml
      }));
    }

    // 10. Colecciones (/coleccion/:slug)
    const collectionSlugs = new Set([
      'desierto', 'norte-de-marruecos', 'ciudades-imperiales', 'aventura',
      'cultura', 'viajes-exclusivos', 'viajes-de-lujo', 'luna-de-miel',
      'viajes-en-familia', 'viajes-en-grupo', 'paquetes', 'actividades'
    ]);
    baseToursEs.forEach(t => {
      if (!t.category) return;
      t.category.split(',').forEach(part => {
        const s = slugifyCategory(part);
        if (s) collectionSlugs.add(s);
      });
    });
    for (const slug of collectionSlugs) {
      const col = collectionContentI18n(slug, '', lang);
      // La categoría se guarda en español: se filtra con el tour original
      const colTours = toursL.filter((t, i) => (baseToursEs[i].category || '').split(',').some(part => slugifyCategory(part) === slug));
      const colHtml = `<main>${navHtml}<h1>${escapeHtml(col.title)}</h1><p>${escapeHtml(col.intro)}</p>${(col.body || []).map(b => `<p>${escapeHtml(b)}</p>`).join('')}${colTours.length ? `<ul>${colTours.map(t => `<li><a href="${L(tourPath(t))}">${escapeHtml(t.title)}</a> - ${from(t.price)}</li>`).join('')}</ul>` : ''}</main>`;
      write(`/coleccion/${slug}`, page({
        title: `${col.title} | ${siteName}`,
        description: col.intro,
        canonicalPath: L(`/coleccion/${slug}`),
        schema: [list(col.title, `/coleccion/${slug}`, colTours.map(t => ({ name: t.title, path: tourPath(t) }))), crumbs([{ name: col.title, path: `/coleccion/${slug}` }])],
        bodyHtml: colHtml
      }));
    }
  }

  console.log(`✅ Pre-renderizado completado: ${count} páginas HTML estáticas generadas con metadatos, JSON-LD y contenido legible.`);
}

prerender();

