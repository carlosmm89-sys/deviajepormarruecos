import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Destination, Tour } from '../types';
import { MapPin, Clock, Star, ArrowLeft, ChevronRight, Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService } from '../services/dbService';
import { usePageViews } from '../hooks/usePageViews';
import { useCurrency } from '../context/CurrencyContext';

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  usePageViews('destination', destination?.id);

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
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">{destination.name}</h1>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-8">
              {/* Reset Button */}
              <div className="flex justify-between items-center hidden">
                 <button onClick={resetFilters} className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
                   <RotateCcw className="w-4 h-4" /> Reset
                 </button>
              </div>

              {/* Buscar */}
              <div className="space-y-3">
                <label className="text-gray-900 font-bold">Buscar</label>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none"
                />
              </div>

              {/* Precio */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-gray-900 font-bold">Precio</label>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <div className="text-sm font-medium text-gray-500">
                  {formatPrice(0)} - {formatPrice(maxPrice)}
                </div>
              </div>

              {/* Días */}
              <div className="space-y-3">
                <label className="text-gray-900 font-bold">Filtrar por días</label>
                <div className="relative">
                  <select 
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value)}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm text-gray-600"
                  >
                    <option value="all">todas las opciones</option>
                    {durations.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              <button 
                onClick={resetFilters} 
                className="w-full py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors mt-2"
              >
                Resetear
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-[#1e293b]">{destination.name}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="pl-4 pr-10 py-2.5 rounded-full border border-gray-200 bg-white appearance-none text-sm font-medium text-gray-600 outline-none focus:border-brand-accent"
                    >
                      <option value="featured">Ordenar por</option>
                      <option value="price-asc">Precio: menor a mayor</option>
                      <option value="price-desc">Precio: mayor a menor</option>
                      <option value="name">Nombre: A-Z</option>
                    </select>
                    <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredTours.map((tour) => (
                    <motion.div
                      layout
                      key={tour.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group h-full"
                    >
                      <Link to={`/tours/${tour.slug || tour.id}`} className="flex-1 flex flex-col h-full">
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={tour.featured_image || tour.gallery?.[0] || 'https://loremflickr.com/800/600/morocco?lock=1'}
                            alt={tour.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        
                        <div className="p-6 flex-1 flex flex-col space-y-3">
                          <h3 className="text-xl font-bold text-[#1e293b] leading-tight group-hover:text-brand-accent transition-colors">
                            {tour.title}
                          </h3>
                          <p className="text-gray-500 text-sm line-clamp-4 leading-relaxed flex-1">
                            {tour.itinerary_details?.replace(/<[^>]*>?/gm, '') || 'Descubre esta increíble aventura en Marruecos.'}
                          </p>
                        </div>

                        <div className="p-6 pt-0 mt-auto flex items-center justify-between w-full">
                          <div className="font-bold text-base text-[#1e293b]">
                            A partir de {formatPrice(tour.price)}
                          </div>
                          <div className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors">
                            Información
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
