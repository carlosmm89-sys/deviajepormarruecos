import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
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

// Register Service Worker for PWA
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
