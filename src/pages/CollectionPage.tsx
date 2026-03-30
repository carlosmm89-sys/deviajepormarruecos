import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { BlogPost, BusinessSettings } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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
  'viajes-al-desierto': 'Desierto',
  'rutas-ciudades-imperiales': 'Ciudades Imperiales',
  'ciudades-imperiales': 'Ciudades Imperiales',
  'aventura': 'Aventura',
  'cultura': 'Cultura'
};

export default function CollectionPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categoryName = CATEGORY_MAP[categorySlug || ''] || 'Colección';

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
          if (target === 'ciudades imperiales' && (c.includes('imperial') || c.includes('imperiales'))) return true;
          return c === target;
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
    if (!settings) {
      toast.error('Error al cargar la configuración. Reintenta.');
      return;
    }
    setSubmitting(true);
    const form = e.currentTarget;
    try {
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
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: newLead, settings, tour_title: `Colección: ${categoryName}` })
      }).catch(err => console.error('SMTP fetch fail:', err));

      toast.success('¡Consulta enviada! Nos pondremos en contacto contigo pronto.');
      form.reset();
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      toast.error('Hubo un problema. Inténtalo de nuevo.');
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
      <Toaster position="top-right" />
      {/* Dynamic Hero based on category */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt={categoryName} className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white drop-shadow-lg"
          >
            {categoryName}
          </motion.h1>
          {categoryName === 'Actividades' && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90 mt-4 uppercase tracking-widest font-medium"
            >
              En Marruecos
            </motion.p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 space-y-12">
        {tours.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-2xl font-bold mb-4">Aún no hay publicaciones en {categoryName}</p>
            <p className="mb-8">Estamos preparando experiencias increíbles para ti.</p>
            <Link to="/tours" className="btn-primary">Explorar Todos los Tours</Link>
          </div>
        ) : (
          tours.map((tour) => (
            <div key={tour.id} className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-2xl md:rounded-[2rem] shadow-sm transform transition-all hover:shadow-xl hover:-translate-y-1 border border-gray-100/50">
              {/* Text Layout (Always Left Side on Desktop) */}
              <div className="bg-[#EBEAE5] p-10 md:p-16 flex flex-col justify-center order-2 md:order-1">
                <p className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Exclusivo en Marruecos</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 uppercase leading-none mb-6">
                  {tour.title}
                </h2>
                
                <p className="text-gray-600 leading-relaxed mb-8 max-w-none text-justify line-clamp-4">
                  {tour.description?.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')}
                </p>
                
                <div className="flex items-center gap-4">
                  <Link 
                    to={`/tours/${tour.id}`}
                    className="px-8 py-3 w-max bg-transparent border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 rounded-full font-bold uppercase tracking-wide text-xs transition-colors"
                  >
                    Ver Itinerario
                  </Link>
                  <button 
                    onClick={scrollToContact}
                    className="px-6 py-3 w-max text-[#D97D3A] font-bold uppercase tracking-wide text-xs transition-colors border-b-2 border-transparent hover:border-[#D97D3A]"
                  >
                    Consultar
                  </button>
                </div>
              </div>

              {/* Image Layout (Always Right Side on Desktop) */}
              <div className="h-64 md:h-auto order-1 md:order-2 overflow-hidden bg-gray-200">
                <img 
                  src={tour.featured_image || tour.gallery?.[0] || 'https://loremflickr.com/800/800/morocco,sahara'} 
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
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Contáctanos</h2>
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
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Para reservas o consultas</h3>
                
                <form className="space-y-6" onSubmit={handleLeadSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre Completo *</label>
                      <input name="first_name" type="text" className="w-full px-4 py-3 bg-white rounded-xl border-none outline-none text-gray-900 shadow-sm" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email *</label>
                      <input name="contact_email" type="email" className="w-full px-4 py-3 bg-white rounded-xl border-none outline-none text-gray-900 shadow-sm" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teléfono *</label>
                      <div className="flex bg-white rounded-xl overflow-hidden shadow-sm">
                        <span className="flex items-center justify-center px-4 bg-gray-50 text-gray-600 border-r border-gray-100 font-medium">🇪🇸</span>
                        <input name="phone" type="tel" className="w-full px-4 py-3 border-none outline-none text-gray-900 bg-transparent" placeholder="+34..." required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">País</label>
                      <input name="country" type="text" className="w-full px-4 py-3 bg-white rounded-xl border-none outline-none text-gray-900 shadow-sm" placeholder="Ej: España" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mensaje o Detalle del Viaje *</label>
                    <textarea 
                      name="message"
                      className="w-full px-4 py-3 bg-white rounded-xl border-none outline-none text-gray-900 min-h-[120px] resize-none shadow-sm" 
                      placeholder={`Me gustaría saber más sobre ${categoryName}...`}
                      required 
                    />
                  </div>

                  <div className="flex justify-center pt-4">
                    <button type="submit" disabled={submitting} className={`bg-[#D97D3A] hover:bg-[#c66c2d] text-white px-12 py-3.5 rounded-full font-bold uppercase tracking-wide text-sm transition-colors shadow-lg shadow-[#D97D3A]/30 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {submitting ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
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
                <h3 className="text-3xl font-bold text-gray-900 leading-tight">¡Tu Aventura Está en Marcha!</h3>
                <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
                  Hemos recibido tu solicitud correctamente. Nuestro equipo en Marruecos ya está revisando los detalles y <strong>te contactaremos lo antes posible</strong> con una propuesta inolvidable.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-[#D97D3A] font-bold tracking-wide uppercase text-xs border-b border-transparent hover:border-[#D97D3A] transition-all pt-4"
                >
                  Enviar otra consulta
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
