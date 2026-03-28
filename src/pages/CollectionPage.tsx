import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { BlogPost, BusinessSettings } from '../types';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const CATEGORY_MAP: Record<string, string> = {
  'actividades': 'Actividades',
  'student-trip': 'Student Trip',
  'paquetes': 'Paquetes',
  'viajes-exclusivos': 'Viajes Exclusivos',
  'viajes-de-lujo': 'Viajes de Lujo',
  'luna-de-miel': 'Luna de Miel',
  'entrega-de-anillo': 'Entrega de Anillo',
  'viajes-en-familia': 'Viajes en Familia',
  'viajes-en-grupo': 'Viajes en Grupo'
};

export default function CollectionPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const categoryName = CATEGORY_MAP[categorySlug || ''] || 'Colección';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const [allPosts, businessSettings] = await Promise.all([
          dbService.getBlogPosts(true),
          dbService.getBusinessSettings()
        ]);
        
        // Filter by category
        const filtered = allPosts.filter(p => p.category === categoryName);
        setPosts(filtered);
        setSettings(businessSettings || null);
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [categoryName]);

  const scrollToContact = () => {
    document.getElementById('contacto-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) {
      toast.error('Error al cargar la configuración. Reintenta.');
      return;
    }
    setSubmitting(true);
    const form = e.currentTarget;
    try {
      const newLead = {
        form_type: 'collection_inquiry',
        first_name: form.first_name.value,
        email: form.contact_email.value,
        phone: form.phone.value || '',
        approximate_date: form.country.value ? `País: ${form.country.value}` : '',
        passengers_count: 1,
        message: `[Interesado en la colección: ${categoryName}]\n${form.message.value}`,
        status: 'new' as const
      };

      await dbService.createLead(newLead);

      // Trigger Email
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: newLead, settings })
      }).catch(err => console.error('SMTP fetch fail:', err));

      toast.success('¡Consulta enviada! Nos pondremos en contacto contigo pronto.');
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error('Hubo un problema. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  const heroImage = posts.length > 0 && posts[0].cover_image 
    ? posts[0].cover_image 
    : 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80';

  return (
    <div className="min-h-screen bg-white pb-24">
      <Toaster position="top-right" />
      {/* Dynamic Hero based on category */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt={categoryName} className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white drop-shadow-lg"
          >
            {categoryName}
          </motion.h1>
          {categoryName === 'Actividades' && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90 mt-4 uppercase tracking-widest font-medium"
            >
              En Marruecos
            </motion.p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 space-y-12">
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-2xl font-bold mb-4">Aún no hay publicaciones en {categoryName}</p>
            <p className="mb-8">Estamos preparando experiencias increíbles para ti.</p>
            <Link to="/" className="btn-primary">Explorar Tours</Link>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-2xl md:rounded-[2rem] shadow-sm transform transition-all hover:shadow-xl hover:-translate-y-1 border border-gray-100/50">
              {/* Text Layout (Always Left Side on Desktop) */}
              <div className="bg-[#EBEAE5] p-10 md:p-16 flex flex-col justify-center order-2 md:order-1">
                <p className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Exclusivo en Marruecos</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 uppercase leading-none mb-6">
                  {post.title}
                </h2>
                
                <div 
                  className="prose prose-base text-gray-700 leading-relaxed mb-8 max-w-none text-justify"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                <button 
                  onClick={scrollToContact}
                  className="px-8 py-3 w-max bg-transparent border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 rounded-full font-bold uppercase tracking-wide text-xs transition-colors"
                >
                  Saber más
                </button>
              </div>

              {/* Image Layout (Always Right Side on Desktop) */}
              <div className="h-64 md:h-auto order-1 md:order-2 overflow-hidden bg-gray-200">
                <img 
                  src={post.cover_image || 'https://loremflickr.com/800/800/morocco,sahara'} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Contact Form Section */}
      <div id="contacto-form" className="max-w-4xl mx-auto px-4 mt-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Contáctanos</h2>
          <div className="w-12 h-1 bg-gray-300 mx-auto rounded-full"></div>
        </div>

        <div className="bg-[#EBEAE5] p-8 md:p-12 rounded-[2rem] shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Para reservas o consultas</h3>
          
          <form className="space-y-6" onSubmit={handleLeadSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre Completo *</label>
                <input name="first_name" type="text" className="w-full px-4 py-3 bg-white rounded-xl border-none outline-none text-gray-900 shadow-sm" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email *</label>
                <input name="contact_email" type="email" className="w-full px-4 py-3 bg-white rounded-xl border-none outline-none text-gray-900 shadow-sm" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teléfono *</label>
                <div className="flex bg-white rounded-xl overflow-hidden shadow-sm">
                  <span className="flex items-center justify-center px-4 bg-gray-50 text-gray-600 border-r border-gray-100 font-medium">🇪🇸</span>
                  <input name="phone" type="tel" className="w-full px-4 py-3 border-none outline-none text-gray-900 bg-transparent" placeholder="+34..." required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">País</label>
                <input name="country" type="text" className="w-full px-4 py-3 bg-white rounded-xl border-none outline-none text-gray-900 shadow-sm" placeholder="Ej: España" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mensaje o Detalle del Viaje *</label>
              <textarea 
                name="message"
                className="w-full px-4 py-3 bg-white rounded-xl border-none outline-none text-gray-900 min-h-[120px] resize-none shadow-sm" 
                placeholder={`Me gustaría saber más sobre ${categoryName}...`}
                required 
              />
            </div>

            <div className="flex justify-center pt-4">
              <button type="submit" disabled={submitting} className={`bg-[#D97D3A] hover:bg-[#c66c2d] text-white px-12 py-3.5 rounded-full font-bold uppercase tracking-wide text-sm transition-colors shadow-lg shadow-[#D97D3A]/30 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {submitting ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
