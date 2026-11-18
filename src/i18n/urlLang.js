/**
 * Idioma según la URL: /en/... = inglés, /fr/... = francés, sin prefijo = español.
 * Lo usan la app (LanguageContext, App, SEO, dbService) y el pre-renderizado (prerender-seo.mjs),
 * así cada idioma tiene sus propias direcciones que Google puede indexar.
 */

export const LANGS = ['es', 'en', 'fr'];
export const DEFAULT_LANG = 'es';
export const DOMAIN = 'https://www.vivirmarruecos.com';

/** Prefijo de la URL de cada idioma ('' para español). */
export function langPrefix(lang) {
  return lang && lang !== DEFAULT_LANG ? `/${lang}` : '';
}

/** Idioma de una ruta: '/en/tours' → 'en'; '/tours' → 'es'. */
export function langFromPath(pathname = '/') {
  const m = /^\/(en|fr)(?=\/|$)/.exec(pathname || '/');
  return m ? m[1] : DEFAULT_LANG;
}

/** Quita el prefijo de idioma: '/en/tours' → '/tours'; '/en' → '/'. */
export function stripLangPrefix(pathname = '/') {
  const out = String(pathname || '/').replace(/^\/(en|fr)(?=\/|$)/, '');
  return out === '' ? '/' : out;
}

/** Ruta en el idioma pedido: ('/tours', 'en') → '/en/tours'; ('/', 'fr') → '/fr'. */
export function localizePath(path = '/', lang = DEFAULT_LANG) {
  const base = stripLangPrefix(path);
  const prefix = langPrefix(lang);
  if (!prefix) return base;
  return base === '/' ? prefix : `${prefix}${base}`;
}

/** Idioma de la página actual (en el navegador). */
export function currentLang() {
  return typeof window !== 'undefined' ? langFromPath(window.location.pathname) : DEFAULT_LANG;
}

/** Rutas internas que no se traducen (ficheros, panel, API...). */
export function isLocalizablePath(path = '') {
  if (!path.startsWith('/') || path.startsWith('//')) return false;
  if (/^\/(assets|images|api|admin|spa-shell)(\/|$|\?|#)/.test(path)) return false;
  if (/^\/[^?#]*\.[a-z0-9]{2,5}([?#]|$)/i.test(path)) return false; // ficheros: .xml, .png, .pdf...
  return true;
}

/** Cambia los enlaces internos de un HTML (artículos, guía...) al idioma pedido. */
export function localizeHtmlLinks(html = '', lang = DEFAULT_LANG) {
  if (!html || lang === DEFAULT_LANG) return html;
  return String(html).replace(/href=(["'])(\/[^"']*)\1/g, (all, q, href) =>
    isLocalizablePath(href) && langFromPath(href) === DEFAULT_LANG ? `href=${q}${localizePath(href, lang)}${q}` : all
  );
}

/** URLs de las tres versiones de una página, para las etiquetas hreflang. */
export function alternateUrls(path = '/') {
  const base = stripLangPrefix(path);
  return [
    ...LANGS.map(l => ({ hreflang: l, href: `${DOMAIN}${localizePath(base, l)}` })),
    { hreflang: 'x-default', href: `${DOMAIN}${base}` }
  ];
}
