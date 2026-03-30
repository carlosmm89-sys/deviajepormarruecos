import { useEffect, useState } from 'react';
import { dbService } from '../services/dbService';

export default function GoogleAnalytics() {
  const [gaId, setGaId] = useState<string | null>(null);

  useEffect(() => {
    // Only load GA once
    if ((window as any).gtag) return;

    dbService.getBusinessSettings().then(settings => {
      if (settings?.google_analytics_id) {
        const id = settings.google_analytics_id.trim();
        setGaId(id);
        
        // Inject script tags if they don't exist
        if (!document.getElementById('ga-script')) {
          const script1 = document.createElement('script');
          script1.id = 'ga-script';
          script1.async = true;
          script1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
          document.head.appendChild(script1);

          const script2 = document.createElement('script');
          script2.id = 'ga-init';
          script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${id}', {
              page_path: window.location.pathname,
            });
          `;
          document.head.appendChild(script2);
        }
      }
    });
  }, []);

  return null;
}
