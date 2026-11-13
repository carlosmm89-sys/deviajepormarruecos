import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tour } from '../types';
import { dbService } from '../services/dbService';
import { useWishlist } from '../hooks/useWishlist';
import { useCurrency } from '../context/CurrencyContext';
import { Heart, Clock, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { optImg } from '../lib/image';

import { useTranslation } from '../hooks/useTranslation';
export default function Wishlist() {
  const { tr, currentLanguage } = useTranslation();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useWishlist();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function fetchTours() {
      try {
        const data = await dbService.getTours();
        setTours(data);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  const favoriteTours = tours.filter(t => favorites.includes(t.id));

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-brand-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-12">
          <Heart className="w-10 h-10 text-brand-primary fill-brand-primary" />
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900">{tr({ es: 'Mis Favoritos', en: 'My favourites', fr: 'Mes favoris' })}</h1>
        </div>

        {favoriteTours.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <Heart className="w-16 h-16 text-gray-200 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{tr({ es: 'No tienes tours guardados', en: 'You have no saved tours', fr: 'Vous n’avez aucun circuit enregistré' })}</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">{tr({ es: 'Explora nuestros increíbles destinos y guarda los tours que más te gusten para tenerlos siempre a mano.', en: 'Explore our amazing destinations and save the tours you like most to keep them handy.', fr: 'Explorez nos incroyables destinations et enregistrez les circuits qui vous plaisent pour les garder sous la main.' })}</p>
            <Link to="/destinations" className="btn-primary">{tr({ es: 'Explorar Tours', en: 'Explore tours', fr: 'Explorer les circuits' })}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={optImg(tour.featured_image || tour.gallery?.[0], 800)}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(tour.id);
                      }}
                      className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-brand-primary hover:scale-110 transition-transform"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4 bg-brand-primary/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg">
                    {tour.category}
                  </div>
                </div>

                <div className="p-6 md:p-8 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 min-h-[56px] group-hover:text-brand-accent transition-colors">
                    {tour.title}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock className="w-4 h-4 mr-3 text-brand-accent" />
                      {tour.itinerary_summary}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-3 text-brand-accent" />
                      Salida desde {tour.departure_city}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-brand-primary font-bold text-2xl">{formatPrice(tour.price)}</span>
                      <span className="text-gray-500 text-sm ml-1">/ {tr({ es: 'pers', en: 'pers.', fr: 'pers.' })}</span>
                    </div>
                    <Link
                      to={`/tours/${tour.slug || tour.id}`}
                      className="flex items-center text-brand-accent font-semibold hover:gap-2 transition-all gap-1"
                    >
                      {tr({ es: 'Ver Tour', en: 'See tour', fr: 'Voir le circuit' })} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
