import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Destination, Tour } from '../types';
import { MapPin, Clock, ArrowRight, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { dbService } from '../services/dbService';
import { BusinessSettings } from '../types';
import WidgetRenderer from '../components/WidgetRenderer';
import HeroSearch from '../components/HeroSearch';
import { usePageViews } from '../hooks/usePageViews';
import { useTranslation } from '../hooks/useTranslation';
import { useCurrency } from '../context/CurrencyContext';

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  usePageViews('home');

  useEffect(() => {
    const loadData = async () => {
      try {
        const dests = await dbService.getDestinations();
        const tours = await dbService.getTours();
        const bizSettings = await dbService.getBusinessSettings();
        setDestinations(dests.slice(0, 4));
        setFeaturedTours(tours.slice(0, 3));
        if (bizSettings) setSettings(bizSettings);
      } catch (err) {
        console.error("Error loading home data", err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative z-30 h-[85vh] flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={settings?.hero_image_url || "https://images.unsplash.com/photo-1540202403-b712f0e01cb4?auto=format&fit=crop&q=80&w=2000"}
            alt="Hero Morocco"
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F9F8F6] opacity-90" />
        </div>

        <div className="relative z-20 max-w-5xl w-full mx-auto px-4 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base font-bold tracking-[0.2em] uppercase text-[#333] drop-shadow-md"
          >
            EXCLUSIVIDAD EN EL MAGREB
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[5.5rem] font-serif font-bold leading-tight text-[#1A1A1A]"
          >
            El Arte del<br/>Viaje Lento
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
          {destinations.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer"
            >
              <Link to={`/destinations/${dest.id}`}>
                <img
                  src={dest.image_url}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white text-left">
                  <h3 className="text-2xl font-serif font-bold group-hover:-translate-y-1 transition-transform">{dest.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
          {destinations.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-6 border-2 border-dashed border-gray-100 rounded-3xl">
              <div className="space-y-2">
                <p className="text-gray-400">No hay destinos disponibles aún.</p>
              </div>
            </div>
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
          {featuredTours.map((tour, idx) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all"
            >
              <Link to={`/tours/${tour.id}`}>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={tour.featured_image || tour.gallery?.[0] || 'https://picsum.photos/seed/tour/800/600'}
                    alt={tour.title}
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
                  <div className="flex items-center gap-6 text-gray-500 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{tour.itinerary_summary || 'Varios días'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-gray-900">4.9</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
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
             <h2 className="text-4xl font-serif font-bold">Síguenos en Instagram</h2>
          </div>
          <WidgetRenderer html={settings.instagram_widget} />
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-brand-primary rounded-[3rem] p-12 md:p-24 text-center text-white space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <h2 className="text-4xl md:text-6xl font-serif font-bold">¿Listo para tu próxima aventura?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Únete a miles de viajeros que ya están explorando el mundo con nosotros.
          </p>
          <button className="btn-primary bg-brand-accent hover:bg-emerald-600 px-12 py-4 text-lg">
            Empezar Ahora
          </button>
        </div>
      </section>
    </div>
  );
}
