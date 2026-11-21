// Imágenes optimizadas. Archivo .js para que también lo use prerender-seo.mjs (Node) durante el build.

/**
 * Devuelve una versión redimensionada y comprimida de una imagen.
 * - Supabase Storage: se sirve la foto original (la transformación /render/image/ no está activada en el plan actual).
 * - Unsplash: ajusta los parámetros w / q / auto=format.
 * - Cualquier otra URL se devuelve tal cual.
 * @param {string | null | undefined} url
 * @param {number} [width]
 * @param {number} [quality]
 * @returns {string}
 */
export function optImg(url, width = 800, quality = 70) {
  if (!url) return url || '';
  if (/\.(svg|gif)(\?|$)/i.test(url)) return url;

  // Supabase Storage: la transformación de imágenes (/render/image/) no está activada en el plan actual
  // (responde 403 «FeatureNotEnabled»), así que se sirve la foto original.
  if (url.includes('.supabase.co/storage/v1/render/image/public/')) {
    return url.split('?')[0].replace('/storage/v1/render/image/public/', '/storage/v1/object/public/');
  }
  if (url.includes('.supabase.co/storage/v1/object/public/')) return url;

  if (url.includes('images.unsplash.com/')) {
    try {
      const u = new URL(url);
      u.searchParams.set('w', String(width));
      u.searchParams.set('q', String(quality));
      u.searchParams.set('auto', 'format');
      if (!u.searchParams.has('fit')) u.searchParams.set('fit', 'crop');
      return u.toString();
    } catch {
      return url;
    }
  }

  // Pexels: mismo sistema (w = ancho, auto=compress devuelve WebP si el navegador lo admite)
  if (url.includes('images.pexels.com/')) {
    try {
      const u = new URL(url);
      u.searchParams.set('w', String(width));
      u.searchParams.set('auto', 'compress');
      u.searchParams.set('cs', 'tinysrgb');
      u.searchParams.delete('dpr');
      return u.toString();
    } catch {
      return url;
    }
  }

  return url;
}

/**
 * srcset con varios anchos, para que el móvil descargue una imagen más pequeña que el ordenador.
 * Devuelve undefined si la URL no se puede redimensionar.
 * @param {string | null | undefined} url
 * @param {number[]} [widths]
 * @param {number} [quality]
 * @returns {string | undefined}
 */
export function optSrcSet(url, widths = [640, 960, 1600], quality = 70) {
  if (!url) return undefined;
  if (!/images\.unsplash\.com\/|images\.pexels\.com\//.test(url)) return undefined;
  return widths.map(w => `${optImg(url, w, quality)} ${w}w`).join(', ');
}

/**
 * onError para <img>: si falla la versión optimizada, carga la foto original (una sola vez).
 * Úsalo con key={url} en imágenes que cambian de foto, para que cada foto tenga su propio intento.
 * @param {string | null | undefined} original
 */
export function fallbackToOriginal(original) {
  return (e) => {
    const img = e.currentTarget;
    if (original && img.dataset.fallback !== '1' && img.src !== original) {
      img.dataset.fallback = '1';
      img.src = original;
    }
  };
}
