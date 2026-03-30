import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Destination } from '../types';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { dbService } from '../services/dbService';
import SEO from '../components/SEO';

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dests = await dbService.getDestinations();
        setDestinations(dests);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 space-y-16">
      <SEO 
        title="Destinos en Marruecos | Marruecos Experiencia"
        description="Descubre la esencia de Marruecos a través de nuestras ciudades más emblemáticas. Un viaje a través del desierto, la costa y atlas."
        url="/destinations"
      />
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-serif font-bold">Nuestros Destinos</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Descubre la esencia de Marruecos a través de nuestras ciudades más emblemáticas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {destinations.map((dest, idx) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group space-y-6"
          >
            <Link to={`/destinations/${dest.id}`} className="block space-y-6">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden relative">
                <img
                  src={dest.image_url}
                  alt={dest.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-bold flex items-center gap-2">
                    Explorar <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-serif font-bold group-hover:text-brand-accent transition-colors">{dest.name}</h3>
                </div>
                <p className="text-gray-500 leading-relaxed line-clamp-3">{dest.description?.replace(/<[^>]*>?/gm, '')}</p>
              </div>
            </Link>
          </motion.div>
        ))}
        {destinations.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
            No hay destinos disponibles aún.
          </div>
        )}
      </div>
    </div>
  );
}
