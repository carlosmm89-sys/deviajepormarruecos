import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { GUIDE, GUIDE_PATH } from '../data/guiaViaje';

import { useTranslation } from '../hooks/useTranslation';
const DOMAIN = 'https://www.vivirmarruecos.com';

export default function TravelGuide() {
  const { tr, currentLanguage } = useTranslation();
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: GUIDE.title,
      description: GUIDE.description,
      dateModified: GUIDE.updated,
      author: { '@type': 'Organization', name: 'Vivir Marruecos', url: DOMAIN },
      publisher: { '@type': 'Organization', name: 'Vivir Marruecos', url: DOMAIN },
      mainEntityOfPage: `${DOMAIN}${GUIDE_PATH}`
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: GUIDE.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    }
  ];

  return (
    <>
      <SEO title={GUIDE.metaTitle} description={GUIDE.description} url={GUIDE_PATH} type="article" schema={schema} />
      <article className="max-w-4xl mx-auto px-4 py-16 md:py-20">
        <nav className="text-sm text-gray-500 mb-6" aria-label={tr({ es: 'Migas de pan', en: 'Breadcrumb', fr: 'Fil d’Ariane' })}>
          <Link to="/" className="hover:text-brand-primary">{tr({ es: 'Inicio', en: 'Home', fr: 'Accueil' })}</Link> <span className="mx-1">/</span> <span>{tr({ es: 'Viaje a Marruecos', en: 'Travelling to Morocco', fr: 'Voyager au Maroc' })}</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">{GUIDE.title}</h1>
        {GUIDE.intro.map((p, i) => (
          <p key={i} className="text-lg text-gray-700 mb-4 leading-relaxed">{p}</p>
        ))}

        <nav className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-6 my-10" aria-label={tr({ es: 'Contenido de la guía', en: 'Guide contents', fr: 'Contenu du guide' })}>
          <p className="font-bold text-gray-900 mb-3">{tr({ es: 'En esta guía', en: 'In this guide', fr: 'Dans ce guide' })}</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            {GUIDE.sections.map(s => (
              <li key={s.id}><a href={`#${s.id}`} className="hover:text-brand-primary">{s.h2}</a></li>
            ))}
            <li><a href="#preguntas" className="hover:text-brand-primary">{tr({ es: 'Preguntas frecuentes', en: 'FAQ', fr: 'Questions fréquentes' })}</a></li>
          </ol>
        </nav>

        {GUIDE.sections.map(s => (
          <section key={s.id} id={s.id} className="mb-12 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">{s.h2}</h2>
            <div
              className="text-gray-700 leading-relaxed space-y-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-brand-primary [&_a]:underline [&_a:hover]:text-brand-accent"
              dangerouslySetInnerHTML={{ __html: s.html }}
            />
          </section>
        ))}

        <section id="preguntas" className="mb-12 scroll-mt-28">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6">{tr({ es: 'Preguntas frecuentes', en: 'FAQ', fr: 'Questions fréquentes' })}</h2>
          <div className="space-y-4">
            {GUIDE.faqs.map(f => (
              <details key={f.q} className="bg-white rounded-xl border border-gray-200 p-5">
                <summary className="font-semibold text-gray-900 cursor-pointer">{f.q}</summary>
                <p className="text-gray-700 mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="bg-brand-primary text-white rounded-2xl p-8 text-center">
          <p className="text-2xl font-serif font-bold mb-3">{tr({ es: '¿Preparamos tu viaje a Marruecos?', en: 'Shall we plan your trip to Morocco?', fr: 'On prépare votre voyage au Maroc ?' })}</p>
          <p className="mb-6 opacity-90">{tr({ es: 'Cuéntanos fechas y número de viajeros y te enviamos un presupuesto a medida.', en: 'Tell us your dates and number of travellers and we will send you a tailor-made quote.', fr: 'Indiquez-nous vos dates et le nombre de voyageurs et nous vous enverrons un devis sur mesure.' })}</p>
          <Link to="/tours" className="inline-block bg-white text-brand-primary font-semibold px-6 py-3 rounded-full">{tr({ es: 'Ver tours por Marruecos', en: 'See tours in Morocco', fr: 'Voir les circuits au Maroc' })}</Link>
        </div>
      </article>
    </>
  );
}
