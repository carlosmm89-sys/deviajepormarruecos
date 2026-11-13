import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Destination, Tour, GalleryImage } from '../types';
import { MapPin, Clock, ArrowRight, Star, Sparkles, Heart, Users, Gem, Compass, ChevronDown, MessageCircle, Mail, Map as MapIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { dbService } from '../services/dbService';
import { BusinessSettings } from '../types';
import WidgetRenderer from '../components/WidgetRenderer';
import HeroSearch from '../components/HeroSearch';
import SEO from '../components/SEO';
import { usePageViews } from '../hooks/usePageViews';
import { useTranslation } from '../hooks/useTranslation';
import { useCurrency } from '../context/CurrencyContext';
import { tourPath, HOME_META_DESCRIPTION, HOME_TITLE } from '../data/seoContent';
import { optImg, optSrcSet } from '../lib/image';
import { getHomeContent, localizeReviewMeta, REVIEWS, REVIEW_TOTALS, TRIPADVISOR_URL, GOOGLE_REVIEWS_URL, GOOGLE_WRITE_REVIEW_URL } from '../data/homeContent';

const TRIP_ICONS: Record<string, React.ElementType> = { heart: Heart, family: Users, gem: Gem, compass: Compass, users: Users, sparkles: Sparkles };

const openQuoteWizard = () => window.dispatchEvent(new Event('open-quote-wizard'));

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [galleryPreview, setGalleryPreview] = useState<GalleryImage[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(() => ((typeof window !== 'undefined' && (window as any).__BIZ__) || null) as BusinessSettings | null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { t, tr, currentLanguage } = useTranslation();
  const { howItWorks: HOW_IT_WORKS, tripTypes: TRIP_TYPES, faqs: HOME_FAQS, priceNote: PRICE_NOTE } = getHomeContent(currentLanguage);
  // Textos de portada guardados en Ajustes (en español); en inglés y francés se usan estos.
  const heroTexts = currentLanguage === 'en'
    ? { subtitle: 'Tailor-made routes from Marrakech, Fez, Tangier and Casablanca, with a night in a tent in the Erg Chebbi dunes. Local agency based in Merzouga.', title: 'Private tours of Morocco and the Merzouga desert' }
    : currentLanguage === 'fr'
      ? { subtitle: 'Itinéraires sur mesure depuis Marrakech, Fès, Tanger et Casablanca, avec une nuit sous la tente dans les dunes de l’Erg Chebbi. Agence locale basée à Merzouga.', title: 'Circuits privés au Maroc et dans le désert de Merzouga' }
      : null;
  const { formatPrice } = useCurrency();

  usePageViews('home');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dests, tours, bizSettings, photos] = await Promise.all([
          dbService.getDestinations(),
          dbService.getTours(),
          dbService.getBusinessSettings(),
          dbService.getGalleryImages()
        ]);
        setDestinations(dests.slice(0, 4));
        setFeaturedTours(tours.slice(0, 3));
        setGalleryPreview(photos.slice(0, 5));
        if (bizSettings) setSettings(bizSettings);
      } catch (err) {
        console.error("Error loading home data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Foto de portada servida desde la propia web (la copia el build) mientras siga siendo la misma que en Supabase.
  const bootBiz = typeof window !== 'undefined' ? (window as any).__BIZ__ : null;
  const heroLocal = bootBiz?.hero_local_src && (!settings?.hero_image_url || settings.hero_image_url === bootBiz.hero_image_url) ? bootBiz : null;

  return (
    <div className="space-y-24 pb-24">
      <SEO 
        title={HOME_TITLE}
        description={settings?.hero_subtitle && settings.hero_subtitle.trim().length >= 90 ? settings.hero_subtitle : HOME_META_DESCRIPTION}
        url="/"
      />
      {/* Hero Section */}
      <section className="relative z-30 min-h-[85vh] py-16 md:py-24 flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden bg-brand-blue/20">
          <img
            src={heroLocal ? heroLocal.hero_local_src : optImg(settings?.hero_image_url || "https://images.unsplash.com/photo-1540202403-b712f0e01cb4?auto=format&fit=crop&q=60&w=800", 1600)}
            srcSet={heroLocal ? heroLocal.hero_local_srcset : optSrcSet(settings?.hero_image_url || "https://images.unsplash.com/photo-1540202403-b712f0e01cb4?auto=format&fit=crop&q=60&w=800")}
            sizes="100vw"
            alt={tr({ es: 'Desierto de Merzouga al atardecer', en: 'Merzouga desert at sunset', fr: 'Désert de Merzouga au coucher du soleil' })}
            className="w-full h-full object-cover scale-105"
            fetchPriority="high"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F9F8F6] to-transparent" />
        </div>

        <div className="relative z-20 max-w-5xl w-full mx-auto px-4 text-center space-y-4 md:space-y-6">
          {/* Sin animación de entrada: el texto de portada se pinta al instante (mejora el LCP en móvil) */}
          <div
            className="text-xs sm:text-sm md:text-base font-bold tracking-wider md:tracking-[0.15em] uppercase text-white/90 drop-shadow-md max-w-3xl mx-auto"
          >
            {heroTexts?.subtitle || settings?.hero_subtitle || 'EXCLUSIVIDAD EN EL MAGREB'}
          </div>
          <h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-serif font-bold leading-tight text-white drop-shadow-lg"
          >
            {heroTexts ? heroTexts.title : settings?.hero_title ? (
              <span dangerouslySetInnerHTML={{ __html: settings.hero_title.replace(/\n/g, '<br/>') }} />
            ) : (
              <>El Arte del<br/>Viaje Lento</>
            )}
          </h1>
          
          <div className="pt-8">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold">{t('home_featured_destinations')}</h2>
          </div>
          <Link to="/destinations" className="text-brand-accent font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            {t('btn_all_destinations')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="group relative h-96 rounded-3xl overflow-hidden bg-gray-200 animate-pulse border border-white/50 shadow-sm" />
            ))
          ) : destinations.length === 0 ? (
            <div className="col-span-full py-20 text-center space-y-6 border-2 border-dashed border-gray-100 rounded-3xl">
              <div className="space-y-2">
                <p className="text-gray-400">{tr({ es: 'No hay destinos disponibles aún.', en: 'No destinations available yet.', fr: 'Aucune destination disponible pour le moment.' })}</p>
              </div>
            </div>
          ) : (
            destinations.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer bg-gray-100"
              >
                <Link to={`/destinations/${dest.slug || dest.id}`}>
                  <img
                    src={optImg(dest.image_url, 800)}
                    srcSet={optSrcSet(dest.image_url, [400, 640, 800])}
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white text-left">
                    <h3 className="text-2xl font-serif font-bold group-hover:-translate-y-1 transition-transform">{dest.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Featured Tours */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold">{t('home_featured_tours')}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm h-[500px] animate-pulse flex flex-col">
                <div className="h-64 bg-gray-200 w-full" />
                <div className="p-8 space-y-4 flex-1 bg-gray-50/50">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-8 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : featuredTours.length === 0 ? (
            <div className="col-span-full py-20 text-center space-y-6 border-2 border-dashed border-gray-100 rounded-3xl">
              <p className="text-gray-400">{tr({ es: 'No hay tours destacados aún.', en: 'No featured tours yet.', fr: 'Aucun circuit mis en avant pour le moment.' })}</p>
            </div>
          ) : (
            featuredTours.map((tour, idx) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all"
              >
                <Link to={tourPath(tour)}>
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={optImg(tour.featured_image || tour.gallery?.[0] || 'https://picsum.photos/seed/tour/800/600', 800)}
                      srcSet={optSrcSet(tour.featured_image || tour.gallery?.[0], [400, 640, 800])}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      alt={tour.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-brand-primary font-bold shadow-sm">
                      {t('tour_price_from')} {formatPrice(tour.price)}
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-2 text-brand-accent text-sm font-bold uppercase tracking-widest">
                      <MapPin className="w-4 h-4" />
                      <span>{(tour as any).destinations?.name || tr({ es: 'Destino', en: 'Destination', fr: 'Destination' })}</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold group-hover:text-brand-primary transition-colors">{tour.title}</h3>
                    <div className="flex items-center gap-6 text-gray-500 text-sm flex-wrap">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{tour.itinerary_summary || tour.duration || tr({ es: 'Varios días', en: 'Several days', fr: 'Plusieurs jours' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#F6B100] fill-[#F6B100]" />
                        <span className="font-bold text-gray-900">5,0</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
        <p className="text-sm text-gray-500 text-center">{PRICE_NOTE}</p>
      </section>

      {/* Cómo funciona */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-2">
          <p className="text-brand-accent text-sm font-bold uppercase tracking-widest">{tr({ es: 'Cómo funciona', en: 'How it works', fr: 'Comment ça marche' })}</p>
          <h2 className="text-4xl font-serif font-bold">{tr({ es: 'Tu viaje en 4 pasos', en: 'Your trip in 4 steps', fr: 'Votre voyage en 4 étapes' })}</h2>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step, idx) => (
            <li key={step.title} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary text-white font-bold">{idx + 1}</span>
              <h3 className="text-xl font-serif font-bold">{step.title}</h3>
              <p className="text-gray-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Viajes para cada ocasión */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-2">
          <p className="text-brand-accent text-sm font-bold uppercase tracking-widest">{tr({ es: 'Experiencias a tu medida', en: 'Tailor-made experiences', fr: 'Expériences sur mesure' })}</p>
          <h2 className="text-4xl font-serif font-bold">{tr({ es: 'Viajes para cada ocasión', en: 'Trips for every occasion', fr: 'Des voyages pour chaque occasion' })}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRIP_TYPES.map(type => {
            const Icon = TRIP_ICONS[type.icon] || Sparkles;
            return (
              <Link key={type.slug} to={`/coleccion/${type.slug}`} className="group flex gap-5 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all p-8">
                <Icon className="w-8 h-8 shrink-0 text-brand-accent" />
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold group-hover:text-brand-primary transition-colors">{type.title}</h3>
                  <p className="text-gray-600">{type.text}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="text-center">
          <button onClick={openQuoteWizard} className="inline-flex items-center gap-2 btn-primary">
            {tr({ es: 'Diseña tu viaje a medida', en: 'Design your tailor-made trip', fr: 'Créez votre voyage sur mesure' })} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Gallery Mini Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl text-brand-secondary font-serif font-bold">{tr({ es: 'Marruecos en Imágenes', en: 'Morocco in pictures', fr: 'Le Maroc en images' })}</h2>
            <p className="text-gray-600 mt-2">{tr({ es: 'La esencia de nuestro país capturada en cada viaje', en: 'The essence of our country captured on every trip', fr: 'L’essence de notre pays capturée à chaque voyage' })}</p>
          </div>
          <Link to="/galeria" className="hidden md:flex items-center gap-2 text-brand-primary font-bold hover:text-brand-accent transition-colors pb-2">
            {tr({ es: 'Ver todas', en: 'View all', fr: 'Tout voir' })} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]" aria-hidden="true">
            {Array(5).fill(0).map((_, idx) => (
              <div key={idx} className={`rounded-2xl md:rounded-[2rem] bg-gray-200 animate-pulse ${idx === 0 ? 'col-span-2 row-span-2' : ''}`} />
            ))}
          </div>
        ) : galleryPreview.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {galleryPreview.map((img, idx) => (
              <Link 
                key={img.id} 
                to="/galeria"
                className={`relative group overflow-hidden rounded-2xl md:rounded-[2rem] bg-gray-100 block ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}
              >
                <img 
                  src={optImg(img.image_url, 600)}
                  srcSet={optSrcSet(img.image_url, idx === 0 ? [480, 800, 1200] : [320, 480, 600])}
                  sizes={idx === 0 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'}
                  alt={img.title || tr({ es: 'Galería de Marruecos', en: 'Morocco gallery', fr: 'Galerie du Maroc' })} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  {img.title && <h3 className="text-white font-serif font-bold text-xl">{img.title}</h3>}
                  {img.category && <p className="text-brand-primary uppercase text-xs font-bold tracking-wider mt-1">{img.category}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full h-[400px] border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center">
             <p className="text-gray-500 font-medium">{tr({ es: 'Próximamente nuestra gran galería fotográfica.', en: 'Our photo gallery is coming soon.', fr: 'Notre galerie photo arrive bientôt.' })}</p>
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/galeria" className="inline-flex items-center gap-2 text-[#9a4d1c] font-bold">
            {tr({ es: 'Ver todas las fotos', en: 'View all photos', fr: 'Voir toutes les photos' })} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Google Reviews Widget */}
      {settings?.google_reviews_widget && (
        <section className="max-w-7xl mx-auto px-4 py-12">
           <WidgetRenderer html={settings.google_reviews_widget} />
        </section>
      )}

      {/* Instagram Widget */}
      {settings?.instagram_widget && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
             <h2 className="text-4xl font-serif font-bold">{tr({ es: 'Síguenos en Instagram', en: 'Follow us on Instagram', fr: 'Suivez-nous sur Instagram' })}</h2>
          </div>
          <WidgetRenderer html={settings.instagram_widget} />
        </section>
      )}

      {/* Opiniones de viajeros (Tripadvisor y Google) */}
      {REVIEWS.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-4">
            <p className="text-brand-accent text-sm font-bold uppercase tracking-widest">{tr({ es: 'Opiniones', en: 'Reviews', fr: 'Avis' })}</p>
            <h2 className="text-4xl font-serif font-bold">{tr({ es: 'Lo que dicen nuestros viajeros', en: 'What our travellers say', fr: 'Ce que disent nos voyageurs' })}</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={TRIPADVISOR_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-full px-5 py-3 hover:shadow-md transition-shadow">
                <span className="flex">{Array(5).fill(0).map((_, i) => <span key={i} className="w-3.5 h-3.5 rounded-full bg-[#00AA6C] mr-0.5" />)}</span>
                <span className="font-bold text-gray-900">{REVIEW_TOTALS.tripadvisor.rating}</span>
                <span className="text-gray-600">· {REVIEW_TOTALS.tripadvisor.count} {tr({ es: 'opiniones en Tripadvisor', en: 'reviews on Tripadvisor', fr: 'avis sur Tripadvisor' })}</span>
              </a>
              <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-full px-5 py-3 hover:shadow-md transition-shadow">
                <span className="flex">{Array(5).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 text-[#F6B100] fill-[#F6B100]" />)}</span>
                <span className="font-bold text-gray-900">{REVIEW_TOTALS.google.rating}</span>
                <span className="text-gray-600">· {REVIEW_TOTALS.google.count} {tr({ es: 'en Google', en: 'on Google', fr: 'sur Google' })}</span>
              </a>
            </div>
            <p className="text-sm font-bold text-[#00AA6C]">🏆 Tripadvisor {REVIEW_TOTALS.tripadvisor.award}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((review, idx) => (
              <figure key={idx} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-7 flex flex-col gap-4">
                <div className="flex" aria-label={tr({ es: '5 de 5', en: '5 out of 5', fr: '5 sur 5' })}>
                  {review.source === 'tripadvisor'
                    ? Array(5).fill(0).map((_, i) => <span key={i} className="w-3.5 h-3.5 rounded-full bg-[#00AA6C] mr-0.5" />)
                    : Array(5).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 text-[#F6B100] fill-[#F6B100]" />)}
                </div>
                <blockquote className="text-gray-700 leading-relaxed flex-1">“{review.text}”</blockquote>
                <figcaption className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <span className="inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-brand-primary/10 text-brand-primary font-bold uppercase">{review.author.charAt(0)}</span>
                  <span>
                    <span className="block font-bold text-gray-900">{review.author}</span>
                    <span className="block text-sm text-gray-500">
                      {localizeReviewMeta(review, currentLanguage).date}{review.trip ? ` · ${localizeReviewMeta(review, currentLanguage).trip}` : ''} · {review.source === 'tripadvisor' ? 'Tripadvisor' : 'Google'}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-bold">
            <a href={TRIPADVISOR_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-accent">
              {tr({ es: 'Ver las', en: 'See all', fr: 'Voir les' })} {REVIEW_TOTALS.tripadvisor.count} {tr({ es: 'opiniones en Tripadvisor', en: 'reviews on Tripadvisor', fr: 'avis sur Tripadvisor' })} <ArrowRight className="w-4 h-4" />
            </a>
            <a href={GOOGLE_WRITE_REVIEW_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-accent">
              {tr({ es: '¿Viajaste con nosotros? Deja tu opinión en Google', en: 'Travelled with us? Leave your review on Google', fr: 'Vous avez voyagé avec nous ? Laissez votre avis sur Google' })}
            </a>
          </div>
        </section>
      )}

      {/* Preguntas frecuentes */}
      <section className="max-w-4xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2">
          <p className="text-brand-accent text-sm font-bold uppercase tracking-widest">{tr({ es: 'Preguntas frecuentes', en: 'FAQ', fr: 'Questions fréquentes' })}</p>
          <h2 className="text-4xl font-serif font-bold">{tr({ es: 'Lo que más nos preguntan', en: 'What people ask us most', fr: 'Ce que l’on nous demande le plus' })}</h2>
        </div>
        <div className="space-y-4">
          {HOME_FAQS.map(faq => (
            <details key={faq.q} className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <summary className="flex justify-between items-center gap-4 cursor-pointer list-none font-bold text-lg">
                {faq.q}
                <ChevronDown className="w-5 h-5 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-[3rem] p-12 md:p-24 text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
            <img 
              src={optImg("https://images.unsplash.com/photo-1539020140153-e479b8c22e70", 1200, 55)}
              srcSet={optSrcSet("https://images.unsplash.com/photo-1539020140153-e479b8c22e70", [640, 960, 1200], 55)}
              sizes="100vw"
              alt={tr({ es: 'Desierto de Marruecos', en: 'Moroccan desert', fr: 'Désert marocain' })} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
              {tr({ es: '¿Listo para tu próxima aventura?', en: 'Ready for your next adventure?', fr: 'Prêt pour votre prochaine aventure ?' })}
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 font-light mx-auto">
              {tr({ es: 'Cuéntanos tu idea y te enviamos una propuesta personalizada sin compromiso.', en: 'Tell us your idea and we will send you a personalised, no-obligation proposal.', fr: 'Racontez-nous votre idée et nous vous enverrons une proposition personnalisée sans engagement.' })}
            </p>
            <div className="pt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
              <Link 
                to="/tours" 
                className="inline-flex items-center gap-3 bg-brand-accent hover:bg-white text-white hover:text-brand-accent px-10 py-5 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_rgba(235,102,43,0.4)]"
              >
                {tr({ es: 'Ver tours', en: 'See tours', fr: 'Voir les circuits' })} <ArrowRight className="w-6 h-6" />
              </Link>
              <button
                onClick={openQuoteWizard}
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white backdrop-blur-md border border-white/40 text-white hover:text-brand-accent px-8 py-5 rounded-full text-lg font-bold transition-all duration-300"
              >
                <MapIcon className="w-5 h-5" /> {tr({ es: 'Pedir presupuesto', en: 'Get a quote', fr: 'Demander un devis' })}
              </button>
              {settings?.whatsapp_number && (
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-white text-white hover:text-[#128C7E] px-8 py-5 rounded-full text-lg font-bold transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </a>
              )}
              <a
                href="mailto:info@vivirmarruecos.com"
                className="inline-flex items-center gap-3 text-white/90 hover:text-white underline-offset-4 hover:underline text-lg font-bold"
              >
                <Mail className="w-5 h-5" /> info@vivirmarruecos.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
