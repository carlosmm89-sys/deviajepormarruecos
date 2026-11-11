import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { dbService } from '../services/dbService';

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
          const script1 = document.createElement('script');
          script1.id = 'ga-script';
          script1.async = true;
          script1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
          document.head.appendChild(script1);

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
        page_path: location.pathname + location.search,
      });
    }
  }, [gaId, location.pathname, location.search]);

  return null;
}
