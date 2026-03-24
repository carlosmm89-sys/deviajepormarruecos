import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Destination, Tour } from '../types';
import { Plus, Trash2, Edit2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { dbService } from '../services/dbService';

export default function AdminTours() {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await dbService.getTours();
      const dests = await dbService.getDestinations();
      setTours(data);
      setDestinations(dests);
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos');
    }
  };

  const deleteTour = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este tour?')) {
      try {
        await dbService.deleteTour(id);
        fetchData();
      } catch (err: any) {
        console.error('Error deleting tour:', err);
        setError('Error al eliminar el tour.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </motion.div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Tours</h1>
          <p className="text-gray-500 mt-1">Gestiona los tours y experiencias ofrecidas.</p>
        </div>
        <button onClick={() => navigate('/admin/tours/new')} className="btn-primary flex items-center gap-2 shadow-lg shadow-brand-primary/20">
          <Plus className="w-5 h-5" />
          <span>Nuevo Tour</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <motion.div
            layout
            key={tour.id}
            className={`bg-white rounded-2xl overflow-hidden border ${tour.is_active ? 'border-gray-100' : 'border-red-100 opacity-70'} shadow-sm hover:shadow-md transition-all`}
          >
            <div className="h-48 overflow-hidden relative">
              <img src={tour.featured_image || tour.gallery?.[0] || 'https://picsum.photos/seed/tour/800/600'} alt={tour.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => navigate(`/admin/tours/${tour.id}`)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:text-brand-accent transition-colors block"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTour(tour.id)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:text-red-500 transition-colors block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 bg-brand-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                {tour.price} €
              </div>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold line-clamp-1">{tour.title}</h3>
              <p className="text-sm text-brand-accent font-medium">
                {destinations.find(d => d.id === tour.destination_id)?.name || 'Destino desconocido'}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{tour.itinerary_summary || 'Varios días'}</span>
              </div>
            </div>
          </motion.div>
        ))}
        {tours.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
            No hay tours disponibles aún.
          </div>
        )}
      </div>
    </div>
  );
}
