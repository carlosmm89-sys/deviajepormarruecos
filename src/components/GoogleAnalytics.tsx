import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { track } from '../lib/track';

export default function GoogleAnalytics() {
  const [gaId, setGaId] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    dbService.getBusinessSettings().then(settings => {
      if (settings?.google_analytics_id) {
        const id = settings.google_analytics_id.trim();
        if (!/^(G|UA|AW|GTM)-[A-Z0-9]+$/i.test(id)) return;
        setGaId(id);

        if (!document.getElementById('ga-script')) {
          // El script de gtag (~190 KB) se carga cuando el visitante interactúa o 2,5 s después de cargar la página,
          // igual que GTM en index.html, para no competir con la foto de portada (LCP). Los eventos se quedan en
          // dataLayer y se envían en cuanto carga.
          const loadGa = () => {
            if (document.getElementById('ga-script')) return;
            const script1 = document.createElement('script');
            script1.id = 'ga-script';
            script1.async = true;
            script1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
            document.head.appendChild(script1);
          };
          ['scroll', 'pointerdown', 'keydown', 'touchstart'].forEach(ev =>
            window.addEventListener(ev, loadGa, { once: true, passive: true }));
          if (document.readyState === 'complete') setTimeout(loadGa, 2500);
          else window.addEventListener('load', () => setTimeout(loadGa, 2500), { once: true });

          const w = window as any;
          w.dataLayer = w.dataLayer || [];
          if (!w.gtag) {
            w.gtag = function () {
              w.dataLayer.push(arguments);
            };
          }
          w.gtag('js', new Date());
          w.gtag('config', id, {
            page_path: window.location.pathname,
          });
        }
      }
    });
  }, []);

  useEffect(() => {
    if (gaId && typeof (window as any).gtag === 'function') {
      (window as any).gtag('config', gaId, {
        // Con el prefijo de idioma (/en, /fr) para ver en Analytics las visitas de cada idioma
        page_path: window.location.pathname + location.search,
      });
    }
  }, [gaId, location.pathname, location.search]);

  // Clics en WhatsApp, email y teléfono (en cualquier parte de la web)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest?.('a') as HTMLAnchorElement | null;
      const href = a?.getAttribute('href') || '';
      const method = /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href) ? 'whatsapp'
        : href.startsWith('mailto:') ? 'email'
        : href.startsWith('tel:') ? 'phone' : '';
      if (method) track('contact_click', { method, link_text: (a?.innerText || '').trim().slice(0, 60) || undefined });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
