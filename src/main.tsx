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

// Register Service Worker for PWA
registerSW({ immediate: true });

if (!redirecting) createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
