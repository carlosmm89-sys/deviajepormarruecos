import { Link } from 'react-router-dom';
import { Star, MapPin, Languages, ShieldCheck, Compass } from 'lucide-react';
import SEO from '../components/SEO';
import { useTranslation } from '../hooks/useTranslation';
import { getAbout, ABOUT_PATH, CONTACT_PATH, COMPANY, OPENING_HOURS } from '../data/companyContent';
import { GOOGLE_WRITE_REVIEW_URL, TRIPADVISOR_URL } from '../data/homeContent';
import { BUSINESS_ADDRESS } from '../data/seoContent';
import { DOMAIN, localizePath } from '../i18n/urlLang';

const HIGHLIGHT_ICONS = [MapPin, Compass, Languages, ShieldCheck];

export default function AboutUs() {
  const { tr, currentLanguage } = useTranslation();
  const A = getAbout(currentLanguage);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: A.h1,
    inLanguage: currentLanguage,
    url: `${DOMAIN}${localizePath(ABOUT_PATH, currentLanguage)}`,
    mainEntity: {
      '@type': 'TravelAgency',
      name: COMPANY.brand,
      legalName: COMPANY.legalName,
      foundingDate: '2015-05',
      founder: { '@type': 'Person', name: 'Ali' },
      email: COMPANY.email,
      address: BUSINESS_ADDRESS,
      knowsLanguage: ['es', 'en', 'fr'],
      openingHoursSpecification: OPENING_HOURS,
      url: DOMAIN
    }
  };

  const highlights = [
    tr({ es: 'Base en Hassi Labied (Merzouga)', en: 'Based in Hassi Labied (Merzouga)', fr: 'Basés à Hassi Labied (Merzouga)' }),
    tr({ es: 'Viajes desde 2015', en: 'Organising trips since 2015', fr: 'Des voyages depuis 2015' }),
    tr({ es: 'Conductores en español, inglés y francés', en: 'English, Spanish and French-speaking drivers', fr: 'Chauffeurs francophones, anglophones et hispanophones' }),
    tr({ es: 'Vehículos con seguro', en: 'Insured vehicles', fr: 'Véhicules assurés' })
  ];

  return (
    <>
      <SEO title={A.metaTitle} description={A.description} url={ABOUT_PATH} schema={schema} />
      <article className="max-w-4xl mx-auto px-4 py-16 md:py-20">
        <nav className="text-sm text-gray-500 mb-6" aria-label={tr({ es: 'Migas de pan', en: 'Breadcrumb', fr: 'Fil d’Ariane' })}>
          <Link to="/" className="hover:text-brand-primary">{tr({ es: 'Inicio', en: 'Home', fr: 'Accueil' })}</Link> <span className="mx-1">/</span> <span>{A.h1}</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">{A.h1}</h1>
        <p className="text-lg text-gray-700 mb-10 leading-relaxed">{A.intro}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {highlights.map((h, i) => {
            const Icon = HIGHLIGHT_ICONS[i];
            return (
              <div key={h} className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-4 text-sm font-semibold text-gray-800 flex flex-col gap-2">
                <Icon className="w-5 h-5 text-brand-accent" aria-hidden="true" />
                {h}
              </div>
            );
          })}
        </div>

        <figure className="mb-12 rounded-2xl overflow-hidden">
          <img src="/images/blog/desert.png" alt={tr({ es: 'Dunas de Erg Chebbi en Merzouga', en: 'Erg Chebbi dunes in Merzouga', fr: 'Dunes de l’Erg Chebbi à Merzouga' })} width="1200" height="675" loading="lazy" className="w-full h-64 md:h-80 object-cover" />
        </figure>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">{A.founder.h2}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_260px] gap-6 items-start">
            <div>{A.founder.paragraphs.map(p => <p key={p} className="text-gray-700 leading-relaxed mb-4">{p}</p>)}</div>
            <figure className="rounded-2xl overflow-hidden shadow-sm">
                  <picture>
                    <source type="image/webp" srcSet="/images/equipo/vivir-marruecos-equipo-480.webp 480w, /images/equipo/vivir-marruecos-equipo-800.webp 800w" sizes="(min-width: 640px) 260px, 100vw" />
                    <img
                      src="/images/equipo/vivir-marruecos-equipo-800.jpg"
                      srcSet="/images/equipo/vivir-marruecos-equipo-480.jpg 480w, /images/equipo/vivir-marruecos-equipo-800.jpg 800w"
                      sizes="(min-width: 640px) 260px, 100vw"
                      alt={A.founder.caption}
                      width="800"
                      height="1067"
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </picture>
                  <figcaption className="bg-white px-4 py-3 text-sm font-semibold text-gray-800 text-center border-t border-gray-100">
                    {A.founder.caption}
                  </figcaption>
                </figure>
          </div>
        </section>

        {A.sections.map(s => (
          <section key={s.h2} className="mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">{s.h2}</h2>
            {s.paragraphs?.map(p => <p key={p} className="text-gray-700 leading-relaxed mb-4">{p}</p>)}
            {s.list && (
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {s.list.map(li => <li key={li}>{li}</li>)}
              </ul>
            )}
          </section>
        ))}

        <div className="flex flex-wrap gap-3 mb-12">
          <a href={TRIPADVISOR_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 font-semibold text-gray-800 hover:border-brand-accent hover:text-brand-accent transition-colors">
            <Star className="w-4 h-4 fill-current text-[#00AA6C]" aria-hidden="true" /> {tr({ es: 'Ver opiniones en Tripadvisor', en: 'Read reviews on Tripadvisor', fr: 'Voir les avis sur Tripadvisor' })}
          </a>
          <a href={GOOGLE_WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 font-semibold text-gray-800 hover:border-brand-accent hover:text-brand-accent transition-colors">
            <Star className="w-4 h-4 fill-current text-[#FBBC04]" aria-hidden="true" /> {tr({ es: 'Opinar en Google', en: 'Review us on Google', fr: 'Donner un avis sur Google' })}
          </a>
        </div>

        <section className="mb-12 bg-gray-50 border border-gray-100 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{A.companyH2}</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm text-gray-700">
            <dt className="font-semibold">{A.labels.legalName}</dt><dd>{COMPANY.legalName}</dd>
            <dt className="font-semibold">{A.labels.ice}</dt><dd>{COMPANY.ice}</dd>
            <dt className="font-semibold">{A.labels.rc}</dt><dd>{COMPANY.rc}</dd>
            <dt className="font-semibold">{A.labels.address}</dt><dd>{COMPANY.address}</dd>
            <dt className="font-semibold">{A.labels.email}</dt><dd><a href={`mailto:${COMPANY.email}`} className="text-brand-primary underline">{COMPANY.email}</a></dd>
            <dt className="font-semibold">{A.labels.since}</dt><dd>{A.sinceValue}</dd>
          </dl>
        </section>

        <div className="bg-brand-primary text-white rounded-2xl p-8 text-center">
          <p className="text-2xl font-serif font-bold mb-3">{A.ctaTitle}</p>
          <p className="mb-6 opacity-90">{A.ctaText}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/tours" className="inline-block bg-white text-brand-primary font-semibold px-6 py-3 rounded-full">{A.ctaTours}</Link>
            <Link to={CONTACT_PATH} className="inline-block border border-white/70 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10">{A.ctaContact}</Link>
          </div>
        </div>
      </article>
    </>
  );
}
