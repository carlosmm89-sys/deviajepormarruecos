import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Destination, Tour } from '../types';
import { Plus, Trash2, Edit2, X, Save, Image as ImageIcon, Clock, DollarSign, List, CheckCircle, AlertCircle, MapPin, Backpack } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { dbService } from '../services/dbService';

const tourSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200),
  slug: z.string().min(1, 'Slug requerido'),
  destination_id: z.string().min(1, 'El destino es requerido'),
  category: z.string().min(1, 'Categoría requerida'),
  featured_image: z.string().url('URL inválida').or(z.literal('')),
  gallery: z.array(z.string().url('URL inválida')),
  departure_city: z.string(),
  departure_time: z.string(),
  meeting_point: z.string(),
  meeting_time: z.string(),
  description_includes: z.string(),
  description_excludes: z.string(),
  recommendations: z.string(),
  itinerary_summary: z.string(),
  itinerary_details: z.string(),
  map_iframe: z.string(),
  itinerary_image: z.string(),
  price: z.number().min(0, 'Positivo'),
  is_active: z.boolean().default(true),
});

type TourFormData = z.infer<typeof tourSchema>;

export default function AdminTours() {
  const location = useLocation();
  const [tours, setTours] = useState<Tour[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<TourFormData>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      title: '', slug: '', destination_id: '', category: 'Aventura', featured_image: '',
      gallery: [''], departure_city: '', departure_time: '', meeting_point: '', meeting_time: '',
      description_includes: '', description_excludes: '', recommendations: '', itinerary_summary: '',
      itinerary_details: '', map_iframe: '', itinerary_image: '', price: 0, is_active: true
    }
  });

  // @ts-ignore
  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({ control, name: "gallery" });

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
    }
  };

  const onSubmit = async (data: TourFormData) => {
    try {
      // Remove empty gallery strings
      data.gallery = data.gallery.filter(g => g.trim() !== '');

      if (editingId) {
        await dbService.saveTour({ ...data, id: editingId } as any);
      } else {
        await dbService.saveTour(data as any);
      }
      fetchData();
      closeModal();
    } catch (err: any) {
      console.error('Error saving tour:', err);
      setError('Error al guardar el tour.');
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

  const openModal = (tour?: Tour) => {
    setError(null);
    if (tour) {
      setEditingId(tour.id);
      setValue('title', tour.title);
      setValue('slug', tour.slug);
      setValue('destination_id', tour.destination_id);
      setValue('category', tour.category);
      setValue('featured_image', tour.featured_image || '');
      setValue('gallery', tour.gallery?.length ? tour.gallery : ['']);
      setValue('departure_city', tour.departure_city || '');
      setValue('departure_time', tour.departure_time || '');
      setValue('meeting_point', tour.meeting_point || '');
      setValue('meeting_time', tour.meeting_time || '');
      setValue('description_includes', tour.description_includes || '');
      setValue('description_excludes', tour.description_excludes || '');
      setValue('recommendations', tour.recommendations || '');
      setValue('itinerary_summary', tour.itinerary_summary || '');
      setValue('itinerary_details', tour.itinerary_details || '');
      setValue('map_iframe', tour.map_iframe || '');
      setValue('itinerary_image', tour.itinerary_image || '');
      setValue('price', tour.price);
      setValue('is_active', tour.is_active);
    } else {
      setEditingId(null);
      reset({
        title: '', slug: '', destination_id: '', category: 'Aventura', featured_image: '',
        gallery: [''], departure_city: '', departure_time: '', meeting_point: '', meeting_time: '',
        description_includes: '', description_excludes: '', recommendations: '', itinerary_summary: '',
        itinerary_details: '', map_iframe: '', itinerary_image: '', price: 0, is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold">Panel de Administración</h1>
          <div className="flex gap-4">
            <Link 
              to="/admin/destinations" 
              className={`text-sm font-bold pb-1 border-b-2 transition-all ${location.pathname.includes('destinations') ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Destinos
            </Link>
            <Link 
              to="/admin/tours" 
              className={`text-sm font-bold pb-1 border-b-2 transition-all ${location.pathname.includes('tours') ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Tours
            </Link>
            <Link 
              to="/admin/leads" 
              className={`text-sm font-bold pb-1 border-b-2 transition-all ${location.pathname.includes('leads') ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Leads
            </Link>
            <Link 
              to="/admin/settings" 
              className={`text-sm font-bold pb-1 border-b-2 transition-all ${location.pathname.includes('settings') ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Configuración
            </Link>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Nuevo Tour</span>
          </button>
        </div>
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
                  onClick={() => openModal(tour)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:text-brand-accent transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTour(tour.id)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 bg-brand-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold">
                ${tour.price}
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

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2rem] w-full max-w-4xl my-8 overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-4 border-b border-gray-100">
                  <h2 className="text-2xl font-bold">{editingId ? 'Editar Tour' : 'Nuevo Tour'}</h2>
                  <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Título del Tour</label>
                        <input {...register('title')} className="input-field" placeholder="Ej: Aventura en el Desierto" />
                        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Slug</label>
                        <input {...register('slug')} className="input-field" placeholder="Ej: aventura-desierto" />
                        {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Categoría</label>
                        <select {...register('category')} className="input-field">
                          <option value="Aventura">Aventura</option>
                          <option value="Cultura">Cultura</option>
                          <option value="Desierto">Desierto</option>
                          <option value="Montaña">Montaña</option>
                          <option value="Costa">Costa</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Destino</label>
                        <select {...register('destination_id')} className="input-field">
                          <option value="">Selecciona un destino</option>
                          {destinations.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                        {errors.destination_id && <p className="text-xs text-red-500">{errors.destination_id.message}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-gray-700">Precio ($)</label>
                          <div className="relative">
                            <input type="number" {...register('price', { valueAsNumber: true })} className="input-field pl-10" placeholder="0" />
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                          {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                        </div>
                        <div className="space-y-1 flex items-center justify-center gap-2 pt-6">
                            <input type="checkbox" {...register('is_active')} className="w-4 h-4 text-brand-accent" id="isActive" />
                            <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">Activo (Visible)</label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Resumen Itinerario</label>
                        <input {...register('itinerary_summary')} className="input-field" placeholder="Ej: 3 Días / 2 Noches" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-gray-700">Ciudad de Salida</label>
                          <input {...register('departure_city')} className="input-field" placeholder="Ej: Marrakech" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-gray-700">Hora de Salida</label>
                          <input {...register('departure_time')} className="input-field" placeholder="Ej: 08:00 AM" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" /> Imagen Principal (Destacada)
                        </label>
                        <input {...register('featured_image')} className="input-field text-sm" placeholder="https://..." />
                        {errors.featured_image && <p className="text-xs text-red-500">{errors.featured_image.message}</p>}
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Galería de Imágenes
                          </label>
                          <button type="button" onClick={() => appendGallery('')} className="text-xs text-brand-accent font-bold hover:underline">
                            + Añadir imagen
                          </button>
                        </div>
                        <div className="space-y-2">
                          {galleryFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                              <input {...register(`gallery.${index}` as never)} className="input-field text-xs" placeholder="https://..." />
                              <button type="button" onClick={() => removeGallery(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" /> Qué Incluye
                        </label>
                        <textarea {...register('description_includes')} className="input-field min-h-[100px] text-sm" placeholder="Transporte\nAlojamiento..." />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500" /> Qué NO Incluye
                        </label>
                        <textarea {...register('description_excludes')} className="input-field min-h-[100px] text-sm" placeholder="Vuelos\nBebidas..." />
                      </div>

                    </div>
                  </div>

                  <div className="space-y-8 border-t border-gray-100 pt-8">
                    
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <List className="w-5 h-5 text-brand-accent" /> Descripción Detallada e Itinerario
                        </label>
                        <textarea {...register('itinerary_details')} className="input-field min-h-[250px] font-mono text-sm" placeholder="Día 1: ...\nDía 2: ..." />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Backpack className="w-5 h-5 text-yellow-500" /> Recomendaciones
                        </label>
                        <textarea {...register('recommendations')} className="input-field min-h-[100px] text-sm" placeholder="Llevar ropa cómoda..." />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-8 border-t border-gray-100 sticky bottom-0 bg-white pb-4">
                    <button type="button" onClick={closeModal} className="btn-secondary">
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary flex items-center gap-2">
                      <Save className="w-5 h-5" />
                      <span>{editingId ? 'Actualizar' : 'Guardar'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
