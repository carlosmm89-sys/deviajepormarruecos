import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentLang, isLocalizablePath, langFromPath, langPrefix, localizePath, stripLangPrefix } from '../i18n/urlLang';

/**
 * En las páginas en inglés o francés, los enlaces internos escritos como HTML (artículos del blog, guía,
 * descripciones de tours, enlaces <a href="/...">) se cambian a /en/... o /fr/..., para que el visitante y
 * Google sigan en el mismo idioma. Los <Link> de React ya llevan el prefijo (basename del router).
 * Además, los clics en esos enlaces navegan dentro de la app sin recargar la página.
 */
export default function LocalizedLinks() {
  const navigate = useNavigate();

  useEffect(() => {
    const lang = currentLang();
    const prefix = langPrefix(lang);

    const fix = (a: HTMLAnchorElement) => {
      const href = a.getAttribute('href');
      if (!href || !isLocalizablePath(href) || langFromPath(href) !== 'es') return;
      a.setAttribute('href', localizePath(href, lang));
    };
    const fixAll = (root: ParentNode) => root.querySelectorAll?.('a[href^="/"]').forEach(a => fix(a as HTMLAnchorElement));

    let observer: MutationObserver | null = null;
    if (prefix) {
      fixAll(document);
      observer = new MutationObserver(muts => {
        for (const m of muts) {
          if (m.type === 'attributes' && m.target instanceof HTMLAnchorElement) fix(m.target);
          m.addedNodes.forEach(n => {
            if (n instanceof HTMLAnchorElement) fix(n);
            if (n instanceof Element) fixAll(n);
          });
        }
      });
      observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['href'] });
    }

    // Clic en un enlace interno escrito como HTML: navegación de la app (sin recargar)
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element)?.closest?.('a') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.dataset.reactLink) return;
      const href = a.getAttribute('href');
      if (!href || !isLocalizablePath(href)) return;
      // Un enlace a otro idioma (selector) carga la página entera
      if (langFromPath(href) !== lang) return;
      if (href.startsWith(`${prefix}/admin`)) return;
      e.preventDefault();
      navigate(stripLangPrefix(href));
    };
    document.addEventListener('click', onClick);

    return () => {
      observer?.disconnect();
      document.removeEventListener('click', onClick);
    };
  }, [navigate]);

  return null;
}
