import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Tour, Destination, BlogPost, BusinessSettings } from '../types';
import { 
  Clock, MapPin, 
  ArrowLeft, Home, BookOpen, ShieldCheck, Map as MapIcon, Image as ImageIcon,
  ChevronDown, ChevronUp, CheckCircle2, PlusSquare, HelpCircle, Star, Share, Heart, Calendar, User, ArrowRight
} from 'lucide-react';
import TourRouteMap from '../components/TourRouteMap';
import { dbService } from '../services/dbService';
import ImageGalleryModal from '../components/ImageGalleryModal';
import ReviewsModal from '../components/ReviewsModal';
import { useWishlist } from '../hooks/useWishlist';
import { usePageViews } from '../hooks/usePageViews';
import { useCurrency } from '../context/CurrencyContext';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTranslation } from '../hooks/useTranslation';
import { categoryLabel } from '../i18n/labels';
import { REVIEW_TOTALS } from '../data/homeContent';
import { tourPath, tourMetaDescription } from '../data/seoContent';
import { optImg } from '../lib/image';

const FAQItem = ({ question, answer }: { question: string, answer: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-100 bg-white rounded-2xl overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-5 md:p-6 text-left font-bold text-gray-900 focus:outline-none hover:bg-gray-50/50 transition-colors"
      >
        <span className="pr-4">{question}</span>
        <span className={`flex-shrink-0 transform transition-transform duration-300 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 ${isOpen ? 'rotate-180 bg-brand-primary text-white' : 'text-gray-500'}`}>
           {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>
      <div className={`px-5 md:px-6 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="text-gray-600 text-sm leading-relaxed">{answer}</div>
      </div>
    </div>
  );
};

export default function TourDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [relatedTours, setRelatedTours] = useState<Tour[]>([]);
  // Fotos de otros tours para rellenar la galería si este tour tiene menos de 5 fotos propias
  const [fillerImages, setFillerImages] = useState<string[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('descripcion');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [dateArrival, setDateArrival] = useState(() => {
    try {
      const saved = localStorage.getItem('search_dates');
      return saved ? JSON.parse(saved).startDate || '' : '';
    } catch { return ''; }
  });
  const [dateDeparture, setDateDeparture] = useState(() => {
    try {
      const saved = localStorage.getItem('search_dates');
      return saved ? JSON.parse(saved).endDate || '' : '';
    } catch { return ''; }
  });
  
  const { isFavorite, toggleFavorite } = useWishlist();
  const { formatPrice } = useCurrency();
  const { td, tr, currentLanguage } = useTranslation();
  
  usePageViews('tour', tour?.id);

  const descripcionRef = useRef<HTMLDivElement>(null);
  const itinerarioRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bs = await dbService.getBusinessSettings();
        if (bs) setSettings(bs);

        if (id) {
          const t = await dbService.getTour(id);
          setTour(t);
          // Las URLs antiguas con ID (/tours/<uuid>) redirigen a la URL con slug
          if (t?.slug && id !== t.slug && /^[0-9a-f-]{36}$/i.test(id)) {
            navigate(`/tours/${t.slug}`, { replace: true });
          }

          const allTours = await dbService.getTours();
          const rt = allTours.filter(x => x.id !== t.id && x.is_active && x.category === t.category);
          setRelatedTours(rt.sort(() => 0.5 - Math.random()).slice(0, 3));
          setFillerImages(
            allTours
              .filter(x => x.id !== t.id && x.is_active)
              .flatMap(x => [x.featured_image, ...(x.gallery || [])])
              .filter((u): u is string => !!u && !u.includes('loremflickr'))
          );
          
          const posts = await dbService.getBlogPosts();
          const rel = posts.filter(p => p.category !== 'Actividades').sort(() => 0.5 - Math.random());
          setRelatedPosts(rel.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>, tab: string) => {
    setActiveTab(tab);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Galería: foto principal + fotos propias del tour (sin repetir); si faltan, se rellenan con fotos reales de otros tours.
  // (Antes se usaba loremflickr.com como relleno, pero ese servicio ya no sirve fotos y salían cuadros grises.)
  const fullGallery: string[] = (() => {
    if (!tour) return [];
    const own = [tour.featured_image, ...(tour.gallery || [])].filter((u): u is string => !!u && !u.includes('loremflickr'));
    const unique = Array.from(new Set(own));
    for (const u of fillerImages) {
      if (unique.length >= 5) break;
      if (!unique.includes(u)) unique.push(u);
    }
    return unique;
  })();

  // Si la versión optimizada de una foto falla, se carga la original; si también falla, se oculta.
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>, original?: string) => {
    const img = e.currentTarget;
    if (original && img.dataset.fallback !== '1' && img.src !== original) {
      img.dataset.fallback = '1';
      img.src = original;
    } else {
      img.style.visibility = 'hidden';
    }
  };

  const openGallery = (idx: number) => {
    setGalleryIndex(idx);
    setIsGalleryOpen(true);
  };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tour) {
      toast.error(tr({ es: 'Error al cargar el tour. Reintenta.', en: 'Error loading the tour. Please try again.', fr: 'Erreur de chargement du circuit. Réessayez.' }));
      return;
    }
    setSubmitting(true);
    const form = e.currentTarget;
    try {
      const activeSettings = settings || await dbService.getBusinessSettings();
      const px = parseInt(form.adults.value || '1', 10);
      const niños = parseInt(form.children?.value || '0', 10);
      const bebes = parseInt(form.infants?.value || '0', 10);
      const pxTotal = px + niños;
      const paxDetails = `Adultos: ${px}, Niños: ${niños}, Bebés: ${bebes}`;
      
      const newLead = {
        tour_id: tour.id,
        form_type: 'tour_inquiry',
        first_name: form.first_name.value,
        email: form.contact_email.value,
        phone: form.phone.value || '',
        approximate_date: dateArrival || new Date().toISOString().split('T')[0],
        passengers_count: pxTotal,
        message: `[Llegada: ${dateArrival}, Salida: ${dateDeparture}]\n[Familia: ${paxDetails}]\n\nMensaje:\n${form.message.value}`,
        status: 'new' as const
      };

      await dbService.createLead(newLead);

      // Trigger Email
      if (activeSettings) {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lead: newLead, settings: activeSettings, tour_title: tour.title })
        }).catch(err => console.error('SMTP fetch fail:', err));
      }

      toast.success(tr({ es: '¡Consulta enviada! Nos pondremos en contacto contigo pronto.', en: 'Request sent! We will get back to you soon.', fr: 'Demande envoyée ! Nous vous contacterons bientôt.' }));
      form.reset();
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      toast.error(tr({ es: 'Hubo un problema. Inténtalo de nuevo.', en: 'Something went wrong. Please try again.', fr: 'Un problème est survenu. Réessayez.' }));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">{tr({ es: 'Tour no encontrado', en: 'Tour not found', fr: 'Circuit introuvable' })}</h2>
        <Link to="/" className="btn-primary">{tr({ es: 'Volver al inicio', en: 'Back to home', fr: 'Retour à l’accueil' })}</Link>
      </div>
    );
  }

  const tourSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": td(tour, 'title'),
    "image": tour.featured_image || tour.gallery?.[0] || 'https://www.vivirmarruecos.com/pwa-512x512.png',
    "description": td(tour, 'description'),
    "touristType": "Sightseeing",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": tour.price || 0,
      "availability": "https://schema.org/InStock",
      "url": `https://www.vivirmarruecos.com${tourPath(tour)}`
    },
    "provider": {
      "@type": "TravelAgency",
      "name": settings?.site_name || "Vivir Marruecos",
      "image": settings?.logo_url || 'https://www.vivirmarruecos.com/pwa-512x512.png'
    }
  };

  return (
    <div className="pb-24 bg-gray-50/30">
      <SEO 
        title={`${td(tour, 'title')} | Vivir Marruecos`}
        description={tourMetaDescription({ ...tour, title: td(tour, 'title'), itinerary_summary: td(tour, 'itinerary_summary') })}
        image={tour.featured_image || tour.gallery?.[0]}
        url={tourPath(tour)}
        type="product"
        schema={tourSchema}
      />
      <Toaster position="top-right" />
      <ReviewsModal isOpen={isReviewsOpen} onClose={() => setIsReviewsOpen(false)} />
      <ImageGalleryModal 
        isOpen={isGalleryOpen}
        images={fullGallery}
        initialIndex={galleryIndex}
        onClose={() => setIsGalleryOpen(false)}
      />

      <section className="max-w-[1600px] mx-auto p-2 md:p-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 md:gap-3 h-[40vh] md:h-[65vh] rounded-3xl overflow-hidden relative group">
          <div className="md:col-span-2 row-span-2 relative cursor-pointer overflow-hidden" onClick={() => openGallery(0)}>
            <img src={optImg(fullGallery[0], 1400)} onError={(e) => handleImgError(e, fullGallery[0])} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Principal" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-300" />
          </div>
          
          <div className="hidden md:block col-span-1 row-span-1 relative cursor-pointer overflow-hidden" onClick={() => openGallery(1)}>
            <img src={optImg(fullGallery[1], 800)} onError={(e) => handleImgError(e, fullGallery[1])} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Gallery 1" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-300" />
          </div>

          <div className="hidden md:block col-span-1 row-span-1 relative cursor-pointer overflow-hidden" onClick={() => openGallery(2)}>
            <img src={optImg(fullGallery[2], 800)} onError={(e) => handleImgError(e, fullGallery[2])} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Gallery 2" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-300" />
          </div>

          <div className="hidden md:block col-span-1 row-span-1 relative cursor-pointer overflow-hidden" onClick={() => openGallery(3)}>
            <img src={optImg(fullGallery[3], 800)} onError={(e) => handleImgError(e, fullGallery[3])} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Gallery 3" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-300" />
          </div>

          <div className="hidden md:block col-span-1 row-span-1 relative cursor-pointer overflow-hidden" onClick={() => openGallery(4)}>
            <img src={optImg(fullGallery[4], 800)} onError={(e) => handleImgError(e, fullGallery[4])} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Gallery 4" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-300" />
          </div>

          <button 
            onClick={() => openGallery(0)}
            className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white/95 backdrop-blur-sm border border-gray-200 text-gray-900 text-sm font-bold px-4 py-2.5 md:px-5 md:py-3 rounded-xl shadow-lg hover:bg-white hover:scale-105 transition-all flex items-center gap-2 z-10"
          >
            <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">{tr({ es: 'Ver todas las fotos', en: 'View all photos', fr: 'Voir toutes les photos' })}</span>
          </button>
        </div>
      </section>

      {/* Sticky Nav */}
      <div className="sticky top-[88px] md:top-[96px] z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all -mx-4 px-4 md:mx-0 md:px-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto no-scrollbar py-4">
            {['Descripción', 'Itinerario', 'Mapa'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  const tabLower = tab.toLowerCase();
                  if (tabLower === 'descripción') scrollToSection(descripcionRef, tabLower);
                  if (tabLower === 'itinerario') scrollToSection(itinerarioRef, tabLower);
                  if (tabLower === 'mapa') scrollToSection(mapaRef, tabLower);
                }}
                className={`text-sm font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab.toLowerCase() ? 'text-brand-accent border-b-2 border-brand-accent pb-1' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab === 'Descripción' ? tr({ es: 'Descripción', en: 'Description', fr: 'Description' }) : tab === 'Itinerario' ? tr({ es: 'Itinerario', en: 'Itinerary', fr: 'Itinéraire' }) : tr({ es: 'Mapa', en: 'Map', fr: 'Carte' })}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-16 min-w-0">
          <div className="space-y-8">
            <Breadcrumbs 
              items={[
                { label: 'Tours', url: '/tours' },
                { label: td(tour, 'title') }
              ]} 
            />

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight text-gray-900 mb-4">{td(tour, 'title')}</h1>
                <div className="flex items-center gap-2 text-gray-900 mb-6 md:mb-0">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold">5,0</span>
                  <span className="text-gray-300">·</span>
                  <button onClick={() => setIsReviewsOpen(true)} className="underline font-medium hover:text-brand-accent transition-colors">
                    {REVIEW_TOTALS.tripadvisor.count} {tr({ es: 'opiniones', en: 'reviews', fr: 'avis' })}
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-4 pb-2 shrink-0">
                <div className="text-left md:text-right">
                  <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">{tr({ es: 'Precio desde', en: 'Price from', fr: 'Prix à partir de' })}</div>
                  <div className="text-4xl font-black text-brand-primary">{formatPrice(tour.price)}</div>
                </div>
                <div className="flex items-center gap-6 mt-2">
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: tour.title,
                          url: window.location.href
                        }).catch(console.error);
                      }
                    }}
                    className="flex items-center gap-2 font-medium underline text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <Share className="w-4 h-4" /> {tr({ es: 'Comparte', en: 'Share', fr: 'Partager' })}
                  </button>
                  <button 
                    onClick={() => toggleFavorite(tour.id)}
                    className={`flex items-center gap-2 font-medium underline transition-colors ${
                      isFavorite(tour.id) ? 'text-red-500 hover:text-red-600' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite(tour.id) ? 'fill-current' : ''}`} /> 
                    {isFavorite(tour.id) ? tr({ es: 'Guardado', en: 'Saved', fr: 'Enregistré' }) : tr({ es: 'Guarda', en: 'Save', fr: 'Enregistrer' })}
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 font-medium bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full hover:bg-brand-primary hover:text-white transition-colors ml-2 print:hidden"
                  >
                    <BookOpen className="w-4 h-4" /> {tr({ es: 'Guardar PDF', en: 'Save PDF', fr: 'Enregistrer en PDF' })}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-8 border-y border-gray-100">
              {/* Duración */}
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{tr({ es: 'Duración', en: 'Duration', fr: 'Durée' })}</span>
                  <span className="text-sm font-medium text-gray-900">{tour.itinerary_summary}</span>
                </div>
              </div>
              
              {/* Salida */}
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-brand-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{tr({ es: 'Salida', en: 'Departure', fr: 'Départ' })}</span>
                  <span className="text-sm font-medium text-gray-900">{tour.departure_city} {tour.departure_time ? `• ${tour.departure_time}` : ''}</span>
                </div>
              </div>

              {/* Regreso (Optional) */}
              {tour.return_city && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-brand-accent shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{tr({ es: 'Regreso', en: 'Return', fr: 'Retour' })}</span>
                    <span className="text-sm font-medium text-gray-900">{tour.return_city} {tour.return_time ? `• ${tour.return_time}` : ''}</span>
                  </div>
                </div>
              )}

              {/* Destino */}
              <div className="flex items-center gap-3">
                <MapIcon className="w-5 h-5 text-brand-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{tr({ es: 'Destino', en: 'Destination', fr: 'Destination' })}</span>
                  <span className="text-sm font-medium text-gray-900">{(tour as any).destinations?.name}</span>
                </div>
              </div>
            </div>
          </div>

          <div ref={descripcionRef} className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-brand-accent rounded-full" />
              <h2 className="text-3xl font-bold text-gray-900">{tr({ es: 'Incluye / Excluye', en: 'Included / Not included', fr: 'Inclus / Non inclus' })}</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-green-50 p-6 md:p-8 rounded-3xl border border-green-100 min-w-0">
                <h3 className="font-bold text-green-900 mb-4">{tr({ es: 'Incluido', en: 'Included', fr: 'Inclus' })}</h3>
                <div 
                  className="prose prose-sm prose-green max-w-none text-green-800 break-words w-full overflow-wrap-anywhere [&_p]:whitespace-normal [&_p]:relative [&_p]:pl-5 [&_p]:before:content-['•'] [&_p]:before:absolute [&_p]:before:left-1 [&_p]:before:font-bold [&_li]:relative [&_li]:pl-5 [&_li]:before:content-['•'] [&_li]:before:absolute [&_li]:before:left-1 [&_li]:before:font-bold [&_ul]:pl-0 [&_ul]:list-none"
                  dangerouslySetInnerHTML={{ __html: tour.description_includes || '' }}
                />
              </div>
              <div className="bg-red-50 p-6 md:p-8 rounded-3xl border border-red-100 min-w-0 mt-2">
                <h3 className="font-bold text-red-900 mb-4">{tr({ es: 'No incluido', en: 'Not included', fr: 'Non inclus' })}</h3>
                <div 
                  className="prose prose-sm prose-red max-w-none text-red-800 break-words w-full overflow-wrap-anywhere [&_p]:whitespace-normal [&_p]:relative [&_p]:pl-5 [&_p]:before:content-['•'] [&_p]:before:absolute [&_p]:before:left-1 [&_p]:before:font-bold [&_li]:relative [&_li]:pl-5 [&_li]:before:content-['•'] [&_li]:before:absolute [&_li]:before:left-1 [&_li]:before:font-bold [&_ul]:pl-0 [&_ul]:list-none"
                  dangerouslySetInnerHTML={{ __html: tour.description_excludes || '' }}
                />
              </div>
            </div>
          </div>
          
          {tour.recommendations && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-brand-accent rounded-full" />
                <h2 className="text-3xl font-bold text-gray-900">{tr({ es: 'Recomendaciones Especiales', en: 'Recommendations', fr: 'Recommandations' })}</h2>
              </div>
              <div 
                className="bg-white p-6 rounded-3xl border border-gray-100 prose prose-sm max-w-none text-gray-600 break-words w-full overflow-hidden [&_p]:whitespace-normal"
                dangerouslySetInnerHTML={{ __html: tour.recommendations }}
              />
            </div>
          )}

          <div ref={itinerarioRef} className="space-y-12">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-brand-accent rounded-full" />
              <h2 className="text-3xl font-bold text-gray-900">{tr({ es: 'Itinerario', en: 'Itinerary', fr: 'Itinéraire' })}: {tour.title}</h2>
            </div>
            <div 
              className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 prose prose-sm max-w-none leading-relaxed text-gray-700 break-words w-full overflow-hidden [&_p]:whitespace-normal"
              dangerouslySetInnerHTML={{ __html: tour.itinerary_details || '' }}
            />
          </div>

          <div ref={mapaRef} className="border-t border-gray-100 pt-12 space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <MapPin className="w-8 h-8 text-gray-900" />
              <h2 className="text-3xl font-bold text-gray-900">{tr({ es: 'Mapa del Itinerario', en: 'Itinerary map', fr: 'Carte de l’itinéraire' })}</h2>
            </div>
            {(tour.itinerary_details || tour.departure_city || tour.return_city) ? (
              <TourRouteMap itineraryHtml={tour.itinerary_details} departureCity={tour.departure_city} returnCity={tour.return_city} />
            ) : tour.map_iframe ? (
              <div className="w-full aspect-video rounded-3xl overflow-hidden border border-gray-100 shadow-sm [&>iframe]:w-full [&>iframe]:h-full"
                   dangerouslySetInnerHTML={{ __html: tour.map_iframe }} 
              />
            ) : null}
          </div>

          <div className="border-t border-gray-100 pt-12 space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <PlusSquare className="w-8 h-8 text-gray-900" />
              <h2 className="text-3xl font-bold text-gray-900">{tr({ es: 'Experiencias Adicionales', en: 'Optional experiences', fr: 'Expériences en option' })}</h2>
            </div>
            <p className="text-gray-500 italic mb-8">{tr({ es: 'Pregunte a nuestro departamento de reservas por el suplemento antes de comenzar el tour.', en: 'Ask our booking team about the supplement before the tour starts.', fr: 'Renseignez-vous auprès de notre service réservations sur le supplément avant le début du circuit.' })}</p>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{tr({ es: 'Paseo en globo en Marrakech:', en: 'Hot-air balloon ride in Marrakech:', fr: 'Vol en montgolfière à Marrakech :' })}</h4>
                  <p className="text-gray-500 text-sm mt-1">{tr({ es: 'Una actividad recomendada para los visitantes de Marrakech, este recorrido por la mañana le lleva sobre las estribaciones de las Montañas al amanecer.', en: 'A recommended activity for visitors to Marrakech: this morning flight takes you over the foothills of the mountains at sunrise.', fr: 'Une activité recommandée à Marrakech : ce vol matinal vous emmène au-dessus des contreforts des montagnes au lever du soleil.' })}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{tr({ es: 'Cena romántica en el desierto:', en: 'Romantic dinner in the desert:', fr: 'Dîner romantique dans le désert :' })}</h4>
                  <p className="text-gray-500 text-sm mt-1">{tr({ es: 'Disfruta de una cena en la intimidad al aire libre en pleno desierto a la luz de las velas y el cielo estrellado.', en: 'Enjoy a private outdoor dinner in the heart of the desert by candlelight under a starry sky.', fr: 'Profitez d’un dîner intime en plein air au cœur du désert, à la lueur des bougies sous un ciel étoilé.' })}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{tr({ es: 'Tour en Quad o buggy en el desierto:', en: 'Quad or buggy ride in the desert:', fr: 'Balade en quad ou buggy dans le désert :' })}</h4>
                  <p className="text-gray-500 text-sm mt-1">{tr({ es: 'Si lo desean en el desierto le podemos organizar un paseo en Quad o Buggy para ver el atardecer desde las dunas.', en: 'If you wish, we can arrange a quad or buggy ride in the desert to watch the sunset from the dunes.', fr: 'Si vous le souhaitez, nous pouvons organiser une balade en quad ou buggy pour admirer le coucher du soleil depuis les dunes.' })}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-12 space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-8 h-8 text-gray-900" />
              <h2 className="text-3xl font-bold text-gray-900">{tr({ es: 'Preguntas frecuentes', en: 'FAQ', fr: 'Questions fréquentes' })}</h2>
            </div>
            
            <div className="space-y-4">
              <FAQItem 
                question={tr({ es: '¿Cómo puedo reservar el tour?', en: 'How can I book the tour?', fr: 'Comment réserver le circuit ?' })} 
                answer={tr({ es: 'Para reservar el tour tienes que elegir la fecha deseada y completar el formulario de esta página. La confirmación se recibirá cuando se realice la reserva.', en: 'To book the tour, choose your dates and fill in the form on this page. You will receive confirmation once the booking is made.', fr: 'Pour réserver le circuit, choisissez vos dates et remplissez le formulaire de cette page. Vous recevrez la confirmation une fois la réservation effectuée.' })} 
              />
              <FAQItem 
                question={tr({ es: '¿Qué tipo de vehículos se utilizan?', en: 'What kind of vehicles do you use?', fr: 'Quels véhicules utilisez-vous ?' })} 
                answer={<>{tr({ es: 'Utilizamos vehículos todoterreno o microbuses para parejas, amigos o familia de 2 hasta 6 personas. A partir de 7 personas minibuses.', en: 'We use 4x4 vehicles or minivans for couples, friends or families of 2 to 6 people, and minibuses from 7 people.', fr: 'Nous utilisons des 4x4 ou des minivans pour les couples, amis ou familles de 2 à 6 personnes, et des minibus à partir de 7 personnes.' })}<br/><br/>{tr({ es: 'En la excursión en el desierto utilizamos todoterreno 4X4.', en: 'For the desert excursion we use 4x4 vehicles.', fr: 'Pour l’excursion dans le désert, nous utilisons des 4x4.' })}<br/><br/>{tr({ es: 'Todos nuestros vehículos son modernos y con aire acondicionado.', en: 'All our vehicles are modern and air-conditioned.', fr: 'Tous nos véhicules sont modernes et climatisés.' })}</>} 
              />
              <FAQItem 
                question={tr({ es: '¿Cuáles son las políticas de cancelación y reembolso?', en: 'What are the cancellation and refund policies?', fr: 'Quelles sont les conditions d’annulation et de remboursement ?' })} 
                answer={<><ul className="space-y-2"><li><b>{tr({ es: 'Temporada baja:', en: 'Low season:', fr: 'Basse saison :' })}</b> {tr({ es: 'Gratis hasta 7 días antes de su llegada.', en: 'Free up to 7 days before arrival.', fr: 'Gratuite jusqu’à 7 jours avant l’arrivée.' })}</li><li><b>{tr({ es: 'Temporada media:', en: 'Mid season:', fr: 'Moyenne saison :' })}</b> {tr({ es: '(Puentes, septiembre, octubre, marzo, abril y mayo): Gratis 15 días antes de su llegada.', en: '(Bank holidays, September, October, March, April and May): free up to 15 days before arrival.', fr: '(Ponts, septembre, octobre, mars, avril et mai) : gratuite jusqu’à 15 jours avant l’arrivée.' })}</li><li><b>{tr({ es: 'Temporada alta:', en: 'High season:', fr: 'Haute saison :' })}</b> {tr({ es: '(Navidad, Fin de año, Semana Santa): No se reembolsa el deposito.', en: '(Christmas, New Year, Easter): the deposit is non-refundable.', fr: '(Noël, Nouvel An, Pâques) : l’acompte n’est pas remboursable.' })}</li></ul></>} 
              />
              <FAQItem 
                question={tr({ es: '¿Cuál es el punto de encuentro para comenzar el tour?', en: 'Where does the tour start?', fr: 'Quel est le point de rendez-vous ?' })} 
                answer={tr({ es: 'El punto de encuentro de está excursión es vuestro alojamiento (Hotel, Riad, Airbnb o desde el aeropuerto de Marrakech si tienen el vuelo de llegada por la mañana).', en: 'We pick you up at your accommodation (hotel, riad, Airbnb) or at the airport if your flight arrives in the morning.', fr: 'Nous venons vous chercher à votre hébergement (hôtel, riad, Airbnb) ou à l’aéroport si votre vol arrive le matin.' })} 
              />
              <FAQItem 
                question={tr({ es: '¿Cuáles son los métodos de pago?', en: 'What payment methods do you accept?', fr: 'Quels sont les moyens de paiement ?' })} 
                answer={tr({ es: 'Se puede realizar el pago con tarjeta de crédito, débito, transferencia bancaria o pago con PayPal.', en: 'You can pay by credit or debit card, bank transfer or PayPal.', fr: 'Vous pouvez payer par carte de crédit ou de débit, virement bancaire ou PayPal.' })} 
              />
              <FAQItem 
                question={tr({ es: '¿Podemos llevar nuestras maletas con nosotros a la excursión?', en: 'Can we bring our luggage on the tour?', fr: 'Pouvons-nous emporter nos bagages ?' })} 
                answer={tr({ es: 'Sí, pueden llevar todas sus maletas a la excursión, tenemos vehículos con espacio suficiente.', en: 'Yes, you can bring all your luggage: our vehicles have plenty of space.', fr: 'Oui, vous pouvez emporter tous vos bagages : nos véhicules ont suffisamment de place.' })} 
              />
            </div>
          </div>
        </div>

        {/* Sidebar / Booking Form */}
        <div className="lg:col-span-1 relative" id="booking-form">
          <div className="sticky top-32 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <h3 className="text-2xl font-bold text-[#E87B37]">{tr({ es: 'Solicitar Presupuesto', en: 'Request a quote', fr: 'Demander un devis' })}</h3>
                    
                    <form className="space-y-6" onSubmit={handleLeadSubmit}>
                      <div className="space-y-4">
                        <input name="first_name" type="text" placeholder={tr({ es: 'Nombre completo*', en: 'Full name*', fr: 'Nom complet*' })} className="input-field text-gray-900 placeholder:text-gray-900" required />
                        <input name="contact_email" type="email" placeholder="Email*" className="input-field text-gray-900 placeholder:text-gray-900" required />
                        <input name="phone" type="tel" placeholder={tr({ es: 'Teléfono', en: 'Phone', fr: 'Téléphone' })} className="input-field text-gray-900 placeholder:text-gray-900" />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1">{tr({ es: 'Fecha de llegada*', en: 'Arrival date*', fr: 'Date d’arrivée*' })}</label>
                            <input type="date" name="date_arrival" min={new Date().toISOString().split('T')[0]} className="input-field text-gray-600" required value={dateArrival} onChange={e => setDateArrival(e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1">{tr({ es: 'Fecha de salida*', en: 'Departure date*', fr: 'Date de départ*' })}</label>
                            <input type="date" name="date_departure" min={dateArrival || new Date().toISOString().split('T')[0]} className="input-field text-gray-600" required value={dateDeparture} onChange={e => setDateDeparture(e.target.value)} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1">{tr({ es: 'Adultos*', en: 'Adults*', fr: 'Adultes*' })}</label>
                            <select name="adults" className="input-field text-gray-600 bg-white" required>
                              <option value="">-</option>
                              {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1">{tr({ es: 'Niños (3 a 8 años)', en: 'Children (3 to 8 years)', fr: 'Enfants (3 à 8 ans)' })}</label>
                            <select name="children" className="input-field text-gray-600 bg-white">
                              <option value="">-</option>
                              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1">{tr({ es: 'Bebés (0 a 2 años)', en: 'Babies (0 to 2 years)', fr: 'Bébés (0 à 2 ans)' })}</label>
                          <select name="infants" className="input-field text-gray-900 bg-white">
                            <option value="">-</option>
                            {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>

                        <textarea name="message" placeholder={tr({ es: 'Su consulta*', en: 'Your message*', fr: 'Votre message*' })} className="input-field min-h-[100px] resize-none text-gray-900 placeholder:text-gray-900" required />
                      </div>

                      <div className="flex gap-3">
                        <input type="checkbox" className="mt-1 flex-shrink-0 w-4 h-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent cursor-pointer" required />
                        <p className="text-xs text-gray-400 leading-tight pt-0.5">
                          {tr({ es: 'He leído y acepto la', en: 'I have read and accept the', fr: 'J’ai lu et j’accepte la' })} <Link to="/privacidad" className="underline hover:text-brand-primary transition-colors">{tr({ es: 'Política de Privacidad', en: 'Privacy Policy', fr: 'Politique de confidentialité' })}</Link> {tr({ es: 'referida al almacenamiento de mi consulta.', en: 'regarding the storage of my request.', fr: 'concernant la conservation de ma demande.' })}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <button type="submit" disabled={submitting} className={`btn-primary w-full py-4 text-base tracking-wide font-bold shadow-lg shadow-brand-primary/20 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {submitting ? tr({ es: 'ENVIANDO...', en: 'SENDING...', fr: 'ENVOI...' }) : tr({ es: 'ENVIAR CONSULTA', en: 'SEND REQUEST', fr: 'ENVOYER LA DEMANDE' })}
                        </button>
                        <a 
                          href={`https://wa.me/${settings?.whatsapp_number?.replace(/\D/g, '') || ''}?text=${encodeURIComponent(`${tr({ es: 'Hola, estoy interesado en el tour:', en: 'Hello, I am interested in the tour:', fr: 'Bonjour, je suis intéressé par le circuit :' })} ${tour.title}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-[#15803D] text-[#15803D] font-bold hover:bg-[#15803D]/5 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z"/></svg>
                          {tr({ es: 'Preguntar por WhatsApp', en: 'Ask on WhatsApp', fr: 'Demander sur WhatsApp' })}
                        </a>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col items-center justify-center text-center py-10 space-y-6"
                  >
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                      >
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                      </motion.div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 leading-tight">{tr({ es: '¡Tu Aventura Está en Marcha!', en: 'Your adventure is on its way!', fr: 'Votre aventure est en route !' })}</h3>
                    <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
                      {tr({ es: 'Hemos recibido tu solicitud correctamente. Nuestro equipo en Marruecos ya está revisando los detalles y', en: 'We have received your request. Our team in Morocco is already reviewing the details and', fr: 'Nous avons bien reçu votre demande. Notre équipe au Maroc étudie déjà les détails et' })} <strong>{tr({ es: 'te contactaremos lo antes posible', en: 'we will contact you as soon as possible', fr: 'nous vous contacterons dès que possible' })}</strong> {tr({ es: 'con una propuesta inolvidable.', en: 'with an unforgettable proposal.', fr: 'avec une proposition inoubliable.' })}
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-brand-primary font-bold tracking-wide uppercase text-xs border-b border-transparent hover:border-brand-primary transition-all pt-4"
                    >
                      {tr({ es: 'Enviar otra consulta', en: 'Send another request', fr: 'Envoyer une autre demande' })}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-brand-primary/5 p-8 rounded-[2.5rem] border border-brand-primary/10 flex items-center justify-center gap-4">
              <ShieldCheck className="w-8 h-8 text-brand-accent" />
              <div className="text-left">
                <p className="font-bold text-gray-900">{tr({ es: 'Reserva Segura', en: 'Secure booking', fr: 'Réservation sécurisée' })}</p>
                <p className="text-xs text-gray-500">{tr({ es: 'Sin cargos ocultos ni sorpresas', en: 'No hidden fees or surprises', fr: 'Sans frais cachés ni surprises' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedTours.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-24 border-t border-gray-100 pt-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900 font-serif">{tr({ es: 'Tours Similares', en: 'Similar tours', fr: 'Circuits similaires' })}</h2>
            <Link to="/tours" className="hidden md:flex items-center gap-2 text-brand-primary font-bold hover:text-brand-accent transition-colors">
              {tr({ es: 'Ver todos', en: 'View all', fr: 'Tout voir' })} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedTours.map((t) => (
              <motion.div
                  key={t.id}
                  whileHover={{ y: -5 }}
                  className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
              >
                  <Link to={tourPath(t)}>
                      <div className="relative h-64 overflow-hidden">
                          <img
                              src={optImg(t.featured_image || t.gallery?.[0] || 'https://picsum.photos/seed/tour/800/600', 800)}
                              alt={t.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-brand-primary font-bold shadow-sm">
                              {t.price ? formatPrice(t.price) : tr({ es: 'Consultar', en: 'On request', fr: 'Sur demande' })}
                          </div>
                      </div>
                      <div className="p-8 space-y-4">
                          <div className="flex items-center gap-2 text-brand-accent text-sm font-bold uppercase tracking-widest">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{t.category || 'Tour'}</span>
                          </div>
                          <h3 className="text-xl font-serif font-bold group-hover:text-brand-primary transition-colors line-clamp-2">{t.title}</h3>
                          <div className="flex items-center gap-4 text-gray-500 text-sm">
                              <div className="flex items-center gap-1.5">
                                  <Clock className="w-4 h-4" />
                                  <span className="truncate">{t.itinerary_summary || tr({ es: 'Varios días', en: 'Several days', fr: 'Plusieurs jours' })}</span>
                              </div>
                          </div>
                      </div>
                  </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {relatedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-24 border-t border-gray-100 pt-16">
          <div className="flex items-center gap-3 mb-10">
            <BookOpen className="w-8 h-8 text-brand-accent" />
            <h2 className="text-3xl font-bold text-gray-900 font-serif">{tr({ es: 'Inspiración y Guías Recomendadas', en: 'Inspiration and recommended guides', fr: 'Inspiration et guides recommandés' })}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((post) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.slug}`}
                className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={optImg(post.cover_image || 'https://loremflickr.com/800/600/morocco', 800)} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-brand-accent">
                    {categoryLabel(post.category || 'Blog', currentLanguage)}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mb-4 h-5">
                    <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.published_at).toLocaleDateString(currentLanguage === 'en' ? 'en-GB' : currentLanguage === 'fr' ? 'fr-FR' : 'es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-brand-accent transition-colors mb-3 line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">{post.excerpt}</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-brand-accent transition-colors">
                      {tr({ es: 'Leer artículo', en: 'Read article', fr: 'Lire l’article' })} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] z-40 transform translate-y-0 transition-transform duration-300">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{tr({ es: 'Precio desde', en: 'Price from', fr: 'Prix à partir de' })}</span>
            <span className="text-2xl font-black text-brand-primary leading-none">{formatPrice(tour.price)}</span>
          </div>
          <button 
            onClick={() => {
              const el = document.getElementById('booking-form');
              if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }}
            className="btn-primary py-3 px-8 text-sm flex-1 shadow-lg shadow-brand-primary/20"
          >
            {tr({ es: 'Reservar', en: 'Book', fr: 'Réserver' })}
          </button>
        </div>
      </div>
    </div>
  );
}
