/**
 * Devuelve una versión redimensionada y comprimida de una imagen.
 * - Supabase Storage: usa el endpoint de transformación (/render/image/), que además sirve WebP si el navegador lo admite.
 * - Unsplash: ajusta los parámetros w / q / auto=format.
 * - Cualquier otra URL se devuelve tal cual.
 */
export function optImg(url: string | null | undefined, width = 800, quality = 70): string {
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
