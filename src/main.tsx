import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import { langFromPath, localizePath, isLocalizablePath } from './i18n/urlLang';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Si una foto redimensionada de Supabase (/render/image/) falla (cuota de
// transformaciones, error del servicio...), cargar la foto original para que nunca
// quede en blanco.
document.addEventListener(
  'error',
  (e) => {
    const img = e.target as HTMLImageElement | null;
    if (!img || img.tagName !== 'IMG' || img.dataset.fallback) return;
    const src = img.currentSrc || img.src || '';
    if (!src.includes('/storage/v1/render/image/public/')) return;
    img.dataset.fallback = '1';
    const original = src.split('?')[0].replace('/storage/v1/render/image/public/', '/storage/v1/object/public/');
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    img.src = original;
  },
  true,
);

// Quien eligió inglés o francés en otra visita y entra desde fuera (Google, un enlace...) a una página en
// español va a la misma página en su idioma. Los buscadores no guardan preferencia, así que siempre ven la URL pedida.
let redirecting = false;
try {
  const saved = localStorage.getItem('app_language');
  const { pathname, search, hash } = window.location;
  const fromOutside = !document.referrer || new URL(document.referrer).host !== window.location.host;
  if ((saved === 'en' || saved === 'fr') && fromOutside && langFromPath(pathname) === 'es' && isLocalizablePath(pathname)) {
    redirecting = true;
    window.location.replace(`${localizePath(pathname, saved)}${search}${hash}`);
  }
} catch { /* sin almacenamiento */ }

// Canonical y hreflang del HTML pre-renderizado: los sustituye el componente SEO de cada página.
// (Si la página llega de la caché de la app instalable, ese HTML es el de la portada y sus etiquetas no valen.)
if (!redirecting) document.querySelectorAll('[data-prerender]').forEach(el => { if (el.tagName !== 'DIV') el.remove(); });

// Register Service Worker for PWA
registerSW({ immediate: true });

// Foto principal de la ficha de tour que ya venía en el HTML del servidor (móvil): TourDetail la sigue
// mostrando mientras carga los datos, para que no desaparezca y vuelva a aparecer (mejor LCP).
(window as any).__TPH__ = { path: location.pathname, src: document.querySelector('.tph img')?.getAttribute('src') || null, alt: document.querySelector('.tph img')?.getAttribute('alt') || '' };

if (!redirecting) createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
