import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Atiende las URLs que no tienen página pre-renderizada en dist/.
 * - Si el contenido existe (tour, destino o artículo nuevo aún sin pre-renderizar), sirve la app con 200.
 * - Si es una URL antigua con ID (/tours/<uuid>, /destinations/<uuid>), redirige con 301 a la URL con nombre.
 * - Si no existe, sirve la app con estado 404 real (y noindex), para que Google no la trate como página válida.
 */

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Tours desactivados con una ruta equivalente activa
const INACTIVE_TOUR_TARGET: Record<string, string> = {
  '979c2415-6305-477f-b722-a453a99a75c5': '/tours/ruta-de-9-dias-desde-marrakech-hacia-tanger',
};

// URLs antiguas de tours desactivados (comparadas sin tildes): los tours inactivos no son visibles desde aquí
const OLD_TOUR_SLUGS: Record<string, string> = {
  'tour-de-9-dias-marrakech-a-tanger': '/tours/ruta-de-9-dias-desde-marrakech-hacia-tanger',
};

let shellCache: { html: string; ts: number } | null = null;

async function getShell(host: string): Promise<string> {
  if (shellCache && Date.now() - shellCache.ts < 5 * 60 * 1000) return shellCache.html;
  const r = await fetch(`https://${host}/spa-shell`);
  const html = await r.text();
  shellCache = { html, ts: Date.now() };
  return html;
}

function slugify(str = '') {
  return str.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

type Result = { status: 200 } | { status: 404 } | { status: 301; location: string };

async function resolve(pathname: string): Promise<Result> {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  const [section, key] = parts;

  // Rutas de la app que no se pre-renderizan
  if (pathname === '/favoritos' || section === 'admin') return { status: 200 };

  if (parts.length !== 2 || !key) return { status: 404 };

  if (section === 'tours' && OLD_TOUR_SLUGS[slugify(key)]) {
    return { status: 301, location: OLD_TOUR_SLUGS[slugify(key)] };
  }

  if (section === 'tours') {
    const q = supabase.from('tours').select('id, slug, is_active');
    let { data } = await (UUID.test(key) ? q.eq('id', key) : q.eq('slug', key)).maybeSingle();
    if (!data && !UUID.test(key)) {
      // URL con tildes o codificada de otra forma: se compara sin tildes ni símbolos
      const { data: all } = await supabase.from('tours').select('id, slug, is_active');
      data = (all || []).find((t: any) => t.slug && slugify(t.slug) === slugify(key)) || null;
    }
    // Tour desactivado: se lleva a la página equivalente (si la hay) o al catálogo, en vez de dar 404
    if (data && data.is_active === false) return { status: 301, location: INACTIVE_TOUR_TARGET[data.id] || '/tours' };
    if (!data) return { status: 404 };
    if (data.slug && data.slug !== key) return { status: 301, location: `/tours/${encodeURI(data.slug)}` };
    return { status: 200 };
  }

  if (section === 'destinations' || section === 'destino') {
    const q = supabase.from('destinations').select('id, slug');
    const { data } = await (UUID.test(key) ? q.eq('id', key) : q.eq('slug', key)).maybeSingle();
    if (!data) return { status: 404 };
    if (data.slug && (data.slug !== key || section !== 'destinations')) return { status: 301, location: `/destinations/${encodeURI(data.slug)}` };
    return { status: 200 };
  }

  if (section === 'blog') {
    const { data } = await supabase.from('blog_posts').select('slug').eq('slug', key).eq('is_published', true).maybeSingle();
    return data ? { status: 200 } : { status: 404 };
  }

  if (section === 'coleccion') {
    const { data } = await supabase.from('tours').select('category').eq('is_active', true);
    const exists = (data || []).some((t: any) => String(t.category || '').split(',').some((c: string) => slugify(c) === key));
    return exists ? { status: 200 } : { status: 404 };
  }

  return { status: 404 };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'www.vivirmarruecos.com';
  // vercel.json pasa la ruta original en ?__path=
  const raw = typeof req.query.__path === 'string' ? `/${req.query.__path}` : new URL(req.url || '/', `https://${host}`).pathname;
  let pathname = raw;
  try {
    pathname = decodeURIComponent(raw);
  } catch {
    pathname = raw;
  }

  let result: Result = { status: 404 };
  try {
    result = await resolve(pathname);
  } catch (err) {
    console.error('page-fallback:', err);
    // Ante un fallo de la base de datos, mejor servir la página que dar un 404 falso
    result = { status: 200 };
  }

  if (result.status === 301) {
    res.setHeader('Cache-Control', 's-maxage=86400');
    res.redirect(301, result.location);
    return;
  }

  let html = await getShell(host);
  if (result.status === 404) {
    html = html.replace('</head>', '    <meta name="robots" content="noindex" />\n  </head>');
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', result.status === 404 ? 's-maxage=300' : 's-maxage=60, stale-while-revalidate=600');
  res.status(result.status).send(html);
}
