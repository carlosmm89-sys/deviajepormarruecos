import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost, Tour } from '../types';
import { dbService } from '../services/dbService';
import { ArrowLeft, Calendar, User, Share2, MapPin, ArrowRight } from 'lucide-react';
import { usePageViews } from '../hooks/usePageViews';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [toc, setToc] = useState<{ id: string, text: string, level: number }[]>([]);
  const [processedContent, setProcessedContent] = useState<string>('');
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [relatedTours, setRelatedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        try {
          const data = await dbService.getBlogPost(slug);
          setPost(data);
          if (data && data.id) {
            if (data.content) {
              const extractedToc: { id: string, text: string, level: number }[] = [];
              const newContent = data.content.replace(/<(h[23])>(.*?)<\/\1>/gi, (match, tag, text) => {
                const plainText = text.replace(/<[^>]+>/g, '').trim();
                const id = plainText.toLowerCase().replace(/[\s\W-]+/g, '-').replace(/^-|-$/g, '');
                extractedToc.push({ id, text: plainText, level: parseInt(tag[1]) });
                return `<${tag} id="${id}" class="scroll-mt-24">${text}</${tag}>`;
              });
              setToc(extractedToc);
              setProcessedContent(newContent);
            }
            
            dbService.incrementBlogViews(data.id);
            const [allPosts, allTours] = await Promise.all([
              dbService.getBlogPosts(),
              dbService.getTours()
            ]);
            setRelatedPosts(allPosts.filter(p => p.id !== data.id && p.category !== 'Actividades').sort(() => 0.5 - Math.random()).slice(0, 3));
            setRelatedTours(allTours.filter(t => t.is_active).sort(() => 0.5 - Math.random()).slice(0, 3));
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-gray-50/50">
        <h2 className="text-2xl font-bold">Artículo no encontrado</h2>
        <Link to="/blog" className="btn-primary">Volver al blog</Link>
      </div>
    );
  }

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(console.error);
    }
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.cover_image || 'https://www.vivirmarruecos.com/pwa-512x512.png',
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Marruecos Experiencia",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.vivirmarruecos.com/pwa-512x512.png"
      }
    },
    "datePublished": post.published_at,
    "description": post.excerpt
  };

  return (
    <div className="bg-gray-50/30 min-h-screen pb-24">
      <SEO 
        title={`${post.title} | Blog Marruecos Experiencia`}
        description={post.excerpt}
        image={post.cover_image}
        url={`/blog/${post.slug}`}
        type="article"
        schema={blogSchema}
      />
      {/* Hero Header */}
      <section className="relative pt-24 pb-32 px-4 overflow-hidden bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-accent transition-colors text-sm font-bold uppercase tracking-wider mb-4 group justify-center">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Volver al Blog
          </Link>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-sm font-medium text-gray-500 pt-4">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
              <User className="w-4 h-4" /> {post.author}
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
              <Calendar className="w-4 h-4" /> {new Date(post.published_at).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 -mt-16 relative z-20">
        <div className="w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl mb-16 bg-white shrink-0">
          <img 
            src={post.cover_image || 'https://loremflickr.com/1200/600/morocco'} 
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-sm border border-gray-100">
          
          {toc.length > 0 && (
            <div className="mb-12 bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold font-serif text-gray-900 mb-6">Índice de contenido</h3>
              <ul className="space-y-3">
                {toc.map((item, idx) => (
                  <li key={idx} className={item.level === 3 ? 'ml-6' : ''}>
                    <a href={`#${item.id}`} className="text-gray-600 hover:text-brand-accent font-medium transition-colors">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div 
            className="prose prose-lg md:prose-xl max-w-none text-gray-600 leading-loose text-justify
                       prose-headings:font-serif prose-headings:text-gray-900 
                       prose-h1:text-4xl prose-h1:font-extrabold prose-h1:mb-8 prose-h1:tracking-tight
                       prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-14 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b-2 prose-h2:border-gray-100
                       prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-gray-800
                       prose-p:mb-8 prose-p:text-lg prose-p:leading-relaxed
                       prose-a:text-[#d36631] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-gray-900 prose-strong:font-bold
                       prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2 prose-li:text-lg
                       [&_p]:break-words [&_p]:overflow-wrap-anywhere"
            dangerouslySetInnerHTML={{ __html: processedContent || post.content }}
          />

          <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-center">

            <button 
              onClick={shareArticle}
              className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" /> 
              <span className="hidden sm:inline">Compartir Artículo</span>
            </button>
          </div>
        </div>
      </section>

      {relatedTours.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-24 mb-12">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900">Tours Recomendados</h2>
            <Link to="/tours" className="text-brand-accent font-bold hover:text-[#d36631] transition-colors">Ver todos →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedTours.map((tour, idx) => (
              <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all"
              >
                  <Link to={`/tours/${tour.id}`}>
                  <div className="relative h-64 overflow-hidden">
                      <img
                      src={tour.featured_image || tour.gallery?.[0] || 'https://loremflickr.com/800/600/morocco,sahara'}
                      alt={tour.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                  </div>
                  <div className="p-8 space-y-4">
                      <h3 className="text-2xl font-serif font-bold group-hover:text-brand-primary transition-colors">{tour.title}</h3>
                      <div className="flex items-center gap-6 text-gray-500 text-sm flex-wrap">
                      <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{tour.departure_city || 'Varios destinos'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{tour.itinerary_summary || 'Varios días'}</span>
                      </div>
                      </div>
                  </div>
                  </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Noticias Relevantes */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-24 mb-12">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900">Noticias Relevantes</h2>
            <Link to="/blog" className="text-brand-accent font-bold hover:text-[#d36631] transition-colors">Ver todas →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map(related => (
              <Link key={related.id} to={`/blog/${related.slug}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={related.cover_image || 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70'} 
                    alt={related.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {related.category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-brand-accent">
                      {related.category}
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-accent transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1">
                    {related.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-xs font-bold text-gray-400">
                    <span>{new Date(related.published_at).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="text-gray-900 group-hover:text-brand-accent transition-colors">Leer Artículo &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
