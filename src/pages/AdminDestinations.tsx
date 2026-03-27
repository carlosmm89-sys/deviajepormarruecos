import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Destination } from '../types';
import { Plus, Trash2, Edit2, X, Save, Image as ImageIcon, AlertCircle, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { dbService } from '../services/dbService';
import ImageUpload from '../components/ImageUpload';
import { Language } from '../context/LanguageContext';

const destinationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  slug: z.string().min(1, 'Slug requerido (ej: marrakech)'),
  description: z.string().min(1, 'La descripción es requerida').max(5000),
  image_url: z.string().url('URL de imagen inválida'),
  featured: z.boolean().optional(),
  translations: z.any().optional(),
});

type DestinationFormData = z.infer<typeof destinationSchema>;

export default function AdminDestinations() {
  const location = useLocation();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Language>('es');

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<DestinationFormData>({
    resolver: zodResolver(destinationSchema),
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const data = await dbService.getDestinations(true);
      setDestinations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data: DestinationFormData) => {
    try {
      if (editingId) {
        await dbService.saveDestination({ ...data, id: editingId } as any);
      } else {
        await dbService.saveDestination(data as any);
      }
      fetchDestinations();
      closeModal();
    } catch (err: any) {
      console.error('Error saving destination:', err);
      setError('Error al guardar el destino.');
    }
  };

  const deleteDestination = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este destino?')) {
      try {
        await dbService.deleteDestination(id);
        fetchDestinations();
      } catch (err: any) {
        console.error('Error deleting destination:', err);
        setError('Error al eliminar el destino.');
      }
    }
  };

  const openModal = (dest?: Destination) => {
    setError(null);
    setActiveTab('es');
    if (dest) {
      setEditingId(dest.id);
      setValue('name', dest.name);
      setValue('slug', dest.slug);
      setValue('description', dest.description);
      setValue('image_url', dest.image_url);
      setValue('featured', dest.featured);
      setValue('translations', dest.translations || {});
    } else {
      setEditingId(null);
      reset({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        featured: false,
        translations: {},
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

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Destinos</h1>
          <p className="text-gray-500 mt-1">Gestiona los destinos turísticos ofrecidos.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 shadow-lg shadow-brand-primary/20">
          <Plus className="w-5 h-5" />
          <span>Nuevo Destino</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <motion.div
            layout
            key={dest.id}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="h-48 overflow-hidden relative">
              <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => openModal(dest)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:text-brand-accent transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteDestination(dest.id)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold">{dest.name}</h3>
              <p className="text-sm text-gray-500 mb-4">Slug: {dest.slug}</p>
              <p className="text-gray-600 text-sm line-clamp-2">{dest.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{editingId ? 'Editar Destino' : 'Nuevo Destino'}</h2>
                  <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-max mb-6">
                    {(['es', 'en', 'fr'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveTab(lang)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold uppercase transition-all ${
                          activeTab === lang 
                            ? 'bg-white text-brand-primary shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        {lang}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'es' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-gray-700">Nombre (Español) *</label>
                          <input {...register('name')} className="input-field" placeholder="Ej: Marrakech" />
                          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-gray-700">Slug (URL)</label>
                          <input {...register('slug')} className="input-field" placeholder="Ej: marrakech" />
                          {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Descripción (Español) *</label>
                        <textarea
                          {...register('description')}
                          className="input-field min-h-[150px] resize-none"
                          placeholder="Describe este destino..."
                        />
                        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Nombre ({activeTab.toUpperCase()})</label>
                        <input {...register(`translations.${activeTab}.name`)} className="input-field" placeholder="Traducción opcional..." />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Descripción ({activeTab.toUpperCase()})</label>
                        <textarea
                          {...register(`translations.${activeTab}.description`)}
                          className="input-field min-h-[150px] resize-none"
                          placeholder="Traducción opcional..."
                        />
                      </div>
                    </div>
                  )}

                  <hr className="border-gray-100 my-6" />

                  <div className="space-y-1">
                    <Controller
                      name="image_url"
                      control={control}
                      render={({ field }) => (
                        <ImageUpload 
                          label="Imagen Principal del Destino" 
                          value={field.value || ''} 
                          onChange={field.onChange} 
                        />
                      )}
                    />
                    {errors.image_url && <p className="text-xs text-red-500 font-medium">{errors.image_url.message}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" {...register('featured')} id="featured" />
                    <label htmlFor="featured" className="text-sm font-semibold text-gray-700">Destacar en inicio</label>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
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
