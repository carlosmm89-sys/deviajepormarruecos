import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { BlogPost, BusinessSettings } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SEO from '../components/SEO';
import { tourPath } from '../data/seoContent';
import { collectionContentI18n } from '../data/collectionsI18n';
import { categoryLabel } from '../i18n/labels';
import { optImg } from '../lib/image';

import { useTranslation } from '../hooks/useTranslation';
const CATEGORY_MAP: Record<string, string> = {
  'actividades': 'Actividades',
  'student-trip': 'Student Trip',
  'paquetes': 'Paquetes',
  'viajes-exclusivos': 'Viajes Exclusivos',
  'viajes-de-lujo': 'Viajes de Lujo',
  'luna-de-miel': 'Luna de Miel',
  'entrega-de-anillo': 'Entrega de Anillo',
  'viajes-en-familia': 'Viajes en Familia',
  'viajes-en-grupo': 'Viajes en Grupo',
  'viajes-norte-de-marruecos': 'Norte de Marruecos',
  'norte-de-marruecos': 'Norte de Marruecos',
  'viajes-al-desierto': 'Desierto',
  'desierto': 'Desierto',
  'rutas-ciudades-imperiales': 'Ciudades Imperiales',
  'ciudades-imperiales': 'Ciudades Imperiales',
  'aventura': 'Aventura',
  'cultura': 'Cultura',
  'montana': 'Montaña',
  'costa': 'Costa'
};

export default function CollectionPage() {
  const { tr, currentLanguage } = useTranslation();
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categoryName = CATEGORY_MAP[categorySlug || ''] || 'Colección';
  const collection = collectionContentI18n(categorySlug || '', categoryName, currentLanguage);
  const categoryLabelText = categoryLabel(categoryName, currentLanguage);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const [allTours, businessSettings] = await Promise.all([
          dbService.getTours(),
          dbService.getBusinessSettings()
        ]);
        
        const filtered = allTours.filter(t => {
          if (!t.category) return false;
          const c = t.category.toLowerCase();
          const target = categoryName.toLowerCase();
          if (target === 'desierto' && (c.includes('desierto') || c.includes('sahara'))) return true;
          if (target === 'norte de marruecos' && (c.includes('norte') || c.includes('tanger'))) return true;
          if (target === 'ciudades imperiales' && (c.includes('imperial') || c.includes('imperiales') || c.includes('gran tour'))) return true;
          return c.split(',').map((s: string) => s.trim()).includes(target) || c.includes(target);
        });
        setTours(filtered);
        setSettings(businessSettings || null);
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [categoryName]);

  const scrollToContact = () => {
    document.getElementById('contacto-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    try {
      const activeSettings = settings || await dbService.getBusinessSettings();
      const newLead = {
        form_type: 'collection_inquiry',
        first_name: form.first_name.value,
        email: form.contact_email.value,
        phone: form.phone.value || '',
        approximate_date: new Date().toISOString().split('T')[0],
        passengers_count: 1,
        message: `[Interesado en la colección: ${categoryName}]\nPaís: ${form.country.value}\n${form.message.value}`,
        status: 'new' as const
      };

      await dbService.createLead(newLead);

      // Trigger Email
      if (activeSettings) {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lead: newLead, settings: activeSettings, tour_title: `Colección: ${categoryName}` })
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

  const heroImage = categoryName === 'Actividades' 
    ? '/images/actividades/quad.png'
    : tours.length > 0 && tours[0].featured_image 
      ? tours[0].featured_image 
      : 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80';

  return (
    <div className="min-h-screen bg-white pb-24">
      <SEO
        title={`${collection.title} | Vivir Marruecos`}
        description={collection.intro}
        image={heroImage}
        url={`/coleccion/${categorySlug}`}
      />
      <Toaster position="top-right" />
      {/* Dynamic Hero based on category */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img src={optImg(heroImage, 1600)} alt={categoryLabelText} className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white drop-shadow-lg"
          >
            {collection.title}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 space-y-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-lg text-gray-600 leading-relaxed">{collection.intro}</p>
          {(collection.body || []).map((para: string, i: number) => (
            <p key={i} className="text-base text-gray-600 leading-relaxed">{para}</p>
          ))}
        </div>
        {tours.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-2xl font-bold mb-4">{tr({ es: 'Aún no hay publicaciones en', en: 'Nothing published yet in', fr: 'Rien de publié pour le moment dans' })} {categoryLabelText}</p>
            <p className="mb-8">{tr({ es: 'Estamos preparando experiencias increíbles para ti.', en: 'We are preparing amazing experiences for you.', fr: 'Nous préparons des expériences incroyables pour vous.' })}</p>
            <Link to="/tours" className="btn-primary">{tr({ es: 'Explorar Todos los Tours', en: 'Explore all tours', fr: 'Voir tous les circuits' })}</Link>
          </div>
        ) : (
          tours.map((tour) => (
            <div key={tour.id} className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-2xl md:rounded-[2rem] shadow-sm transform transition-all hover:shadow-xl hover:-translate-y-1 border border-gray-100/50">
              {/* Text Layout (Always Left Side on Desktop) */}
              <div className="bg-[#EBEAE5] p-10 md:p-16 flex flex-col justify-center order-2 md:order-1">
                <p className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">{tr({ es: 'Exclusivo en Marruecos', en: 'Exclusive in Morocco', fr: 'Exclusif au Maroc' })}</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 uppercase leading-none mb-6">
                  {tour.title}
                </h2>
                
                <p className="text-gray-600 leading-relaxed mb-8 max-w-none text-left md:text-justify line-clamp-4">
                  {tour.description?.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')}
                </p>
                
                <div className="flex items-center gap-4">
                  <Link 
                    to={tourPath(tour)}
                    className="px-8 py-3 w-max bg-transparent border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 rounded-full font-bold uppercase tracking-wide text-xs transition-colors"
                  >
                    {tr({ es: 'Ver Itinerario', en: 'See itinerary', fr: 'Voir l’itinéraire' })}
                  </Link>
                  <button 
                    onClick={scrollToContact}
                    className="px-6 py-3 w-max text-[#D97D3A] font-bold uppercase tracking-wide text-xs transition-colors border-b-2 border-transparent hover:border-[#D97D3A]"
                  >
                    {tr({ es: 'Consultar', en: 'Enquire', fr: 'Se renseigner' })}
                  </button>
                </div>
              </div>

              {/* Image Layout (Always Right Side on Desktop) */}
              <div className="h-64 md:h-auto order-1 md:order-2 overflow-hidden bg-gray-200">
                <img 
                  src={optImg(tour.featured_image || tour.gallery?.[0] || 'https://loremflickr.com/800/800/morocco,sahara', 800)} 
                  alt={tour.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Contact Form Section */}
      <div id="contacto-form" className="max-w-4xl mx-auto px-4 mt-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">{tr({ es: 'Contáctanos', en: 'Contact us', fr: 'Contactez-nous' })}</h2>
          <div className="w-12 h-1 bg-gray-300 mx-auto rounded-full"></div>
        </div>

        <div className="bg-[#EBEAE5] p-8 md:p-12 rounded-[2rem] shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">{tr({ es: 'Para reservas o consultas', en: 'For bookings or enquiries', fr: 'Pour réservations ou demandes' })}</h3>
                
                <form className="space-y-6" onSubmit={handleLeadSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{tr({ es: 'Nombre Completo *', en: 'Full name *', fr: 'Nom complet *' })}</label>
                      <input name="first_name" type="text" className="w-full px-4 py-3 bg-white rounded-xl border-none outline-none text-gray-900 shadow-sm" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email *</label>
                      <input name="contact_email" type="email" className="w-full px-4 py-3 bg-white rounded-xl border-none outline-none text-gray-900 shadow-sm" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{tr({ es: 'Teléfono *', en: 'Phone *', fr: 'Téléphone *' })}</label>
                      <div className="flex bg-white rounded-xl overflow-hidden shadow-sm">
                        <span className="flex items-center justify-center px-4 bg-gray-50 text-gray-600 border-r border-gray-100 font-medium">🇪🇸</span>
                        <input name="phone" type="tel" className="w-full px-4 py-3 border-none outline-none text-gray-900 bg-transparent" placeholder="+34..." required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{tr({ es: 'País', en: 'Country', fr: 'Pays' })}</label>
                      <input name="country" type="text" className="w-full px-4 py-3 bg-white rounded-xl border-none outline-none text-gray-900 shadow-sm" placeholder={tr({ es: 'Ej: España', en: 'E.g. United Kingdom', fr: 'Ex. : France' })} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{tr({ es: 'Mensaje o Detalle del Viaje *', en: 'Message or trip details *', fr: 'Message ou détails du voyage *' })}</label>
                    <textarea 
                      name="message"
                      className="w-full px-4 py-3 bg-white rounded-xl border-none outline-none text-gray-900 min-h-[120px] resize-none shadow-sm" 
                      placeholder={tr({ es: `Me gustaría saber más sobre ${categoryLabelText}...`, en: `I would like to know more about ${categoryLabelText}...`, fr: `J’aimerais en savoir plus sur ${categoryLabelText}...` })}
                      required 
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <input type="checkbox" className="mt-1 flex-shrink-0 w-4 h-4 rounded border-gray-300 text-[#D97D3A] focus:ring-[#D97D3A] cursor-pointer" required />
                    <p className="text-xs text-gray-500 leading-tight pt-0.5">
                      {tr({ es: 'He leído y acepto la', en: 'I have read and accept the', fr: 'J’ai lu et j’accepte la' })} <Link to="/privacidad" className="underline hover:text-[#D97D3A] transition-colors">{tr({ es: 'Política de Privacidad', en: 'Privacy Policy', fr: 'Politique de confidentialité' })}</Link> {tr({ es: 'referida al almacenamiento de mi consulta.', en: 'regarding the storage of my request.', fr: 'concernant la conservation de ma demande.' })}
                    </p>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button type="submit" disabled={submitting} className={`bg-[#D97D3A] hover:bg-[#c66c2d] text-white px-12 py-3.5 rounded-full font-bold uppercase tracking-wide text-sm transition-colors shadow-lg shadow-[#D97D3A]/30 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {submitting ? tr({ es: 'ENVIANDO...', en: 'SENDING...', fr: 'ENVOI...' }) : tr({ es: 'ENVIAR MENSAJE', en: 'SEND MESSAGE', fr: 'ENVOYER LE MESSAGE' })}
                    </button>
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
                  className="mt-6 text-[#D97D3A] font-bold tracking-wide uppercase text-xs border-b border-transparent hover:border-[#D97D3A] transition-all pt-4"
                >
                  {tr({ es: 'Enviar otra consulta', en: 'Send another request', fr: 'Envoyer une autre demande' })}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
