import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Destination, Tour } from '../types';
import { Save, Image as ImageIcon, CheckCircle, AlertCircle, List, Backpack, ArrowLeft, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { dbService } from '../services/dbService';
import ImageUpload from '../components/ImageUpload';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const tourSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200),
  slug: z.string().min(1, 'Slug requerido'),
  destination_id: z.string().min(1, 'El destino es requerido'),
  category: z.string().min(1, 'Categoría requerida'),
  featured_image: z.string().url('URL inválida').or(z.literal('')),
  gallery: z.array(z.string().url('URL inválida').or(z.literal(''))),
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

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
};

export default function AdminTourEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isNew = id === 'new';

  const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TourFormData>({
    resolver: zodResolver(tourSchema) as any,
    defaultValues: {
      title: '', slug: '', destination_id: '', category: 'Aventura', featured_image: '',
      gallery: [''], departure_city: '', departure_time: '', meeting_point: '', meeting_time: '',
      description_includes: '', description_excludes: '', recommendations: '', itinerary_summary: '',
      itinerary_details: '', map_iframe: '', itinerary_image: '', price: 0, is_active: true
    }
  });

  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({ control, name: "gallery" });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const dests = await dbService.getDestinations();
      setDestinations(dests);

      if (!isNew && id) {
        const data = await dbService.getTours();
        const tour = data.find(t => t.id === id);
        if (tour) {
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
          setError('Tour no encontrado.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar datos.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TourFormData) => {
    try {
      // Remove empty gallery strings
      data.gallery = data.gallery.filter(g => g.trim() !== '');

      if (!isNew && id) {
        await dbService.saveTour({ ...data, id } as any);
      } else {
        await dbService.saveTour(data as any);
      }
      navigate('/admin/tours');
    } catch (err: any) {
      console.error('Error saving tour:', err);
      setError('Error al guardar el tour.');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Cargando datos...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
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

      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/tours')} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">{isNew ? 'Nuevo Tour' : 'Editar Tour'}</h1>
          <p className="text-gray-500 mt-1">Configura todos los detalles de la experiencia.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 p-8"
      >
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column: Basic Info */}
            <div className="space-y-6">
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

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Precio (€)</label>
                  <input type="number" {...register('price', { valueAsNumber: true })} className="input-field" placeholder="0" />
                  {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                </div>
                <div className="space-y-1 flex items-center justify-center gap-2 pt-6">
                    <input type="checkbox" {...register('is_active')} className="w-5 h-5 text-brand-accent rounded" id="isActive" />
                    <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 cursor-pointer">Activo (Visible)</label>
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

            {/* Right Column: Media & Highlights */}
            <div className="space-y-6">
              <div className="space-y-1">
                <Controller
                  name="featured_image"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload 
                      label="Imagen Principal (Destacada)" 
                      value={field.value || ''} 
                      onChange={field.onChange} 
                    />
                  )}
                />
                {errors.featured_image && <p className="text-xs text-red-500 font-medium">{errors.featured_image.message}</p>}
              </div>

              <div className="space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-brand-primary" /> Galería Secundaria
                  </label>
                  <button type="button" onClick={() => appendGallery('' as any)} className="text-xs text-brand-accent font-bold hover:underline px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-200">
                    + Añadir foto
                  </button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {galleryFields.map((field, index) => (
                    <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex-1 w-full">
                        <Controller
                          name={`gallery.${index}` as const}
                          control={control}
                          render={({ field: controllerField }) => (
                            <ImageUpload 
                              value={controllerField.value || ''} 
                              onChange={controllerField.onChange} 
                            />
                          )}
                        />
                      </div>
                      <button type="button" onClick={() => removeGallery(index)} className="p-3 text-red-500 hover:bg-red-50 hover:text-red-600 font-medium rounded-xl shadow-sm border border-gray-200 bg-gray-50 transition-colors w-full sm:w-auto text-sm mt-4 sm:mt-0 sm:self-center">
                        Quitar 
                      </button>
                    </div>
                  ))}
                  {galleryFields.length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-4">No hay imágenes en la galería. Añade fotos para mostrar detalles.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-12 border-t border-gray-100 pt-10">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Contenido Detallado</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Qué Incluye
                </label>
                <div className="h-64 mb-14">
                  <ReactQuill 
                      theme="snow"
                      modules={quillModules}
                      value={watch('description_includes')}
                      onChange={(content) => setValue('description_includes', content)}
                      className="h-full bg-white rounded-lg"
                      placeholder="Escribe lo que incluye..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" /> Qué NO Incluye
                </label>
                <div className="h-64 mb-14">
                  <ReactQuill 
                      theme="snow"
                      modules={quillModules}
                      value={watch('description_excludes')}
                      onChange={(content) => setValue('description_excludes', content)}
                      className="h-full bg-white rounded-lg"
                      placeholder="Escribe lo que NO incluye..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1 mt-8">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <List className="w-5 h-5 text-brand-accent" /> Descripción Detallada e Itinerario
                </label>
                <div className="h-96 mb-14">
                  <ReactQuill 
                      theme="snow"
                      modules={quillModules}
                      value={watch('itinerary_details')}
                      onChange={(content) => setValue('itinerary_details', content)}
                      className="h-full bg-white rounded-lg"
                      placeholder="Describe la ruta o itinerario completo..."
                  />
                </div>
            </div>

            <div className="space-y-1 mt-8">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <Backpack className="w-5 h-5 text-yellow-500" /> Recomendaciones
                </label>
                <div className="h-48 mb-14">
                  <ReactQuill 
                      theme="snow"
                      modules={quillModules}
                      value={watch('recommendations')}
                      onChange={(content) => setValue('recommendations', content)}
                      className="h-full bg-white rounded-lg"
                      placeholder="Recomendaciones para el viaje..."
                  />
                </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-gray-100 mt-12 bg-gray-50 p-6 rounded-2xl -mx-8 -mb-8">
            <button type="button" onClick={() => navigate('/admin/tours')} className="btn-secondary bg-white shadow-sm border border-gray-200">
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2 shadow-lg shadow-brand-primary/20">
              <Save className="w-5 h-5" />
              <span>{isNew ? 'Guardar Tour' : 'Actualizar Tour'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
