import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Globe } from 'lucide-react';
import { dbService } from '../services/dbService';
import ImageUpload from '../components/ImageUpload';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Language } from '../context/LanguageContext';

const blogSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  slug: z.string().min(1, 'El slug es obligatorio').regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'El contenido es obligatorio'),
  cover_image: z.string().optional().nullable(),
  author: z.string().min(1, 'El autor es obligatorio'),
  is_published: z.boolean(),
  translations: z.any().optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

const quillModules = {
  toolbar: [
    [{ 'header': [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ],
};

export default function AdminBlogEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Language>('es');
  
  const isNew = !id;

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image: null,
      author: 'Marruecos Experiencia',
      is_published: true,
      translations: {},
    }
  });

  const titleValue = watch('title');

  // Auto-generate slug from title if it's new
  useEffect(() => {
    if (isNew && titleValue && !watch('slug')) {
      const generatedSlug = titleValue
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9]+/g, '-')     // replace non-alphanumeric with hyphen
        .replace(/^-+|-+$/g, '');        // remove leading/trailing hyphens
      setValue('slug', generatedSlug);
    }
  }, [titleValue, isNew, setValue, watch]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!isNew) {
        try {
          const post = await dbService.getBlogPost(id, true);
          if (post) {
            setValue('title', post.title);
            setValue('slug', post.slug);
            setValue('excerpt', post.excerpt || '');
            setValue('cover_image', post.cover_image);
            setValue('author', post.author);
            setValue('is_published', post.is_published);
            setValue('translations', post.translations || {});
          } else {
            navigate('/admin/blog');
          }
        } catch (error) {
          console.error('Error fetching post:', error);
          alert('Error al cargar el artículo');
        }
      }
      setLoading(false);
    };

    fetchPost();
  }, [id, isNew, setValue, navigate]);

  const onSubmit = async (data: BlogFormData) => {
    try {
      setSaving(true);
      await dbService.saveBlogPost({
        ...(isNew ? {} : { id }),
        ...data,
      });
      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Error saving post:', error);
      if (error.code === '23505') {
        alert('Este slug ya está en uso por otro artículo. Por favor, elige uno diferente.');
      } else {
        alert('Error al guardar el artículo');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/admin/blog" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? 'Nuevo Artículo' : 'Editar Artículo'}
          </h1>
          <p className="text-gray-500 mt-1">Configura el contenido y SEO del artículo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-brand-accent pl-3">Información Principal</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Globe className="w-4 h-4" /> {watch('is_published') ? 'Público' : 'Borrador'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" {...register('is_published')} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Slug (URL SEO)</label>
              <div className="flex items-center">
                <span className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 text-gray-500 rounded-l-xl text-sm">
                  /blog/
                </span>
                <input
                  {...register('slug')}
                  className="w-full px-4 py-3 rounded-r-xl border border-gray-300 focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors font-mono text-sm"
                  placeholder="consejos-visitar-marrakech"
                />
              </div>
              {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Autor</label>
              <input
                {...register('author')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors"
              />
              {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
            </div>
          </div>

          <hr className="border-gray-100 my-6" />

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
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Título del Artículo (Español) *</label>
                <input
                  {...register('title')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors"
                  placeholder="Ej: 5 Consejos para visitar Marrakech"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Extracto (Español) *</label>
                <textarea
                  {...register('excerpt')}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors resize-none"
                  placeholder="Breve descripción que aparecerá en las tarjetas y en Google..."
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Título ({activeTab.toUpperCase()})</label>
                <input
                  {...register(`translations.${activeTab}.title`)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors"
                  placeholder="Traducción opcional..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Extracto ({activeTab.toUpperCase()})</label>
                <textarea
                  {...register(`translations.${activeTab}.excerpt`)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-colors resize-none"
                  placeholder="Traducción opcional..."
                />
              </div>
            </>
          )}

          <hr className="border-gray-100 my-6" />

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Imagen de Portada</label>
            <Controller
              name="cover_image"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  value={field.value || undefined}
                  onChange={field.onChange}
                  label="foto principal del artículo"
                />
              )}
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-l-4 border-brand-accent pl-3">Contenido del Artículo</h2>
          
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-max mb-6">
            {(['es', 'en', 'fr'] as Language[]).map((lang) => (
              <button
                key={`content-tab-${lang}`}
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
            <div className="prose-edit-container">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <ReactQuill 
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    modules={quillModules}
                    className="bg-white rounded-xl mb-12"
                    placeholder="Empieza a escribir tu increíble artículo..."
                  />
                )}
              />
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
            </div>
          ) : (
             <div className="prose-edit-container">
              <Controller
                name={`translations.${activeTab}.content` as "content"}
                control={control}
                render={({ field }) => (
                  <ReactQuill 
                    theme="snow"
                    value={field.value || ''}
                    onChange={field.onChange}
                    modules={quillModules}
                    className="bg-white rounded-xl mb-12"
                    placeholder={`Traducción del contenido en ${activeTab.toUpperCase()}...`}
                  />
                )}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 sticky bottom-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-lg z-10">
          <Link
            to="/admin/blog"
            className="px-6 py-3 font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            Guardar Artículo
          </button>
        </div>
      </form>
    </div>
  );
}
