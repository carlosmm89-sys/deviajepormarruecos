import { Helmet } from 'react-helmet-async';
import { fitTitle } from '../data/seoContent';
import { alternateUrls, currentLang, DOMAIN, localizePath, stripLangPrefix } from '../i18n/urlLang';

const OG_LOCALE: Record<string, string> = { es: 'es_ES', en: 'en_GB', fr: 'fr_FR' };

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  schema?: Record<string, any> | Record<string, any>[];
}

export default function SEO({
  title = 'Vivir Marruecos | Tours privados por Marruecos',
  description = 'Descubre la magia de Marruecos con nuestros tours y excursiones organizadas desde España y Marruecos. Experiencias únicas en el desierto, ciudades imperiales y más.',
  image = 'https://www.vivirmarruecos.com/pwa-512x512.png',
  url,
  type = 'website',
  schema,
}: SEOProps) {
  title = fitTitle(title);
  // Ruta de la página sin prefijo de idioma (si no se indica, la actual) y su versión en el idioma de la página
  const lang = currentLang();
  const basePath = url
    ? stripLangPrefix(url.startsWith('http') ? new URL(url).pathname : url)
    : stripLangPrefix(typeof window !== 'undefined' ? window.location.pathname : '/');
  const canonicalUrl = `${DOMAIN}${localizePath(basePath, lang)}`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <html lang={lang} />
      <link rel="canonical" href={canonicalUrl} />
      {alternateUrls(basePath).map(a => (
        <link key={a.hreflang} rel="alternate" hrefLang={a.hreflang} href={a.href} />
      ))}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={OG_LOCALE[lang] || 'es_ES'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
