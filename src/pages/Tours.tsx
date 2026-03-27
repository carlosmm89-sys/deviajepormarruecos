import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Tour, Destination } from '../types';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Calendar } from 'lucide-react';
import { dbService } from '../services/dbService';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from '../hooks/useTranslation';

export default function Tours() {
  const [searchParams] = useSearchParams();
  const destParam = searchParams.get('destination') || '';
  const durationParam = searchParams.get('duration') || '';
  const dateParam = searchParams.get('date') || '';

  const [tours, setTours] = useState<Tour[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  const categories = [
    'Todos', 
    'Aventura', 'Cultura', 'Desierto', 'Montaña', 'Costa',
    'Viajes Exclusivos', 'Viajes de Lujo', 'Viajes en Grupo', 
    'Luna de Miel', 'Entrega de Anillo', 'Viajes en Familia', 
    'Student Trip', 'Paquetes', 'Actividades'
  ];

  const { formatPrice } = useCurrency();
  const { t } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [allTours, allDestinations] = await Promise.all([
          dbService.getTours(),
          dbService.getDestinations()
        ]);
        
        // Match destinations to tours for easy lookup
        const destMap = new Map(allDestinations.map(d => [d.id, d.name]));
        
        let filtered = allTours.filter(t => t.is_active);

        // Filter by Destination
        if (destParam && destParam !== 'all') {
          filtered = filtered.filter(t => 
            t.destination_id === destParam || 
            (t.destination_ids && t.destination_ids.includes(destParam))
          );
        }

        // Filter by Category
        if (activeCategory && activeCategory !== 'Todos') {
          filtered = filtered.filter(t => t.category === activeCategory);
        }

        // Filter by Duration
        if (durationParam && durationParam !== 'all') {
            filtered = filtered.filter(t => {
                const daysStr = t.duration.toLowerCase().replace(/[^0-9]/g, '');
                const days = parseInt(daysStr, 10) || 0;
                
                if (durationParam === '1-3') return days >= 1 && days <= 3;
                if (durationParam === '4-6') return days >= 4 && days <= 6;
                if (durationParam === '7-10') return days >= 7 && days <= 10;
                if (durationParam === '11-14') return days >= 11 && days <= 14;
                if (durationParam === '15+') return days >= 15;
                return true;
            });
        }

        // Filter by Date (simple exact match or partial match on date_text if needed)
        // Since Tour dates are complex (date_text), we do a basic includes if dateParam is passed
        /* if (dateParam) {
            filtered = filtered.filter(t => t.date_text.includes(dateParam)); // basic approach
        } */

        setTours(filtered);
        setDestinations(allDestinations);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [destParam, durationParam, dateParam, activeCategory]);

  const getDestinationName = (destId: string) => {
    return destinations.find(d => d.id === destId)?.name || 'Marruecos';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-serif font-bold">Explora Nuestros Tours</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Encuentra la aventura perfecta diseñada especialmente para ti.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm
              ${activeCategory === cat 
                ? 'bg-brand-primary text-white scale-105' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 hover:text-brand-primary hover:border-brand-primary/30'}
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
            <div className="col-span-full py-20 text-center">Cargando tours...</div>
        ) : tours.length > 0 ? (
            tours.map((tour, idx) => (
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
                    <span>{getDestinationName(tour.destination_id)}</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold group-hover:text-brand-primary transition-colors">{tour.title}</h3>
                    <div className="flex items-center gap-6 text-gray-500 text-sm flex-wrap">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{tour.itinerary_summary || tour.duration || 'Varios días'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{tour.date_text || 'Salidas regulares'}</span>
                    </div>
                    </div>
                </div>
                </Link>
            </motion.div>
            ))
        ) : (
            <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-3xl">
                No se encontraron tours que coincidan con tu búsqueda. Intenta modificar los filtros.
            </div>
        )}
      </div>
    </div>
  );
}
