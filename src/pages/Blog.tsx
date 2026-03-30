import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { dbService } from '../services/dbService';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await dbService.getBlogPosts();
        setPosts(data.filter(p => p.category !== 'Actividades'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24">
      <SEO 
        title="Blog de Viajes a Marruecos | Marruecos Experiencia"
        description="Descubre Marruecos a través de nuestras guías prácticas, historias y consejos de expertos locales para preparar tu próxima aventura."
        url="/blog"
      />
      {/* Header */}
      <section className="bg-white border-b border-gray-100 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="text-brand-accent font-bold uppercase tracking-widest text-sm">Consejos y Guías</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900">Blog de Viajes</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg pt-4">Descubre Marruecos a través de nuestras guías prácticas, historias y consejos de expertos locales para preparar tu próxima aventura.</p>
        </div>
      </section>

      {/* Grid de Artículos */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage).map((post, idx) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
            >
              <Link to={`/blog/${post.slug}`} className="block relative aspect-[4/3] overflow-hidden">
                <img 
                  src={post.cover_image || 'https://loremflickr.com/800/600/morocco'} 
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mb-4 h-5">
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.published_at).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div className="w-1 h-1 bg-gray-200 rounded-full" />
                  <div className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</div>
                </div>
                
                <Link to={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-brand-accent transition-colors leading-snug mb-4 line-clamp-3">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>

                <div className="mt-8 pt-6 border-t border-gray-50">
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-brand-accent transition-colors group/link"
                  >
                    Leer artículo completo <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}

          {posts.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <h3 className="text-xl font-medium text-gray-500">Aún no hay artículos publicados.</h3>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {posts.length > postsPerPage && (
          <div className="flex justify-center items-center mt-16 gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-full border border-gray-200 text-gray-500 hover:border-brand-accent hover:text-brand-accent disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(posts.length / postsPerPage) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-12 h-12 rounded-full font-bold flex items-center justify-center transition-colors ${currentPage === i + 1 ? 'bg-brand-accent text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-accent hover:text-brand-accent'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(posts.length / postsPerPage), p + 1))}
              disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
              className="p-3 rounded-full border border-gray-200 text-gray-500 hover:border-brand-accent hover:text-brand-accent disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
