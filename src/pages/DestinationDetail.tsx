import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Destination, Tour } from '../types';
import { MapPin, Clock, Star, ArrowLeft, ChevronRight, Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService } from '../services/dbService';

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        try {
          const dest = await dbService.getDestination(id);
          if (dest) {
            setDestination(dest);
            const destTours = await dbService.getToursByDestination(id);
            setAllTours(destTours);
            
            if (destTours.length > 0) {
              const highestPrice = Math.max(...destTours.map(t => t.price || 0));
              setMaxPrice(highestPrice + 50);
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [id]);

  const durations = useMemo(() => {
    const unique = new Set(allTours.map(t => t.itinerary_summary || 'Varios días'));
    return Array.from(unique);
  }, [allTours]);

  const filteredTours = useMemo(() => {
    return allTours
      .filter(tour => {
        const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tour.description_includes?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = (tour.price || 0) <= maxPrice;
        const matchesDuration = durationFilter === 'all' || (tour.itinerary_summary || 'Varios días') === durationFilter;
        
        return matchesSearch && matchesPrice && matchesDuration;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        // We lack a boolean 'featured' on Tour, so we skip it or assume 'is_active'
        return 0;
      });
  }, [allTours, searchQuery, maxPrice, durationFilter, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    const highestPrice = allTours.length > 0 ? Math.max(...allTours.map(t => t.price || 0)) : 500;
    setMaxPrice(highestPrice + 50);
    setDurationFilter('all');
    setSortBy('featured');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Destino no encontrado</h2>
        <Link to="/" className="btn-primary">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-gray-50/50">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={destination.image_url}
            alt={destination.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-12 w-full">
          <Link to="/destinations" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Volver a destinos
          </Link>
          <div className="space-y-2">
            <p className="text-brand-accent font-bold uppercase tracking-widest text-sm">{destination.slug}</p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">{destination.name}</h1>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <main className="lg:col-span-4 space-y-8">

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">Experiencias en {destination.name}</h2>
                  <p className="text-gray-500">Mostrando {filteredTours.length} de {allTours.length} tours</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredTours.map((tour) => (
                    <motion.div
                      layout
                      key={tour.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100 flex flex-col"
                    >
                      <Link to={`/tours/${tour.id}`} className="flex-1 flex flex-col">
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={tour.featured_image || tour.gallery?.[0] || 'https://picsum.photos/seed/tour/800/600'}
                            alt={tour.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-4 left-4 flex gap-2">
                            <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-brand-primary uppercase tracking-widest shadow-lg">
                              {tour.category || 'Tour'}
                            </div>
                          </div>
                          <div className="absolute bottom-4 right-4 bg-brand-primary text-white px-4 py-2 rounded-2xl text-lg font-bold shadow-xl">
                            {tour.price} €
                          </div>
                        </div>
                        
                        <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-brand-accent" />
                                <span>{tour.itinerary_summary || 'Por determinar'}</span>
                              </div>
                            </div>
                            <h3 className="text-2xl font-bold group-hover:text-brand-accent transition-colors leading-tight">{tour.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                              {tour.itinerary_details?.replace(/<[^>]*>?/gm, '')?.slice(0, 100) || 'Descubre esta aventura.'}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredTours.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-20 text-center space-y-6 bg-white rounded-[3rem] border-2 border-dashed border-gray-100"
                  >
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">No encontramos tours con estos filtros</h3>
                      <p className="text-gray-500 max-w-xs mx-auto">Intenta ajustar tu búsqueda o filtros para encontrar lo que buscas.</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <section className="bg-white p-10 md:p-16 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
              <div className="max-w-3xl space-y-6">
                <h2 className="text-4xl font-serif font-bold text-brand-primary">Descubre la magia de {destination.name}</h2>
                <div className="w-20 h-1.5 bg-brand-accent rounded-full" />
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                  {destination.description}
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
