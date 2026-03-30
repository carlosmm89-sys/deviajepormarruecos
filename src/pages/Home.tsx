import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Destination, Tour, GalleryImage } from '../types';
import { MapPin, Clock, ArrowRight, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { dbService } from '../services/dbService';
import { BusinessSettings } from '../types';
import WidgetRenderer from '../components/WidgetRenderer';
import HeroSearch from '../components/HeroSearch';
import SEO from '../components/SEO';
import { usePageViews } from '../hooks/usePageViews';
import { useTranslation } from '../hooks/useTranslation';
import { useCurrency } from '../context/CurrencyContext';
import Testimonials from '../components/Testimonials';

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [galleryPreview, setGalleryPreview] = useState<GalleryImage[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  usePageViews('home');

  useEffect(() => {
    const loadData = async () => {
      try {
        const dests = await dbService.getDestinations();
        const tours = await dbService.getTours();
        const bizSettings = await dbService.getBusinessSettings();
        const photos = await dbService.getGalleryImages();
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

  return (
    <div className="space-y-24 pb-24">
      <SEO 
        title={settings?.business_name ? `${settings.business_name} - Agencia de Viajes en Marruecos` : undefined}
        description={settings?.hero_subtitle || undefined}
        url="/"
      />
      {/* Hero Section */}
      <section className="relative z-30 h-[85vh] flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden bg-brand-blue/20">
          <img
            src={settings?.hero_image_url || "https://images.unsplash.com/photo-1540202403-b712f0e01cb4?auto=format&fit=crop&q=60&w=800"}
            alt="Hero Morocco"
            className="w-full h-full object-cover scale-105"
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F9F8F6] to-transparent" />
        </div>

        <div className="relative z-20 max-w-5xl w-full mx-auto px-4 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base font-bold tracking-[0.2em] uppercase text-white/90 drop-shadow-md"
          >
            {settings?.hero_subtitle || 'EXCLUSIVIDAD EN EL MAGREB'}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[5.5rem] font-serif font-bold leading-tight text-white drop-shadow-lg"
          >
            {settings?.hero_title ? (
              <span dangerouslySetInnerHTML={{ __html: settings.hero_title.replace(/\n/g, '<br/>') }} />
            ) : (
              <>El Arte del<br/>Viaje Lento</>
            )}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-8"
          >
            <HeroSearch />
          </motion.div>
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
                <p className="text-gray-400">No hay destinos disponibles aún.</p>
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
                <Link to={`/destinations/${dest.id}`}>
                  <img
                    src={dest.image_url}
                    alt={dest.name}
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
              <div key={i} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm h-[400px] animate-pulse flex flex-col">
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
              <p className="text-gray-400">No hay tours destacados aún.</p>
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
                <Link to={`/tours/${tour.id}`}>
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={tour.featured_image || tour.gallery?.[0] || 'https://picsum.photos/seed/tour/800/600'}
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
                      <span>{(tour as any).destinations?.name || 'Destino'}</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold group-hover:text-brand-primary transition-colors">{tour.title}</h3>
                    <div className="flex items-center gap-6 text-gray-500 text-sm flex-wrap">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{tour.itinerary_summary || tour.duration || 'Varios días'}</span>
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
      </section>

      {/* Gallery Mini Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl text-brand-secondary font-serif font-bold">Marruecos en Imágenes</h2>
            <p className="text-gray-500 mt-2">La esencia de nuestro país capturada en cada viaje</p>
          </div>
          <Link to="/galeria" className="hidden md:flex items-center gap-2 text-brand-primary font-bold hover:text-brand-accent transition-colors pb-2">
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {galleryPreview.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {galleryPreview.map((img, idx) => (
              <Link 
                key={img.id} 
                to="/galeria"
                className={`relative group overflow-hidden rounded-2xl md:rounded-[2rem] bg-gray-100 block ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}
              >
                <img 
                  src={img.image_url} 
                  alt={img.title || 'Galería de Marruecos'} 
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
             <p className="text-gray-500 font-medium">Próximamente nuestra gran galería fotográfica.</p>
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/galeria" className="inline-flex items-center gap-2 text-brand-primary font-bold">
            Ver todas las fotos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Testimonios */}
      <Testimonials />

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
             <h2 className="text-4xl font-serif font-bold">Síguenos en Instagram</h2>
          </div>
          <WidgetRenderer html={settings.instagram_widget} />
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-[3rem] p-12 md:p-24 text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2000&auto=format&fit=crop" 
              alt="Desierto de Marruecos" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
              ¿Listo para tu próxima aventura?
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 font-light mx-auto">
              Únete a miles de viajeros descubriendo la auténtica esencia de Marruecos a su ritmo y a medida.
            </p>
            <div className="pt-8">
              <Link 
                to="/tours" 
                className="inline-flex items-center gap-3 bg-brand-accent hover:bg-white text-white hover:text-brand-accent px-10 py-5 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_rgba(235,102,43,0.4)]"
              >
                Empezar Ahora <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
