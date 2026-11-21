import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, ClipboardList, Clock, MapPin, Languages, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { useTranslation } from '../hooks/useTranslation';
import { dbService } from '../services/dbService';
import { getContact, CONTACT_PATH, COMPANY, OPENING_HOURS } from '../data/companyContent';
import { GOOGLE_WRITE_REVIEW_URL, TRIPADVISOR_URL } from '../data/homeContent';
import { BUSINESS_ADDRESS } from '../data/seoContent';
import { DOMAIN, localizePath } from '../i18n/urlLang';

const openQuoteWizard = () => window.dispatchEvent(new Event('open-quote-wizard'));

export default function Contact() {
  const { tr, currentLanguage } = useTranslation();
  const C = getContact(currentLanguage);
  const boot = typeof window !== 'undefined' ? (window as any).__BIZ__ : null;
  const [phone, setPhone] = useState<string>(boot?.whatsapp_number || COMPANY.whatsapp);
  const [tripadvisorUrl, setTripadvisorUrl] = useState<string>(TRIPADVISOR_URL);

  useEffect(() => {
    dbService.getBusinessSettings().then(s => {
      if (s?.whatsapp_number) setPhone(s.whatsapp_number);
      if ((s as any)?.tripadvisor_url) setTripadvisorUrl((s as any).tripadvisor_url);
    }).catch(() => {});
  }, []);

  const digits = phone.replace(/\D/g, '');
  const waUrl = `https://wa.me/${digits}?text=${encodeURIComponent(C.whatsappMessage)}`;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(COMPANY.mapQuery)}&z=13&output=embed&hl=${currentLanguage}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: C.h1,
    inLanguage: currentLanguage,
    url: `${DOMAIN}${localizePath(CONTACT_PATH, currentLanguage)}`,
    mainEntity: {
      '@type': 'LocalBusiness',
      name: COMPANY.brand,
      legalName: COMPANY.legalName,
      email: COMPANY.email,
      telephone: phone,
      address: BUSINESS_ADDRESS,
      openingHoursSpecification: OPENING_HOURS,
      contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer service', telephone: phone, email: COMPANY.email, availableLanguage: ['Spanish', 'English', 'French'] }],
      url: DOMAIN
    }
  };

  const card = 'bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-3';
  const btn = 'mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold transition-colors';

  return (
    <>
      <SEO title={C.metaTitle} description={C.description} url={CONTACT_PATH} schema={schema} />
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
        <nav className="text-sm text-gray-500 mb-6" aria-label={tr({ es: 'Migas de pan', en: 'Breadcrumb', fr: 'Fil d’Ariane' })}>
          <Link to="/" className="hover:text-brand-primary">{tr({ es: 'Inicio', en: 'Home', fr: 'Accueil' })}</Link> <span className="mx-1">/</span> <span>{C.h1}</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">{C.h1}</h1>
        <p className="text-lg text-gray-700 mb-10 max-w-2xl">{C.intro}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <div className={card}>
            <MessageCircle className="w-7 h-7 text-[#15803D]" aria-hidden="true" />
            <h2 className="text-xl font-bold text-gray-900">{C.whatsapp}</h2>
            <p className="text-gray-600 text-sm">{C.whatsappText}</p>
            <p className="font-semibold text-gray-900">{phone}</p>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#15803D] text-white hover:bg-[#166534]`}>
              <MessageCircle className="w-4 h-4" aria-hidden="true" /> {C.whatsappCta}
            </a>
          </div>
          <div className={card}>
            <Mail className="w-7 h-7 text-brand-primary" aria-hidden="true" />
            <h2 className="text-xl font-bold text-gray-900">{C.email}</h2>
            <p className="text-gray-600 text-sm">{C.emailText}</p>
            <p className="font-semibold text-gray-900 break-all">{COMPANY.email}</p>
            <a href={`mailto:${COMPANY.email}`} className={`${btn} bg-brand-primary text-white hover:opacity-90`}>
              <Mail className="w-4 h-4" aria-hidden="true" /> {COMPANY.email}
            </a>
          </div>
          <div className={card}>
            <ClipboardList className="w-7 h-7 text-brand-accent" aria-hidden="true" />
            <h2 className="text-xl font-bold text-gray-900">{C.quote}</h2>
            <p className="text-gray-600 text-sm">{C.quoteText}</p>
            <button type="button" onClick={openQuoteWizard} className={`${btn} bg-brand-accent text-white hover:opacity-90`}>
              <ClipboardList className="w-4 h-4" aria-hidden="true" /> {C.quoteCta}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <dl className="space-y-5">
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" aria-hidden="true" />
              <div><dt className="font-bold text-gray-900">{C.hours}</dt><dd className="text-gray-700">{C.hoursValue}</dd></div>
            </div>
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" aria-hidden="true" />
              <div><dt className="font-bold text-gray-900">{C.address}</dt><dd className="text-gray-700">{C.addressValue}</dd></div>
            </div>
            <div className="flex gap-3">
              <Languages className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" aria-hidden="true" />
              <div><dt className="font-bold text-gray-900">{C.languages}</dt><dd className="text-gray-700">{C.languagesValue}</dd></div>
            </div>
          </dl>
          <iframe
            title={C.mapTitle}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-64 md:h-full min-h-[16rem] rounded-2xl border border-gray-100"
          />
        </div>

        <section className="bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">{C.reviewsH2}</h2>
          <p className="text-gray-600 mb-6">{C.reviewsText}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={GOOGLE_WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-5 py-2.5 font-semibold text-gray-800 hover:border-brand-accent hover:text-brand-accent transition-colors">
              <Star className="w-4 h-4 fill-current text-[#FBBC04]" aria-hidden="true" /> {C.reviewGoogle}
            </a>
            <a href={tripadvisorUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-5 py-2.5 font-semibold text-gray-800 hover:border-brand-accent hover:text-brand-accent transition-colors">
              <Star className="w-4 h-4 fill-current text-[#00AA6C]" aria-hidden="true" /> {C.reviewTripadvisor}
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
