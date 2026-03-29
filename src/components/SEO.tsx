import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  schema?: Record<string, any> | Record<string, any>[];
}

export default function SEO({
  title = 'Marruecos Experiencia - Tu Agencia de Viajes en Marruecos',
  description = 'Descubre la magia de Marruecos con nuestros tours y excursiones organizadas desde España y Marruecos. Experiencias únicas en el desierto, ciudades imperiales y más.',
  image = 'https://www.vivirmarruecos.com/pwa-512x512.png',
  url = 'https://www.vivirmarruecos.com',
  type = 'website',
  schema,
}: SEOProps) {
  const canonicalUrl = url.startsWith('http') ? url : `https://www.vivirmarruecos.com${url}`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
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
