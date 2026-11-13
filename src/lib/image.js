// Imágenes optimizadas. Archivo .js para que también lo use prerender-seo.mjs (Node) durante el build.

/**
 * Devuelve una versión redimensionada y comprimida de una imagen.
 * - Supabase Storage: usa el endpoint de transformación (/render/image/), que sirve WebP si el navegador lo admite.
 * - Unsplash: ajusta los parámetros w / q / auto=format.
 * - Cualquier otra URL se devuelve tal cual.
 * @param {string | null | undefined} url
 * @param {number} [width]
 * @param {number} [quality]
 * @returns {string}
 */
export function optImg(url, width = 800, quality = 80) {
  if (!url) return url || '';
  if (/\.(svg|gif)(\?|$)/i.test(url)) return url;

  if (url.includes('.supabase.co/storage/v1/object/public/')) {
    const base = url.split('?')[0].replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
    return `${base}?width=${width}&quality=${quality}&resize=contain`;
  }

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
  if (!/\.supabase\.co\/storage\/v1\/object\/public\/|images\.unsplash\.com\//.test(url)) return undefined;
  return widths.map(w => `${optImg(url, w, quality)} ${w}w`).join(', ');
}
