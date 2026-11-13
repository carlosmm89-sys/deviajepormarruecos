import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Tour, Destination } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Calendar, ChevronRight, RotateCcw, Filter } from 'lucide-react';
import { dbService } from '../services/dbService';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from '../hooks/useTranslation';
import SEO from '../components/SEO';
import { tourPath } from '../data/seoContent';
import { optImg, optSrcSet } from '../lib/image';
import { categoryLabel, durationLabel } from '../i18n/labels';

// Foto de cabecera: caravana de camellos en las dunas (Unsplash, foto de Carlos Leret, licencia Unsplash gratuita).
const TOURS_HERO_IMAGE = 'https://images.unsplash.com/photo-1559586616-361e18714958';

const STATIC_CATEGORIES = [
  'Aventura', 'Cultura', 'Desierto', 'Montaña', 'Costa',
  'Viajes Exclusivos', 'Viajes de Lujo', 'Viajes en Grupo',
  'Luna de Miel', 'Entrega de Anillo', 'Viajes en Familia',
  'Paquetes', 'Actividades'
];

const DURATIONS = ['1-3 días', '4-6 días', '7-10 días', '11-14 días', '15+ días'];

export default function Tours() {
  const [searchParams] = useSearchParams();
  const destParam = searchParams.get('destination') || '';
  const initialDurationParam = searchParams.get('duration') || '';

  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [durationFilter, setDurationFilter] = useState(initialDurationParam || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { formatPrice, rate } = useCurrency();
  const { t, tr, currentLanguage } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [toursData, destinationsData] = await Promise.all([
          dbService.getTours(),
          dbService.getDestinations()
        ]);
        setAllTours(toursData.filter(t => t.is_active));
        setDestinations(destinationsData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const getDestinationName = (destId: string) => {
    return destinations.find(d => d.id === destId)?.name || 'Marruecos';
  };

  const resetFilters = () => {
    setSearchQuery('');
    setMaxPrice(5000);
    setDurationFilter('all');
    setActiveCategory('Todos');
    setSortBy('featured');
  };

  // Derive active categories dynamically (splitting comma-separated categories)
  const availableCategories = useMemo(() => {
    const activeSet = new Set<string>();
    allTours.forEach(t => {
      if (!t.category) return;
      t.category.split(',').forEach(part => {
        const clean = part.trim();
        if (clean) activeSet.add(clean);
      });
    });
    const matched = STATIC_CATEGORIES.filter(c => activeSet.has(c));
    activeSet.forEach(c => {
      if (!matched.includes(c)) matched.push(c);
    });
    return ['Todos', ...matched];
  }, [allTours]);

  // Filtering Logic
  const filteredTours = useMemo(() => {
    let result = [...allTours];

    // URL Destination param
    if (destParam && destParam !== 'all') {
      result = result.filter(t => 
        t.destination_id === destParam || 
        (t.destination_ids && t.destination_ids.includes(destParam))
      );
    }

    // Category
    if (activeCategory !== 'Todos') {
      const target = activeCategory.toLowerCase();
      result = result.filter(t => {
        if (!t.category) return false;
        return t.category
          .toLowerCase()
          .split(',')
          .map(s => s.trim())
          .includes(target);
      });
    }

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.destination_id && getDestinationName(t.destination_id).toLowerCase().includes(q))
      );
    }

    // Max Price
    if (maxPrice < 5000) {
      result = result.filter(t => (t.price || 0) * rate <= maxPrice * rate);
    }

    // Duration Filter
    if (durationFilter && durationFilter !== 'all') {
      result = result.filter(t => {
        const sourceText = `${t.duration || ''} ${t.itinerary_summary || ''} ${t.title || ''}`;
        const match = sourceText.match(/(\d+)\s*d[ií]as?/i) || sourceText.match(/(\d+)/);
        const days = match ? parseInt(match[1], 10) : 0;
        
        if (durationFilter.includes('1-3')) return days >= 1 && days <= 3;
        if (durationFilter.includes('4-6')) return days >= 4 && days <= 6;
        if (durationFilter.includes('7-10')) return days >= 7 && days <= 10;
        if (durationFilter.includes('11-14')) return days >= 11 && days <= 14;
        if (durationFilter.includes('15+')) return days >= 15;
        return true;
      });
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [allTours, destParam, activeCategory, searchQuery, maxPrice, durationFilter, sortBy, rate, destinations]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 space-y-16">
      <SEO 
        title={tr({ es: 'Tours y circuitos por Marruecos | Vivir Marruecos', en: 'Tours and trips in Morocco | Vivir Marruecos', fr: 'Circuits et voyages au Maroc | Vivir Marruecos' })}
        description={tr({ es: `Explora nuestros ${filteredTours.length > 0 ? filteredTours.length : ''} tours y descubre la aventura perfecta en Marruecos. Desde el desierto hasta la costa.`, en: `Explore our ${filteredTours.length > 0 ? filteredTours.length : ''} tours and find the perfect adventure in Morocco, from the desert to the coast.`, fr: `Découvrez nos ${filteredTours.length > 0 ? filteredTours.length : ''} circuits et trouvez l’aventure idéale au Maroc, du désert à la côte.` })}
        url="/tours"
      />
      
      <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl">
        <img
          src={optImg(TOURS_HERO_IMAGE, 1600)}
          srcSet={optSrcSet(TOURS_HERO_IMAGE, [640, 960, 1600])}
          sizes="(min-width: 1280px) 1280px, 100vw"
          alt={tr({ es: 'Caravana de camellos en las dunas del desierto de Marruecos', en: 'Camel caravan in the dunes of the Moroccan desert', fr: 'Caravane de dromadaires dans les dunes du désert marocain' })}
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="relative text-center space-y-4 px-6 py-20 md:py-28">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white drop-shadow-lg">{tr({ es: 'Tours y circuitos por Marruecos', en: 'Tours and trips in Morocco', fr: 'Circuits et voyages au Maroc' })}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
            {tr({ es: 'Todos nuestros tours y circuitos privados por Marruecos, diseñados a tu medida.', en: 'All our private tours and trips in Morocco, tailored to you.', fr: 'Tous nos circuits et voyages privés au Maroc, sur mesure.' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="md:hidden flex items-center justify-between mb-4">
             <button 
               onClick={() => setShowMobileFilters(!showMobileFilters)}
               className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg font-bold"
             >
               <Filter className="w-4 h-4" /> {tr({ es: 'Filtros', en: 'Filters', fr: 'Filtres' })}
             </button>
          </div>

          <div className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-col gap-8 ${showMobileFilters ? 'flex' : 'hidden md:flex'}`}>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-lg">{tr({ es: 'Filtros', en: 'Filters', fr: 'Filtres' })}</h3>
              <button onClick={resetFilters} className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
                <RotateCcw className="w-4 h-4" /> {tr({ es: 'Borrar', en: 'Reset', fr: 'Réinitialiser' })}
              </button>
            </div>

            {/* Buscar */}
            <div className="space-y-3">
              <label className="text-gray-900 font-bold">{tr({ es: 'Buscar', en: 'Search', fr: 'Rechercher' })}</label>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tr({ es: 'Ej. Marrakech, Fez...', en: 'E.g. Marrakech, Fez...', fr: 'Ex. Marrakech, Fès...' })}
                className="w-full px-4 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none"
              />
            </div>

            {/* Precio */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-gray-900 font-bold">{tr({ es: 'Precio Máximo', en: 'Maximum price', fr: 'Prix maximum' })}</label>
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
                {tr({ es: 'Hasta', en: 'Up to', fr: 'Jusqu’à' })} {formatPrice(maxPrice)}
              </div>
            </div>

            {/* Días */}
            <div className="space-y-3">
              <label className="text-gray-900 font-bold">{tr({ es: 'Duración', en: 'Duration', fr: 'Durée' })}</label>
              <div className="relative">
                <select 
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm text-gray-600 font-bold"
                >
                  <option value="all">{tr({ es: 'Todas las opciones', en: 'All options', fr: 'Toutes les options' })}</option>
                  {DURATIONS.map(d => (
                    <option key={d} value={d}>{durationLabel(d, currentLanguage)}</option>
                  ))}
                </select>
                <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
              </div>
            </div>

            <button 
              onClick={resetFilters} 
              className="w-full py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors mt-2"
            >
              {tr({ es: 'Aplicar y Cerrar', en: 'Apply and close', fr: 'Appliquer et fermer' })}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 space-y-8">
          
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="text-gray-500 font-medium">
               {tr({ es: 'Mostrando', en: 'Showing', fr: 'Affichage de' })} <strong className="text-gray-900">{filteredTours.length}</strong> {filteredTours.length === 1 ? tr({ es: 'resultado', en: 'result', fr: 'résultat' }) : tr({ es: 'resultados', en: 'results', fr: 'résultats' })}
             </div>
             
             <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-4 pr-10 py-2.5 rounded-full border border-gray-200 bg-white appearance-none text-sm font-bold text-gray-600 outline-none focus:border-brand-accent"
                >
                  <option value="featured">{tr({ es: 'Ordenar por', en: 'Sort by', fr: 'Trier par' })}</option>
                  <option value="price-asc">{tr({ es: 'Precio: menor a mayor', en: 'Price: low to high', fr: 'Prix : croissant' })}</option>
                  <option value="price-desc">{tr({ es: 'Precio: mayor a menor', en: 'Price: high to low', fr: 'Prix : décroissant' })}</option>
                  <option value="name">{tr({ es: 'Nombre: A-Z', en: 'Name: A-Z', fr: 'Nom : A-Z' })}</option>
                </select>
                <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
             </div>
          </div>

          {/* Category Filter Pills */}
          {availableCategories.length > 1 && (
            <div className="flex flex-wrap items-center gap-3">
              {availableCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm
                    ${activeCategory === cat 
                      ? 'bg-brand-primary text-white scale-105' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 hover:text-brand-primary hover:border-brand-primary/30'}
                  `}
                >
                  {categoryLabel(cat, currentLanguage)}
                </button>
              ))}
            </div>
          )}

          {/* Grid de Tours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {isLoading ? (
                <div className="col-span-full py-20 text-center text-gray-500 font-bold">{tr({ es: 'Cargando tours...', en: 'Loading tours...', fr: 'Chargement des circuits...' })}</div>
            ) : filteredTours.length > 0 ? (
                filteredTours.map((tour, idx) => (
                <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                >
                    <Link to={tourPath(tour)}>
                    <div className="relative h-64 overflow-hidden">
                        <img
                        src={optImg(tour.featured_image || tour.gallery?.[0] || 'https://picsum.photos/seed/tour/800/600', 800)}
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
                        <span>{getDestinationName(tour.destination_id)}</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold group-hover:text-brand-primary transition-colors line-clamp-2">{tour.title}</h3>
                        <div className="flex items-center gap-6 text-gray-500 text-sm flex-wrap">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{tour.itinerary_summary || tour.duration || tr({ es: 'Varios días', en: 'Several days', fr: 'Plusieurs jours' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className="line-clamp-1">{tour.date_text || tr({ es: 'Salidas regulares', en: 'Regular departures', fr: 'Départs réguliers' })}</span>
                        </div>
                        </div>
                    </div>
                    </Link>
                </motion.div>
                ))
            ) : (
                <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-3xl font-bold">
                    {tr({ es: 'No se encontraron tours que coincidan con tu búsqueda. Intenta modificar los filtros.', en: 'No tours match your search. Try changing the filters.', fr: 'Aucun circuit ne correspond à votre recherche. Essayez de modifier les filtres.' })}
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
