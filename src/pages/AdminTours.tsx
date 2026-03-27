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
      const data = await dbService.getTours(true);
      const dests = await dbService.getDestinations(true);
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {tours.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">No hay tours registrados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 font-semibold text-gray-600 border-b border-gray-100 text-sm uppercase tracking-wider">Tour</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 border-b border-gray-100 text-sm uppercase tracking-wider">Categoría</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 border-b border-gray-100 text-sm uppercase tracking-wider">Precio</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 border-b border-gray-100 text-sm uppercase tracking-wider">Estado</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 border-b border-gray-100 text-right text-sm uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tours.map((tour) => (
                  <tr key={tour.id} className={`hover:bg-gray-50/50 transition-colors ${!tour.is_active ? 'opacity-70' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                          {tour.featured_image || tour.gallery?.[0] ? (
                            <img src={tour.featured_image || tour.gallery?.[0]} alt={tour.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="text-gray-400 text-xs text-center">No img</div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{tour.title}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {tour.itinerary_summary || 'Varios días'} 
                            <span className="mx-1">•</span>
                            {destinations.find(d => d.id === tour.destination_id)?.name || 'Destino opcional'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-[240px]">
                        {tour.category?.split(',').map(c => c.trim()).filter(Boolean).map(cat => (
                          <span key={cat} className="inline-flex items-center text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {cat}
                          </span>
                        )) || '-'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-900">{tour.price} €</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        tour.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {tour.is_active ? 'Activo' : 'Oculto'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/tours/${tour.id}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteTour(tour.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
